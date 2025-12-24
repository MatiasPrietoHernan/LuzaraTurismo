"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, MapPin, Calendar } from 'lucide-react'

interface Promotion {
  _id: string
  title: string
  mainImage: string
  badge?: string
  price: number
  priceFrom?: number
  destination?: string
  nights?: number
}

export function PromotionsSection() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/packages?type=promotions&limit=4')
      .then(res => res.json())
      .then(setPromotions)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-12 text-balance">
          Nuestras Promociones
        </h2>
        <div className="grid grid-cols-4 gap-6">
          {Array.from({length: 4}).map((_, i) => (
            <Card key={i} className="h-80 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  }

  if (!promotions.length) {
    return null
  }


  return (
    <section className="py-20 gradient-brand relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-20 w-32 h-32 bg-accent rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 left-20 w-48 h-48 bg-secondary rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-bold text-gradient mb-4">
            Ofertas Exclusivas
          </h2>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Aprovecha nuestras promociones especiales y viaja por menos
          </p>
        </div>

        <div className="relative">
          {/* Enhanced Desktop grid */}
          <div className="hidden lg:grid grid-cols-4 gap-8 px-2">
            {promotions.map((promo, index) => (
              <PromotionCard key={promo._id} {...promo} index={index} />
            ))}
          </div>

          {/* Enhanced Mobile carousel */}
          <div className="lg:hidden">
            <div className="overflow-hidden rounded-2xl">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {promotions.map((promo, index) => (
                  <div key={promo._id} className="w-full flex-shrink-0 px-4">
                    <PromotionCard {...promo} index={index} />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center gap-3 mt-8">
              {promotions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentIndex 
                      ? "bg-accent w-8 shadow-glow" 
                      : "bg-primary-foreground/30 hover:bg-primary-foreground/50"
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
  _id,
  title,
  mainImage,
  badge,
  price,
  priceFrom,
  destination,
  nights,
  index = 0,
}: Promotion & { index?: number }) {
  return (
    <Link href={`/package/${_id}`} className="block group">
      <Card className=" h-[520px] 
  flex flex-col 
  shadow-card 
  hover:shadow-card-hover 
  transition-all
  overflow-hidden">
        {/* Flash sale badge */}
        <div className="absolute top-4 right-4 z-20 animate-pulse-glow">
          <div className="bg-destructive text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            OFERTA
          </div>
        </div>
        
        <div className="relative h-64 shrink-0 overflow-hidden">
          <img
            src={mainImage || "/placeholder.svg"}
            alt={title}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = "/placeholder.svg"
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          {badge && (
            <Badge className="absolute top-4 left-4 gradient-sunset text-white font-bold uppercase text-xs shadow-lg animate-float">
              {badge}
            </Badge>
          )}
        </div>
        <CardContent className="p-6 flex flex-col flex-1">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-destructive via-accent to-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
          
          <div className="flex items-start justify-between mb-3">
          <h3
            className="
              text-lg
              font-bold
              truncate
              h-[48px]
              flex items-center
              mb-2
            "
            title={title}
          >
            {title}
          </h3>


          </div>
         <div className="min-h-[44px] space-y-1 mb-4">
  {destination && (
    <div className="flex items-center gap-2 text-muted-foreground">
      <MapPin className="w-4 h-4 text-accent" />
      <span className="text-sm truncate">{destination}</span>
    </div>
  )}

  {nights && (
    <div className="flex items-center gap-2 text-muted-foreground">
      <Calendar className="w-4 h-4 text-accent" />
      <span className="text-sm">{nights} noches</span>
    </div>
  )}
</div>

          <div className="mt-auto pt-4 border-t flex items-center justify-between">
  <div className="flex items-center gap-2">
    <Zap className="w-5 h-5 text-destructive" />
    {priceFrom && (
      <span className="text-sm line-through text-muted-foreground">
        ARS {priceFrom.toLocaleString("es-AR")}
      </span>
    )}
    <span className="text-2xl font-bold text-gradient">
      ARS {price.toLocaleString("es-AR")}
    </span>
  </div>

  <svg
    className="w-5 h-5 text-accent opacity-0 group-hover:opacity-100 transition-opacity"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
</div>

        </CardContent>
      </Card>
    </Link>
  )
}
