"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap } from 'lucide-react'
import { useState } from "react"

const packages = [
  {
    id: 1,
    title: "CAMBORIÚ AÉREO",
    image: "/camboriu-brasil-cityscape-aerial-view.jpg",
    badge: "EN AVION",
    price: 2581250,
    description: "Vuelo directo + hotel 4 estrellas",
  },
  {
    id: 2,
    title: "MAR DEL PLATA",
    image: "/mar-del-plata-beach-argentina-sea-lion-sculpture.jpg",
    badge: "Paquete Promocional",
    price: 681000,
    description: "Hotel + excursiones incluidas",
  },
  {
    id: 3,
    title: "MAR DEL PLATA 5 NOCHES",
    image: "/mar-del-plata-hotel-resort-beachfront.jpg",
    badge: "5 Noches",
    price: 393000,
    description: "Todo incluido en resort",
  },
  {
    id: 4,
    title: "PATAGONIA CHILENA",
    image: "/patagonia-chile-volcano-osorno-lake.jpg",
    badge: "Paquete Aventura",
    price: 1665000,
    description: "Naturaleza + trekking",
  },
]

export function PackagesSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  return (
    <section id="paquetes" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-12 text-balance">
          Paquetes
        </h2>

        <div className="relative">
          {/* Desktop grid */}
          <div className="hidden lg:grid grid-cols-4 gap-6">
            {packages.map((pkg) => (
              <PackageCard key={pkg.id} {...pkg} />
            ))}
          </div>

          {/* Mobile carousel */}
          <div className="lg:hidden">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {packages.map((pkg) => (
                  <div key={pkg.id} className="w-full flex-shrink-0 px-2">
                    <PackageCard {...pkg} />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center gap-2 mt-6">
              {packages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? "bg-secondary" : "bg-border"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function PackageCard({
  title,
  image,
  badge,
  price,
  description,
}: {
  title: string
  image: string
  badge: string
  price: number
  description: string
}) {
  return (
    <Card className="group hover:shadow-xl transition-shadow duration-300 overflow-hidden p-0">
      <div className="relative h-64 overflow-hidden">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground font-bold uppercase text-xs">
          {badge}
        </Badge>
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-foreground mb-2 min-h-[3rem]">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <div className="flex items-baseline gap-2">
          <Zap className="w-5 h-5 text-accent" />
          <span className="text-sm text-muted-foreground">Desde</span>
          <span className="text-2xl font-bold text-foreground">
            ARS {price.toLocaleString("es-AR")}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
