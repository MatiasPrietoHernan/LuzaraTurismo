"use client"

import { useSearchParams } from 'next/navigation'

export function LoginForm() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const getErrorMessage = () => {
    switch (error) {
      case 'invalid':
        return 'Credenciales inválidas'
      case 'missing':
        return 'Por favor completa todos los campos'
      case 'server':
        return 'Error del servidor. Intenta nuevamente.'
      default:
        return null
    }
  }

  const errorMessage = getErrorMessage()

  return (
    <form action="/api/admin/login" method="POST" className="space-y-6">
      {errorMessage && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
          {errorMessage}
        </div>
      )}
      
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-foreground">
          Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="admin@luzara.com"
          className="w-full px-4 py-4 bg-background/50 border border-input/50 rounded-xl text-lg placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all duration-200"
          required
          autoComplete="email"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-foreground">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          name="password"
          placeholder="•••••••"
          className="w-full px-4 py-4 bg-background/50 border border-input/50 rounded-xl text-lg placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all duration-200"
          required
          autoComplete="current-password"
        />
      </div>
      
      <button 
        type="submit" 
        className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground px-6 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
      >
        Iniciar Sesión
      </button>
      
      <p className="text-xs text-center text-muted-foreground mt-4">
        Credenciales de demostración
      </p>
    </form>
  )
}
