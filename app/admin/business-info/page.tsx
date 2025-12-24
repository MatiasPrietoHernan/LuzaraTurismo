"use client"

import { useEffect, useMemo, useState } from 'react'
import type { FormEvent, MouseEvent } from 'react'
import Link from 'next/link'
import { Building2, Loader2, Plus, Trash2, Globe2, Phone, Mail } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'

type SocialKeys = 'facebook' | 'instagram' | 'twitter' | 'youtube' | 'tiktok' | 'whatsapp'

interface BusinessInfoForm {
  companyName: string
  slogan: string
  aboutTitle: string
  aboutDescription: string
  mission: string
  vision: string
  address: string
  city: string
  country: string
  phones: string[]
  emails: string[]
  socials: Record<SocialKeys, string>
  heroImage: string
  gallery: string[]
}

const emptyInfo: BusinessInfoForm = {
  companyName: 'Luzara Turismo',
  slogan: '',
  aboutTitle: '¿Quiénes somos?',
  aboutDescription: '',
  mission: '',
  vision: '',
  address: '',
  city: '',
  country: '',
  phones: [''],
  emails: [''],
  socials: {
    facebook: '',
    instagram: '',
    twitter: '',
    youtube: '',
    tiktok: '',
    whatsapp: '',
  },
  heroImage: '',
  gallery: [''],
}

export default function BusinessInfoPage() {
  const [info, setInfo] = useState<BusinessInfoForm>(emptyInfo)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const loadInfo = async () => {
      try {
        const res = await fetch('/api/admin/business-info')
        if (!res.ok) throw new Error('Error al cargar la información')
        const data = await res.json()
        setInfo({
          ...emptyInfo,
          ...data,
          phones: data.phones?.length ? data.phones : [''],
          emails: data.emails?.length ? data.emails : [''],
          gallery: data.gallery?.length ? data.gallery : [''],
          socials: { ...emptyInfo.socials, ...(data.socials || {}) },
        })
      } catch (error) {
        toast({
          title: 'Error',
          description: 'No se pudo cargar la información del negocio',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }

    loadInfo()
  }, [toast])

  const handleArrayChange = (key: 'phones' | 'emails' | 'gallery', index: number, value: string) => {
    setInfo((prev) => {
      const next = [...prev[key]]
      next[index] = value
      return { ...prev, [key]: next }
    })
  }

  const handleAddItem = (key: 'phones' | 'emails' | 'gallery') => {
    setInfo((prev) => ({ ...prev, [key]: [...prev[key], ''] }))
  }

  const handleRemoveItem = (key: 'phones' | 'emails' | 'gallery', index: number) => {
    setInfo((prev) => {
      if (prev[key].length === 1) return prev
      const next = prev[key].filter((_, i) => i !== index)
      return { ...prev, [key]: next }
    })
  }

  const handleSocialChange = (platform: SocialKeys, value: string) => {
    setInfo((prev) => ({ ...prev, socials: { ...prev.socials, [platform]: value } }))
  }

  const savingPreview = useMemo(() => saving || loading, [saving, loading])

  const handleSubmit = async (e?: FormEvent | MouseEvent) => {
    e?.preventDefault?.()
    setSaving(true)
    try {
      const res = await fetch('/api/admin/business-info', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(info),
      })

      if (!res.ok) throw new Error('Error al guardar')

      toast({
        title: 'Información guardada',
        description: 'Los datos del negocio se actualizaron correctamente.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo guardar la información',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Globe2 className="h-4 w-4" />
            <span>Información general</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Información del negocio
          </h1>
          <p className="text-muted-foreground">Gestiona los textos, contactos y enlaces visibles en el sitio.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/">
            <Button variant="outline">Ver sitio</Button>
          </Link>
          <Button type="button" onClick={handleSubmit} disabled={savingPreview}>
            {savingPreview && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Guardar cambios
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Identidad y descripción
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Nombre del negocio</Label>
                <Input
                  id="companyName"
                  value={info.companyName}
                  onChange={(e) => setInfo({ ...info, companyName: e.target.value })}
                  placeholder="Luzara Turismo"
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slogan">Eslogan / frase corta</Label>
                <Input
                  id="slogan"
                  value={info.slogan}
                  onChange={(e) => setInfo({ ...info, slogan: e.target.value })}
                  placeholder="Tu próximo viaje empieza aquí"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="aboutTitle">Título sección ¿Quiénes somos?</Label>
                <Input
                  id="aboutTitle"
                  value={info.aboutTitle}
                  onChange={(e) => setInfo({ ...info, aboutTitle: e.target.value })}
                  placeholder="¿Quiénes somos?"
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heroImage">Imagen destacada (URL)</Label>
                <Input
                  id="heroImage"
                  value={info.heroImage}
                  onChange={(e) => setInfo({ ...info, heroImage: e.target.value })}
                  placeholder="https://tusitio.com/imagen.jpg"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="aboutDescription">Descripción</Label>
              <Textarea
                id="aboutDescription"
                value={info.aboutDescription}
                onChange={(e) => setInfo({ ...info, aboutDescription: e.target.value })}
                placeholder="Cuenta brevemente la historia o propuesta de valor del negocio."
                rows={5}
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mission">Misión</Label>
                <Textarea
                  id="mission"
                  value={info.mission}
                  onChange={(e) => setInfo({ ...info, mission: e.target.value })}
                  placeholder="Nuestra misión es..."
                  rows={3}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vision">Visión</Label>
                <Textarea
                  id="vision"
                  value={info.vision}
                  onChange={(e) => setInfo({ ...info, vision: e.target.value })}
                  placeholder="Nuestra visión es..."
                  rows={3}
                  disabled={loading}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" />
              Contacto y redes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  value={info.address}
                  onChange={(e) => setInfo({ ...info, address: e.target.value })}
                  placeholder="Calle y número"
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Ciudad</Label>
                <Input
                  id="city"
                  value={info.city}
                  onChange={(e) => setInfo({ ...info, city: e.target.value })}
                  placeholder="San Miguel de Tucumán"
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">País</Label>
                <Input
                  id="country"
                  value={info.country}
                  onChange={(e) => setInfo({ ...info, country: e.target.value })}
                  placeholder="Argentina"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Teléfonos</Label>
                <div className="space-y-2">
                  {info.phones.map((phone, index) => (
                    <div key={`phone-${index}`} className="flex gap-2">
                      <Input
                        value={phone}
                        onChange={(e) => handleArrayChange('phones', index, e.target.value)}
                        placeholder="+54 9 381 334-0304"
                        disabled={loading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem('phones', index)}
                        disabled={loading || info.phones.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => handleAddItem('phones')}
                    disabled={loading}
                  >
                    <Plus className="h-4 w-4" />
                    Añadir teléfono
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Emails</Label>
                <div className="space-y-2">
                  {info.emails.map((email, index) => (
                    <div key={`email-${index}`} className="flex gap-2">
                      <Input
                        value={email}
                        onChange={(e) => handleArrayChange('emails', index, e.target.value)}
                        placeholder="contacto@tuempresa.com"
                        disabled={loading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem('emails', index)}
                        disabled={loading || info.emails.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => handleAddItem('emails')}
                    disabled={loading}
                  >
                    <Plus className="h-4 w-4" />
                    Añadir email
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(['whatsapp', 'facebook', 'instagram', 'twitter', 'youtube', 'tiktok'] as SocialKeys[]).map((platform) => (
                <div key={platform} className="space-y-2">
                  <Label className="flex items-center gap-2 capitalize">
                    <Badge variant="outline" className="text-xs">{platform}</Badge>
                  </Label>
                  <Input
                    value={info.socials[platform] || ''}
                    onChange={(e) => handleSocialChange(platform, e.target.value)}
                    placeholder={
                      platform === 'whatsapp'
                        ? 'https://wa.me/549...'
                        : `https://${platform}.com/usuario`
                    }
                    disabled={loading}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Imágenes y recursos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Galería (URLs)</Label>
              <div className="space-y-2">
                {info.gallery.map((url, index) => (
                  <div key={`gallery-${index}`} className="flex gap-2">
                    <Input
                      value={url}
                      onChange={(e) => handleArrayChange('gallery', index, e.target.value)}
                      placeholder="https://tusitio.com/imagen.jpg"
                      disabled={loading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveItem('gallery', index)}
                      disabled={loading || info.gallery.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => handleAddItem('gallery')}
                  disabled={loading}
                >
                  <Plus className="h-4 w-4" />
                  Añadir imagen
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Usa URLs absolutas. Si necesitas subir archivos, primero súbelos al bucket y pega el enlace.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => setInfo(emptyInfo)} disabled={loading || savingPreview}>
            Restablecer
          </Button>
          <Button type="submit" disabled={savingPreview}>
            {savingPreview && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Guardar cambios
          </Button>
        </div>
      </form>
    </div>
  )
}
