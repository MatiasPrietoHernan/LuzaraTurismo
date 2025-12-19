import { NextResponse } from 'next/server'
import connectDB from '@/lib/db/connect'
import Package from '@/lib/db/models/Package'
import Order from '@/lib/db/models/Order'
import Subscriber from '@/lib/db/models/Subscriber'

export async function GET() {
  await connectDB()
  
  const [published, deactivated, active] = await Promise.all([
    Package.countDocuments({ isPublished: true }),
    Package.countDocuments({ isPublished: false }),
    Package.countDocuments({ isActive: true })
  ])
  
  const mostClickedRaw = await Package.findOne().sort({ clicks: -1 }).select('title clicks').lean()
  const mostClicked = mostClickedRaw ? {
    title: mostClickedRaw.title || 'Ninguno',
    clicks: mostClickedRaw.clicks || 0
  } : { title: 'Ninguno', clicks: 0 }
  
  const ordersCount = await Order.countDocuments()
  return NextResponse.json({
    published,
    deactivated,
    active,
    mostClicked,
    ordersCount
  })

}
