import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db/connect'
import Package from '@/lib/db/models/Package'

export async function GET(request: NextRequest) {
  await connectDB()
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') 
  const limit = Number(searchParams.get('limit')) || 4

  const query = type === 'promotions' ? { isPromotion: true, isPublished: true, isActive: true } : { isPublished: true, isActive: true }
  
  const packages = await Package.find().sort({ createdAt: -1 }).lean()

  return NextResponse.json(packages)
}
