import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db/connect'
import DeparturePoint from '@/lib/db/models/DeparturePoint'

// GET - Obtener un punto de salida específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const { id } = await params
    const departurePoint = await DeparturePoint.findById(id)
    
    if (!departurePoint) {
      return NextResponse.json(
        { error: 'Punto de salida no encontrado' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(departurePoint)
  } catch (error) {
    console.error('Error fetching departure point:', error)
    return NextResponse.json(
      { error: 'Error al obtener el punto de salida' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar un punto de salida
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const { id } = await params
    const body = await request.json()
    
    const updatedDeparturePoint = await DeparturePoint.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    )
    
    if (!updatedDeparturePoint) {
      return NextResponse.json(
        { error: 'Punto de salida no encontrado' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(updatedDeparturePoint)
  } catch (error) {
    console.error('Error updating departure point:', error)
    return NextResponse.json(
      { error: 'Error al actualizar el punto de salida' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar un punto de salida
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const { id } = await params
    
    const deletedDeparturePoint = await DeparturePoint.findByIdAndDelete(id)
    
    if (!deletedDeparturePoint) {
      return NextResponse.json(
        { error: 'Punto de salida no encontrado' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Punto de salida eliminado exitosamente' 
    })
  } catch (error) {
    console.error('Error deleting departure point:', error)
    return NextResponse.json(
      { error: 'Error al eliminar el punto de salida' },
      { status: 500 }
    )
  }
}
