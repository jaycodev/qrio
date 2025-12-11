'use client'

import { useMemo, useState } from 'react'

import { TableListLayout } from '@admin/components/shared/table-list-layout'
import { OfferDialog } from '@admin/components/offers/offer-dialog'

import { useListQuery } from '@/hooks/use-list-query'
import { offersApi } from '@/lib/api/offers'
import type { OfferList } from '@/lib/schemas/offers/offers.list.schema'
import { useQueryClient } from '@tanstack/react-query'

import { getColumns } from './columns'

interface Props {
  title: string
  pathname: string
  resource: string
}

export function OffersPage({ title, pathname, resource }: Props) {
  const { data, error } = useListQuery<OfferList[]>(pathname, [resource], () => offersApi.getAll(1))
  const queryClient = useQueryClient()

  const [showDialog, setShowDialog] = useState(false)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'details'>('create')
  const [selected, setSelected] = useState<OfferList | undefined>(undefined)

  const columns = useMemo(
    () =>
      getColumns(
        (offer) => {
          setSelected(offer)
          setDialogMode('edit')
          setShowDialog(true)
        },
        (offer) => {
          setSelected(offer)
          setDialogMode('details')
          setShowDialog(true)
        }
      ),
    []
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
        onAdd={() => {
          setSelected(undefined)
          setDialogMode('create')
          setShowDialog(true)
        }}
      />
      <OfferDialog
        open={showDialog}
        mode={dialogMode}
        initialValues={selected ? {
          id: selected.id,
          title: selected.title,
          description: selected.description,
          offerDiscountPercentage: selected.offerDiscountPercentage,
          active: selected.active,
          products: [],
        } : undefined}
        onClose={() => setShowDialog(false)}
        onSubmit={async (values, id) => {
          if (dialogMode === 'create') {
            await offersApi.create({
              restaurantId: 1,
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
        }}
      />
    </>
  )
}
