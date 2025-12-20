'use client'

import { useMemo, useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import { OfferDialog } from '@admin/components/offers/offer-dialog'
import { TableListLayout } from '@admin/components/shared/table-list-layout'

import { useTenant } from '@/app/providers/tenant-provider'
import { useListQuery } from '@/hooks/use-list-query'
import { offersApi } from '@/lib/api/offers'
import type { OfferList } from '@/lib/schemas/offers/offers.list.schema'

import { getColumns } from './columns'
import { OfferRowDetail } from './row-detail'

interface Props {
  title: string
  pathname: string
  resource: string
}

export function OffersPage({ title, pathname, resource }: Props) {
  const tenant = useTenant()
  const { data, error } = useListQuery<OfferList[]>(
    pathname,
    [resource, String(tenant.branchId ?? '')],
    () => offersApi.getAll(tenant.branchId ?? 0)
  )
  const queryClient = useQueryClient()
  const router = useRouter()

  const [showDialog, setShowDialog] = useState(false)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'details'>('create')
  const [expanded, setExpanded] = useState<Set<number>>(new Set())
  const toggleExpand = (id: number) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }
  const [initialValues, setInitialValues] = useState<
    | {
        id?: number
        title?: string
        description?: string
        offerDiscountPercentage?: number
        active?: boolean
        products?: { productId: number; quantity: number }[]
      }
    | undefined
  >(undefined)

  const columns = useMemo(
    () =>
      getColumns(
        async (offer) => {
          // Abrir el mismo modal en modo edición, precargando detalle y productos
          const detail = await offersApi.getById(offer.id)
          setInitialValues({
            id: detail.id,
            title: detail.title,
            description: detail.description ?? '',
            offerDiscountPercentage: detail.offerDiscountPercentage,
            active: detail.active,
            products: detail.products.map((p) => ({
              productId: p.productId,
              quantity: p.quantity,
            })),
          })
          setDialogMode('edit')
          setShowDialog(true)
        },
        (offer) => {
          // Alternar despliegue de productos en la fila
          toggleExpand(offer.id)
        },
        async (offer) => {
          await offersApi.updateActive(offer.id, !offer.active)
          await queryClient.invalidateQueries({ queryKey: [resource] })
          await queryClient.refetchQueries({ queryKey: [resource], type: 'active' })
        }
      ),
    [queryClient, resource]
  )

  if (error) {
    console.error(`Failed to fetch ${resource}:`, error)
  }

  return (
    <>
      <TableListLayout
        columns={columns}
        data={data}
        resource={resource}
        title={title}
        description="Gestión de ofertas especiales."
        pathname={pathname}
        renderRowDetail={(item) => <OfferRowDetail offer={item as OfferList} />}
        isRowExpanded={(item) => expanded.has((item as OfferList).id)}
        onAdd={() => {
          setInitialValues(undefined)
          setDialogMode('create')
          setShowDialog(true)
        }}
      />
      <OfferDialog
        open={showDialog}
        mode={dialogMode}
        initialValues={initialValues}
        onClose={() => setShowDialog(false)}
        onSubmit={async (values, id) => {
          if (dialogMode === 'create') {
            await offersApi.create({
              restaurantId: tenant.restaurantId ?? 1,
              title: values.title,
              description: values.description,
              offerDiscountPercentage: values.offerDiscountPercentage,
              active: values.active,
              products: values.products,
            })
          } else if (id) {
            await offersApi.update(id, {
              title: values.title,
              description: values.description,
              offerDiscountPercentage: values.offerDiscountPercentage,
              active: values.active,
              products: values.products,
            })
          }
          await queryClient.invalidateQueries({ queryKey: [resource] })
          await queryClient.refetchQueries({ queryKey: [resource], type: 'active' })
        }}
      />
    </>
  )
}
