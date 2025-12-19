"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Edit, Trash2, Plus, MapPin } from 'lucide-react'

interface IDeparturePoint {
  _id: string
  name: string
  city: string
  address?: string
  isActive: boolean
}

export default function DeparturePointsPage() {
  const [departurePoints, setDeparturePoints] = useState<IDeparturePoint[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editingPoint, setEditingPoint] = useState<IDeparturePoint | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    address: '',
    isActive: true
  })
  const { toast } = useToast()

  const fetchDeparturePoints = async () => {
    try {
      const res = await fetch('/api/admin/departure-points')
      const data = await res.json()
      setDeparturePoints(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los puntos de salida",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDeparturePoints()
  }, [])

  const handleToggleActive = async (id: string, currentValue: boolean) => {
    try {
      const res = await fetch(`/api/admin/departure-points/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentValue })
      })

      if (res.ok) {
        setDeparturePoints(departurePoints.map(point => 
          point._id === id ? { ...point, isActive: !currentValue } : point
        ))
        toast({
          title: "Actualizado",
          description: `Punto de salida ${!currentValue ? 'activado' : 'desactivado'} exitosamente`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado",
        variant: "destructive"
      })
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    
    try {
      const res = await fetch(`/api/admin/departure-points/${deleteId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        setDeparturePoints(departurePoints.filter(point => point._id !== deleteId))
        toast({
          title: "Eliminado",
          description: "Punto de salida eliminado exitosamente",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el punto de salida",
        variant: "destructive"
      })
    } finally {
      setDeleteId(null)
    }
  }

  const openCreateDialog = () => {
    setEditingPoint(null)
    setFormData({ name: '', city: '', address: '', isActive: true })
    setIsDialogOpen(true)
  }

  const openEditDialog = (point: IDeparturePoint) => {
    setEditingPoint(point)
    setFormData({
      name: point.name,
      city: point.city,
      address: point.address || '',
      isActive: point.isActive
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingPoint 
        ? `/api/admin/departure-points/${editingPoint._id}`
        : '/api/admin/departure-points'
      
      const method = editingPoint ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        toast({
          title: editingPoint ? "Actualizado" : "Creado",
          description: `Punto de salida ${editingPoint ? 'actualizado' : 'creado'} exitosamente`,
        })
        setIsDialogOpen(false)
        fetchDeparturePoints()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar el punto de salida",
        variant: "destructive"
      })
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
            Puntos de Salida
          </h1>
          <p className="text-muted-foreground mt-2">
            Gestiona los puntos de salida de los paquetes turísticos
          </p>
        </div>
        <Button size="lg" className="gap-2" onClick={openCreateDialog}>
          <Plus className="h-5 w-5" />
          Nuevo Punto de Salida
        </Button>
      </div>
      
      <Card className="shadow-lg">
        <CardHeader className="border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl flex items-center gap-2">
              <MapPin className="h-6 w-6 text-primary" />
              Lista de Puntos de Salida
              <Badge variant="secondary" className="ml-2">
                {departurePoints.length} total
              </Badge>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {departurePoints.length === 0 ? (
            <div className="text-center py-16">
              <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-xl font-medium text-muted-foreground mb-2">
                No hay puntos de salida disponibles
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Comienza creando el primer punto de salida
              </p>
              <Button variant="outline" onClick={openCreateDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Punto de Salida
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Nombre</TableHead>
                    <TableHead className="font-semibold">Ciudad</TableHead>
                    <TableHead className="font-semibold">Dirección</TableHead>
                    <TableHead className="font-semibold">Estado</TableHead>
                    <TableHead className="font-semibold text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departurePoints.map((point) => (
                    <TableRow key={point._id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium">{point.name}</TableCell>
                      <TableCell>{point.city}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {point.address || '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={point.isActive}
                            onCheckedChange={() => handleToggleActive(point._id, point.isActive)}
                          />
                          <span className="text-sm font-medium">
                            {point.isActive ? (
                              <Badge className="bg-blue-500 hover:bg-blue-600">Activo</Badge>
                            ) : (
                              <Badge variant="destructive">Inactivo</Badge>
                            )}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="gap-1"
                            onClick={() => openEditDialog(point)}
                          >
                            <Edit className="h-3.5 w-3.5" />
                            Editar
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            className="gap-1"
                            onClick={() => setDeleteId(point._id)}
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

      {/* Dialog para Crear/Editar */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingPoint ? 'Editar Punto de Salida' : 'Nuevo Punto de Salida'}
            </DialogTitle>
            <DialogDescription>
              {editingPoint 
                ? 'Modifica los datos del punto de salida' 
                : 'Completa los datos para crear un nuevo punto de salida'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Terminal de Ómnibus"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Ciudad *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Buenos Aires"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Dirección</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Av. Ramos Mejía 1680"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label>Activo</Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingPoint ? 'Actualizar' : 'Crear'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmación de Eliminación */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El punto de salida será eliminado permanentemente
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
