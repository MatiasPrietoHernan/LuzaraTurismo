import connectDB from '@/lib/db/connect'
import Package, { IPackage } from '@/lib/db/models/Package'
import { notFound } from 'next/navigation'
import ClientPackageView from './client-package-view'

export default async function PackagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await connectDB()
  const pkg = await Package.findById(id).lean() as IPackage | null

  if (!pkg) notFound()

  const serializedPkg = {
    ...pkg,
    _id: pkg._id.toString(),
    departureDate: pkg.departureDate.toLocaleDateString('es-AR'),
  } as any

  return <ClientPackageView pkg={serializedPkg} />
}
