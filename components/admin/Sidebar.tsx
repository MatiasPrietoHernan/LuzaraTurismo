"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  Package, 
  ShoppingCart, 
  Users, 
  Home, 
  LogOut 
} from 'lucide-react'


interface SidebarProps {
  logoutAction: () => Promise<void>
}

export function Sidebar({ logoutAction }: SidebarProps) {
  return (
    <div className="w-72 bg-background/80 backdrop-blur-xl border-r border-border/50 shadow-xl h-screen flex flex-col">
      <div className="p-8 border-b border-border/50">
        <h1 className="text-2xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Admin Luzara
        </h1>
        <p className="text-xs text-muted-foreground mt-1">Panel de Gestión</p>
      </div>
      <nav className="flex-1 p-6 space-y-1 overflow-y-auto">
        <Link href="/admin">
          <Button variant="ghost" className="w-full justify-start">
            <Home className="w-5 h-5 mr-3" />
            <span className="font-semibold">Dashboard</span>
          </Button>
        </Link>
        <Link href="/admin/packages">
          <Button variant="ghost" className="w-full justify-start">
            <Package className="w-5 h-5 mr-3" />
            <span className="font-semibold">Paquetes</span>
          </Button>
        </Link>
        <Link href="/admin/orders">
          <Button variant="ghost" className="w-full justify-start">
            <ShoppingCart className="w-5 h-5 mr-3" />
            <span className="font-semibold">Órdenes</span>
          </Button>
        </Link>

      </nav>
      <div className="p-6 border-t border-border/50 space-y-2">
        <Link href="/">
          <Button variant="outline" className="w-full justify-start">
            <Home className="w-5 h-5 mr-3" />
            Volver a Tienda
          </Button>
        </Link>
        <form action={logoutAction}>
          <Button type="submit" variant="ghost" className="w-full justify-start text-destructive hover:text-destructive/80">
            <LogOut className="w-5 h-5 mr-3" />
            Salir
          </Button>
        </form>
      </div>
    </div>
  )
}
