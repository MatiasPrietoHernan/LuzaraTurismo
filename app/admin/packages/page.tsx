import connectDB from '@/lib/db/connect'
import Package, { IPackage } from '@/lib/db/models/Package'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'

async function createPackage(formData: FormData) {
  'use server'
  await connectDB()
  const data = Object.fromEntries(formData.entries())
  data.nights = Number(data.nights)
  data.price = Number(data.price)
  data.isPromotion = data.isPromotion === 'on'
  await Package.create(data as any)
  revalidatePath('/admin/packages')
}

async function deletePackage(formData: FormData) {
  'use server'
  await connectDB()
  const id = formData.get('id') as string
  await Package.findByIdAndDelete(id)
  revalidatePath('/admin/packages')
}

export default async function PackagesPage() {
  await connectDB()
  const packages: IPackage[] = await Package.find({}).lean()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Paquetes</h1>
        <Link href="/admin/packages/create">
          <Button>
            Nuevo Paquete
          </Button>
        </Link>

      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Lista de Paquetes ({packages.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {packages.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No hay paquetes. Crea el primero arriba.</p>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Destino</TableHead>
                    <TableHead>Noches</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Promoción</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                {packages.map((pkg) => (
                  <TableRow key={pkg._id.toString()}>
                    <TableCell className="font-medium">{pkg.title}</TableCell>
                    <TableCell>{pkg.destination}</TableCell>
                    <TableCell>{pkg.nights}</TableCell>
                    <TableCell>ARS {Number(pkg.price)?.toLocaleString('es-AR')}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${pkg.isPromotion ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {pkg.isPromotion ? 'Sí' : 'No'}
                      </span>
                    </TableCell>
                    <TableCell className="space-x-2">
                      <Link href={`/admin/packages/${pkg._id.toString()}`}>
                        <Button variant="outline" size="sm">Editar</Button>
                      </Link>
                      <form action={deletePackage}>
                        <input type="hidden" name="id" value={pkg._id.toString()} />
                        <Button variant="destructive" size="sm" type="submit">
                          Eliminar
                        </Button>
                      </form>
                    </TableCell>
                  </TableRow>
                ))}

                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
