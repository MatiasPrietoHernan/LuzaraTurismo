import Link from "next/link"
import { Facebook, Instagram, Phone, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer id="contacto" className="bg-muted/50 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {/* Need Help */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4 uppercase tracking-wide">
              ¿Necesita Ayuda?
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Teléfono</p>
                <a 
                  href="tel:+5491234567890" 
                  className="flex items-center gap-2 text-foreground hover:text-secondary transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span className="font-medium">+5493813340304</span>
                </a>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Email</p>
                <a 
                  href="mailto:turismoluzara@gmail.com" 
                  className="flex items-center gap-2 text-secondary hover:text-secondary/80 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span className="font-medium">turismoluzara@gmail.com</span>
                </a>
              </div>
              <div className="pt-2">
                <p className="text-sm text-muted-foreground mb-2">Redes Sociales</p>
                <div className="flex gap-3">
                  <a 
                    href="https://facebook.com/turismoagvtucuman" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-secondary hover:text-secondary/80 transition-colors"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a 
                    href="https://instagram.com/turismoluzara" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-secondary hover:text-secondary/80 transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4 uppercase tracking-wide">
              La Compañía
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="#nosotros" className="text-muted-foreground hover:text-secondary transition-colors">
                  ¿Quiénes Sómos?
                </Link>
              </li>
              <li>
                <Link href="#paquetes" className="text-muted-foreground hover:text-secondary transition-colors">
                  Paquetes
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4 uppercase tracking-wide">
              Soporte
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-secondary transition-colors">
                  Centro de Ayuda
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-secondary transition-colors">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-secondary transition-colors">
                  Política de Privacidad
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-border">
          <p className="text-center text-muted-foreground text-sm">
            Copyright © <span className="text-secondary font-medium">Luzara Turismo</span> - Todos los derechos reservados
          </p>
        </div>
      </div>

      {/* WhatsApp button */}
      <a
        href="https://wa.me/5493813340304"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full p-4 shadow-lg transition-colors z-50"
        aria-label="Contactar por WhatsApp"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </a>

      {/* Scroll to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 left-6 bg-accent hover:bg-accent/90 text-accent-foreground rounded-full p-3 shadow-lg transition-colors z-50"
        aria-label="Volver arriba"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </footer>
  )
}
