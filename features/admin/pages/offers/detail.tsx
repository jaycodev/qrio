'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { offersApi } from '@/lib/api/offers'
import { productsApi } from '@/lib/api/products'
import type { OfferDetail } from '@/lib/schemas/offers/offers.detail.schema'
import type { ProductList } from '@/lib/schemas/products/product.list.schema'

interface Props {
  title: string
}

export function OfferDetailPage({ title }: Props) {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [offer, setOffer] = useState<OfferDetail | null>(null)
  const [products, setProducts] = useState<ProductList[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const id = Number(params?.id)
    setLoading(true)
    Promise.all([offersApi.getById(id), productsApi.getAll(1)])
      .then(([detail, catalog]) => {
        if (!mounted) return
        setOffer(detail)
        setProducts(catalog)
      })
      .finally(() => mounted && setLoading(false))
    return () => {
      mounted = false
    }
  }, [params])

  const productMap = useMemo(() => {
    const map = new Map<number, ProductList>()
    for (const p of products) map.set(p.id, p)
    return map
  }, [products])

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="text-muted-foreground">Cargando oferta...</div>
      </div>
    )
  }

  if (!offer) {
    return (
      <div className="flex flex-col gap-4">
        <div className="text-destructive">No se encontró la oferta.</div>
        <Button variant="outline" onClick={() => router.back()}>
          Volver
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => router.back()}>
            Volver
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalle de la oferta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <div className="text-sm text-muted-foreground">Código</div>
              <div className="font-mono font-medium">{offer.code}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Estado</div>
              <div className="font-medium">{offer.active ? 'Activa' : 'Inactiva'}</div>
            </div>
            <div className="md:col-span-2">
              <div className="text-sm text-muted-foreground">Título</div>
              <div className="font-medium">{offer.title}</div>
            </div>
            {offer.description && (
              <div className="md:col-span-2">
                <div className="text-sm text-muted-foreground">Descripción</div>
                <div className="font-medium">{offer.description}</div>
              </div>
            )}
            <div>
              <div className="text-sm text-muted-foreground">Descuento</div>
              <div className="font-medium">{offer.offerDiscountPercentage}%</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Productos en la oferta</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead className="text-center">Cantidad</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {offer.products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-muted-foreground">
                    No hay productos en esta oferta.
                  </TableCell>
                </TableRow>
              ) : (
                offer.products.map((item) => {
                  const p = productMap.get(item.productId)
                  return (
                    <TableRow key={`${item.productId}`}>
                      <TableCell>
                        <div className="font-medium">
                          {p?.name ?? `Producto #${item.productId}`}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {p?.category?.name ?? '—'}
                      </TableCell>
                      <TableCell className="text-center">{item.quantity}</TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
