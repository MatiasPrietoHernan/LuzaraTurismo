import connectDB from '@/lib/db/connect'
import Subscriber from '@/lib/db/models/Subscriber'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { revalidatePath } from 'next/cache'

async function deleteSubscriber(formData: FormData) {
  'use server'
  await connectDB()
  const id = formData.get('id') as string
  await Subscriber.findByIdAndDelete(id)
  revalidatePath('/admin/subscribers')
}

export default async function SubscribersPage() {
  await connectDB()
  const subscribers = await Subscriber.find({}).lean()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Suscriptores Newsletter ({subscribers.length})</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Lista de Suscriptores</CardTitle>
        </CardHeader>
        <CardContent>
          {subscribers.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No hay suscriptores.</p>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscribers.map((sub) => (
                    <TableRow key={sub._id.toString()}>
                      <TableCell>{sub.email}</TableCell>
                      <TableCell>{new Date(sub.createdAt).toLocaleDateString('es-AR')}</TableCell>
                      <TableCell>
                        <form action={deleteSubscriber} className="inline">
                          <input type="hidden" name="id" value={sub._id.toString()} />
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
