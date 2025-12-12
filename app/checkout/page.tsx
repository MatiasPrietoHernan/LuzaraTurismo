"use client"

import { useMemo, useState } from "react"
import { Header } from "@/components/header"
import { useCart } from "@/components/cart-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar as CalendarIcon, CreditCard, Building2 } from "lucide-react"
import { cn } from "@/lib/utils"

function formatARS(n: number) {
  return `ARS ${n.toLocaleString("es-AR")}`
}

export default function CheckoutPage() {
  const { items, total } = useCart()
  const passengersCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items])

  // Simple breakdown (mock taxes)
  const tarifa = total
  const gravado = Math.round(tarifa * 0.1)
  const gravadoTransporte = Math.round(tarifa * 0.05)
  const grandTotal = tarifa + gravado + gravadoTransporte

  const [payment, setPayment] = useState("transferencia")
  const [contact, setContact] = useState({ email: "", phone: "" })
  const [agree, setAgree] = useState(false)

  // Passengers local state
  const [passengers, setPassengers] = useState(
    Array.from({ length: Math.max(passengersCount, 1) }, (_, idx) => ({
      name: "",
      lastName: "",
      docType: "DNI",
      docNumber: "",
      gender: "M",
      birthDate: undefined as Date | undefined,
      nationality: "ARGENTINA",
      residence: "ARGENTINA",
    }))
  )

  const setPassenger = (index: number, patch: Partial<(typeof passengers)[number]>) => {
    setPassengers((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], ...patch }
      return next
    })
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      <div className="h-20" />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Completá tus datos para finalizar la reserva</h1>
        <p className="text-muted-foreground mb-6">Producto Seleccionado: Paquetes</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column: Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hint */}
            <Card>
              <CardContent className="p-4">
                <div className="rounded-md bg-secondary/20 border border-secondary/40 px-4 py-3 text-sm text-foreground">
                  Los campos marcados con asterisco (*) son requeridos.
                </div>
              </CardContent>
            </Card>

            {/* Passenger data */}
            <Card>
              <CardContent className="p-6 space-y-6">
                <h2 className="text-2xl font-bold text-foreground">Datos de los Pasajeros</h2>
                {passengers.map((p, index) => (
                  <div key={index} className="rounded-lg border">
                    <div className="px-4 py-2 bg-muted/50 text-sm font-semibold rounded-t-lg">
                      Pasajero {index + 1} - Adulto
                    </div>
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Nombre/s *</Label>
                        <Input value={p.name} onChange={(e) => setPassenger(index, { name: e.target.value })} placeholder="Nombre como figura en el documento" />
                      </div>
                      <div>
                        <Label>Apellido/s *</Label>
                        <Input value={p.lastName} onChange={(e) => setPassenger(index, { lastName: e.target.value })} placeholder="Apellidos como figura en el documento" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 md:col-span-2">
                        <div>
                          <Label>Tipo de documento *</Label>
                          <Select value={p.docType} onValueChange={(v) => setPassenger(index, { docType: v })}>
                            <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {['DNI','Pasaporte','CI'].map((d) => (<SelectItem key={d} value={d}>{d}</SelectItem>))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Número *</Label>
                          <Input value={p.docNumber} onChange={(e) => setPassenger(index, { docNumber: e.target.value })} placeholder="Número sin puntos" />
                        </div>
                      </div>

                      <div>
                        <Label>Sexo</Label>
                        <Select value={p.gender} onValueChange={(v) => setPassenger(index, { gender: v })}>
                          <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="M">M</SelectItem>
                            <SelectItem value="F">F</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Fecha de nacimiento</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className={cn("w-full justify-start text-left font-normal bg-white hover:bg-white", !p.birthDate && "text-muted-foreground")}> 
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {p.birthDate ? p.birthDate.toLocaleDateString("es-AR") : "Seleccionar fecha"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar 
                              mode="single"
                              selected={p.birthDate}
                              onSelect={(d) => setPassenger(index, { birthDate: d })}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div>
                        <Label>Nacionalidad</Label>
                        <Select value={p.nationality} onValueChange={(v) => setPassenger(index, { nationality: v })}>
                          <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {['ARGENTINA','BRASIL','CHILE','URUGUAY','PARAGUAY'].map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Residencia</Label>
                        <Select value={p.residence} onValueChange={(v) => setPassenger(index, { residence: v })}>
                          <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {['ARGENTINA','BRASIL','CHILE','URUGUAY','PARAGUAY'].map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Payment */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Medio de Pago</h2>
                <RadioGroup value={payment} onValueChange={setPayment} className="grid gap-4">
                  <label className="flex items-start gap-3 p-4 rounded-lg border bg-white cursor-pointer">
                    <RadioGroupItem value="transferencia" id="transferencia" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 font-semibold"><Building2 className="w-4 h-4" /> Agencia / Transferencia</div>
                      <p className="text-sm text-muted-foreground mt-1">Pago por Transferencia. Alias: luzara.turismo</p>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 p-4 rounded-lg border bg-white cursor-pointer">
                    <RadioGroupItem value="tarjeta" id="tarjeta" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 font-semibold"><CreditCard className="w-4 h-4" /> Tarjetas de crédito</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                        <div>
                          <Label>Marca</Label>
                          <Select defaultValue="visa" disabled={payment!=="tarjeta"}>
                            <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="visa">VISA</SelectItem>
                              <SelectItem value="master">MasterCard</SelectItem>
                              <SelectItem value="amex">American Express</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Cuotas</Label>
                          <Select defaultValue="1" disabled={payment!=="tarjeta"}>
                            <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 cuota</SelectItem>
                              <SelectItem value="3">3 cuotas</SelectItem>
                              <SelectItem value="6">6 cuotas</SelectItem>
                              <SelectItem value="12">12 cuotas</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </label>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Datos de Contacto</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Email *</Label>
                    <Input value={contact.email} onChange={(e)=>setContact({...contact, email:e.target.value})} placeholder="tu@email.com" />
                  </div>
                  <div>
                    <Label>Teléfono *</Label>
                    <Input value={contact.phone} onChange={(e)=>setContact({...contact, phone:e.target.value})} placeholder="Ej: +54 9 381 555555" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardContent className="p-6 space-y-3">
                <h2 className="text-2xl font-bold text-foreground">Información importante para nosotros</h2>
                <Textarea placeholder="¿Tenés alguna observación? Dejanos una consulta." />
                <label className="text-sm flex items-center gap-2 mt-2">
                  <input type="checkbox" checked={agree} onChange={(e)=>setAgree(e.target.checked)} />
                  <span>Leí y acepto las <a className="underline" href="#" target="_blank" rel="noreferrer">condiciones de compra</a>.</span>
                </label>
                <div className="pt-4">
                  <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg px-10 py-6" disabled={!agree || !contact.email || !contact.phone}>
                    Confirmar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column: Summary */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="overflow-hidden">
              <div className="bg-accent text-accent-foreground p-6">
                <div className="text-sm">Precio por los servicios</div>
                <div className="text-3xl font-bold">{formatARS(grandTotal)}</div>
              </div>
              <CardContent className="p-0">
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">TARIFA</span>
                    <span className="font-medium">{formatARS(tarifa)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">GRAVADO</span>
                    <span className="font-medium">{formatARS(gravado)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">GRAVADO TRANSPORTE CABOTAJE</span>
                    <span className="font-medium">{formatARS(gravadoTransporte)}</span>
                  </div>
                </div>
                <Separator />
                <div className="p-4 flex items-center justify-between">
                  <span className="text-lg font-bold text-foreground">Total</span>
                  <span className="text-xl font-extrabold text-foreground">{formatARS(grandTotal)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground">DETALLE DEL SERVICIO</h3>
                {items.map((i) => (
                  <div key={i.id} className="text-sm space-y-1 py-2 border-b last:border-0">
                    <div className="font-semibold text-foreground">{i.title}</div>
                    {i.date && <div className="text-muted-foreground">Salida: {i.date}</div>}
                    <div className="text-muted-foreground">{i.details}</div>
                    <div className="font-semibold text-foreground mt-1">{formatARS(i.price)} x {i.quantity}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
