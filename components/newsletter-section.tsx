"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Send, Plane } from 'lucide-react'

export function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log("Newsletter signup:", email)
    setEmail("")
    setIsSubmitting(false)
  }

  return (
    <section className="gradient-brand py-20 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-20 w-24 h-24 bg-white rounded-full blur-2xl animate-float"></div>
        <div className="absolute bottom-10 right-20 w-32 h-32 bg-accent rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <Plane className="absolute top-1/4 right-1/4 w-16 h-16 text-white/30 rotate-45 animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="glass rounded-3xl p-8 md:p-12 shadow-glow">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="text-center lg:text-left flex-1">
                <div className="flex items-center gap-3 mb-4 justify-center lg:justify-start">
                  <div className="p-3 bg-white/20 rounded-full">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white">
                    No te pierdas <span className="text-gradient">ninguna oferta</span>
                  </h2>
                </div>
                <p className="text-white/90 text-lg leading-relaxed">
                  Suscríbete y recibe las mejores promociones de viaje directamente en tu email
                </p>
                
                {/* Benefits */}
                <div className="flex flex-wrap gap-4 mt-6 justify-center lg:justify-start">
                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    <div className="w-2 h-2 bg-accent rounded-full animate-pulse-glow"></div>
                    <span>Ofertas exclusivas</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    <div className="w-2 h-2 bg-accent rounded-full animate-pulse-glow"></div>
                    <span>Destinos nuevos</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    <div className="w-2 h-2 bg-accent rounded-full animate-pulse-glow"></div>
                    <span>Descuentos especiales</span>
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto min-w-[350px]">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Tu email aquí..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-12 h-12 bg-white/95 backdrop-blur-sm border-0 shadow-md focus:shadow-lg transition-all duration-300 text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="h-12 px-8 gradient-accent hover:shadow-glow text-white font-bold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Enviando...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      <span>SUSCRIBIRME</span>
                    </div>
                  )}
                </Button>
              </form>
            </div>
            
            {/* Trust indicators */}
            <div className="mt-8 pt-8 border-t border-white/20">
              <div className="flex flex-wrap justify-center gap-8 text-white/70 text-sm">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 9.67-4.66 0-8-4.445-8-9.67 0-.682.057-1.35.166-2.002zm4.812 8.464a.75.75 0 00-1.238-.085l-3.236 4.44L4.35 16.3a.75.75 0 00-.274 1.025l.256.077a.75.75 0 001.027-.274l2.396-1.558 3.236 4.44a.75.75 0 001.238-.085l3.236-4.44 2.396 1.558a.75.75 0 001.027-.274l.256-.077a.75.75 0 00-.274-1.025L12.256 13.23l3.236-4.44z" clipRule="evenodd" />
                  </svg>
                  <span>Cancela cuando quieras</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span>100% seguro</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>No spam</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
