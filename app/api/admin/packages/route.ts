import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db/connect'
import Package from '@/lib/db/models/Package'

export async function GET(request: NextRequest) {
  await connectDB()
  const { searchParams } = new URL(request.url)
  const page = Math.max(Number(searchParams.get('page')) || 1, 1)
  const limit = Math.max(Number(searchParams.get('limit')) || 10, 1)
  const search = searchParams.get('search') || ''

  // Build search query
  const searchQuery = search ? {
    $or: [
      { title: { $regex: search, $options: 'i' } },
      { destination: { $regex: search, $options: 'i' } },
      { type: { $regex: search, $options: 'i' } }
    ]
  } : {}

  const total = await Package.countDocuments(searchQuery)
  const packages = await Package.find(searchQuery)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean()

  return NextResponse.json({
    packages,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  })
}
