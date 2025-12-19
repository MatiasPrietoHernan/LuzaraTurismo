"use client"

import { useEffect, useState, type ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Building2, MapPin, Phone, Mail, Globe2, Quote, Image as ImageIcon } from 'lucide-react'

interface BusinessInfo {
  companyName?: string
  slogan?: string
  aboutTitle?: string
  aboutDescription?: string
  mission?: string
  vision?: string
  address?: string
  city?: string
  country?: string
  phones?: string[]
  emails?: string[]
  socials?: {
    facebook?: string
    instagram?: string
    twitter?: string
    youtube?: string
    tiktok?: string
    whatsapp?: string
  }
  heroImage?: string
  gallery?: string[]
}

export function AboutSection() {
  const [info, setInfo] = useState<BusinessInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadInfo = async () => {
      try {
        const res = await fetch('/api/business-info')
        const data = await res.json()
        setInfo(data)
      } catch (error) {
        setInfo(null)
      } finally {
        setLoading(false)
      }
    }

    loadInfo()
  }, [])

  const headline = info?.aboutTitle || '¿Quiénes somos?'
  const description = info?.aboutDescription || 'Somos un equipo apasionado por crear experiencias de viaje memorables.'
  const heroImage = info?.heroImage || '/images/design-mode/Luzara.jpeg'

  return (
    <section id="nosotros" className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5">
              {info?.companyName || 'Luzara Turismo'}
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-[#2C3E5C] leading-tight">
              {headline}
            </h2>
            {info?.slogan && (
              <p className="text-lg text-[#4A9B9B] font-semibold">{info.slogan}</p>
            )}
            <p className="text-lg text-slate-700 leading-relaxed">
              {description}
            </p>

            {(info?.mission || info?.vision) && (
              <Card className="border-dashed border-slate-200 bg-slate-50">
                <CardContent className="p-4 space-y-3">
                  {info.mission && (
                    <div className="flex gap-3">
                      <Quote className="h-5 w-5 text-[#4A9B9B] mt-1" />
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-500">Misión</p>
                        <p className="text-slate-700">{info.mission}</p>
                      </div>
                    </div>
                  )}
                  {info.vision && (
                    <div className="flex gap-3">
                      <Building2 className="h-5 w-5 text-[#4A9B9B] mt-1" />
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-500">Visión</p>
                        <p className="text-slate-700">{info.vision}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <ContactItem
                icon={<MapPin className="h-5 w-5 text-[#4A9B9B]" />}
                label="Ubicación"
                value={[info?.address, info?.city, info?.country].filter(Boolean).join(' · ') || 'San Miguel de Tucumán, Argentina'}
              />
              <ContactItem
                icon={<Phone className="h-5 w-5 text-[#4A9B9B]" />}
                label="Teléfono"
                value={info?.phones?.[0] || '+54 9 381 334-0304'}
              />
              <ContactItem
                icon={<Mail className="h-5 w-5 text-[#4A9B9B]" />}
                label="Email"
                value={info?.emails?.[0] || 'turismoluzara@gmail.com'}
              />
              {info?.socials?.whatsapp && (
                <Button
                  variant="outline"
                  className="justify-start gap-2"
                  asChild
                >
                  <a href={info.socials.whatsapp} target="_blank" rel="noreferrer">
                    <Globe2 className="h-5 w-5 text-[#4A9B9B]" />
                    WhatsApp
                  </a>
                </Button>
              )}
            </div>
          </div>

          <div className="grid gap-4">
            <div className="relative h-full min-h-[320px] rounded-2xl overflow-hidden shadow-xl border border-slate-100 bg-slate-100">
              {heroImage ? (
                <img
                  src={heroImage}
                  alt={headline}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-slate-500">
                  <ImageIcon className="h-10 w-10" />
                </div>
              )}
            </div>

            {info?.gallery && info.gallery.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {info.gallery.slice(0, 3).map((url, idx) => (
                  <div key={idx} className="h-28 rounded-xl overflow-hidden border border-slate-100 bg-slate-100">
                    {url ? (
                      <img src={url} alt={`Galería ${idx + 1}`} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-slate-500">
                        <ImageIcon className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {loading && (
          <p className="mt-6 text-sm text-muted-foreground">Cargando información...</p>
        )}
      </div>
    </section>
  )
}

function ContactItem({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <Card className="border-slate-100">
      <CardContent className="p-4 space-y-1">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500">
          {icon}
          <span>{label}</span>
        </div>
        <p className="font-semibold text-slate-800">{value}</p>
      </CardContent>
    </Card>
  )
}
