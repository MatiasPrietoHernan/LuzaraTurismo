import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db/connect'
import DeparturePoint from '@/lib/db/models/DeparturePoint'

// GET - Obtener todos los puntos de salida
export async function GET() {
  try {
    await connectDB()
    const departurePoints = await DeparturePoint.find({}).sort({ city: 1, name: 1 })
    return NextResponse.json(departurePoints)
  } catch (error) {
    console.error('Error fetching departure points:', error)
    return NextResponse.json(
      { error: 'Error al obtener los puntos de salida' },
      { status: 500 }
    )
  }
}

// POST - Crear un nuevo punto de salida
export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()
    
    const departurePoint = await DeparturePoint.create(body)
    return NextResponse.json(departurePoint, { status: 201 })
  } catch (error) {
    console.error('Error creating departure point:', error)
    return NextResponse.json(
      { error: 'Error al crear el punto de salida' },
      { status: 500 }
    )
  }
}
