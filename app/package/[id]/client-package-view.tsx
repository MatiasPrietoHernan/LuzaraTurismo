"use client"

import React, { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { useCart } from "@/components/cart-context"
import { Header } from "@/components/header"
import { 
  MapPin, 
  ChevronLeft,
  ChevronRight,
  Bed,
  Users,
  Calendar as CalendarIcon
} from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import * as LucideDynamic from "lucide-react"
import { Bus, Hotel } from "lucide-react"

interface DeparturePoint {
  _id: string
  name: string
  city: string
  address?: string
}

interface ClientPackage {
  _id: string
  title: string
  mainImage?: string
  gallery?: string[]
  badge?: string
  price: number
  priceFrom?: number
  description?: string
  destination?: string
  nights?: number
  departureDate?: string
  formattedDepartureDate?: string
  availableDates?: number[]
  services?: { icon: string; text: string }[]
  information?: string[]
  hotel?: {
    name: string
    roomType: string
    zone?: string
    location?: string
    image?: string
  }
  departurePoints?: DeparturePoint[]
}

interface Props {
  pkg: ClientPackage
}

export default function ClientPackageView({ pkg }: Props) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const departureMonth = useMemo(() => {
    if (!pkg.departureDate) return undefined
    const date = new Date(pkg.departureDate)
    if (Number.isNaN(date.getTime())) return undefined
    return new Date(date.getFullYear(), date.getMonth(), 1)
  }, [pkg.departureDate])
  const defaultSelectedDate = useMemo(() => {
    if (!departureMonth || !pkg.availableDates?.length) return undefined
    const firstDay = pkg.availableDates[0]
    return new Date(departureMonth.getFullYear(), departureMonth.getMonth(), firstDay)
  }, [departureMonth, pkg.availableDates])
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(defaultSelectedDate)
  const { addItem } = useCart()
  const router = useRouter()

  useEffect(() => {
    setSelectedDate(defaultSelectedDate)
  }, [defaultSelectedDate])

  const availableDays = useMemo(() => new Set(pkg.availableDates || []), [pkg.availableDates])

  const effectiveGallery = pkg.gallery && pkg.gallery.length > 0 
    ? pkg.gallery 
    : pkg.mainImage 
      ? [pkg.mainImage] 
      : ["/placeholder.svg"]

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === effectiveGallery.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? effectiveGallery.length - 1 : prev - 1
    )
  }

  const isDateAvailable = (date: Date) => {
    if (!departureMonth || availableDays.size === 0) return false
    return (
      date.getMonth() === departureMonth.getMonth() &&
      date.getFullYear() === departureMonth.getFullYear() &&
      availableDays.has(date.getDate())
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      {/* Header spacing */}
      <div className="h-20"></div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title Section */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#2C3E5C] mb-2">
                {pkg.title}
              </h1>
              <div className="flex items-center gap-4 text-slate-600">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-[#4A9B9B]" />
                  <span className="text-lg font-medium">
                    {pkg.nights} noches
                  </span>
                </div>
                {pkg.destination && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#4A9B9B]" />
                    <span className="text-lg font-medium">
                      {pkg.destination}
                    </span>
                  </div>
                )}
              </div>
              {pkg.formattedDepartureDate && (
                <div className="text-slate-600 mt-1 font-medium">
                  Salida: {pkg.formattedDepartureDate}
                </div>
              )}
            </div>

            {/* Image Gallery */}
            <Card className="overflow-hidden p-0 border-0 shadow-lg">
              <div className="relative aspect-video bg-slate-200">
                <Image
                  src={effectiveGallery[currentImageIndex]}
                  alt={pkg.title}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/placeholder.svg"
                  }}
                />
                {/* Navigation Arrows */}
                {effectiveGallery.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white p-2 rounded-full shadow-lg transition-all hover:scale-110"
                    >
                      <ChevronLeft className="w-6 h-6 text-[#2C3E5C]" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white p-2 rounded-full shadow-lg transition-all hover:scale-110"
                    >
                      <ChevronRight className="w-6 h-6 text-[#2C3E5C]" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {effectiveGallery.length > 1 && (
                <div className="grid grid-cols-4 gap-2 p-4 bg-white">
                  {effectiveGallery.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={cn(
                        "relative aspect-video rounded-lg overflow-hidden border-2 transition-all",
                        currentImageIndex === index
                          ? "border-[#4A9B9B] ring-2 ring-[#4A9B9B]/30"
                          : "border-slate-200 hover:border-[#4A9B9B]/50"
                      )}
                    >
                      <Image
                        src={image}
                        alt={`Gallery ${index + 1}`}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.svg"
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </Card>

            {/* Description Section */}
            {pkg.description && (
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-[#2C3E5C] mb-4">
                    Descripción
                  </h2>
                  <p className="text-slate-600 leading-relaxed">
                    {pkg.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Available Dates */}
            {pkg.availableDates && pkg.availableDates.length > 0 && (
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-[#2C3E5C] mb-4">
                    Fechas disponibles
                  </h2>
                  <p className="text-sm text-slate-500 mb-4">
                    {departureMonth
                      ? `Salidas confirmadas para el mes de ${departureMonth.toLocaleDateString("es-AR", { month: "long", year: "numeric" })}`
                      : "Salidas confirmadas para este paquete"}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {pkg.availableDates.map((day) => (
                      <span
                        key={day}
                        className="px-3 py-1 rounded-full bg-[#4A9B9B]/10 text-[#2C3E5C] font-semibold text-sm"
                      >
                        Día {day}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Services Section */}
            {pkg.services && pkg.services.length > 0 && (
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-[#2C3E5C] mb-4">
                    Servicios del Paquete
                  </h2>
                  <div className="space-y-3">
                    {pkg.services.map((service: any, index: number) => {
                      const IconComponent = (LucideDynamic as any)[service.icon];
                      if (!IconComponent || typeof IconComponent !== 'function') {
                        return (
                          <div key={index} className="flex items-start gap-3">
                            <div className="w-5 h-5 bg-[#4A9B9B]/20 rounded flex-shrink-0 mt-0.5" />
                            <span className="text-slate-700">{service.text}</span>
                          </div>
                        );
                      }
                      return (
                        <div key={index} className="flex items-start gap-3">
                          {React.createElement(IconComponent, { className: "w-5 h-5 text-[#4A9B9B] mt-0.5 flex-shrink-0" })}
                          <span className="text-slate-700">{service.text}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Information Section */}
            {pkg.information && pkg.information.length > 0 && (
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-[#2C3E5C] mb-4">
                    Información
                  </h2>
                  <ul className="space-y-2">
                    {pkg.information.map((info: string, index: number) => (
                      <li key={index} className="text-slate-700 font-medium">
                        {info}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Departure Points */}
            {pkg.departurePoints && pkg.departurePoints.length > 0 && (
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-[#2C3E5C] mb-4">
                    Puntos de salida
                  </h2>
                  <div className="space-y-4">
                    {pkg.departurePoints.map((point) => (
                      <div key={point._id} className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#4A9B9B]/10 flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-5 h-5 text-[#4A9B9B]" />
                        </div>
                        <div>
                          <p className="font-semibold text-[#2C3E5C]">{point.city}</p>
                          <p className="text-sm text-slate-600">{point.name}</p>
                          {point.address && (
                            <p className="text-sm text-slate-500">{point.address}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Hotel Section */}
            {pkg.hotel && (
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-[#2C3E5C] mb-4">
                    Hoteles
                  </h2>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative w-full md:w-48 h-48 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                      {pkg.hotel.image ? (
                        <Image
                          src={pkg.hotel.image}
                          alt={pkg.hotel.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                          Sin imagen
                        </div>
                      )}
                    </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start gap-2">
                          <Hotel className="w-5 h-5 text-[#4A9B9B] mt-1 flex-shrink-0" />
                          <div>
                            <h3 className="font-bold text-lg text-[#2C3E5C]">
                              {pkg.hotel.name}
                            </h3>
                            <div className="flex items-center gap-2 text-[#4A9B9B] mt-1">
                              <Bed className="w-4 h-4" />
                              <span className="text-sm font-medium">{pkg.hotel.roomType}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-slate-500 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-slate-700">{pkg.hotel.zone}</p>
                            <p className="text-sm text-slate-600">{pkg.hotel.location}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Price and Booking */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <Card className="overflow-hidden border-0 shadow-lg">
                {/* Price Header */}
                <div className="bg-[#4A9B9B] text-white p-6">
                  <div className="text-sm font-medium mb-1">Por</div>
                  <div className="text-3xl font-bold">
                    ARS {pkg.price.toLocaleString("es-AR")}
                  </div>
                  {pkg.priceFrom && (
                    <div className="text-sm line-through opacity-80 mt-1">
                      Desde ARS {pkg.priceFrom.toLocaleString("es-AR")}
                    </div>
                  )}
                </div>

                {/* Calendar */}
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {departureMonth && (
                      <div className="flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-lg font-bold text-[#2C3E5C] mb-2 capitalize">
                            {departureMonth.toLocaleDateString("es-AR", { month: "long", year: "numeric" })}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        if (date && isDateAvailable(date)) {
                          setSelectedDate(date)
                        }
                      }}
                      disabled={(date) => !isDateAvailable(date)}
                      month={departureMonth}
                      className="rounded-md border-0"
                    />

                    <div className="text-xs text-slate-600 text-center px-2">
                      Solo se muestran los días con salidas disponibles
                    </div>

                    <Button 
                      className="w-full bg-[#2C3E5C] hover:bg-[#3A4F6F] text-white font-bold text-lg py-6 rounded-xl transition-all duration-200"
                      disabled={!selectedDate}
                      onClick={() => {
                        if (!selectedDate) return
                        const dateStr = selectedDate.toLocaleDateString("es-AR")
                        addItem({
                          id: `${pkg._id}-${dateStr}`,
                          title: pkg.title,
                          image: pkg.mainImage || effectiveGallery[0],
                          price: pkg.price,
                          quantity: 1,
                          date: dateStr,
                          details: `${pkg.nights} noches · ${pkg.destination}`
                        })
                        router.push("/cart")
                      }}
                    >
                      Añadir
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Package Features */}
              <Card className="border-0 shadow-md">
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#4A9B9B]/10 flex items-center justify-center flex-shrink-0">
                      <CalendarIcon className="w-5 h-5 text-[#4A9B9B]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#2C3E5C]">{pkg.nights} Noches</p>
                      <p className="text-sm text-slate-600">Estadía incluida</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#4A9B9B]/10 flex items-center justify-center flex-shrink-0">
                      <Bus className="w-5 h-5 text-[#4A9B9B]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#2C3E5C]">Transporte</p>
                      <p className="text-sm text-slate-600">Ida y vuelta incluido</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#4A9B9B]/10 flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-[#4A9B9B]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#2C3E5C]">Coordinación</p>
                      <p className="text-sm text-slate-600">Permanente en destino</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
