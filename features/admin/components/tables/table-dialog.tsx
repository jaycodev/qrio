'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import type { DiningTableList } from '@/lib/schemas/table/table.list.schema'

type Mode = 'create' | 'edit' | 'details'

interface Props {
  open: boolean
  mode: Mode
  initial?: DiningTableList | null
  onClose: () => void
  onSubmitCreate: (payload: { tableNumber: number; floor: number }) => Promise<void>
  onSubmitEdit?: (id: number, payload: { tableNumber: number; floor: number }) => Promise<void>
}

export function TableDialog({ open, mode, initial, onClose, onSubmitCreate, onSubmitEdit }: Props) {
  const readOnly = mode === 'details'
  const title = mode === 'create' ? 'Agregar Mesa' : mode === 'edit' ? 'Editar Mesa' : 'Detalle de Mesa'

  const form = useForm<{ tableNumber: number; floor: number }>({
    defaultValues: {
      tableNumber: initial?.tableNumber ?? (0 as unknown as number),
      floor: initial?.floor ?? 1,
    },
    values: {
      tableNumber: initial?.tableNumber ?? (0 as unknown as number),
      floor: initial?.floor ?? 1,
    },
  })

  const handleSubmit = async (values: { tableNumber: number; floor: number }) => {
    const payload = { tableNumber: Number(values.tableNumber), floor: Number(values.floor) }
    if (mode === 'create') {
      await onSubmitCreate(payload)
    } else if (mode === 'edit' && initial && onSubmitEdit) {
      await onSubmitEdit(Number(initial.id), payload)
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
              name="tableNumber"
              rules={{ required: 'El número es requerido' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} {...field} readOnly={readOnly} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="floor"
              rules={{ required: 'El piso es requerido' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Piso</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} {...field} readOnly={readOnly} />
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
