'use client'

import { useEffect, useState } from 'react'

import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { useTenant } from '@/app/providers/tenant-provider'
import { Logo } from '@/components/shared/logo'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { authApi } from '@/lib/api/auth'
import { getInitials } from '@/lib/utils'

interface Branch {
  id: string
  restaurantId?: string
  restaurantName: string
  branchName: string
}

export default function BranchSelectionPage() {
  const [branches, setBranches] = useState<Branch[]>([])
  const [loadingBranches, setLoadingBranches] = useState(false)

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newRestaurantName, setNewRestaurantName] = useState('')
  const [newRestaurantDescription, setNewRestaurantDescription] = useState('')

  const handleCreateRestaurant = () => {
    console.warn('Crear restaurante:', {
      name: newRestaurantName,
      description: newRestaurantDescription,
    })
    setIsCreateModalOpen(false)
    setNewRestaurantName('')
    setNewRestaurantDescription('')
  }

  const router = useRouter()
  const tenant = useTenant()

  const handleBranchClick = (branch: Branch) => {
    ;(async () => {
      try {
        await fetch('/api/auth/set-branch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            branchId: Number(branch.id),
            restaurantId: branch.restaurantId ? Number(branch.restaurantId) : undefined,
          }),
          credentials: 'same-origin',
        })
      } catch (err) {
        console.warn('Failed to set branch cookie', err)
      }
      try {
        tenant.setBranchId(Number(branch.id))
      } catch {}
      try {
        if (typeof window !== 'undefined') window.location.href = '/admin'
        else router.replace('/admin')
      } catch {
        router.replace('/admin')
      }
    })()
  }

  const handleLogout = async () => {
    try {
      await authApi.logout()
    } finally {
      try {
        tenant.reset()
      } catch {}
      try {
        const cookieNames = ['access_token', 'refresh_token', 'branchId']
        for (const name of cookieNames) {
          document.cookie = `${name}=; Max-Age=0; Path=/;`
        }
      } catch {}
      router.push('/iniciar-sesion')
    }
  }

  useEffect(() => {
    let mounted = true
    setLoadingBranches(true)
    authApi
      .branches()
      .then((data) => {
        if (!mounted) return
        const mapped = data.map((b) => ({
          id: String(b.branch?.id ?? ''),
          restaurantId: b.restaurant?.id ? String(b.restaurant.id) : undefined,
          restaurantName: b.restaurant?.name ?? '',
          branchName: b.branch?.name ?? '',
        }))
        setBranches(mapped)
      })
      .catch((err) => console.warn('Failed to load branches', err))
      .finally(() => {
        if (mounted) setLoadingBranches(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="relative min-h-screen bg-muted">
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <Card className="overflow-hidden">
            <CardContent className="p-8">
              <div
                className={`mb-8 flex items-center ${branches.length > 0 ? 'justify-between' : 'justify-center'}`}
              >
                <div className="flex items-center gap-2">
                  <Logo className="size-12" />
                </div>

                {branches.length > 0 && (
                  <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="size-4" />
                    Crear sucursal
                  </Button>
                )}
              </div>

              {loadingBranches ? (
                <div className="py-12 text-center">Cargando sucursales...</div>
              ) : branches.length === 0 ? (
                <div className="py-12 text-center">
                  <h2 className="mb-4 text-3xl font-bold">¡Bienvenido a Qrio!</h2>
                  <p className="mb-8 text-lg">
                    Crea tu primer restaurante para comenzar a gestionar tus sucursales y optimizar
                    tu negocio
                  </p>
                  <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="size-4" />
                    Crear Restaurante
                  </Button>
                </div>
              ) : (
                <div>
                  <h2 className="mb-8 text-2xl font-bold">¡Qué gusto verte de nuevo, Jason!</h2>
                  <div className="space-y-3">
                    {branches.map((branch) => (
                      <button
                        key={branch.id}
                        className="flex w-full items-center gap-4 rounded-lg border p-4 text-left cursor-pointer transition-all hover:border-primary hover:shadow-md"
                        onClick={() => handleBranchClick(branch)}
                      >
                        <Avatar className="h-12 w-12 border-2">
                          <AvatarFallback className="text-base font-semibold">
                            {getInitials(branch.restaurantName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold">{branch.restaurantName}</h3>
                          <p className="text-sm">{branch.branchName}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-8 text-sm text-center">
                Sesión iniciada como {tenant.user?.email ?? 'usuario'}.{' '}
                <button
                  onClick={handleLogout}
                  className="hover:underline cursor-pointer font-medium text-primary"
                >
                  Cerrar sesión
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Restaurante</DialogTitle>
            <DialogDescription>
              Ingresa los datos de tu restaurante. Podrás agregar sucursales después.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                placeholder="Ej: La Parrilla"
                value={newRestaurantName}
                onChange={(e) => setNewRestaurantName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                placeholder="Describe tu restaurante..."
                value={newRestaurantDescription}
                onChange={(e) => setNewRestaurantDescription(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateRestaurant}>Crear</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
