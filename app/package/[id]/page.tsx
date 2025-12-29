import connectDB from '@/lib/db/connect'
import Package, { IPackage } from '@/lib/db/models/Package'
import { notFound } from 'next/navigation'
import ClientPackageView from './client-package-view'

export default async function PackagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await connectDB()
  const pkg = await Package.findById(id)
    .populate('departurePoints')
    .lean() as (IPackage & { departurePoints: any[] }) | null

  if (!pkg) notFound()

  const serializedPkg = {
    ...pkg,
    _id: pkg._id.toString(),
    departureDate: pkg.departureDate?.toISOString(),
    formattedDepartureDate: pkg.departureDate?.toLocaleDateString('es-AR'),
    departurePoints: (pkg.departurePoints || []).map((point: any) => ({
      ...point,
      _id: point._id?.toString() || point.toString(),
    })),
  } as any

  return <ClientPackageView pkg={serializedPkg} />
}
