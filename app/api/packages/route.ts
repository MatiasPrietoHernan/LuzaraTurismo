import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db/connect'
import Package from '@/lib/db/models/Package'

export async function GET(request: NextRequest) {
  await connectDB()
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') 
  const limit = Number(searchParams.get('limit')) || 0 // 0 = sin límite
  const departurePoint = searchParams.get('departurePoint')
  const destination = searchParams.get('destination')

  // Construir query base
  const query: any = { isPublished: true, isActive: true }
  
  // Filtro por tipo (promociones)
  if (type === 'promotions') {
    query.isPromotion = true
  }
  
  // Filtro por punto de salida
  if (departurePoint && departurePoint !== 'all') {
    query.departurePoints = departurePoint
  }
  
  // Filtro por destino
  if (destination && destination !== 'all') {
    query.destination = { $regex: destination, $options: 'i' } // Búsqueda case-insensitive
  }
  
  const packagesQuery = Package.find(query).sort({ createdAt: -1 })
  
  // Aplicar límite solo si se especifica
  const packages = limit > 0 
    ? await packagesQuery.limit(limit).lean()
    : await packagesQuery.lean()

  return NextResponse.json(packages)
}
