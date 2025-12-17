import connectDB from '@/lib/db/connect'
import Order from '@/lib/db/models/Order'
import Package from '@/lib/db/models/Package'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'

async function deleteOrder(formData: FormData) {
  'use server'
  await connectDB()
  const id = formData.get('id') as string
  await Order.findByIdAndDelete(id)
  revalidatePath('/admin/orders')
}

export default async function OrdersPage() {
  await connectDB()
  const orders = await Order.find({}).populate('items.packageId', 'title price').lean()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Órdenes</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Lista de Órdenes ({orders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No hay órdenes.</p>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order._id.toString()}>
                      <TableCell className="font-mono text-xs">{order._id.toString().slice(-8)}</TableCell>
                      <TableCell>{order.email || 'N/A'}</TableCell>
                      <TableCell>ARS {Number(order.total)?.toLocaleString('es-AR')}</TableCell>
                      <TableCell>{order.items.length}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                          order.status === 'paid' ? 'bg-green-100 text-green-800' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell>{new Date(order.createdAt).toLocaleDateString('es-AR')}</TableCell>
                      <TableCell>
                        <Link href={`/admin/orders/${order._id}`}>
                          <Button variant="outline" size="sm">Ver</Button>
                        </Link>
                        <form action={deleteOrder} className="inline">
                          <input type="hidden" name="id" value={order._id.toString()} />
                          <Button variant="destructive" size="sm" type="submit">Eliminar</Button>
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
