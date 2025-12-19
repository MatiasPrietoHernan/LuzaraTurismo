import { NextResponse } from 'next/server'
import { unstable_cache } from 'next/cache'
import connectDB from '@/lib/db/connect'
import BusinessInfo from '@/lib/db/models/BusinessInfo'

const getCachedBusinessInfo = unstable_cache(async () => {
  await connectDB()
  const info = await BusinessInfo.findOne().lean()
  return info || {}
}, ['business-info-cache'], {
  revalidate: 60 * 60, // 1 hora
  tags: ['business-info'],
})

export async function GET() {
  try {
    const info = await getCachedBusinessInfo()
    return NextResponse.json(info)
  } catch (error) {
    console.error('Error loading business info:', error)
    return NextResponse.json(
      { error: 'No se pudo cargar la información del negocio' },
      { status: 500 }
    )
  }
}
