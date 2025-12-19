'use client'

import * as React from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { ComboBox } from '@/components/ui/combobox'
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
import { Select } from '@/components/ui/select'
import { ordersApi } from '@/lib/api/orders'
import { Badge } from '@/components/ui/badge'
import { productsApi } from '@/lib/api/products'

const orderSchema = z.object({
  customerId: z.number().int().positive(),
  people: z.number().int().positive(),
  status: z.string().min(1),
  items: z
    .array(
      z.object({
        productId: z.number().int().positive(),
        quantity: z.number().int().positive(),
        unitPrice: z.number().nonnegative(),
      })
    )
    .min(1),
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

export function OrderDialog({
  open,
  mode,
  initialValues,
  tables = [],
  customers = [],
  onClose,
  onSubmit,
}: OrderDialogProps) {
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customerId: initialValues?.customerId ?? (undefined as unknown as number),
      people: initialValues?.people ?? 1,
      status: initialValues?.status ?? 'PENDIENTE',
      items: initialValues?.items ?? [],
    },
  })

  const [catalog, setCatalog] = React.useState<{ id: number; name: string; price: number }[]>([])
  const [loadingProducts, setLoadingProducts] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const [detailTotal, setDetailTotal] = React.useState<number | null>(null)

  const statusStyles: Record<string, { label: string; variant: any }> = {
    PENDIENTE: { label: 'Pendiente', variant: 'warning' },
    EN_PROGRESO: { label: 'En progreso', variant: 'info' },
    COMPLETADO: { label: 'Completado', variant: 'success' },
    CANCELADO: { label: 'Cancelado', variant: 'destructive' },
  }

  React.useEffect(() => {
    let mounted = true
    setLoadingProducts(true)
    productsApi
      .getAll(1)
      .then((products) => {
        if (mounted) setCatalog(products.map((p) => ({ id: p.id, name: p.name, price: p.price })))
      })
      .finally(() => mounted && setLoadingProducts(false))
    return () => {
      mounted = false
    }
  }, [])

  // Cargar detalle enriquecido cuando estamos en modo detalles
  React.useEffect(() => {
    if (!open || mode !== 'details' || !initialValues?.id) return
    let mounted = true
    ordersApi.getById(initialValues.id).then((detail) => {
      if (!mounted) return
      const enrichedItems = detail.items.map((it) => ({
        productId: it.productId,
        quantity: it.quantity,
        unitPrice: it.unitPrice,
        subtotal: it.subtotal,
        productName: it.productName,
        productImageUrl: it.productImageUrl ?? null,
      })) as any
      form.reset({
        customerId: initialValues.customerId ?? (undefined as unknown as number),
        people: detail.people ?? initialValues.people ?? 1,
        status: (detail as any).status ?? initialValues.status ?? 'PENDIENTE',
        items: enrichedItems,
      })
      setDetailTotal(detail.total ?? null)
    })
    return () => {
      mounted = false
    }
  }, [open, mode, initialValues?.id])

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
    form.setValue(
      'items',
      form.getValues('items').filter((i) => i.productId !== productId)
    )
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
            {mode === 'create'
              ? 'Agregar Pedido'
              : mode === 'edit'
                ? 'Editar Pedido'
                : 'Detalle de Pedido'}
          </DialogTitle>
          {/* Badge de estado con color para dar "colorsito" como la tabla */}
          <div className="mt-1">
            {(() => {
              const current = form.watch('status') || 'PENDIENTE'
              const meta = statusStyles[current] ?? statusStyles.PENDIENTE
              return <Badge variant={meta.variant}>{meta.label}</Badge>
            })()}
          </div>
        </DialogHeader>
        {readOnly && (
          <div className="space-y-3">
            <div className="font-medium">Items</div>
            <div className="rounded-md border">
              {form.getValues('items').length === 0 ? (
                <div className="p-3 text-sm text-muted-foreground">Sin ítems</div>
              ) : (
                form.getValues('items').map((item, idx) => (
                  <div
                    key={item.productId}
                    className="grid grid-cols-[auto_1fr] md:grid-cols-[auto_1fr_auto] items-center gap-3 p-3 border-b last:border-b-0 odd:bg-muted/30"
                  >
                    <img
                      src={(item as any).productImageUrl || '/images/placeholders/product.svg'}
                      alt={(item as any).productName || 'Producto'}
                      className="h-12 w-12 rounded-md object-cover ring-1 ring-border"
                    />
                    <div className="flex-1">
                      <div className="font-medium">{(item as any).productName ?? 'Producto'}</div>
                      <div className="text-sm text-muted-foreground">
                        Cantidad: {item.quantity} · Unit: S/. {item.unitPrice.toFixed(2)}
                      </div>
                    </div>
                    <div className="justify-self-end">
                      <Badge variant="outline" className="font-mono">
                        Subtotal: S/.{' '}
                        {(item as any).subtotal?.toFixed?.(2) ??
                          (item.unitPrice * item.quantity).toFixed(2)}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="flex justify-end pt-2">
              <div className="rounded-md bg-primary/10 px-3 py-2 text-sm font-semibold text-primary">
                Total: S/.{' '}
                {(
                  detailTotal ??
                  form
                    .getValues('items')
                    .reduce(
                      (acc, it: any) =>
                        acc +
                        (typeof it.subtotal === 'number'
                          ? it.subtotal
                          : it.unitPrice * it.quantity),
                      0
                    )
                ).toFixed(2)}
              </div>
            </div>
          </div>
        )}
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
                    <Input
                      type="number"
                      min={1}
                      value={field.value as number}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      disabled={readOnly}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!readOnly && (
              <div className="space-y-2">
                <div className="font-medium">Items</div>
                <div className="flex flex-wrap gap-2">
                  {loadingProducts ? (
                    <span>Cargando productos...</span>
                  ) : (
                    catalog.map((p) => (
                      <Button
                        key={p.id}
                        type="button"
                        variant="outline"
                        onClick={() => addItem(p.id)}
                        disabled={readOnly}
                      >
                        + {p.name}
                      </Button>
                    ))
                  )}
                </div>
                <div className="space-y-2">
                  {form.getValues('items').map((item) => (
                    <div key={item.productId} className="flex items-center gap-2">
                      <span className="w-48 truncate">
                        {catalog.find((c) => c.id === item.productId)?.name}
                      </span>
                      <Input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) => updateItem(item.productId, Number(e.target.value))}
                        className="w-24"
                        disabled={readOnly}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => removeItem(item.productId)}
                        disabled={readOnly}
                      >
                        Quitar
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
