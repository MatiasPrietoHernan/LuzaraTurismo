import { redirect } from 'next/navigation'
import { setAuthCookie } from '@/lib/auth'
import connectDB from '@/lib/db/connect'
import User from '@/lib/db/models/User'

export async function POST(request: Request) {
  await connectDB()
  
  try {
    const formData = await request.formData()
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    
    // Validaciones básicas
    if (!email || !password) {
      return Response.redirect(new URL('/admin?error=missing', request.url))
    }

    const user = await User.findOne({ email }).lean()
    
    if (!user) {
      return Response.redirect(new URL('/admin?error=invalid', request.url))
    }
    
    // Importar funciones de forma dinámica
    const { verifyPassword } = await import('@/lib/auth')
    const isValidPassword = await verifyPassword(password, user.password)
    
    if (!isValidPassword) {
      return Response.redirect(new URL('/admin?error=invalid', request.url))
    }
    
    await setAuthCookie(user._id.toString())
    
    return Response.redirect(new URL('/admin', request.url))
  } catch (error) {
    console.error('Login error:', error)
    return Response.redirect(new URL('/admin?error=server', request.url))
  }
}
