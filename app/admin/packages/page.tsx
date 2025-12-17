"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import Link from 'next/link'
import { Edit, Trash2, Plus, Eye, Package as PackageIcon } from 'lucide-react'

interface IPackage {
  _id: string
  title: string
  destination: string
  nights: number
  price: number
  isPromotion: boolean
  isActive: boolean
  isPublished: boolean
  views: number
  clicks: number
  mainImage?: string
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<IPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchPackages = async () => {
    try {
      const res = await fetch('/api/admin/packages')
      const data = await res.json()
      setPackages(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los paquetes",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPackages()
  }, [])

  const handleToggleActive = async (id: string, currentValue: boolean) => {
    try {
      const res = await fetch(`/api/admin/packages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentValue })
      })

      if (res.ok) {
        setPackages(packages.map(pkg => 
          pkg._id === id ? { ...pkg, isActive: !currentValue } : pkg
        ))
        toast({
          title: "Actualizado",
          description: `Paquete ${!currentValue ? 'activado' : 'desactivado'} exitosamente`,
        })
      } else {
        throw new Error('Error al actualizar')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del paquete",
        variant: "destructive"
      })
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    
    try {
      const res = await fetch(`/api/admin/packages/${deleteId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        setPackages(packages.filter(pkg => pkg._id !== deleteId))
        toast({
          title: "Eliminado",
          description: "Paquete eliminado exitosamente",
        })
      } else {
        throw new Error('Error al eliminar')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el paquete",
        variant: "destructive"
      })
    } finally {
      setDeleteId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Gestión de Paquetes
          </h1>
          <p className="text-muted-foreground mt-2">
            Administra todos los paquetes turísticos del sistema
          </p>
        </div>
        <Link href="/admin/packages/create">
          <Button size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Nuevo Paquete
          </Button>
        </Link>
      </div>
      
      <Card className="shadow-lg">
        <CardHeader className="border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl flex items-center gap-2">
              <PackageIcon className="h-6 w-6 text-primary" />
              Lista de Paquetes
              <Badge variant="secondary" className="ml-2">
                {packages.length} total
              </Badge>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {packages.length === 0 ? (
            <div className="text-center py-16">
              <PackageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-xl font-medium text-muted-foreground mb-2">
                No hay paquetes disponibles
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Comienza creando tu primer paquete turístico
              </p>
              <Link href="/admin/packages/create">
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Paquete
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Imagen</TableHead>
                    <TableHead className="font-semibold">Título</TableHead>
                    <TableHead className="font-semibold">Destino</TableHead>
                    <TableHead className="font-semibold">Noches</TableHead>
                    <TableHead className="font-semibold">Precio</TableHead>
                    <TableHead className="font-semibold">Promoción</TableHead>
                    <TableHead className="font-semibold">Estado</TableHead>
                    <TableHead className="font-semibold">Estadísticas</TableHead>
                    <TableHead className="font-semibold text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {packages.map((pkg) => (
                    <TableRow key={pkg._id} className="hover:bg-muted/30 transition-colors">
                      <TableCell>
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                          {pkg.mainImage ? (
                            <img 
                              src={pkg.mainImage} 
                              alt={pkg.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <PackageIcon className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium max-w-xs">
                        <div className="truncate">{pkg.title}</div>
                      </TableCell>
                      <TableCell>{pkg.destination}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{pkg.nights} noches</Badge>
                      </TableCell>
                      <TableCell className="font-semibold">
                        ARS ${Number(pkg.price)?.toLocaleString('es-AR')}
                      </TableCell>
                      <TableCell>
                        {pkg.isPromotion ? (
                          <Badge className="bg-green-500 hover:bg-green-600">
                            Promoción
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Normal</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={pkg.isActive}
                            onCheckedChange={() => handleToggleActive(pkg._id, pkg.isActive)}
                          />
                          <span className="text-sm font-medium">
                            {pkg.isActive ? (
                              <Badge className="bg-blue-500 hover:bg-blue-600">Activo</Badge>
                            ) : (
                              <Badge variant="destructive">Inactivo</Badge>
                            )}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 text-xs">
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3 text-muted-foreground" />
                            <span>{pkg.views || 0} vistas</span>
                          </div>
                          <div className="text-muted-foreground">
                            {pkg.clicks || 0} clicks
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/packages/${pkg._id}`}>
                            <Button variant="outline" size="sm" className="gap-1">
                              <Edit className="h-3.5 w-3.5" />
                              Editar
                            </Button>
                          </Link>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            className="gap-1"
                            onClick={() => setDeleteId(pkg._id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Eliminar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El paquete será eliminado permanentemente
              de la base de datos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
