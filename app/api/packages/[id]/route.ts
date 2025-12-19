import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db/connect'
import Package from '@/lib/db/models/Package'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  await connectDB()
  const pkg = await Package.findById(params.id).lean()

  if (!pkg) {
    return NextResponse.json({ error: 'Package not found' }, { status: 404 })
  }

  return NextResponse.json(pkg)
}
