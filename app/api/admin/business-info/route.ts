import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import connectDB from '@/lib/db/connect'
import BusinessInfo from '@/lib/db/models/BusinessInfo'

const CACHE_TAG = 'business-info'

const toStringArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === 'string' ? item.trim() : ''))
      .filter((item) => item.length > 0)
  }
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
  }
  return []
}

export async function GET() {
  await connectDB()
  const info = await BusinessInfo.findOne().lean()

  return NextResponse.json(info ?? {})
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB()
    const payload = await request.json()

    const updateData = {
      companyName: payload.companyName || 'Luzara Turismo',
      slogan: payload.slogan || '',
      aboutTitle: payload.aboutTitle || '¿Quiénes somos?',
      aboutDescription: payload.aboutDescription || '',
      mission: payload.mission || '',
      vision: payload.vision || '',
      address: payload.address || '',
      city: payload.city || '',
      country: payload.country || '',
      phones: toStringArray(payload.phones),
      emails: toStringArray(payload.emails),
      socials: {
        facebook: payload.socials?.facebook || '',
        instagram: payload.socials?.instagram || '',
        twitter: payload.socials?.twitter || '',
        youtube: payload.socials?.youtube || '',
        tiktok: payload.socials?.tiktok || '',
        whatsapp: payload.socials?.whatsapp || '',
      },
      heroImage: payload.heroImage || '',
      gallery: toStringArray(payload.gallery),
    }

    const info = await BusinessInfo.findOneAndUpdate(
      {},
      updateData,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean()

    revalidateTag(CACHE_TAG)

    return NextResponse.json(info)
  } catch (error) {
    console.error('Error updating business info:', error)
    return NextResponse.json(
      { error: 'No se pudo actualizar la información' },
      { status: 500 }
    )
  }
}
