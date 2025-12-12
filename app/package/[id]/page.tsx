"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { useCart } from "@/components/cart-context"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { 
  MapPin, 
  Calendar as CalendarIcon, 
  Bus, 
  Hotel, 
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Bed,
  Users
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

// Mock package data
const packagesData: Record<string, any> = {
  "1": {
    id: "1",
    title: "MDQ VIERNES (BUS+HTL) 2026",
    destination: "Mar del Plata, Argentina",
    nights: 10,
    departureDate: "19/12/2025",
    price: 350000,
    priceFrom: 408000,
    mainImage: "/mar-del-plata-beach-promenade.jpg",
    gallery: [
      "/mar-del-plata-beach-promenade.jpg",
      "/mar-del-plata-hotel-resort-beachfront.jpg",
      "/mar-del-plata-beach-argentina-sea-lion-sculpture.jpg",
      "/mar-del-plata-hotel-resort-beachfront.jpg"
    ],
    services: [
      { icon: Bus, text: "Bus ida y vuelta" },
      { icon: Hotel, text: "20/12/2025 - 7 noches en HOTEL CATEGORIA TURISTA (MDQ-SAB-7N-DWL)" },
      { icon: CheckCircle2, text: "19/12/2025 COORDINACION PERMANENTE IQQ" },
      { icon: CheckCircle2, text: "19/12/2025 MEDIA PENSION" }
    ],
    information: [
      "BUS IDA Y VUELTA",
      "MEDIA PENSION",
      "COORDINACION",
      "7 NOCHES DE HOTEL"
    ],
    hotel: {
      name: "HOTEL CATEGORIA TURISTA HTL",
      roomType: "Habitación Doble",
      zone: "ZONA GUEMES",
      location: "MAR DEL PLATA",
      image: "/mar-del-plata-hotel-resort-beachfront.jpg"
    },
    availableDates: [19, 20, 21, 26, 27, 28] // Days available in December 2025
  },
  "2": {
    id: "2",
    title: "CATARATAS 2X1 DICIEMBRE",
    destination: "Cataratas del Iguazú, Argentina",
    nights: 5,
    departureDate: "15/12/2025",
    price: 550000,
    priceFrom: null,
    mainImage: "/iguazu-falls-waterfall.jpg",
    gallery: [
      "/iguazu-falls-waterfall.jpg",
      "/iguazu-falls-waterfall.jpg",
      "/iguazu-falls-waterfall.jpg",
      "/iguazu-falls-waterfall.jpg"
    ],
    services: [
      { icon: Bus, text: "Bus ida y vuelta" },
      { icon: Hotel, text: "5 noches en hotel 4 estrellas" },
      { icon: CheckCircle2, text: "Coordinación permanente" },
      { icon: CheckCircle2, text: "Pensión completa" }
    ],
    information: [
      "BUS IDA Y VUELTA",
      "PENSION COMPLETA",
      "COORDINACION",
      "5 NOCHES DE HOTEL"
    ],
    hotel: {
      name: "HOTEL IGUAZU GRAND",
      roomType: "Habitación Triple",
      zone: "ZONA CENTRO",
      location: "PUERTO IGUAZU",
      image: "/iguazu-falls-waterfall.jpg"
    },
    availableDates: [15, 16, 17, 22, 23, 29, 30]
  }
}

export default function PackagePage() {
  const params = useParams()
  const id = params.id as string
  const packageData = packagesData[id] || packagesData["1"]
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const { addItem } = useCart()
  const router = useRouter()

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === packageData.gallery.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? packageData.gallery.length - 1 : prev - 1
    )
  }

  const isDateAvailable = (date: Date) => {
    return packageData.availableDates.includes(date.getDate())
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      {/* Header spacing */}
      <div className="h-20"></div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title Section */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {packageData.title}
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CalendarIcon className="w-5 h-5" />
                <span className="text-lg">
                  {packageData.nights} noches - Salida: {packageData.departureDate}
                </span>
              </div>
            </div>

            {/* Image Gallery */}
            <Card className="overflow-hidden p-0">
              <div className="relative aspect-video bg-muted">
                <Image
                  src={packageData.gallery[currentImageIndex]}
                  alt={packageData.title}
                  fill
                  className="object-cover"
                />
                {/* Navigation Arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-foreground" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                >
                  <ChevronRight className="w-6 h-6 text-foreground" />
                </button>
              </div>

              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-4 gap-2 p-4">
                {packageData.gallery.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={cn(
                      "relative aspect-video rounded-lg overflow-hidden border-2 transition-all",
                      currentImageIndex === index
                        ? "border-primary ring-2 ring-primary"
                        : "border-transparent hover:border-primary/50"
                    )}
                  >
                    <Image
                      src={image}
                      alt={`Gallery ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </Card>

            {/* Services Section */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Servicios del Paquete
                </h2>
                <div className="space-y-3">
                  {packageData.services.map((service: any, index: number) => (
                    <div key={index} className="flex items-start gap-3">
                      <service.icon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{service.text}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Information Section */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Información
                </h2>
                <ul className="space-y-2">
                  {packageData.information.map((info: string, index: number) => (
                    <li key={index} className="text-foreground font-medium">
                      {info}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Hotel Section */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Hoteles
                </h2>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative w-full md:w-48 h-48 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={packageData.hotel.image}
                      alt={packageData.hotel.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start gap-2">
                      <Hotel className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-bold text-lg text-foreground">
                          {packageData.hotel.name}
                        </h3>
                        <div className="flex items-center gap-2 text-accent mt-1">
                          <Bed className="w-4 h-4" />
                          <span className="text-sm font-medium">{packageData.hotel.roomType}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      <div>
                        <p className="font-medium text-foreground">{packageData.hotel.zone}</p>
                        <p className="text-sm text-muted-foreground">{packageData.hotel.location}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Price and Booking */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <Card className="overflow-hidden">
                {/* Price Header */}
                <div className="bg-accent text-accent-foreground p-6">
                  <div className="text-sm font-medium mb-1">Por</div>
                  <div className="text-3xl font-bold">
                    ARS {packageData.price.toLocaleString("es-AR")}
                  </div>
                  {packageData.priceFrom && (
                    <div className="text-sm line-through opacity-80 mt-1">
                      Desde ARS {packageData.priceFrom.toLocaleString("es-AR")}
                    </div>
                  )}
                </div>

                {/* Calendar */}
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-lg font-bold text-foreground mb-2">
                          Diciembre 2025
                        </div>
                      </div>
                    </div>
                    
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        if (date && isDateAvailable(date)) {
                          setSelectedDate(date)
                        }
                      }}
                      disabled={(date) => !isDateAvailable(date)}
                      month={new Date(2025, 11, 1)}
                      className="rounded-md border-0"
                    />

                    <div className="text-xs text-muted-foreground text-center px-2">
                      Solo se muestran los días con salidas disponibles
                    </div>

                    <Button 
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg py-6"
                      disabled={!selectedDate}
                      onClick={() => {
                        if (!selectedDate) return
                        const dateStr = selectedDate.toLocaleDateString("es-AR")
                        addItem({
                          id: `${packageData.id}-${dateStr}`,
                          title: packageData.title,
                          image: packageData.mainImage,
                          price: packageData.price,
                          quantity: 1,
                          date: dateStr,
                          details: `${packageData.nights} noches · ${packageData.destination}`
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
              <Card>
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <CalendarIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{packageData.nights} Noches</p>
                      <p className="text-sm text-muted-foreground">Estadía incluida</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bus className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Transporte</p>
                      <p className="text-sm text-muted-foreground">Ida y vuelta incluido</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Coordinación</p>
                      <p className="text-sm text-muted-foreground">Permanente en destino</p>
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
