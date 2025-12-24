"use client"

import { useState, useEffect, useMemo } from 'react'
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MapPin, Clock, ArrowRight, Filter, X, Navigation } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface Package {
  _id: string
  title: string
  mainImage: string
  badge?: string
  price: number
  description?: string
  destination?: string
  nights?: number
  departurePoints?: Array<string | { _id: string }>
  type?: string
}

interface DeparturePoint {
  _id: string
  name: string
  city: string
  address?: string
}

interface PackageCardProps extends Package {
  departurePointNames?: string[]
}

const DURATIONS = [
  { label: "Cualquier duración", value: "all" },
  { label: "1-3 noches", value: "1-3" },
  { label: "4-7 noches", value: "4-7" },
  { label: "8+ noches", value: "8" }
]

const PRICE_RANGES = [
  { label: "Cualquier precio", value: "all" },
  { label: "Hasta $50,000", value: "0-50000" },
  { label: "$50,000 - $100,000", value: "50000-100000" },
  { label: "$100,000 - $200,000", value: "100000-200000" },
  { label: "Más de $200,000", value: "200000" }
]

export default function InternacionalesPage() {
  const searchParams = useSearchParams()
  const [packages, setPackages] = useState<Package[]>([])
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [departurePoints, setDeparturePoints] = useState<DeparturePoint[]>([])

  // Filters
  const [destination, setDestination] = useState(searchParams.get('destination') || "all")
  const [duration, setDuration] = useState(searchParams.get('duration') || "all")
  const [priceRange, setPriceRange] = useState(searchParams.get('price') || "all")
  const [departurePoint, setDeparturePoint] = useState(searchParams.get('departurePoint') || "all")
  const [sortBy, setSortBy] = useState("relevant")

  // Load packages
  useEffect(() => {
    fetch('/api/packages')
      .then(res => res.json())
      .then(data => {
        // Filter only internacional packages
        const internacionalPackages = data.filter((pkg: Package) => pkg.type === 'PAQUETES INTERNACIONALES')
        setPackages(internacionalPackages)
        setFilteredPackages(internacionalPackages)
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetch('/api/departure-points')
      .then(res => res.json())
      .then(data => setDeparturePoints(data))
      .catch((err) => console.error('Error fetching departure points', err))
  }, [])

  const destinationOptions = useMemo(() => {
    const set = new Set<string>()
    packages.forEach((pkg) => {
      if (pkg.destination) {
        set.add(pkg.destination)
      }
    })
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [packages])

  const departurePointMap = useMemo(() => {
    const map = new Map<string, DeparturePoint>()
    departurePoints.forEach((point) => {
      map.set(point._id, point)
    })
    return map
  }, [departurePoints])

  // Apply filters
  useEffect(() => {
    let filtered = [...packages]

    // Filter by destination
    if (destination && destination !== "all") {
      filtered = filtered.filter(pkg => pkg.destination === destination)
    }

    // Filter by duration
    if (duration && duration !== "all") {
      const [min, max] = duration.split('-').map(Number)
      if (max) {
        filtered = filtered.filter(pkg =>
          pkg.nights && pkg.nights >= min && pkg.nights <= max
        )
      } else {
        filtered = filtered.filter(pkg =>
          pkg.nights && pkg.nights >= min
        )
      }
    }

    // Filter by price range
    if (priceRange && priceRange !== "all") {
      const [min, max] = priceRange.split('-').map(Number)
      if (max) {
        filtered = filtered.filter(pkg =>
          pkg.price >= min && pkg.price <= max
        )
      } else {
        filtered = filtered.filter(pkg => pkg.price >= min)
      }
    }

    // Filter by departure point
    if (departurePoint && departurePoint !== "all") {
      filtered = filtered.filter(pkg =>
        pkg.departurePoints && pkg.departurePoints.some(point => {
          if (typeof point === 'string') {
            return point === departurePoint
          }
          return point?._id === departurePoint
        })
      )
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'duration-asc':
        filtered.sort((a, b) => (a.nights || 0) - (b.nights || 0))
        break
      case 'duration-desc':
        filtered.sort((a, b) => (b.nights || 0) - (a.nights || 0))
        break
    }

    setFilteredPackages(filtered)
  }, [packages, destination, duration, priceRange, departurePoint, sortBy])

  const clearFilters = () => {
    setDestination("all")
    setDuration("all")
    setPriceRange("all")
    setDeparturePoint("all")
    setSortBy("relevant")
  }

  const hasActiveFilters =
    (destination !== "all" && destination !== "") ||
    (duration !== "all" && duration !== "") ||
    (priceRange !== "all" && priceRange !== "") ||
    (departurePoint !== "all" && departurePoint !== "")

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      {/* Page Header */}
      <div className="bg-gradient-to-br from-[#2C3E5C] to-[#3A4F6F] text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Paquetes Internacionales
          </h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Explora el mundo con nuestros paquetes turísticos internacionales
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-md sticky top-24">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-[#2C3E5C] flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filtros
                  </h2>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-[#4A9B9B] hover:text-[#3A8A8A]"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Limpiar
                    </Button>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Destination Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                      Destino
                    </label>
                    <Select value={destination} onValueChange={setDestination}>
                      <SelectTrigger className="border-2 border-slate-200 focus:border-[#4A9B9B]">
                        <SelectValue placeholder="Todos los destinos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los destinos</SelectItem>
                        {destinationOptions.map((dest) => (
                          <SelectItem key={dest} value={dest}>
                            {dest}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Departure Point Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                      Punto de salida
                    </label>
                    <Select value={departurePoint} onValueChange={setDeparturePoint}>
                      <SelectTrigger className="border-2 border-slate-200 focus:border-[#4A9B9B]">
                        <SelectValue placeholder="Todos los puntos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los puntos</SelectItem>
                        {departurePoints.map((point) => (
                          <SelectItem key={point._id} value={point._id}>
                            {point.city} · {point.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Duration Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                      Duración
                    </label>
                    <Select value={duration} onValueChange={setDuration}>
                      <SelectTrigger className="border-2 border-slate-200 focus:border-[#4A9B9B]">
                        <SelectValue placeholder="Cualquier duración" />
                      </SelectTrigger>
                      <SelectContent>
                        {DURATIONS.map((dur) => (
                          <SelectItem key={dur.value} value={dur.value}>
                            {dur.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Range Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                      Precio
                    </label>
                    <Select value={priceRange} onValueChange={setPriceRange}>
                      <SelectTrigger className="border-2 border-slate-200 focus:border-[#4A9B9B]">
                        <SelectValue placeholder="Cualquier precio" />
                      </SelectTrigger>
                      <SelectContent>
                        {PRICE_RANGES.map((range) => (
                          <SelectItem key={range.value} value={range.value}>
                            {range.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sort By */}
                  <div className="space-y-2 pt-4 border-t border-slate-200">
                    <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                      Ordenar por
                    </label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="border-2 border-slate-200 focus:border-[#4A9B9B]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relevant">Relevancia</SelectItem>
                        <SelectItem value="price-asc">Precio: Menor a Mayor</SelectItem>
                        <SelectItem value="price-desc">Precio: Mayor a Menor</SelectItem>
                        <SelectItem value="duration-asc">Duración: Menor a Mayor</SelectItem>
                        <SelectItem value="duration-desc">Duración: Mayor a Menor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Results count */}
            <div className="mb-6">
              <p className="text-slate-600 font-medium">
                {loading ? (
                  "Cargando paquetes..."
                ) : (
                  <>
                    {filteredPackages.length} {filteredPackages.length === 1 ? 'paquete encontrado' : 'paquetes encontrados'}
                  </>
                )}
              </p>
            </div>

            {/* Packages Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({length: 6}).map((_, i) => (
                  <Card key={i} className="h-96 animate-pulse bg-slate-200 border-0" />
                ))}
              </div>
            ) : filteredPackages.length === 0 ? (
              <Card className="border-0 shadow-md">
                <CardContent className="p-12 text-center">
                  <p className="text-xl text-slate-600 mb-4">
                    No se encontraron paquetes internacionales con los filtros seleccionados
                  </p>
                  <Button onClick={clearFilters} className="bg-[#4A9B9B] hover:bg-[#3A8A8A]">
                    Limpiar filtros
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPackages.map((pkg) => {
                  const departurePointNames = Array.from(new Set(
                    (pkg.departurePoints || [])
                      .map((pointRef) => {
                        const pointId = typeof pointRef === 'string' ? pointRef : pointRef?._id
                        if (!pointId) return null
                        return departurePointMap.get(pointId)
                      })
                      .filter((point): point is DeparturePoint => Boolean(point))
                      .map((point) => point.city || point.name)
                  ))
                  return (
                    <PackageCard
                      key={pkg._id}
                      {...pkg}
                      departurePointNames={departurePointNames}
                    />
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
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
  departurePointNames = [],
}: PackageCardProps) {
  const departureSummary = departurePointNames.slice(0, 2).join(", ")
  const extraDepartures = departurePointNames.length > 2
    ? ` +${departurePointNames.length - 2} más`
    : ""
  return (
    <Link href={`/package/${_id}`} className="block group">
      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white hover:-translate-y-1">
        {/* Image */}
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {badge && (
            <Badge className="absolute top-4 left-4 bg-[#C8D96F] hover:bg-[#C8D96F] text-[#2C3E5C] font-bold uppercase text-xs px-3 py-1 shadow-lg border-0">
              {badge}
            </Badge>
          )}

          {/* Price on image */}
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
          <h3 className="text-xl font-bold text-[#2C3E5C] mb-3 line-clamp-2 min-h-[3.5rem] group-hover:text-[#4A9B9B] transition-colors duration-200">
            {title}
          </h3>

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

            {departurePointNames.length > 0 && (
              <div className="flex items-center gap-2 text-slate-600">
                <Navigation className="w-4 h-4 text-[#4A9B9B] flex-shrink-0" />
                <span className="text-sm font-medium truncate">
                  Salidas: {departureSummary}{extraDepartures}
                </span>
              </div>
            )}
          </div>

          {description && (
            <p className="text-sm text-slate-600 mb-4 line-clamp-2">
              {description}
            </p>
          )}

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
