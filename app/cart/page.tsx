"use client"

import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/components/cart-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/header"
import { Trash2, ArrowLeft, Zap } from "lucide-react"
import { useRouter } from "next/navigation"

export default function CartPage() {
  const { items, total, removeItem, clear } = useCart()
  const router = useRouter()

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      <div className="h-20" />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Su Carrito</h1>

        {items.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground mb-6">Tu carrito está vacío.</p>
              <Link href="/">
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
                  Volver a explorar
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardContent className="p-0">
                  {items.map((item, idx) => (
                    <div key={item.id} className="p-4 flex items-start gap-4">
                      <div className="relative w-40 h-24 rounded-md overflow-hidden flex-shrink-0 bg-muted">
                        <Image src={item.image} alt={item.title} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 text-accent mb-1">
                              <Zap className="w-4 h-4" />
                              <span className="text-sm font-semibold">Paquete</span>
                            </div>
                            <h3 className="text-lg font-semibold text-foreground leading-snug">
                              {item.title}
                            </h3>
                            {item.date && (
                              <p className="text-sm text-muted-foreground mt-1">
                                Fecha seleccionada: {item.date}
                              </p>
                            )}
                            {item.details && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {item.details}
                              </p>
                            )}
                            <p className="text-sm text-foreground mt-2">{item.quantity} Adulto{item.quantity > 1 ? 's' : ''}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-foreground">
                              ARS {(item.price * item.quantity).toLocaleString("es-AR")}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive mt-2"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" /> Quitar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="flex items-center justify-between">
                <Button variant="destructive" onClick={clear}>
                  Vaciar Carrito
                </Button>
                <Link href="/">
                  <Button variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Continuar comprando
                  </Button>
                </Link>
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-xl font-bold text-foreground">Total del Carrito</h2>
                  <div className="rounded-lg border">
                    <div className="p-4 grid grid-cols-2 text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-right text-foreground">ARS {total.toLocaleString("es-AR")}</span>
                    </div>
                    <Separator />
                    <div className="p-4 grid grid-cols-2 items-center">
                      <span className="text-base font-semibold text-foreground">Total</span>
                      <span className="text-right text-xl font-bold text-foreground">ARS {total.toLocaleString("es-AR")}</span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground text-center">
                    Precios por persona. Impuestos incluidos.
                  </div>
                  <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg py-6" onClick={() => router.push('/checkout')}>
                    Comprar
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
