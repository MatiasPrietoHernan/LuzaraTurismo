"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, ArrowRight, Clock } from 'lucide-react'

interface PackagePreview {
  _id: string
  title: string
  mainImage: string
  badge?: string
  price: number
  description?: string
  destination?: string
  nights?: number
}

export function PackagesSection() {
  const [packages, setPackages] = useState<PackagePreview[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/packages')
      .then(res => res.json())
      .then(data => {
        // Mostrar solo los primeros 4 paquetes
        setPackages(data.slice(0, 4))
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-[#2C3E5C] mb-12">
          Paquetes Turísticos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({length: 4}).map((_, i) => (
            <Card key={i} className="h-96 animate-pulse bg-slate-200" />
          ))}
        </div>
      </div>
    </div>
  }

  return (
    <section id="paquetes" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-[#2C3E5C] mb-4">
            Paquetes Turísticos
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Descubre nuestros destinos increíbles y vive la experiencia de viaje perfecta
          </p>
        </div>

        <div className="relative">
          {/* Desktop grid */}
          <div className="hidden lg:grid grid-cols-4 gap-6">
            {packages.map((pkg, index) => (
              <PackageCard key={pkg._id} {...pkg} index={index} />
            ))}
          </div>

          {/* Mobile carousel */}
          <div className="lg:hidden">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {packages.map((pkg, index) => (
                  <div key={pkg._id} className="w-full flex-shrink-0 px-2">
                    <PackageCard {...pkg} index={index} />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center gap-2 mt-6">
              {packages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? "bg-[#4A9B9B] w-8" 
                      : "bg-slate-300 w-2 hover:bg-slate-400"
                  }`}
                  aria-label={`Ver paquete ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* CTA Button para ver todos los paquetes */}
        <div className="text-center mt-12">
          <Link href="/paquetes">
            <button className="bg-[#2C3E5C] hover:bg-[#3A4F6F] text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 inline-flex items-center gap-2">
              Ver todos los paquetes
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
          <p className="text-slate-600 mt-4 text-sm">
            Descubre más destinos increíbles y encuentra el viaje perfecto para ti
          </p>
        </div>
      </div>
    </section>
  )
}

function PackageCard({
  _id,
  title,
  mainImage,
  badge,
  price,
  description,
  destination,
  nights,
  index = 0,
}: PackagePreview & { index?: number }) {
  return (
    <Link href={`/package/${_id}`} className="block group">
      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white hover:-translate-y-1">
        {/* Image container */}
        <div className="relative h-64 overflow-hidden bg-slate-200">
          <img
            src={mainImage || "/placeholder.svg"}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = "/placeholder.svg"
            }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          {/* Badge */}
          {badge && (
            <Badge className="absolute top-4 left-4 bg-[#C8D96F] hover:bg-[#C8D96F] text-[#2C3E5C] font-bold uppercase text-xs px-3 py-1 shadow-lg border-0">
              {badge}
            </Badge>
          )}
          
          {/* Price overlay - visible on image */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-baseline gap-2">
              <span className="text-white/90 text-sm font-medium">Desde</span>
              <span className="text-white text-3xl font-bold">
                ${price.toLocaleString("es-AR")}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-5">
          {/* Title */}
          <h3 className="text-xl font-bold text-[#2C3E5C] mb-3 line-clamp-2 min-h-[3.5rem] group-hover:text-[#4A9B9B] transition-colors duration-200">
            {title}
          </h3>
          
          {/* Destination & Duration */}
          <div className="space-y-2 mb-4">
            {destination && (
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="w-4 h-4 text-[#4A9B9B] flex-shrink-0" />
                <span className="text-sm font-medium truncate">{destination}</span>
              </div>
            )}
            
            {nights && (
              <div className="flex items-center gap-2 text-slate-600">
                <Clock className="w-4 h-4 text-[#4A9B9B] flex-shrink-0" />
                <span className="text-sm font-medium">{nights} {nights === 1 ? 'noche' : 'noches'}</span>
              </div>
            )}
          </div>
          
          {/* Description */}
          {description && (
            <p className="text-sm text-slate-600 mb-4 line-clamp-2">
              {description}
            </p>
          )}
          
          {/* CTA */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <span className="text-sm font-semibold text-[#2C3E5C] group-hover:text-[#4A9B9B] transition-colors duration-200">
              Ver detalles
            </span>
            <ArrowRight className="w-5 h-5 text-[#4A9B9B] transform group-hover:translate-x-1 transition-transform duration-200" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
