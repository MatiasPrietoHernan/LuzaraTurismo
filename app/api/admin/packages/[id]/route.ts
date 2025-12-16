import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db/connect'
import Package from '@/lib/db/models/Package'

// GET - Obtener un paquete específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const { id } = await params
    const pkg = await Package.findById(id)
    
    if (!pkg) {
      return NextResponse.json(
        { error: 'Paquete no encontrado' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(pkg)
  } catch (error) {
    console.error('Error fetching package:', error)
    return NextResponse.json(
      { error: 'Error al obtener el paquete' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar un paquete
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const { id } = await params
    const body = await request.json()
    
    const updatedPackage = await Package.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    )
    
    if (!updatedPackage) {
      return NextResponse.json(
        { error: 'Paquete no encontrado' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(updatedPackage)
  } catch (error) {
    console.error('Error updating package:', error)
    return NextResponse.json(
      { error: 'Error al actualizar el paquete' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar un paquete
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const { id } = await params
    
    const deletedPackage = await Package.findByIdAndDelete(id)
    
    if (!deletedPackage) {
      return NextResponse.json(
        { error: 'Paquete no encontrado' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ message: 'Paquete eliminado exitosamente' })
  } catch (error) {
    console.error('Error deleting package:', error)
    return NextResponse.json(
      { error: 'Error al eliminar el paquete' },
      { status: 500 }
    )
  }
}
