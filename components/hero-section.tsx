"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar as CalendarIcon, Users, Luggage, ChevronDown, Plus, Minus } from 'lucide-react'
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

const ORIGINS = [
  "TUCUMAN, ARGENTINA",
  "SALTA, ARGENTINA",
  "JUJUY, ARGENTINA"
]

const DESTINATIONS = [
  "Mar del Plata, Argentina",
  "Camboriú, Brasil",
  "Cataratas del Iguazú, Argentina",
  "Patagonia Chilena, Chile",
  "Buenos Aires, Argentina",
  "Mendoza, Argentina",
  "Bariloche, Argentina",
  "Ushuaia, Argentina",
  "Córdoba, Argentina",
  "Puerto Madryn, Argentina"
]

// Available months and days based on selection
const MONTHS = [
  { value: "01", label: "Enero" },
  { value: "02", label: "Febrero" },
  { value: "03", label: "Marzo" },
  { value: "04", label: "Abril" },
  { value: "05", label: "Mayo" },
  { value: "06", label: "Junio" },
  { value: "07", label: "Julio" },
  { value: "08", label: "Agosto" },
  { value: "09", label: "Septiembre" },
  { value: "10", label: "Octubre" },
  { value: "11", label: "Noviembre" },
  { value: "12", label: "Diciembre" },
]

// Simulated available dates based on origin, destination and month
const getAvailableDates = (origin: string, destination: string, month: string): number[] => {
  if (!origin || !destination || !month) return []
  
  // Simulate different availability patterns based on combinations
  const hash = (origin + destination + month).length % 3
  
  if (hash === 0) {
    // Pattern 1: Mostly weekends and some mid-week days
    return [5, 6, 7, 12, 13, 14, 19, 20, 21, 26, 27, 28]
  } else if (hash === 1) {
    // Pattern 2: Regular departures every few days
    return [1, 4, 7, 10, 13, 16, 19, 22, 25, 28]
  } else {
    // Pattern 3: More flexible dates
    return [2, 3, 5, 8, 9, 11, 15, 16, 17, 18, 22, 23, 24, 29, 30]
  }
}

export function HeroSection() {
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [month, setMonth] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [childrenAges, setChildrenAges] = useState<number[]>([])
  const [peoplePopoverOpen, setPeoplePopoverOpen] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)

  const handleOriginChange = (value: string) => {
    setOrigin(value)
    // Reset dependent fields
    setDestination("")
    setMonth("")
    setSelectedDate(undefined)
  }

  const handleDestinationChange = (value: string) => {
    setDestination(value)
    // Reset dependent fields
    setMonth("")
    setSelectedDate(undefined)
  }

  const handleMonthChange = (value: string) => {
    setMonth(value)
    // Reset day selection
    setSelectedDate(undefined)
  }

  const getAvailableDatesForCalendar = () => {
    if (!origin || !destination || !month) return []
    
    const availableDays = getAvailableDates(origin, destination, month)
    const year = new Date().getFullYear()
    const monthNum = parseInt(month) - 1
    
    return availableDays.map(day => new Date(year, monthNum, day))
  }

  const isDateAvailable = (date: Date) => {
    const availableDates = getAvailableDatesForCalendar()
    return availableDates.some(availableDate => 
      availableDate.getDate() === date.getDate() &&
      availableDate.getMonth() === date.getMonth() &&
      availableDate.getFullYear() === date.getFullYear()
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

  return (
    <section className="relative bg-gradient-to-br from-accent via-secondary to-primary py-32 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 w-64 h-64 border-4 border-primary-foreground rounded-full"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 border-4 border-primary-foreground rounded-full"></div>
        <Luggage className="absolute top-1/4 left-1/4 w-32 h-32 text-primary-foreground rotate-12" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Search Form */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-primary/90 backdrop-blur rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Luggage className="w-6 h-6 text-primary-foreground" />
              <h2 className="text-2xl font-bold text-primary-foreground">Paquetes</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Origin - Always enabled */}
              <div className="lg:col-span-1">
                <label className="block text-xs font-medium text-primary-foreground/80 mb-2 uppercase">
                  Origen
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10 pointer-events-none" />
                  <Select value={origin} onValueChange={handleOriginChange}>
                    <SelectTrigger className="pl-10 bg-white w-full cursor-pointer">
                      <SelectValue placeholder="Seleccionar origen" />
                    </SelectTrigger>
                    <SelectContent className="max-w-[250px] cursor-pointer">
                      {ORIGINS.map((orig) => (
                        <SelectItem key={orig} value={orig} className="text-sm">
                          {orig}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Destination - Enabled only when origin is selected */}
              <div className="lg:col-span-1">
                <label className="block text-xs font-medium text-primary-foreground/80 mb-2 uppercase">
                  Destino
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10 pointer-events-none" />
                  <Select 
                    value={destination} 
                    onValueChange={handleDestinationChange}
                    disabled={!origin}
                  >
                    <SelectTrigger className={cn(
                      "pl-10 bg-white w-full",
                      !origin ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                    )}>
                      <SelectValue placeholder="Seleccionar destino" />
                    </SelectTrigger>
                    <SelectContent className="max-w-[250px]">
                      {DESTINATIONS.map((dest) => (
                        <SelectItem key={dest} value={dest} className="text-sm">
                          {dest}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Date - Month enabled when origin and destination are selected */}
              <div className="lg:col-span-2">
                <label className="block text-xs font-medium text-primary-foreground/80 mb-2 uppercase">
                  Fecha
                </label>
                <div className="flex gap-2">
                  {/* Month selector */}
                  <div className="relative flex-1">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10 pointer-events-none" />
                    <Select 
                      value={month} 
                      onValueChange={handleMonthChange}
                      disabled={!origin || !destination}
                    >
                      <SelectTrigger className={cn(
                        "pl-10 bg-white",
                        (!origin || !destination) ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                      )}>
                        <SelectValue placeholder="Mes" />
                      </SelectTrigger>
                      <SelectContent>
                        {MONTHS.map((m) => (
                          <SelectItem key={m.value} value={m.value}>
                            {m.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Day calendar - Enabled when origin, destination and month are selected */}
                  <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "flex-1 justify-start text-left font-normal bg-white hover:bg-white",
                          !selectedDate && "text-muted-foreground",
                          (!origin || !destination || !month) && "cursor-not-allowed opacity-50"
                        )}
                        disabled={!origin || !destination || !month}
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
                        month={month ? new Date(new Date().getFullYear(), parseInt(month) - 1, 1) : undefined}
                        initialFocus
                      />
                      <div className="p-3 border-t bg-muted/30">
                        <p className="text-xs text-muted-foreground text-center">
                          Solo se muestran los días con salidas disponibles
                        </p>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* People selector */}
              <div className="lg:col-span-1">
                <label className="block text-xs font-medium text-primary-foreground/80 mb-2 uppercase">
                  Personas
                </label>
                <Popover open={peoplePopoverOpen} onOpenChange={setPeoplePopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full justify-between bg-white hover:bg-white"
                    >
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-muted-foreground" />
                        <span>{adults + children}</span>
                      </div>
                      <ChevronDown className="w-4 h-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      {/* Adults */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Adultos</p>
                          <p className="text-xs text-muted-foreground">Mayores de 5 años</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setAdults(Math.max(1, adults - 1))}
                            disabled={adults <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center font-medium">{adults}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setAdults(adults + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Children */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Menores</p>
                          <p className="text-xs text-muted-foreground">1 a 5 años</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleChildrenChange(Math.max(0, children - 1))}
                            disabled={children <= 0}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center font-medium">{children}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleChildrenChange(children + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Children ages */}
                      {children > 0 && (
                        <div className="pt-2 border-t space-y-2">
                          <p className="text-sm font-medium">Edad de los menores</p>
                          {Array.from({ length: children }).map((_, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground w-20">Menor {index + 1}:</span>
                              <Select
                                value={childrenAges[index]?.toString() || "1"}
                                onValueChange={(value) => handleChildAgeChange(index, parseInt(value))}
                              >
                                <SelectTrigger className="flex-1">
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

            <Button className="w-full md:w-full mt-6 bg-accent hover:bg-accent/90 text-accent-foreground font-semibolt text-lg px-12 py-6 cursor-pointer">
              BUSCAR
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
