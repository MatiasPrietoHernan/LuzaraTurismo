"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package as PackageIcon, ShoppingCart, Users, MousePointer, CheckCircle, AlertCircle } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

interface Stats {
  published: number
  deactivated: number
  active: number
  mostClicked: { title: string; clicks: number }
  ordersCount: number
}


export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(setStats)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-6 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (!stats) return <div>Error loading stats</div>

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-xl text-muted-foreground">Bienvenido al panel de Luzara Turismo</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/admin/packages" className="group">
          <Card className="group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-300 border-0 bg-gradient-to-br from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/20">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                  <PackageIcon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-2xl font-black text-primary">Publicados</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-black text-primary">{stats.published}</p>
              <p className="text-sm text-muted-foreground">Paquetes publicados</p>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/admin/packages" className="group">
          <Card className="group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-300 border-0 bg-gradient-to-br from-destructive/5 to-destructive/10 hover:from-destructive/10 hover:to-destructive/20">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-destructive/20 rounded-xl flex items-center justify-center group-hover:bg-destructive/30 transition-colors">
                  <AlertCircle className="w-6 h-6 text-destructive" />
                </div>
                <CardTitle className="text-2xl font-black text-destructive">Desactivados</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-black text-destructive">{stats.deactivated}</p>
              <p className="text-sm text-muted-foreground">Paquetes no publicados</p>
            </CardContent>
          </Card>
        </Link>
        
        <Card className="group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-300 border-0 bg-gradient-to-br from-secondary/5 to-secondary/10 hover:from-secondary/10 hover:to-secondary/20">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center group-hover:bg-secondary/30 transition-colors">
                <CheckCircle className="w-6 h-6 text-secondary" />
              </div>
              <CardTitle className="text-2xl font-black text-secondary">Activos</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-black text-secondary">{stats.active}</p>
            <p className="text-sm text-muted-foreground">Paquetes disponibles</p>
          </CardContent>
        </Card>
        
        <Card className="group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-300 border-0 bg-gradient-to-br from-accent/5 to-accent/10 hover:from-accent/10 hover:to-accent/20">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center group-hover:bg-accent/30 transition-colors">
                <MousePointer className="w-6 h-6 text-accent" />
              </div>
              <CardTitle className="text-2xl font-black text-accent">Más Clicado</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-black text-accent">{stats.mostClicked.clicks}</p>
            <p className="text-xs text-muted-foreground truncate max-w-[120px]">{stats.mostClicked.title}</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Órdenes Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black">{stats.ordersCount}</p>
            <p className="text-sm text-muted-foreground">Total órdenes</p>
          </CardContent>
        </Card>       
        <Card className="hover:shadow-xl transition-all cursor-pointer h-full group">
          <CardHeader>
            <CardTitle>Gestionar Paquetes</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Button asChild className="w-full mt-4">
              <Link href="/admin/packages">
                Ir a Paquetes <PackageIcon className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
