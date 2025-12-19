'use client'

import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import type { DiningTableList } from '@/lib/schemas/table/table.list.schema'

type Mode = 'create' | 'edit' | 'details'

interface Props {
  open: boolean
  mode: Mode
  initial?: DiningTableList | null
  onClose: () => void
  onSubmitCreate: (payload: { floor: number }) => Promise<void>
  onSubmitEdit?: (id: number, payload: { floor: number }) => Promise<void>
}

export function TableDialog({ open, mode, initial, onClose, onSubmitCreate, onSubmitEdit }: Props) {
  const readOnly = mode === 'details'
  const title =
    mode === 'create' ? 'Agregar Mesa' : mode === 'edit' ? 'Editar Mesa' : 'Detalle de Mesa'

  const form = useForm<{ floor: number }>({
    defaultValues: {
      floor: initial?.floor ?? 1,
    },
    values: {
      floor: initial?.floor ?? 1,
    },
  })

  const handleSubmit = async (values: { floor: number }) => {
    const payload = { floor: Number(values.floor) }
    if (mode === 'create') {
      await onSubmitCreate(payload)
    } else if (mode === 'edit' && initial && onSubmitEdit) {
      await onSubmitEdit(Number(initial.id), { floor: payload.floor })
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
            {mode === 'edit' && (
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Mesa</div>
                <div className="text-sm font-medium">Mesa {initial?.tableNumber}</div>
              </div>
            )}
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
              <Button type="button" variant="outline" onClick={onClose}>
                Cerrar
              </Button>
              {mode !== 'details' && <Button type="submit">Guardar</Button>}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
