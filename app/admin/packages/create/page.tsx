"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'
import { ArrowLeft, Upload, Image as ImageIcon, Hotel, Bus, CheckCircle, MapPin } from 'lucide-react'

interface IDeparturePoint {
  _id: string
  name: string
  city: string
  isActive: boolean
}

interface FormData {
  title: string
  destination: string
  nights: number
  departureDate: string
  price: number
  priceFrom?: number
  description: string
  badge: string
  type: 'PAQUETE ESTUDIANTILES' | 'PAQUETES INTERNACIONALES' | 'PAQUETES NACIONALES'
  isPromotion: boolean
  isPublished: boolean
  isActive: boolean
  mainImage: File | null
  gallery: File[]
  services: { icon: string; text: string }[]
  information: string[]
  hotel: {
    name: string
    roomType: string
    zone: string
    location: string
  }
  availableDates: number[]
  departurePoints: string[]
}

export default function CreatePackagePage() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    title: '',
    destination: '',
    nights: 1,
    departureDate: '',
    price: 0,
    description: '',
    badge: '',
    type: 'PAQUETE ESTUDIANTILES',
    isPromotion: false,
    isPublished: true,
    isActive: true,
    mainImage: null,
    gallery: [],
    services: [],
    information: [],
    hotel: { name: '', roomType: '', zone: '', location: '' },
    availableDates: [],
    departurePoints: []
  })
  const [loading, setLoading] = useState(false)
  const [previewMain, setPreviewMain] = useState('')
  const [previewGallery, setPreviewGallery] = useState<string[]>([])
  const [departurePoints, setDeparturePoints] = useState<IDeparturePoint[]>([])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const data = new FormData()
    data.append('title', formData.title)
    data.append('destination', formData.destination)
    data.append('nights', formData.nights.toString())
    data.append('departureDate', formData.departureDate)
    data.append('price', formData.price.toString())
    if (formData.priceFrom) data.append('priceFrom', formData.priceFrom.toString())
    data.append('description', formData.description)
    data.append('badge', formData.badge)
    data.append('type', formData.type)
    data.append('isPromotion', formData.isPromotion.toString())
    data.append('isPublished', formData.isPublished.toString())
    data.append('isActive', formData.isActive.toString())
    data.append('services', JSON.stringify(formData.services))
    data.append('information', JSON.stringify(formData.information))
    data.append('hotel', JSON.stringify(formData.hotel))
    data.append('availableDates', JSON.stringify(formData.availableDates))
    data.append('departurePoints', JSON.stringify(formData.departurePoints))

    if (formData.mainImage) data.append('mainImage', formData.mainImage)
    formData.gallery.forEach((file, i) => data.append(`gallery[${i}]`, file))

    try {
      const res = await fetch('/api/admin/packages/create', {
        method: 'POST',
        body: data
      })
      if (res.ok) {
        router.push('/admin/packages')
        router.refresh()
      }
    } catch (error) {
      console.error('Error creating package', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMainImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPreviewMain(url)
      setFormData({ ...formData, mainImage: file })
    }
  }

  const handleGalleryImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const urls = files.map(URL.createObjectURL)
    setPreviewGallery(urls)
    setFormData({ ...formData, gallery: files })
  }

  const addService = () => {
    setFormData({
      ...formData,
      services: [...formData.services, { icon: 'Bus', text: '' }]
    })
  }

  const updateService = (index: number, field: 'icon' | 'text', value: string) => {
    const services = [...formData.services]
    services[index] = { ...services[index], [field]: value }
    setFormData({ ...formData, services })
  }

  const removeService = (index: number) => {
    setFormData({
      ...formData,
      services: formData.services.filter((_, i) => i !== index)
    })
  }

  const addInfo = () => {
    setFormData({
      ...formData,
      information: [...formData.information, '']
    })
  }

  const updateInfo = (index: number, value: string) => {
    const information = [...formData.information]
    information[index] = value
    setFormData({ ...formData, information })
  }

  const removeInfo = (index: number) => {
    setFormData({
      ...formData,
      information: formData.information.filter((_, i) => i !== index)
    })
  }

  const addAvailableDate = () => {
    setFormData({
      ...formData,
      availableDates: [...formData.availableDates, new Date().getDate()]
    })
  }

  const updateAvailableDate = (index: number, value: number) => {
    const availableDates = [...formData.availableDates]
    availableDates[index] = value
    setFormData({ ...formData, availableDates })
  }

  const removeAvailableDate = (index: number) => {
    setFormData({
      ...formData,
      availableDates: formData.availableDates.filter((_, i) => i !== index)
    })
  }

  return (
    <div className="min-h-screen bg-muted/30 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/packages">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Paquetes
            </Button>
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Nuevo Paquete
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Información Básica</CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Título *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Destino *</Label>
                <Input
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  className="mt-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <Label>Noches *</Label>
                <Input
                  type="number"
                  value={formData.nights}
                  onChange={(e) => setFormData({ ...formData, nights: Number(e.target.value) })}
                  min="1"
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Fecha de Salida *</Label>
                <Input
                  type="date"
                  value={formData.departureDate}
                  onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Precio (ARS) *</Label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  min="0"
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <Label>Descripción</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-2"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <Label>Etiqueta</Label>
                <Input
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  className="mt-2"
                  placeholder="Ej: EN AVION"
                />
              </div>
              <div>
                <Label>Tipo de Paquete *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value as FormData['type'] })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Selecciona el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PAQUETE ESTUDIANTILES">PAQUETE ESTUDIANTILES</SelectItem>
                    <SelectItem value="PAQUETES INTERNACIONALES">PAQUETES INTERNACIONALES</SelectItem>
                    <SelectItem value="PAQUETES NACIONALES">PAQUETES NACIONALES</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.isPromotion}
                  onCheckedChange={(checked) => setFormData({ ...formData, isPromotion: checked })}
                />
                <Label>Es Promoción</Label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.isPublished}
                  onCheckedChange={(checked) => setFormData({ ...formData, isPublished: checked })}
                />
                <Label>Publicado</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label>Activo</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Imagen Principal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="w-full h-64 bg-muted rounded-xl flex items-center justify-center border-2 border-dashed border-input cursor-pointer hover:border-primary group">
                <label className="w-full h-full flex flex-col items-center justify-center text-center rounded-xl group-hover:bg-muted/50 transition-colors">
                  <Upload className="w-12 h-12 text-muted-foreground mb-4 group-hover:text-primary" />
                  <p className="font-semibold text-foreground mb-1">Arrastra o click para subir</p>
                  <p className="text-sm text-muted-foreground">PNG, JPG hasta 5MB</p>
                  <input type="file" onChange={handleMainImage} className="sr-only" accept="image/*" />
                </label>
              </div>
              {previewMain && (
                <img src={previewMain} alt="Preview" className="w-full h-64 object-cover rounded-xl" />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Galería de Imágenes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="w-full h-32 bg-muted rounded-xl flex items-center justify-center border-2 border-dashed border-input cursor-pointer hover:border-primary group">
                <label className="w-full h-full flex flex-col items-center justify-center text-center rounded-xl group-hover:bg-muted/50 transition-colors">
                  <Upload className="w-12 h-12 text-muted-foreground mb-4 group-hover:text-primary" />
                  <p className="font-semibold text-foreground mb-1">Agregar imágenes</p>
                  <p className="text-sm text-muted-foreground">Múltiples PNG, JPG hasta 5MB</p>
                  <input type="file" multiple onChange={handleGalleryImage} className="sr-only" accept="image/*" />
                </label>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {previewGallery.map((url, i) => (
                  <img key={i} src={url} alt="Preview" className="w-full h-24 object-cover rounded-lg" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Servicios Incluidos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Servicios</Label>
              <Button type="button" variant="outline" size="sm" onClick={addService}>
                Agregar Servicio
              </Button>
            </div>
            {formData.services.map((service, index) => (
              <div key={index} className="flex gap-3 items-start">
                <Input
                  value={service.icon}
                  onChange={(e) => updateService(index, 'icon', e.target.value)}
                  placeholder="Icono (Bus, Hotel, etc)"
                  className="w-24"
                />
                <Input
                  value={service.text}
                  onChange={(e) => updateService(index, 'text', e.target.value)}
                  placeholder="Texto del servicio"
                  className="flex-1"
                />
                <Button type="button" variant="destructive" size="sm" onClick={() => removeService(index)}>
                  Eliminar
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Información Adicional</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Información</Label>
              <Button type="button" variant="outline" size="sm" onClick={addInfo}>
                Agregar Item
              </Button>
            </div>
            {formData.information.map((info, index) => (
              <div key={index} className="flex gap-3 items-start">
                <Input
                  value={info}
                  onChange={(e) => updateInfo(index, e.target.value)}
                  placeholder="Ej: BUS IDA Y VUELTA"
                  className="flex-1"
                />
                <Button type="button" variant="destructive" size="sm" onClick={() => removeInfo(index)}>
                  Eliminar
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hotel</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Nombre del Hotel *</Label>
              <Input
                value={formData.hotel.name}
                onChange={(e) => setFormData({ ...formData, hotel: { ...formData.hotel, name: e.target.value } })}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Tipo de Habitación *</Label>
              <Input
                value={formData.hotel.roomType}
                onChange={(e) => setFormData({ ...formData, hotel: { ...formData.hotel, roomType: e.target.value } })}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Zona</Label>
              <Input
                value={formData.hotel.zone}
                onChange={(e) => setFormData({ ...formData, hotel: { ...formData.hotel, zone: e.target.value } })}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Localización</Label>
              <Input
                value={formData.hotel.location}
                onChange={(e) => setFormData({ ...formData, hotel: { ...formData.hotel, location: e.target.value } })}
                className="mt-2"
              />
            </div>
          </CardContent>
        </Card>

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
                      checked={formData.departurePoints.includes(point._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            departurePoints: [...formData.departurePoints, point._id]
                          })
                        } else {
                          setFormData({
                            ...formData,
                            departurePoints: formData.departurePoints.filter(id => id !== point._id)
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

        <Card>
          <CardHeader>
            <CardTitle>Días Disponibles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Días del mes disponibles</Label>
              <Button type="button" variant="outline" size="sm" onClick={addAvailableDate}>
                Agregar Día
              </Button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {formData.availableDates.map((day, index) => (
                <div key={index} className="flex gap-1">
                  <Input
                    type="number"
                    value={day}
                    onChange={(e) => updateAvailableDate(index, Number(e.target.value))}
                    min="1"
                    max="31"
                    className="w-full"
                    size={2}
                  />
                  <Button type="button" variant="destructive" size="sm" onClick={() => removeAvailableDate(index)}>
                    X
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 pt-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="submit" onClick={handleSubmit} disabled={loading} className="flex-1">
            {loading ? 'Creando...' : 'Crear Paquete'}
          </Button>
        </div>
      </div>
    </div>
  )
}
