"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap } from 'lucide-react'
import { useState } from "react"
import Link from "next/link"

const promotions = [
  {
    id: 1,
    title: "PROMO MAR DEL PLATA",
    image: "/mar-del-plata-beach-promenade.jpg",
    badge: "Salida 19 de Diciembre",
    priceFrom: 408000,
    priceTo: 350000,
  },
  {
    id: 2,
    title: "CATARATAS 2X1 DICIEMBRE",
    image: "/iguazu-falls-waterfall.jpg",
    badge: "Paquete Turístico",
    priceFrom: null,
    priceTo: 550000,
  },
  {
    id: 3,
    title: "LOS FABULOSOS CADILLACS",
    image: "/concert-stadium-buenos-aires.jpg",
    badge: "Estadio Ferro | Buenos Aires",
    priceFrom: null,
    priceTo: 571430,
  },
  {
    id: 4,
    title: "CAMBORIÚ 23 DE NOV",
    image: "/camboriu-brasil-beach-skyline.jpg",
    badge: "5 Noches",
    priceFrom: 804000,
    priceTo: 660000,
  },
]

export function PromotionsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-12 text-balance">
          Nuestras Promociones
        </h2>

        <div className="relative">
          {/* Desktop grid */}
          <div className="hidden lg:grid grid-cols-4 gap-6 px-2">
            {promotions.map((promo) => (
              <PromotionCard key={promo.id} {...promo} />
            ))}
          </div>

          {/* Mobile carousel */}
          <div className="lg:hidden">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {promotions.map((promo) => (
                  <div key={promo.id} className="w-full flex-shrink-0 px-2">
                    <PromotionCard {...promo} />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center gap-2 mt-6">
              {promotions.map((_, index) => (
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

function PromotionCard({
  id,
  title,
  image,
  badge,
  priceFrom,
  priceTo,
}: {
  id: number
  title: string
  image: string
  badge: string
  priceFrom: number | null
  priceTo: number
}) {
  return (
    <Link href={`/package/${id}`} className="block">
      <Card className="group hover:shadow-xl transition-shadow duration-300 overflow-hidden p-0 cursor-pointer">
        <div className="relative h-64 overflow-hidden">
          <img
            src={image || "/placeholder.svg"}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <Badge className="absolute top-4 left-4 bg-secondary text-secondary-foreground font-bold">
            {badge}
          </Badge>
        </div>
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-foreground mb-4 min-h-[3.5rem]">
            {title}
          </h3>
          <div className="flex items-baseline gap-2">
            <Zap className="w-5 h-5 text-accent" />
            {priceFrom && (
              <span className="text-sm text-muted-foreground line-through">
                Desde {priceFrom.toLocaleString("es-AR")}
              </span>
            )}
            <span className="text-2xl font-bold text-foreground">
              {priceTo ? `ARS ${priceTo.toLocaleString("es-AR")}` : `Desde ARS ${priceTo.toLocaleString("es-AR")}`}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
