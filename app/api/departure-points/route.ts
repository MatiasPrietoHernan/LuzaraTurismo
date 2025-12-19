import { NextResponse } from 'next/server'
import connectDB from '@/lib/db/connect'
import DeparturePoint from '@/lib/db/models/DeparturePoint'

export async function GET() {
  await connectDB()

  const points = await DeparturePoint
    .find({ isActive: true })
    .sort({ city: 1, name: 1 })
    .lean()

  return NextResponse.json(points)
}
