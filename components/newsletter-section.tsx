"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function NewsletterSection() {
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter signup
    console.log("Newsletter signup:", email)
    setEmail("")
  }

  return (
    <section className="bg-gradient-to-r from-secondary to-accent py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 text-balance">
              Recibir noticias
            </h2>
            <p className="text-white/90 text-lg">
              Directamente en tu email
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="flex gap-2 w-full md:w-auto">
            <Input
              type="email"
              placeholder="Escribe aquí su email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="min-w-[300px] bg-white"
            />
            <Button 
              type="submit" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8"
            >
              ENVIAR
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
