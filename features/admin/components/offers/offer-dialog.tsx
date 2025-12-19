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
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { productsApi } from '@/lib/api/products'

type CatalogProduct = {
  id: number
  name: string
  imageUrl?: string | null
  category?: { id: number; name: string }
  price?: number
}

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

  const [catalog, setCatalog] = React.useState<CatalogProduct[]>([])
  const [loadingProducts, setLoadingProducts] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const [categoryFilter, setCategoryFilter] = React.useState<string>('all')
  const [qtyByProduct, setQtyByProduct] = React.useState<Record<number, number>>({})
  const productsSelected = form.watch('products')
  const PAGE_SIZE = 3
  const [page, setPage] = React.useState(1)

  React.useEffect(() => {
    let mounted = true
    setLoadingProducts(true)
    productsApi
      .getAll(1)
      .then((products) => {
        if (mounted)
          setCatalog(
            products.map((p) => ({
              id: p.id,
              name: p.name,
              imageUrl: p.imageUrl ?? null,
              category: p.category ? { id: p.category.id, name: p.category.name } : undefined,
              price: p.price,
            }))
          )
      })
      .finally(() => mounted && setLoadingProducts(false))
    return () => {
      mounted = false
    }
  }, [])

  const addProduct = (productId: number, qty?: number) => {
    const products = form.getValues('products')
    if (products.find((p) => p.productId === productId)) return
    const quantity = Math.max(1, Number(qty ?? qtyByProduct[productId] ?? 1))
    form.setValue('products', [...products, { productId, quantity }])
    setQtyByProduct((prev) => ({ ...prev, [productId]: 1 }))
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

  const categories = React.useMemo(() => {
    const map = new Map<number, string>()
    for (const p of catalog) {
      if (p.category) map.set(p.category.id, p.category.name)
    }
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }))
  }, [catalog])

  const filteredCatalog = React.useMemo(() => {
    const term = search.trim().toLowerCase()
    return catalog.filter((p) => {
      const byTerm = !term || p.name.toLowerCase().includes(term)
      const byCat = categoryFilter === 'all' || (p.category && String(p.category.id) === categoryFilter)
      return byTerm && byCat
    })
  }, [catalog, search, categoryFilter])

  const pageCount = Math.max(1, Math.ceil(filteredCatalog.length / PAGE_SIZE))
  const currentProducts = React.useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filteredCatalog.slice(start, start + PAGE_SIZE)
  }, [filteredCatalog, page])

  React.useEffect(() => {
    setPage(1)
  }, [search, categoryFilter])

  React.useEffect(() => {
    if (page > pageCount) setPage(pageCount)
  }, [pageCount, page])

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-5xl">
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
            <div className="grid gap-4 md:grid-cols-3">
              {/* Izquierda: filtros + productos */}
              <div className="md:col-span-2 space-y-3">
                <div className="font-medium">Productos</div>
                {/* Filtros */}
                <div className="flex flex-wrap items-center gap-2">
                  <Input
                    placeholder="Buscar por nombre"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-64"
                    disabled={readOnly}
                  />
                  <Select
                    value={categoryFilter}
                    onValueChange={setCategoryFilter}
                    disabled={readOnly}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las categorías</SelectItem>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={String(c.id)}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Paginación */}
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm text-muted-foreground">Página {page} de {pageCount}</div>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-8 px-2"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={readOnly || page === 1}
                    >
                      Anterior
                    </Button>
                    {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                      <Button
                        key={n}
                        type="button"
                        variant={n === page ? 'default' : 'outline'}
                        className="h-8 px-2"
                        onClick={() => setPage(n)}
                        disabled={readOnly}
                      >
                        {n}
                      </Button>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      className="h-8 px-2"
                      onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                      disabled={readOnly || page === pageCount}
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>

                {/* Grid de cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {loadingProducts ? (
                    <div className="text-sm text-muted-foreground">Cargando productos...</div>
                  ) : filteredCatalog.length === 0 ? (
                    <div className="text-sm text-muted-foreground">Sin resultados</div>
                  ) : (
                    currentProducts.map((p) => (
                      <div key={p.id} className="rounded-md border p-2 space-y-2">
                        <div className="h-28 w-full overflow-hidden rounded">
                          <img
                            src={p.imageUrl || '/images/placeholders/product.png'}
                            alt={p.name}
                            className="h-28 w-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="font-medium truncate" title={p.name}>
                              {p.name}
                            </div>
                            {p.category && (
                              <Badge variant="outline" className="mt-1">
                                {p.category.name}
                              </Badge>
                            )}
                          </div>
                          {typeof p.price === 'number' && (
                            <Badge variant="outline" className="font-mono">
                              S/. {p.price.toFixed(2)}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <Input
                            type="number"
                            min={1}
                            value={qtyByProduct[p.id] ?? 1}
                            onChange={(e) =>
                              setQtyByProduct((prev) => ({ ...prev, [p.id]: Number(e.target.value) }))
                            }
                            className="w-20"
                            disabled={readOnly}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => addProduct(p.id, qtyByProduct[p.id])}
                            disabled={readOnly || !!productsSelected.find((pi) => pi.productId === p.id)}
                          >
                            Agregar
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Derecha: formulario + cesto */}
              <div className="space-y-3">
                <div className="space-y-3 rounded-md border p-3">
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

                  <div className="grid grid-cols-2 gap-2">
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
                  </div>
                </div>

                <div className="space-y-2 rounded-md border p-3">
                  <div className="font-medium">Cesto ({productsSelected.length})</div>
                  {productsSelected.length === 0 ? (
                    <div className="text-sm text-muted-foreground">No hay productos en el cesto</div>
                  ) : (
                    <div className="rounded-md border divide-y max-h-64 overflow-y-auto">
                      {productsSelected.map((item) => {
                        const p = catalog.find((c) => c.id === item.productId)
                        return (
                          <div key={item.productId} className="flex items-center gap-3 p-2">
                            <img
                              src={p?.imageUrl || '/images/placeholders/product.png'}
                              alt={p?.name || 'Producto'}
                              className="h-12 w-12 rounded object-cover border"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">{p?.name ?? 'Producto'}</div>
                              {p?.category && (
                                <div className="text-xs text-muted-foreground">{p.category.name}</div>
                              )}
                            </div>
                            <Input
                              type="number"
                              min={1}
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.productId, Number(e.target.value))}
                              className="w-20"
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
                        )
                      })}
                    </div>
                  )}
                </div>
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
