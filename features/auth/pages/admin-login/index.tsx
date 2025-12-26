'use client'

import { useState } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { authApi } from '@/lib/api/auth'
import { cn } from '@/lib/utils'

export function AdminLoginPage({ className, ...props }: React.ComponentProps<'div'>) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const form = new FormData(e.currentTarget)
    const email = String(form.get('email') ?? '')
    const password = String(form.get('password') ?? '')
    if (!email || !password) {
      setError('Ingresa tu email y contraseña')
      return
    }
    setLoading(true)
    try {
      await authApi.adminLogin({ email, password })
      try {
        const me = await authApi.me()
        if (me.role !== 'APP_ADMIN') {
          setError('No tienes rol de APP_ADMIN')
          return
        }
        router.replace('/requerimientos')
        return
      } catch (meErr) {
        console.warn('No se pudo obtener /auth/me después del login', meErr)
      }
    } catch (err) {
      console.error('Admin login failed:', err)
      setError('Credenciales inválidas o servicio no disponible')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Acceso App Admin</h1>
                <p className="text-muted-foreground text-balance">
                  Ingresa con credenciales de administrador de plataforma
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@qrio.com"
                  autoComplete="username"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Link
                    href="/iniciar-sesion"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Ir al login normal
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                />
              </Field>
              <Field>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Ingresando...' : 'Entrar'}
                </Button>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              </Field>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/placeholder.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        Solo para administradores de la plataforma.
      </FieldDescription>
    </div>
  )
}
