import { getAuthUserId, clearAuthCookie } from '@/lib/auth'
import { Sidebar } from '@/components/admin/Sidebar'
import { LoginForm } from '@/components/admin/login-form'
import { Toaster } from '@/components/ui/toaster'

async function logoutAction() {
  'use server'
  await clearAuthCookie()
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const userId = await getAuthUserId()

  // Si no está autenticado, mostrar formulario de login
  if (!userId) {
    return (
      <div className="min-hadmin/packages-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="max-w-md w-full mx-4 space-y-8 p-8 bg-background/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center">
              <span className="text-3xl font-bold text-primary">L</span>
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-primary/80 bg-clip-text text-transparent">Luzara Turismo</h2>
              <p className="text-muted-foreground">Panel de Administración</p>
            </div>
          </div>
          <LoginForm />
        </div>
      </div>
    )
  }

  // Si está autenticado, mostrar el layout con sidebar
  return (
    <div className="min-h-screen bg-background/50 flex">
      <div className="sticky top-0 h-screen overflow-y-auto flex-shrink-0"><Sidebar logoutAction={logoutAction} /></div>
      <main className="flex-1 overflow-auto">
        {children}
      </main>
      <Toaster />
    </div>
  )
}
