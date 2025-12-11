'use client'

import * as React from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

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
import { Textarea } from '@/components/ui/textarea'
import { categoriesApi } from '@/lib/api/categories'
import {
  type ProductCreate,
  productCreateSchema,
} from '@/lib/schemas/products/product.create.schema'

interface CategoryOption {
  id: number
  name: string
}

interface ProductDialogProps {
  open: boolean
  mode: 'create' | 'edit' | 'details'
  initialValues?: Partial<ProductCreate> & { id?: number }
  onClose: () => void
  onSubmit: (values: ProductCreate, id?: number) => Promise<void>
}

export function ProductDialog({
  open,
  mode,
  initialValues,
  onClose,
  onSubmit,
}: ProductDialogProps) {
  const form = useForm<ProductCreate>({
    resolver: zodResolver(productCreateSchema),
    defaultValues: {
      categoryId: initialValues?.categoryId ?? (undefined as unknown as number),
      name: initialValues?.name ?? '',
      description: initialValues?.description ?? '',
      price: (initialValues?.price as number) ?? (undefined as unknown as number),
      imageUrl: (initialValues?.imageUrl as string) ?? '',
    },
  })

  const [categories, setCategories] = React.useState<CategoryOption[]>([])
  const [loadingCategories, setLoadingCategories] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)

  React.useEffect(() => {
    let mounted = true
    setLoadingCategories(true)
    categoriesApi
      .getAll(1)
      .then((cats) => {
        if (mounted) setCategories(cats)
      })
      .finally(() => mounted && setLoadingCategories(false))
    return () => {
      mounted = false
    }
  }, [])

  const handleSubmit = async (values: ProductCreate) => {
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create'
              ? 'Agregar Producto'
              : mode === 'edit'
                ? 'Editar Producto'
                : 'Detalle de Producto'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>
                  <FormControl>
                    <ComboBox
                      disabled={loadingCategories || readOnly}
                      value={field.value}
                      onChange={(v) => field.onChange(Number(v))}
                      options={categories.map((c) => ({ value: c.id, label: c.name }))}
                      placeholder="Selecciona una categoría"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre del producto" {...field} disabled={readOnly} />
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
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
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
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imagen (URL)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} disabled={readOnly} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
