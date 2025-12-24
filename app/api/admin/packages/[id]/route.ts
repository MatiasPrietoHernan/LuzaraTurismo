import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db/connect'
import Package from '@/lib/db/models/Package'
import { writeFile, mkdir, unlink } from 'fs/promises'
import mongoose from 'mongoose'
import path from 'path'
import { existsSync } from 'fs'

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
    
    const contentType = request.headers.get('content-type') || ''
    
    // Si es FormData (con archivos)
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      console.log(formData)
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'packages')
      
      // Crear directorio si no existe
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true })
      }
      
      // Preparar datos de actualización
      const updateData: any = {
        title: formData.get('title'),
        destination: formData.get('destination'),
        nights: Number(formData.get('nights')),
        price: Number(formData.get('price')),
        departureDate: formData.get('departureDate'),
        description: formData.get('description') || undefined,
        badge: formData.get('badge') || undefined,
        type: formData.get('type'),
        isPromotion: formData.get('isPromotion') === 'true',
        isPublished: formData.get('isPublished') === 'true',
        isActive: formData.get('isActive') === 'true',
      }
      
      // Agregar priceFrom si existe
      const priceFrom = formData.get('priceFrom')
      if (priceFrom) {
        updateData.priceFrom = Number(priceFrom)
      }
      
      // Procesar imagen principal
      const mainImageFile = formData.get('mainImage') as File | null
      if (mainImageFile && mainImageFile.size > 0) {
        const buffer = Buffer.from(await mainImageFile.arrayBuffer())
        const filename = `main-${Date.now()}-${mainImageFile.name.replace(/\s/g, '-')}`
        const filepath = path.join(uploadDir, filename)
        await writeFile(filepath, buffer)
        updateData.mainImage = `/uploads/packages/${filename}`
      }
      
      // Procesar galería
      const galleryFiles: File[] = []
      for (const [key, value] of formData.entries()) {
        if (key === 'gallery' && value instanceof File && value.size > 0) {
          galleryFiles.push(value)
        }
      }
      
      // Obtener imágenes existentes que no se eliminaron
      const existingGalleryStr = formData.get('existingGallery') as string
      const existingGallery = existingGalleryStr ? JSON.parse(existingGalleryStr) : []
      
      // Subir nuevas imágenes de galería
      const newGalleryUrls: string[] = []
      for (const file of galleryFiles) {
        const buffer = Buffer.from(await file.arrayBuffer())
        const filename = `gallery-${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name.replace(/\s/g, '-')}`
        const filepath = path.join(uploadDir, filename)
        await writeFile(filepath, buffer)
        newGalleryUrls.push(`/uploads/packages/${filename}`)
      }
      
      // Combinar imágenes existentes con las nuevas
      updateData.gallery = [...existingGallery, ...newGalleryUrls]
      
      // Procesar otros campos JSON
      const servicesStr = formData.get('services') as string
      if (servicesStr) {
        updateData.services = JSON.parse(servicesStr)
      }
      
      const informationStr = formData.get('information') as string
      if (informationStr) {
        updateData.information = JSON.parse(informationStr)
      }
      
      const hotelStr = formData.get('hotel') as string
      if (hotelStr) {
        updateData.hotel = JSON.parse(hotelStr)
      }
      
      const availableDatesStr = formData.get('availableDates') as string
      if (availableDatesStr) {
        updateData.availableDates = JSON.parse(availableDatesStr)
      }
      
      const departurePointsStr = formData.get('departurePoints') as string
        if (departurePointsStr) {
          try {
            const parsed = JSON.parse(departurePointsStr)
            if (Array.isArray(parsed)) {
              // Convertir strings a ObjectIds válidos de Mongoose
              updateData.departurePoints = parsed.map(id => new mongoose.Types.ObjectId(id))
            }
          } catch (e) {
            console.error('Error parsing departurePoints:', e)
          }
        }
        console.log('departurePoints:', departurePointsStr)
      //console.log('updateData antes de guardar:', JSON.stringify(updateData, null, 2))
        
      const updatedPackage = await Package.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      )
      console.log('Paquete actualizado - departurePoints:', updatedPackage?.departurePoints) // 👈 AGREGA ESTO

      if (!updatedPackage) {
        return NextResponse.json(
          { error: 'Paquete no encontrado' },
          { status: 404 }
        )
      }
      
      return NextResponse.json(updatedPackage)
    } else {
      // Si es JSON simple (para toggles rápidos como isActive)
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
    }
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
    
    const pkg = await Package.findById(id)
    
    if (!pkg) {
      return NextResponse.json(
        { error: 'Paquete no encontrado' },
        { status: 404 }
      )
    }
    
    // Opcional: Eliminar imágenes del servidor
    try {
      if (pkg.mainImage) {
        const imagePath = path.join(process.cwd(), 'public', pkg.mainImage)
        if (existsSync(imagePath)) {
          await unlink(imagePath)
        }
      }
      
      if (pkg.gallery && pkg.gallery.length > 0) {
        for (const imageUrl of pkg.gallery) {
          const imagePath = path.join(process.cwd(), 'public', imageUrl)
          if (existsSync(imagePath)) {
            await unlink(imagePath)
          }
        }
      }
    } catch (fileError) {
      console.error('Error deleting images:', fileError)
      // Continuar con la eliminación del paquete aunque falle la eliminación de imágenes
    }
    
    await Package.findByIdAndDelete(id)
    
    return NextResponse.json({ 
      success: true,
      message: 'Paquete eliminado exitosamente' 
    })
  } catch (error) {
    console.error('Error deleting package:', error)
    return NextResponse.json(
      { error: 'Error al eliminar el paquete' },
      { status: 500 }
    )
  }
}
