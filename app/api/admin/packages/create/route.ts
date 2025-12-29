import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db/connect'
import Package from '@/lib/db/models/Package'
import { uploadImage, uploadMultipleImages } from '@/lib/storage'

export async function POST(request: NextRequest) {
  await connectDB()

  try {
    const formData = await request.formData()
    const data = {
      title: formData.get('title') as string,
      destination: formData.get('destination') as string,
      nights: Number(formData.get('nights')),
      departureDate: new Date(formData.get('departureDate') as string),
      price: Number(formData.get('price')),
      priceFrom: formData.get('priceFrom') ? Number(formData.get('priceFrom')) : undefined,
      description: formData.get('description') as string || undefined,
      badge: formData.get('badge') as string || undefined,
      type: formData.get('type') as string,
      isPromotion: formData.get('isPromotion') === 'true',
      isPublished: formData.get('isPublished') === 'true',
      isActive: formData.get('isActive') === 'true',
      services: JSON.parse(formData.get('services') as string),
      information: JSON.parse(formData.get('information') as string),
      hotel: JSON.parse(formData.get('hotel') as string),
      availableDates: JSON.parse(formData.get('availableDates') as string),
      departurePoints: JSON.parse(formData.get('departurePoints') as string || '[]'),
      mainImage: '',
      gallery: [] as string[]
    }

    // Validar datos requeridos
    const errors: string[] = []

    if (!data.title?.trim()) errors.push('El título es obligatorio')
    if (!data.destination?.trim()) errors.push('El destino es obligatorio')
    if (!data.nights || data.nights < 1) errors.push('Las noches deben ser al menos 1')
    if (!data.departureDate) errors.push('La fecha de salida es obligatoria')
    if (!data.price || data.price <= 0) errors.push('El precio debe ser mayor a 0')
    if (!data.type) errors.push('El tipo de paquete es obligatorio')

    // Validar fecha futura
    const departureDate = new Date(data.departureDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (departureDate < today) errors.push('La fecha de salida debe ser futura')

    // Validar hotel
    if (!data.hotel?.name?.trim()) errors.push('El nombre del hotel es obligatorio')
    if (!data.hotel?.roomType?.trim()) errors.push('El tipo de habitación es obligatorio')

    // Validar precio desde si existe
    if (data.priceFrom && data.priceFrom <= 0) {
      errors.push('El precio desde debe ser mayor a 0')
    }
    if (data.priceFrom && data.priceFrom >= data.price) {
      errors.push('El precio desde debe ser menor al precio regular')
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Errores de validación', details: errors },
        { status: 400 }
      )
    }

    // Subir imagen principal a Minio
    const mainImageFile = formData.get('mainImage') as File | null
    if (mainImageFile && mainImageFile.size > 0) {
      const uploadResult = await uploadImage(mainImageFile, 'packages', 'main-')
      if (uploadResult) {
        data.mainImage = uploadResult.url
      }
    }

    // Subir galería a Minio - Manejar diferentes métodos de envío
    const galleryFiles: File[] = []
    
    // Método 1: Intentar obtener directamente como array
    let directGallery = formData.getAll('gallery') as File[]
    if (directGallery.length > 0) {
      // Filtrar archivos válidos
      galleryFiles.push(...directGallery.filter(file => file && file.size > 0))
    }
    
    // Método 2: Si no se encontraron archivos, buscar con el patrón gallery[i]
    if (galleryFiles.length === 0) {
      for (let i = 0; i < 50; i++) { // Límite razonable de imágenes
        const file = formData.get(`gallery[${i}]`) as File
        if (file && file.size > 0) {
          galleryFiles.push(file)
        } else {
          // Si no encontramos más archivos válidos, dejamos de buscar
          // Pero continuamos por si hay archivos nulos intercalados
          continue
        }
      }
    }
    
    console.log('Gallery files found:', galleryFiles.length)
    
    if (galleryFiles.length > 0) {
      const uploadResults = await uploadMultipleImages(galleryFiles, 'packages', 'gallery-')
      data.gallery = uploadResults.map(result => result.url)
      console.log('Gallery uploaded:', data.gallery.length, 'images')
    }

    // Si no hay imagen principal pero hay galería, usar la primera de la galería como principal
    if (!data.mainImage && data.gallery.length > 0) {
      data.mainImage = data.gallery[0]
    }

    // Si no hay ninguna imagen, usar placeholder
    if (!data.mainImage) {
      data.mainImage = '/placeholder.svg'
    }

    console.log('Final data - mainImage:', data.mainImage, 'gallery length:', data.gallery.length)
    const newPackage = await Package.create(data)

    await fetch(process.env.PACKAGE_WEBHOOK_URL || '', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({data: newPackage, method: 'create'}),
    })

    return NextResponse.json({ 
      success: true, 
      package: newPackage 
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating package:', error)
    return NextResponse.json(
      { error: 'Error al crear el paquete' }, 
      { status: 500 }
    )
  }
}
