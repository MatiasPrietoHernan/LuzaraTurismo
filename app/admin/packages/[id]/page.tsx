"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Upload, 
  Save, 
  X, 
  ImageIcon, 
  Trash2,
  Plus,
  Loader2,
  MapPin
} from 'lucide-react'

interface IPackage {
  _id: string
  title: string
  destination: string
  nights: number
  departureDate: string
  price: number
  priceFrom?: number
  mainImage?: string
  gallery: string[]
  services: { icon: string; text: string }[]
  information: string[]
  hotel: {
    name: string
    roomType: string
    zone: string
    location: string
    image: string
  }
  availableDates: number[]
  departurePoints: string[]
  type: 'PAQUETE ESTUDIANTILES' | 'PAQUETES INTERNACIONALES' | 'PAQUETES NACIONALES'
  badge?: string
  description?: string
  isPromotion: boolean
  isPublished: boolean
  isActive: boolean
}

interface IDeparturePoint {
  _id: string
  name: string
  city: string
  isActive: boolean
}

export default function EditPackagePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [packageData, setPackageData] = useState<IPackage | null>(null)
  const [mainImageFile, setMainImageFile] = useState<File | null>(null)
  const [mainImagePreview, setMainImagePreview] = useState<string>('')
  const [galleryFiles, setGalleryFiles] = useState<File[]>([])
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([])
  const [deletedGalleryImages, setDeletedGalleryImages] = useState<string[]>([])
  const [id, setId] = useState<string>('')
  const [departurePoints, setDeparturePoints] = useState<IDeparturePoint[]>([])
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    params.then(p => setId(p.id))
  }, [params])

  useEffect(() => {
    const fetchDeparturePoints = async () => {
      try {
        const res = await fetch('/api/admin/departure-points')
        const data = await res.json()
        setDeparturePoints(data.filter((dp: IDeparturePoint) => dp.isActive))
      } catch (error) {
        console.error('Error loading departure points:', error)
      }
    }
    
    fetchDeparturePoints()
  }, [])

  useEffect(() => {
    if (!id) return
    
    const fetchPackage = async () => {
      try {
        const res = await fetch(`/api/admin/packages/${id}`)
        if (!res.ok) throw new Error('Error al cargar el paquete')
        const data = await res.json()
        setPackageData(data)
        setMainImagePreview(data.mainImage || '')
        setGalleryPreviews(data.gallery || [])
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo cargar el paquete",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPackage()
  }, [id])

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setMainImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setMainImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setGalleryFiles([...galleryFiles, ...files])
    
    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setGalleryPreviews(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeGalleryImage = (index: number) => {
    const imageToRemove = galleryPreviews[index]
    
    // Si es una imagen existente (URL), la marcamos para eliminar
    if (packageData?.gallery.includes(imageToRemove)) {
      setDeletedGalleryImages([...deletedGalleryImages, imageToRemove])
    }
    
    // Removemos de los previews y archivos
    setGalleryPreviews(galleryPreviews.filter((_, i) => i !== index))
    setGalleryFiles(galleryFiles.filter((_, i) => i !== index))
  }

  const validateForm = () => {
    if (!packageData) return false

    const errors: Record<string, string> = {}
    let hasErrors = false

    // Validaciones básicas
    if (!packageData.title.trim()) {
      errors.title = 'El título es obligatorio'
      hasErrors = true
    }
    if (!packageData.destination.trim()) {
      errors.destination = 'El destino es obligatorio'
      hasErrors = true
    }
    if (!packageData.nights || packageData.nights < 1) {
      errors.nights = 'Las noches deben ser al menos 1'
      hasErrors = true
    }
    if (!packageData.departureDate) {
      errors.departureDate = 'La fecha de salida es obligatoria'
      hasErrors = true
    } else {
      // Validar fecha futura
      const departureDate = new Date(packageData.departureDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (departureDate < today) {
        errors.departureDate = 'La fecha de salida debe ser futura'
        hasErrors = true
      }
    }
    if (!packageData.price || packageData.price <= 0) {
      errors.price = 'El precio debe ser mayor a 0'
      hasErrors = true
    }
    if (!packageData.type) {
      errors.type = 'El tipo de paquete es obligatorio'
      hasErrors = true
    }

    // Validar hotel
    if (!packageData.hotel?.name?.trim()) {
      errors.hotelName = 'El nombre del hotel es obligatorio'
      hasErrors = true
    }
    if (!packageData.hotel?.roomType?.trim()) {
      errors.hotelRoomType = 'El tipo de habitación es obligatorio'
      hasErrors = true
    }

    // Validar precio desde si existe
    if (packageData.priceFrom && packageData.priceFrom <= 0) {
      errors.priceFrom = 'El precio desde debe ser mayor a 0'
      hasErrors = true
    } else if (packageData.priceFrom && packageData.priceFrom >= packageData.price) {
      errors.priceFrom = 'El precio desde debe ser menor al precio regular'
      hasErrors = true
    }

    setFieldErrors(errors)
    return hasErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!packageData) return

    if (validateForm()) {
      toast({
        title: "Errores de validación",
        description: "Por favor, corrige los errores marcados en el formulario",
        variant: "destructive"
      })
      return
    }

    setSaving(true)

    try {
      const formData = new FormData()
      
      // Datos básicos
      formData.append('title', packageData.title)
      formData.append('destination', packageData.destination)
      formData.append('nights', packageData.nights.toString())
      formData.append('departureDate', packageData.departureDate)
      formData.append('price', packageData.price.toString())
      if (packageData.priceFrom) formData.append('priceFrom', packageData.priceFrom.toString())
      formData.append('description', packageData.description || '')
      formData.append('badge', packageData.badge || '')
      formData.append('type', packageData.type)
      formData.append('isPromotion', packageData.isPromotion.toString())
      formData.append('isPublished', packageData.isPublished.toString())
      formData.append('isActive', packageData.isActive.toString())
      
      // Imagen principal
      if (mainImageFile) {
        formData.append('mainImage', mainImageFile)
      }
      
      // Galería
      galleryFiles.forEach((file, i) => {
        formData.append(`gallery`, file)
      })
      
      // Imágenes existentes de galería que no se eliminaron
      const existingGallery = (packageData.gallery || []).filter(
        img => !deletedGalleryImages.includes(img)
      )
      formData.append('existingGallery', JSON.stringify(existingGallery))
      
      formData.append('services', JSON.stringify(packageData.services))
      formData.append('information', JSON.stringify(packageData.information))
      formData.append('hotel', JSON.stringify(packageData.hotel))
      formData.append('availableDates', JSON.stringify(packageData.availableDates))
      formData.append('departurePoints', JSON.stringify(packageData.departurePoints))

      const res = await fetch(`/api/admin/packages/${id}`, {
        method: 'PUT',
        body: formData
      })

      if (!res.ok) throw new Error('Error al actualizar')

      toast({
        title: "Actualizado",
        description: "Paquete actualizado exitosamente",
      })
      
      router.push('/admin/packages')
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el paquete",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const addService = () => {
    if (!packageData) return
    setPackageData({
      ...packageData,
      services: [...packageData.services, { icon: 'Bus', text: '' }]
    })
  }

  const updateService = (index: number, field: 'icon' | 'text', value: string) => {
    if (!packageData) return
    const services = [...packageData.services]
    services[index] = { ...services[index], [field]: value }
    setPackageData({ ...packageData, services })
  }

  const removeService = (index: number) => {
    if (!packageData) return
    setPackageData({
      ...packageData,
      services: packageData.services.filter((_, i) => i !== index)
    })
  }

  const addInfo = () => {
    if (!packageData) return
    setPackageData({
      ...packageData,
      information: [...packageData.information, '']
    })
  }

  const updateInfo = (index: number, value: string) => {
    if (!packageData) return
    const information = [...packageData.information]
    information[index] = value
    setPackageData({ ...packageData, information })
  }

  const removeInfo = (index: number) => {
    if (!packageData) return
    setPackageData({
      ...packageData,
      information: packageData.information.filter((_, i) => i !== index)
    })
  }

  const addAvailableDate = () => {
    if (!packageData) return
    setPackageData({
      ...packageData,
      availableDates: [...packageData.availableDates, new Date().getDate()]
    })
  }

  const updateAvailableDate = (index: number, value: number) => {
    if (!packageData) return
    const availableDates = [...packageData.availableDates]
    availableDates[index] = value
    setPackageData({ ...packageData, availableDates })
  }

  const removeAvailableDate = (index: number) => {
    if (!packageData) return
    setPackageData({
      ...packageData,
      availableDates: packageData.availableDates.filter((_, i) => i !== index)
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!packageData) {
    return (
      <div className="text-center py-16">
        <p className="text-xl text-muted-foreground">Paquete no encontrado</p>
        <Link href="/admin/packages">
          <Button variant="outline" className="mt-4">Volver a Paquetes</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/packages">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Editar Paquete</h1>
              <p className="text-muted-foreground">{packageData.title}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant={packageData.isActive ? "default" : "destructive"}>
              {packageData.isActive ? "Activo" : "Inactivo"}
            </Badge>
            {packageData.isPromotion && (
              <Badge className="bg-green-500">Promoción</Badge>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          <Card>
            <CardHeader>
              <CardTitle>Información Básica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    value={packageData.title}
                    onChange={(e) => {
                      setPackageData({ ...packageData, title: e.target.value })
                      if (fieldErrors.title) {
                        setFieldErrors({ ...fieldErrors, title: '' })
                      }
                    }}
                    className={fieldErrors.title ? 'border-red-500' : ''}
                    required
                  />
                  {fieldErrors.title && (
                    <p className="text-sm text-red-500">{fieldErrors.title}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destination">Destino *</Label>
                  <Input
                    id="destination"
                    value={packageData.destination}
                    onChange={(e) => {
                      setPackageData({ ...packageData, destination: e.target.value })
                      if (fieldErrors.destination) {
                        setFieldErrors({ ...fieldErrors, destination: '' })
                      }
                    }}
                    className={fieldErrors.destination ? 'border-red-500' : ''}
                    required
                  />
                  {fieldErrors.destination && (
                    <p className="text-sm text-red-500">{fieldErrors.destination}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nights">Noches *</Label>
                  <Input
                    id="nights"
                    type="number"
                    value={packageData.nights}
                    onChange={(e) => {
                      setPackageData({ ...packageData, nights: Number(e.target.value) })
                      if (fieldErrors.nights) {
                        setFieldErrors({ ...fieldErrors, nights: '' })
                      }
                    }}
                    className={fieldErrors.nights ? 'border-red-500' : ''}
                    min="1"
                    required
                  />
                  {fieldErrors.nights && (
                    <p className="text-sm text-red-500">{fieldErrors.nights}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Precio (ARS) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={packageData.price}
                    onChange={(e) => {
                      setPackageData({ ...packageData, price: Number(e.target.value) })
                      if (fieldErrors.price) {
                        setFieldErrors({ ...fieldErrors, price: '' })
                      }
                    }}
                    className={fieldErrors.price ? 'border-red-500' : ''}
                    min="0"
                    required
                  />
                  {fieldErrors.price && (
                    <p className="text-sm text-red-500">{fieldErrors.price}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priceFrom">Precio Desde (ARS)</Label>
                  <Input
                    id="priceFrom"
                    type="number"
                    value={packageData.priceFrom || ''}
                    onChange={(e) => {
                      setPackageData({ ...packageData, priceFrom: Number(e.target.value) || undefined })
                      if (fieldErrors.priceFrom) {
                        setFieldErrors({ ...fieldErrors, priceFrom: '' })
                      }
                    }}
                    className={fieldErrors.priceFrom ? 'border-red-500' : ''}
                    min="0"
                  />
                  {fieldErrors.priceFrom && (
                    <p className="text-sm text-red-500">{fieldErrors.priceFrom}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="departureDate">Fecha de Salida *</Label>
                  <Input
                    id="departureDate"
                    type="date"
                    value={packageData.departureDate?.split('T')[0] || ''}
                    onChange={(e) => {
                      setPackageData({ ...packageData, departureDate: e.target.value })
                      if (fieldErrors.departureDate) {
                        setFieldErrors({ ...fieldErrors, departureDate: '' })
                      }
                    }}
                    className={fieldErrors.departureDate ? 'border-red-500' : ''}
                    required
                  />
                  {fieldErrors.departureDate && (
                    <p className="text-sm text-red-500">{fieldErrors.departureDate}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="badge">Etiqueta</Label>
                  <Input
                    id="badge"
                    value={packageData.badge || ''}
                    onChange={(e) => setPackageData({ ...packageData, badge: e.target.value })}
                    placeholder="Ej: EN AVION"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo de Paquete *</Label>
                  <Select
                    value={packageData.type}
                    onValueChange={(value) => {
                      setPackageData({ ...packageData, type: value as IPackage['type'] })
                      if (fieldErrors.type) {
                        setFieldErrors({ ...fieldErrors, type: '' })
                      }
                    }}
                  >
                    <SelectTrigger className={fieldErrors.type ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Selecciona el tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PAQUETE ESTUDIANTILES">PAQUETE ESTUDIANTILES</SelectItem>
                      <SelectItem value="PAQUETES INTERNACIONALES">PAQUETES INTERNACIONALES</SelectItem>
                      <SelectItem value="PAQUETES NACIONALES">PAQUETES NACIONALES</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldErrors.type && (
                    <p className="text-sm text-red-500 mt-1">{fieldErrors.type}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={packageData.description || ''}
                  onChange={(e) => setPackageData({ ...packageData, description: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={packageData.isPromotion}
                    onCheckedChange={(checked) => setPackageData({ ...packageData, isPromotion: checked })}
                  />
                  <Label>Es Promoción</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={packageData.isPublished}
                    onCheckedChange={(checked) => setPackageData({ ...packageData, isPublished: checked })}
                  />
                  <Label>Publicado</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={packageData.isActive}
                    onCheckedChange={(checked) => setPackageData({ ...packageData, isActive: checked })}
                  />
                  <Label>Activo</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Imágenes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Imágenes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Imagen Principal */}
              <div className="space-y-3">
                <Label>Imagen Principal</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative border-2 border-dashed rounded-lg overflow-hidden bg-muted hover:bg-muted/80 transition-colors">
                    <label className="cursor-pointer block h-64">
                      {mainImagePreview ? (
                        <img 
                          src={mainImagePreview} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full">
                          <Upload className="h-12 w-12 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">Click para subir imagen</p>
                        </div>
                      )}
                      <input
                        type="file"
                        onChange={handleMainImageChange}
                        className="sr-only"
                        accept="image/*"
                      />
                    </label>
                  </div>
                  {mainImagePreview && (
                    <div className="flex items-center">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setMainImageFile(null)
                          setMainImagePreview('')
                        }}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Quitar Imagen
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Galería */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Galería de Imágenes</Label>
                  <label>
                    <Button type="button" variant="outline" size="sm" asChild>
                      <span className="cursor-pointer">
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Imágenes
                      </span>
                    </Button>
                    <input
                      type="file"
                      multiple
                      onChange={handleGalleryChange}
                      className="sr-only"
                      accept="image/*"
                    />
                  </label>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {galleryPreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeGalleryImage(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                {galleryPreviews.length === 0 && (
                  <div className="text-center py-8 border-2 border-dashed rounded-lg">
                    <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No hay imágenes en la galería
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Servicios */}
          <Card>
            <CardHeader>
              <CardTitle>Servicios Incluidos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Servicios</Label>
                <Button type="button" variant="outline" size="sm" onClick={addService}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Servicio
                </Button>
              </div>
              {packageData.services.map((service, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <Input
                    value={service.icon}
                    onChange={(e) => updateService(index, 'icon', e.target.value)}
                    placeholder="Icono"
                    className="w-32"
                  />
                  <Input
                    value={service.text}
                    onChange={(e) => updateService(index, 'text', e.target.value)}
                    placeholder="Descripción del servicio"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeService(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Información Adicional */}
          <Card>
            <CardHeader>
              <CardTitle>Información Adicional</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Items de Información</Label>
                <Button type="button" variant="outline" size="sm" onClick={addInfo}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Item
                </Button>
              </div>
              {packageData.information.map((info, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <Input
                    value={info}
                    onChange={(e) => updateInfo(index, e.target.value)}
                    placeholder="Información adicional"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeInfo(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Hotel */}
          <Card>
            <CardHeader>
              <CardTitle>Información del Hotel</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nombre del Hotel *</Label>
                <Input
                  value={packageData.hotel?.name || ''}
                  onChange={(e) => {
                    setPackageData({
                      ...packageData,
                      hotel: { ...packageData.hotel, name: e.target.value }
                    })
                    if (fieldErrors.hotelName) {
                      setFieldErrors({ ...fieldErrors, hotelName: '' })
                    }
                  }}
                  className={fieldErrors.hotelName ? 'border-red-500' : ''}
                  required
                />
                {fieldErrors.hotelName && (
                  <p className="text-sm text-red-500">{fieldErrors.hotelName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Tipo de Habitación *</Label>
                <Input
                  value={packageData.hotel?.roomType || ''}
                  onChange={(e) => {
                    setPackageData({
                      ...packageData,
                      hotel: { ...packageData.hotel, roomType: e.target.value }
                    })
                    if (fieldErrors.hotelRoomType) {
                      setFieldErrors({ ...fieldErrors, hotelRoomType: '' })
                    }
                  }}
                  className={fieldErrors.hotelRoomType ? 'border-red-500' : ''}
                  required
                />
                {fieldErrors.hotelRoomType && (
                  <p className="text-sm text-red-500">{fieldErrors.hotelRoomType}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Zona</Label>
                <Input
                  value={packageData.hotel?.zone || ''}
                  onChange={(e) => setPackageData({
                    ...packageData,
                    hotel: { ...packageData.hotel, zone: e.target.value }
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label>Ubicación</Label>
                <Input
                  value={packageData.hotel?.location || ''}
                  onChange={(e) => setPackageData({
                    ...packageData,
                    hotel: { ...packageData.hotel, location: e.target.value }
                  })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Puntos de Salida */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Puntos de Salida
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Label>Selecciona los puntos desde donde sale el paquete</Label>
              {departurePoints.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed rounded-lg">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-4">
                    No hay puntos de salida disponibles
                  </p>
                  <Link href="/admin/departure-points">
                    <Button type="button" variant="outline" size="sm">
                      Crear Puntos de Salida
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {departurePoints.map((point) => (
                    <div
                      key={point._id}
                      className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <input
                        type="checkbox"
                        id={`departure-${point._id}`}
                        checked={packageData.departurePoints?.includes(point._id) || false}
                        onChange={(e) => {
                          const currentPoints = packageData.departurePoints || []
                          if (e.target.checked) {
                            setPackageData({
                              ...packageData,
                              departurePoints: [...currentPoints, point._id]
                            })
                          } else {
                            setPackageData({
                              ...packageData,
                              departurePoints: currentPoints.filter(id => id !== point._id)
                            })
                          }
                        }}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <label
                        htmlFor={`departure-${point._id}`}
                        className="flex-1 cursor-pointer"
                      >
                        <p className="font-medium">{point.name}</p>
                        <p className="text-sm text-muted-foreground">{point.city}</p>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Días Disponibles */}
          <Card>
            <CardHeader>
              <CardTitle>Días Disponibles del Mes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Días</Label>
                <Button type="button" variant="outline" size="sm" onClick={addAvailableDate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Día
                </Button>
              </div>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                {packageData.availableDates.map((day, index) => (
                  <div key={index} className="flex gap-1">
                    <Input
                      type="number"
                      value={day}
                      onChange={(e) => updateAvailableDate(index, Number(e.target.value))}
                      min="1"
                      max="31"
                      className="w-full"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeAvailableDate(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Botones de Acción */}
          <div className="flex gap-4 pt-4 sticky bottom-0 bg-background/95 backdrop-blur p-4 border-t">
            <Link href="/admin/packages" className="flex-1">
              <Button type="button" variant="outline" className="w-full">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" disabled={saving} className="flex-1">
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Cambios
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
