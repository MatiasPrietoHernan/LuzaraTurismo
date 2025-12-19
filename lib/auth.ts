import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-key-change-in-production'
)

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function createToken(userId: string): Promise<string> {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<{ userId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as { userId: string }
  } catch (error) {
    return null
  }
}

export async function setAuthCookie(userId: string) {
  const token = await createToken(userId)
  const cookieStore = await cookies()
  
  cookieStore.set('admin-auth', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 1 semana
    path: '/'
  })
}

export async function getAuthUserId(): Promise<string | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin-auth')?.value
  
  if (!token) return null
  
  const payload = await verifyToken(token)
  return payload?.userId || null
}

export async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete('admin-auth')
}
