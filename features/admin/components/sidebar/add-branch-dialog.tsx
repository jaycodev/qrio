'use client'

import * as React from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useTenant } from '@/app/providers/tenant-provider'
import { branchesApi } from '@/lib/api/branches'
import {
  createBranchRequestSchema,
  type CreateBranchRequest,
} from '@/lib/schemas/branches/branch.create.request.schema'
import type { BranchList } from '@/lib/schemas/branches/branch.list.schema'

type Props = {
  open: boolean
  onOpenChange: (value: boolean) => void
  onCreated?: (branch: BranchList) => void
}

export function AddBranchDialog({ open, onOpenChange, onCreated }: Props) {
  const tenant = useTenant()
  const form = useForm<Pick<CreateBranchRequest, 'name' | 'address' | 'phone' | 'schedule'>>({
    resolver: zodResolver(createBranchRequestSchema.omit({ restaurantId: true })),
    defaultValues: {
      name: '',
      address: '',
      phone: '',
      schedule: '',
    },
  })

  const [submitting, setSubmitting] = React.useState(false)

  const onSubmit = form.handleSubmit(async (values) => {
    if (!tenant.restaurantId) {
      toast.error('No se encontró el restaurante del usuario')
      return
    }
    setSubmitting(true)
    try {
      const created = await branchesApi.create({
        restaurantId: tenant.restaurantId,
        name: values.name,
        address: values.address ?? null,
        phone: values.phone ?? null,
        schedule: values.schedule ?? null,
      })
      toast.success('Sucursal creada correctamente')
      onCreated?.(created)
      onOpenChange(false)
      form.reset()
    } catch (error: any) {
      console.error('[AddBranchDialog] create error:', error)
      toast.error(error?.message ?? 'Error al crear la sucursal')
    } finally {
      setSubmitting(false)
    }
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar sucursal</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="grid gap-4" onSubmit={onSubmit}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej. Sucursal Centro" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Input placeholder="Opcional" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <Input placeholder="Opcional" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="schedule"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Horario</FormLabel>
                  <FormControl>
                    <Input placeholder="Opcional" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => onOpenChange(false)}
                disabled={submitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Creando…' : 'Crear'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
