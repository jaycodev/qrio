'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import type { CustomerList } from '@/lib/schemas/customers/customers.list.schema'

type Mode = 'create' | 'edit' | 'details'

interface Props {
  open: boolean
  mode: Mode
  initial?: CustomerList | null
  onClose: () => void
  onSubmitCreate: (payload: { name: string; email: string }) => Promise<void>
  onSubmitEdit?: (id: number, payload: { name: string; email: string }) => Promise<void>
}

export function CustomerDialog({ open, mode, initial, onClose, onSubmitCreate, onSubmitEdit }: Props) {
  const readOnly = mode === 'details'
  const title = mode === 'create' ? 'Agregar Cliente' : mode === 'edit' ? 'Editar Cliente' : 'Detalle de Cliente'

  const form = useForm<{ name: string; email: string }>({
    defaultValues: {
      name: initial?.name ?? '',
      email: initial?.email ?? '',
    },
    values: {
      name: initial?.name ?? '',
      email: initial?.email ?? '',
    },
  })

  const handleSubmit = async (values: { name: string; email: string }) => {
    if (mode === 'create') {
      await onSubmitCreate(values)
    } else if (mode === 'edit' && initial && onSubmitEdit) {
      await onSubmitEdit(Number(initial.id), values)
    }
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              rules={{ required: 'El nombre es requerido' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre" {...field} readOnly={readOnly} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              rules={{ required: 'El email es requerido' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="correo@dominio.com" {...field} readOnly={readOnly} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>Cerrar</Button>
              {mode !== 'details' && <Button type="submit">Guardar</Button>}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
