'use client'

import * as React from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
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
import { Textarea } from '@/components/ui/textarea'
import { productsApi } from '@/lib/api/products'

const offerSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  description: z.string().optional(),
  offerDiscountPercentage: z.number().min(0),
  active: z.boolean(),
  products: z
    .array(
      z.object({ productId: z.number().int().positive(), quantity: z.number().int().positive() })
    )
    .min(1, 'Seleccione al menos un producto'),
})

type OfferFormValues = z.infer<typeof offerSchema>

interface OfferDialogProps {
  open: boolean
  mode: 'create' | 'edit' | 'details'
  initialValues?: Partial<OfferFormValues> & { id?: number }
  onClose: () => void
  onSubmit: (values: OfferFormValues, id?: number) => Promise<void>
}

export function OfferDialog({ open, mode, initialValues, onClose, onSubmit }: OfferDialogProps) {
  const form = useForm<OfferFormValues>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      title: initialValues?.title ?? '',
      description: initialValues?.description ?? '',
      offerDiscountPercentage: (initialValues?.offerDiscountPercentage as number) ?? 0,
      active: initialValues?.active ?? true,
      products: initialValues?.products ?? [],
    },
  })

  const [catalog, setCatalog] = React.useState<{ id: number; name: string }[]>([])
  const [loadingProducts, setLoadingProducts] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)

  React.useEffect(() => {
    let mounted = true
    setLoadingProducts(true)
    productsApi
      .getAll(1)
      .then((products) => {
        if (mounted) setCatalog(products.map((p) => ({ id: p.id, name: p.name })))
      })
      .finally(() => mounted && setLoadingProducts(false))
    return () => {
      mounted = false
    }
  }, [])

  const addProduct = (productId: number) => {
    const products = form.getValues('products')
    if (products.find((p) => p.productId === productId)) return
    form.setValue('products', [...products, { productId, quantity: 1 }])
  }

  const updateQuantity = (productId: number, qty: number) => {
    form.setValue(
      'products',
      form
        .getValues('products')
        .map((p) => (p.productId === productId ? { ...p, quantity: qty } : p))
    )
  }

  const removeProduct = (productId: number) => {
    form.setValue(
      'products',
      form.getValues('products').filter((p) => p.productId !== productId)
    )
  }

  const handleSubmit = async (values: OfferFormValues) => {
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
              ? 'Agregar Oferta'
              : mode === 'edit'
                ? 'Editar Oferta'
                : 'Detalle de Oferta'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Título de la oferta" {...field} disabled={readOnly} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descripción" {...field} disabled={readOnly} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="offerDiscountPercentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descuento (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      value={field.value as number}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      disabled={readOnly}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activo</FormLabel>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(v) => field.onChange(!!v)}
                      disabled={readOnly}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <div className="font-medium">Productos</div>
              <div className="flex flex-wrap gap-2">
                {loadingProducts ? (
                  <span>Cargando productos...</span>
                ) : (
                  catalog.map((p) => (
                    <Button
                      key={p.id}
                      type="button"
                      variant="outline"
                      onClick={() => addProduct(p.id)}
                      disabled={readOnly}
                    >
                      + {p.name}
                    </Button>
                  ))
                )}
              </div>
              <div className="space-y-2">
                {form.getValues('products').map((item) => (
                  <div key={item.productId} className="flex items-center gap-2">
                    <span className="w-48 truncate">
                      {catalog.find((c) => c.id === item.productId)?.name}
                    </span>
                    <Input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.productId, Number(e.target.value))}
                      className="w-24"
                      disabled={readOnly}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => removeProduct(item.productId)}
                      disabled={readOnly}
                    >
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
