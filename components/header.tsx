import Link from "next/link"
import Image from "next/image"
import { Phone, Mail, ShoppingCart } from 'lucide-react'

export function Header() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top bar - Contact information */}
        <div className="flex items-center justify-between py-2 text-sm border-b border-slate-100">
          <div className="flex items-center gap-6">
            <a 
              href="mailto:info@luzaraturismo.com" 
              className="hidden sm:flex items-center gap-2 text-slate-600 hover:text-[#4A9B9B] transition-colors duration-200"
            >
              <Mail className="w-4 h-4" />
              <span>info@luzaraturismo.com</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href="tel:+5491234567890" 
              className="flex items-center gap-2 text-slate-600 hover:text-[#4A9B9B] transition-colors duration-200"
            >
              <Phone className="w-4 h-4" />
              <span className="font-medium">+54 9 123 456 7890</span>
            </a>
            <Link 
              href="/admin" 
              className="text-slate-600 hover:text-[#4A9B9B] transition-colors duration-200 font-medium text-sm px-3 py-1 rounded-full border border-slate-200 hover:border-[#4A9B9B]"
            >
              Admin
            </Link>
          </div>
        </div>

        {/* Main navigation */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center transition-transform duration-200 hover:scale-105">
            <Image 
              src="/images/design-mode/Luzara.jpeg"
              alt="Luzara Turismo"
              width={180}
              height={60}
              className="h-14 w-auto rounded-lg"
              priority
            />
          </Link>
          
          {/* Navigation links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              href="/" 
              className="font-medium text-[#2C3E5C] hover:text-[#4A9B9B] transition-colors duration-200 relative group"
            >
              INICIO
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#4A9B9B] transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link 
              href="/paquetes" 
              className="font-medium text-[#2C3E5C] hover:text-[#4A9B9B] transition-colors duration-200 relative group"
            >
              PAQUETES
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#4A9B9B] transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link 
              href="#nosotros" 
              className="font-medium text-[#2C3E5C] hover:text-[#4A9B9B] transition-colors duration-200 relative group"
            >
              ¿QUIÉNES SOMOS?
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#4A9B9B] transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link 
              href="#contacto" 
              className="font-medium text-[#2C3E5C] hover:text-[#4A9B9B] transition-colors duration-200 relative group"
            >
              CONTACTO
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#4A9B9B] transition-all duration-200 group-hover:w-full"></span>
            </Link>
          </nav>

          {/* Shopping cart */}
          <div className="flex items-center gap-4">
            <Link 
              href="/cart" 
              className="p-2.5 hover:bg-slate-50 rounded-lg transition-colors duration-200 relative group" 
              aria-label="Carrito de compras"
            >
              <ShoppingCart className="w-6 h-6 text-[#2C3E5C] group-hover:text-[#4A9B9B] transition-colors duration-200" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#4A9B9B] text-white text-xs rounded-full flex items-center justify-center font-bold">
                0
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
