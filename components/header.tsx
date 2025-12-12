import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram } from 'lucide-react'

export function Header() {
  return (
    <header className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between py-2 text-sm border-b border-primary-foreground/20">
          <div className="flex items-center gap-6">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="mailto:info@luzaraturismo.com" className="hover:text-accent transition-colors">
              info@luzaraturismo.com
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-accent transition-colors cursor-pointer">+54 9 123 456 7890</span>
          </div>
        </div>

        {/* Main navigation */}
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center">
            <Image 
              src="/images/design-mode/Luzara.jpeg"
              alt="Luzara Turismo"
              width={180}
              height={60}
              className="h-12 w-auto rounded px-2 py-1"
            />
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="font-medium hover:text-accent transition-colors">
              INICIO
            </Link>
            <Link href="#paquetes" className="font-medium hover:text-accent transition-colors">
              PAQUETES
            </Link>
            <Link href="#nosotros" className="font-medium hover:text-accent transition-colors">
              ¿QUIÉNES SÓMOS?
            </Link>
            <Link href="#contacto" className="font-medium hover:text-accent transition-colors">
              CONTACTO
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/cart" className="p-2 hover:text-accent transition-colors" aria-label="Carrito">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
