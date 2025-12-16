import { notFound } from 'next/navigation'
import connectDB from '@/lib/db/connect'
import Package, { IPackage } from '@/lib/db/models/Package'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'

interface Props {
  params: Promise<{ id: string }>
}

async function updatePackage(formData: FormData, id: string) {
  'use server'
  await connectDB()
  await Package.findByIdAndUpdate(id, {
    title: formData.get('title'),
    destination: formData.get('destination'),
    nights: Number(formData.get('nights')),
    price: Number(formData.get('price')),
    description: formData.get('description') || undefined,
    badge: formData.get('badge') || undefined,
    isPromotion: formData.has('isPromotion')
  })
  revalidatePath('/admin/packages')
}

export default async function EditPackagePage({ params }: Props) {
  await connectDB()
  const { id } = await params
  const pkg = await Package.findById(id).lean() as IPackage | null

  if (!pkg) notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/packages">
          <Button variant="outline">← Volver</Button>
        </Link>
        <h1 className="text-3xl font-bold">Editar {pkg.title}</h1>
      </div>
      
      <form action={async (formData: FormData) => {
        'use server'
        await updatePackage(formData, id)
      }} className="max-w-2xl space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Título</Label>
          <Input id="title" name="title" defaultValue={pkg.title} required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="destination">Destino</Label>
            <Input id="destination" name="destination" defaultValue={pkg.destination} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nights">Noches</Label>
            <Input id="nights" name="nights" type="number" defaultValue={pkg.nights} min="1" required />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Precio (ARS)</Label>
            <Input id="price" name="price" type="number" defaultValue={pkg.price} min="0" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="isPromotion">Promoción</Label>
            <Input id="isPromotion" name="isPromotion" type="checkbox" defaultChecked={pkg.isPromotion} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Descripción</Label>
          <Input id="description" name="description" defaultValue={pkg.description || ''} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="badge">Badge</Label>
          <Input id="badge" name="badge" defaultValue={pkg.badge || ''} />
        </div>
        <div className="flex gap-4">
          <Button type="submit">Actualizar Paquete</Button>
          <Link href="/admin/packages">
            <Button variant="outline" type="button">Cancelar</Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
