'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { ComboBox } from '@/components/ui/combobox'

import { ordersApi } from '@/lib/api/orders'
import { productsApi } from '@/lib/api/products'

const orderSchema = z.object({
  customerId: z.number().int().positive(),
  people: z.number().int().positive(),
  status: z.string().min(1),
  items: z.array(z.object({ productId: z.number().int().positive(), quantity: z.number().int().positive(), unitPrice: z.number().nonnegative() })).min(1),
})

type OrderFormValues = z.infer<typeof orderSchema>

interface OrderDialogProps {
  open: boolean
  mode: 'create' | 'edit' | 'details'
  initialValues?: Partial<OrderFormValues> & { id?: number }
  tables?: { id: number; label: string }[]
  customers?: { id: number; label: string }[]
  onClose: () => void
  onSubmit: (values: OrderFormValues, id?: number) => Promise<void>
}

export function OrderDialog({ open, mode, initialValues, tables = [], customers = [], onClose, onSubmit }: OrderDialogProps) {
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customerId: initialValues?.customerId ?? (undefined as unknown as number),
      people: initialValues?.people ?? 1,
      status: initialValues?.status ?? 'PENDING',
      items: initialValues?.items ?? [],
    },
  })

  const [catalog, setCatalog] = React.useState<{ id: number; name: string; price: number }[]>([])
  const [loadingProducts, setLoadingProducts] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)

  React.useEffect(() => {
    let mounted = true
    setLoadingProducts(true)
    productsApi
      .getAll(1)
      .then((products) => {
        if (mounted)
          setCatalog(products.map((p) => ({ id: p.id, name: p.name, price: p.price })))
      })
      .finally(() => mounted && setLoadingProducts(false))
    return () => {
      mounted = false
    }
  }, [])

  const addItem = (productId: number) => {
    const items = form.getValues('items')
    if (items.find((i) => i.productId === productId)) return
    const price = catalog.find((c) => c.id === productId)?.price ?? 0
    form.setValue('items', [...items, { productId, quantity: 1, unitPrice: price }])
  }

  const updateItem = (productId: number, quantity: number) => {
    form.setValue(
      'items',
      form.getValues('items').map((i) => (i.productId === productId ? { ...i, quantity } : i))
    )
  }

  const removeItem = (productId: number) => {
    form.setValue('items', form.getValues('items').filter((i) => i.productId !== productId))
  }

  const handleSubmit = async (values: OrderFormValues) => {
    setSubmitting(true)
    try {
      await onSubmit(values, initialValues?.id)
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  const readOnly = mode === 'details'

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Agregar Pedido' : mode === 'edit' ? 'Editar Pedido' : 'Detalle de Pedido'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="customerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <FormControl>
                    <ComboBox
                      value={field.value}
                      onChange={(v) => field.onChange(Number(v))}
                      options={customers.map((c) => ({ value: c.id, label: c.label }))}
                      placeholder="Selecciona un cliente"
                      disabled={readOnly}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="people"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Personas</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} value={field.value as number} onChange={(e) => field.onChange(Number(e.target.value))} disabled={readOnly} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <FormControl>
                    <ComboBox
                      value={field.value}
                      onChange={(v) => field.onChange(String(v))}
                      options={[
                        { value: 'PENDING', label: 'Pendiente' },
                        { value: 'CONFIRMED', label: 'Confirmado' },
                        { value: 'CANCELLED', label: 'Cancelado' },
                        { value: 'COMPLETED', label: 'Completado' },
                      ]}
                      placeholder="Selecciona un estado"
                      disabled={readOnly}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <div className="font-medium">Items</div>
              <div className="flex flex-wrap gap-2">
                {loadingProducts ? (
                  <span>Cargando productos...</span>
                ) : (
                  catalog.map((p) => (
                    <Button key={p.id} type="button" variant="outline" onClick={() => addItem(p.id)} disabled={readOnly}>
                      + {p.name}
                    </Button>
                  ))
                )}
              </div>
              <div className="space-y-2">
                {form.getValues('items').map((item) => (
                  <div key={item.productId} className="flex items-center gap-2">
                    <span className="w-48 truncate">{catalog.find((c) => c.id === item.productId)?.name}</span>
                    <Input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateItem(item.productId, Number(e.target.value))}
                      className="w-24"
                      disabled={readOnly}
                    />
                    <Button type="button" variant="destructive" onClick={() => removeItem(item.productId)} disabled={readOnly}>
                      Quitar
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={onClose}>
                {readOnly ? 'Cerrar' : 'Cancelar'}
              </Button>
              {!readOnly && (
                <Button type="submit" disabled={submitting}>
                  {mode === 'create' ? 'Agregar' : 'Guardar cambios'}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
