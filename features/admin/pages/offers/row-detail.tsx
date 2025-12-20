'use client'

import * as React from 'react'

import { Badge } from '@/components/ui/badge'
import { offersApi } from '@/lib/api/offers'
import { productsApi } from '@/lib/api/products'
import { useTenant } from '@/app/providers/tenant-provider'
import type { OfferList } from '@/lib/schemas/offers/offers.list.schema'

interface Props {
  offer: OfferList
}

export function OfferRowDetail({ offer }: Props) {
  const tenant = useTenant()
  const [loading, setLoading] = React.useState(true)
  const [items, setItems] = React.useState<Array<{ productId: number; quantity: number }>>([])
  const [catalogMap, setCatalogMap] = React.useState<
    Map<number, { name: string; imageUrl?: string; categoryName?: string }>
  >(new Map())

  React.useEffect(() => {
    let mounted = true
    setLoading(true)
    ;(async () => {
      try {
        const detail = await offersApi.getById(offer.id)
        if (!mounted) return
        setItems(detail.products)
        const products = await productsApi.getAll(tenant.branchId ?? 0)
        if (!mounted) return
        const map = new Map<number, { name: string; imageUrl?: string; categoryName?: string }>()
        for (const p of products) {
          map.set(p.id, {
            name: p.name,
            imageUrl: p.imageUrl ?? undefined,
            categoryName: p.category?.name,
          })
        }
        setCatalogMap(map)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [offer.id, tenant.branchId])

  if (loading) {
    return <div className="p-3 text-sm text-muted-foreground">Cargando productos...</div>
  }

  if (!items.length) {
    return <div className="p-3 text-sm text-muted-foreground">Sin productos en esta oferta</div>
  }

  return (
    <div className="p-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((item) => {
          const p = catalogMap.get(item.productId)
          return (
            <div key={item.productId} className="rounded-md border p-2 flex items-center gap-3">
              <img
                src={p?.imageUrl || '/images/placeholders/product.png'}
                alt={p?.name || `Producto #${item.productId}`}
                className="h-12 w-12 rounded object-cover border"
              />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">
                  {p?.name ?? `Producto #${item.productId}`}
                </div>
                {p?.categoryName && (
                  <div className="text-xs text-muted-foreground">{p.categoryName}</div>
                )}
              </div>
              <Badge variant="outline" className="font-mono">
                x{item.quantity}
              </Badge>
            </div>
          )
        })}
      </div>
    </div>
  )
}
