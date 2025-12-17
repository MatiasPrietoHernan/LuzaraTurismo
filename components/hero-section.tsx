"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar as CalendarIcon, Users, Compass, ChevronDown, Plus, Minus } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

interface DeparturePoint {
  _id: string
  name: string
  city: string
}

interface PackageSummary {
  _id: string
  destination?: string
  departureDate?: string
  availableDates?: number[]
  departurePoints?: string[]
}

export function HeroSection() {
  const [packages, setPackages] = useState<PackageSummary[]>([])
  const [departurePoints, setDeparturePoints] = useState<DeparturePoint[]>([])
  const [filtersLoading, setFiltersLoading] = useState(true)
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [month, setMonth] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [childrenAges, setChildrenAges] = useState<number[]>([])
  const [peoplePopoverOpen, setPeoplePopoverOpen] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [packagesRes, pointsRes] = await Promise.all([
          fetch('/api/packages'),
          fetch('/api/departure-points')
        ])
        const [packagesData, pointsData] = await Promise.all([
          packagesRes.json(),
          pointsRes.json()
        ])
        setPackages(packagesData)
        setDeparturePoints(pointsData)
      } catch (error) {
        console.error('Error loading packages filters:', error)
      } finally {
        setFiltersLoading(false)
      }
    }

    loadData()
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

  const matchingPackages = useMemo(() => {
    return packages.filter((pkg) => {
      if (destination && pkg.destination !== destination) {
        return false
      }
      if (origin) {
        if (!pkg.departurePoints || pkg.departurePoints.length === 0) {
          return false
        }
        return pkg.departurePoints.some((pointId) => pointId === origin)
      }
      return true
    })
  }, [packages, destination, origin])

  const monthOptions = useMemo(() => {
    const map = new Map<string, { value: string; label: string; year: number; monthIndex: number }>()
    matchingPackages.forEach((pkg) => {
      if (!pkg.departureDate) return
      const departureDate = new Date(pkg.departureDate)
      if (Number.isNaN(departureDate.getTime())) return
      const key = `${departureDate.getFullYear()}-${departureDate.getMonth()}`
      if (!map.has(key)) {
        map.set(key, {
          value: key,
          label: departureDate.toLocaleDateString("es-AR", { month: "long", year: "numeric" }),
          year: departureDate.getFullYear(),
          monthIndex: departureDate.getMonth(),
        })
      }
    })
    return Array.from(map.values()).sort((a, b) => {
      if (a.year === b.year) {
        return a.monthIndex - b.monthIndex
      }
      return a.year - b.year
    })
  }, [matchingPackages])

  const selectedMonthDate = useMemo(() => {
    if (!month) return undefined
    const [yearStr, monthIndexStr] = month.split('-')
    const year = Number(yearStr)
    const monthIndex = Number(monthIndexStr)
    if (Number.isNaN(year) || Number.isNaN(monthIndex)) return undefined
    return new Date(year, monthIndex, 1)
  }, [month])

  const availableDatesForMonth = useMemo(() => {
    if (!selectedMonthDate) return []
    const days = new Set<number>()
    matchingPackages.forEach((pkg) => {
      if (!pkg.departureDate) return
      const departureDate = new Date(pkg.departureDate)
      if (Number.isNaN(departureDate.getTime())) return
      if (
        departureDate.getFullYear() !== selectedMonthDate.getFullYear() ||
        departureDate.getMonth() !== selectedMonthDate.getMonth()
      ) {
        return
      }

      if (pkg.availableDates && pkg.availableDates.length > 0) {
        pkg.availableDates.forEach((day) => days.add(day))
      } else {
        days.add(departureDate.getDate())
      }
    })

    return Array.from(days)
      .sort((a, b) => a - b)
      .map((day) => new Date(selectedMonthDate.getFullYear(), selectedMonthDate.getMonth(), day))
  }, [matchingPackages, selectedMonthDate])

  const availableDaySet = useMemo(() => {
    return new Set(availableDatesForMonth.map((date) => date.getDate()))
  }, [availableDatesForMonth])

  const handleOriginChange = (value: string) => {
    const normalizedValue = value === 'all' ? '' : value
    setOrigin(normalizedValue)
    setMonth("")
    setSelectedDate(undefined)
  }

  const handleDestinationChange = (value: string) => {
    const normalizedValue = value === 'all' ? '' : value
    setDestination(normalizedValue)
    setMonth("")
    setSelectedDate(undefined)
  }

  const handleMonthChange = (value: string) => {
    const normalizedValue = value === 'all' ? '' : value
    setMonth(normalizedValue)
    setSelectedDate(undefined)
  }

  const isDateAvailable = (date: Date) => {
    if (!selectedMonthDate || availableDaySet.size === 0) return false
    return (
      date.getMonth() === selectedMonthDate.getMonth() &&
      date.getFullYear() === selectedMonthDate.getFullYear() &&
      availableDaySet.has(date.getDate())
    )
  }

  const handleChildrenChange = (newCount: number) => {
    if (newCount < children) {
      setChildrenAges(childrenAges.slice(0, newCount))
    } else {
      setChildrenAges([...childrenAges, ...Array(newCount - children).fill(1)])
    }
    setChildren(newCount)
  }

  const handleChildAgeChange = (index: number, age: number) => {
    const newAges = [...childrenAges]
    newAges[index] = age
    setChildrenAges(newAges)
  }

  const formatDate = (date: Date | undefined) => {
    if (!date) return ""
    return date.toLocaleDateString("es-AR", { day: "numeric", month: "long" })
  }

  const handleSearch = () => {
    // Build search params
    const params = new URLSearchParams()
    
    if (destination) {
      params.set('destination', destination)
    }
    
    if (origin) {
      params.set('departurePoint', origin)
    }

    if (selectedDate) {
      params.set('date', selectedDate.toISOString())
    }
    
    // Redirect to packages page with filters
    const query = params.toString()
    window.location.href = query ? `/paquetes?${query}` : '/paquetes'
  }

  return (
    <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden">
      {/* Hero background image with dark overlay */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/iguazu-falls-waterfall.jpg')",
          }}
        />
        {/* Dark gradient overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-slate-800/60 to-slate-900/70" />
      </div>

      {/* Content container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16">
        {/* Premium Search Card */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl shadow-slate-900/10 p-8 md:p-12">
            
            {/* Title with icon */}
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-[#4A9B9B]/10 rounded-xl">
                <Compass className="w-7 h-7 md:w-8 md:h-8 text-[#4A9B9B]" />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#2C3E5C]">
                Busca tu próxima aventura
              </h1>
            </div>

            {/* Search inputs grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              
              {/* Origin - Always enabled */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide">
                  Origen
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10 pointer-events-none" />
                  <Select 
                    value={origin} 
                    onValueChange={handleOriginChange}
                    disabled={filtersLoading || departurePoints.length === 0}
                  >
                    <SelectTrigger className={cn(
                      "pl-10 h-12 border-2 border-slate-200 rounded-lg focus:border-[#4A9B9B] focus:ring-2 focus:ring-[#4A9B9B]/20 transition-all duration-200 bg-white",
                      filtersLoading ? "cursor-not-allowed opacity-50" : "hover:border-slate-300"
                    )}>
                      <SelectValue placeholder={filtersLoading ? "Cargando orígenes..." : "Seleccionar origen"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="text-sm">
                        Cualquier origen
                      </SelectItem>
                      {departurePoints.map((point) => (
                        <SelectItem key={point._id} value={point._id} className="text-sm">
                          {point.city} · {point.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Destination - Enabled only when origin is selected */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide">
                  Destino
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10 pointer-events-none" />
                  <Select 
                    value={destination} 
                    onValueChange={handleDestinationChange}
                    disabled={filtersLoading || destinationOptions.length === 0}
                  >
                    <SelectTrigger className={cn(
                      "pl-10 h-12 border-2 border-slate-200 rounded-lg focus:border-[#4A9B9B] focus:ring-2 focus:ring-[#4A9B9B]/20 transition-all duration-200 bg-white",
                      filtersLoading ? "cursor-not-allowed opacity-50" : "hover:border-slate-300"
                    )}>
                      <SelectValue placeholder={filtersLoading ? "Cargando destinos..." : "Seleccionar destino"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="text-sm">Cualquier destino</SelectItem>
                      {destinationOptions.map((dest) => (
                        <SelectItem key={dest} value={dest} className="text-sm">
                          {dest}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Date - Month and Day */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide">
                  Fecha
                </label>
                <div className="flex gap-2">
                  {/* Month selector */}
                  <div className="relative flex-1">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10 pointer-events-none" />
                    <Select 
                      value={month} 
                      onValueChange={handleMonthChange}
                      disabled={filtersLoading || monthOptions.length === 0}
                    >
                      <SelectTrigger className={cn(
                        "pl-10 h-12 border-2 border-slate-200 rounded-lg focus:border-[#4A9B9B] focus:ring-2 focus:ring-[#4A9B9B]/20 transition-all duration-200 bg-white",
                        (filtersLoading || monthOptions.length === 0) ? "cursor-not-allowed opacity-50" : "hover:border-slate-300"
                      )}>
                        <SelectValue placeholder={filtersLoading ? "Cargando meses..." : "Mes"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Cualquier mes</SelectItem>
                        {monthOptions.map((m) => (
                          <SelectItem key={m.value} value={m.value}>
                            {m.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Day calendar */}
                  <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "flex-1 h-12 justify-start text-left font-normal border-2 border-slate-200 rounded-lg focus:border-[#4A9B9B] focus:ring-2 focus:ring-[#4A9B9B]/20 transition-all duration-200 bg-white",
                          !selectedDate && "text-slate-400",
                          (!month || availableDatesForMonth.length === 0) ? "cursor-not-allowed opacity-50" : "hover:border-slate-300 hover:bg-white"
                        )}
                        disabled={!month || availableDatesForMonth.length === 0}
                      >
                        {selectedDate ? formatDate(selectedDate) : "Día"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          if (date && isDateAvailable(date)) {
                            setSelectedDate(date)
                            setCalendarOpen(false)
                          }
                        }}
                        disabled={(date) => !isDateAvailable(date)}
                        month={selectedMonthDate}
                        initialFocus
                      />
                      <div className="p-3 border-t bg-slate-50">
                        <p className="text-xs text-slate-500 text-center">
                          Solo se muestran los días con salidas disponibles
                        </p>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* People selector */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide">
                  Personas
                </label>
                <Popover open={peoplePopoverOpen} onOpenChange={setPeoplePopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full h-12 justify-between border-2 border-slate-200 rounded-lg focus:border-[#4A9B9B] focus:ring-2 focus:ring-[#4A9B9B]/20 transition-all duration-200 bg-white hover:border-slate-300 hover:bg-white"
                    >
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-700">{adults + children} {adults + children === 1 ? 'persona' : 'personas'}</span>
                      </div>
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      {/* Adults */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-700">Adultos</p>
                          <p className="text-xs text-slate-500">Mayores de 5 años</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-lg border-slate-300"
                            onClick={() => setAdults(Math.max(1, adults - 1))}
                            disabled={adults <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center font-medium text-slate-700">{adults}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-lg border-slate-300"
                            onClick={() => setAdults(adults + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Children */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-700">Menores</p>
                          <p className="text-xs text-slate-500">1 a 5 años</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-lg border-slate-300"
                            onClick={() => handleChildrenChange(Math.max(0, children - 1))}
                            disabled={children <= 0}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center font-medium text-slate-700">{children}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-lg border-slate-300"
                            onClick={() => handleChildrenChange(children + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Children ages */}
                      {children > 0 && (
                        <div className="pt-2 border-t space-y-2">
                          <p className="text-sm font-medium text-slate-700">Edad de los menores</p>
                          {Array.from({ length: children }).map((_, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <span className="text-sm text-slate-600 w-20">Menor {index + 1}:</span>
                              <Select
                                value={childrenAges[index]?.toString() || "1"}
                                onValueChange={(value) => handleChildAgeChange(index, parseInt(value))}
                              >
                                <SelectTrigger className="flex-1 border-slate-300">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {[1, 2, 3, 4, 5].map((age) => (
                                    <SelectItem key={age} value={age.toString()}>
                                      {age} {age === 1 ? 'año' : 'años'}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* CTA Button */}
            <Button 
              onClick={handleSearch}
              className="w-full bg-[#2C3E5C] hover:bg-[#3A4F6F] text-white font-semibold text-base tracking-wide px-8 py-6 rounded-xl shadow-lg hover:shadow-xl hover:shadow-[#2C3E5C]/20 hover:-translate-y-0.5 transition-all duration-200"
            >
              <Compass className="w-5 h-5 mr-2" />
              BUSCAR MI VIAJE
            </Button>
          </div>
        </div>
      </div>

      {/* WhatsApp floating button */}
      <a
        href="https://wa.me/5491234567890"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 bg-[#4A9B9B] hover:bg-[#3A8A8A] text-white p-4 rounded-full shadow-xl hover:scale-110 transition-all duration-200"
        aria-label="Contactar por WhatsApp"
      >
        <svg 
          className="w-6 h-6" 
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </a>
    </section>
  )
}
