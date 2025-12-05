'use client'

import { useMemo } from 'react'

import { TableListLayout } from '@admin/components/shared/table-list-layout'

import { useListQuery } from '@/hooks/use-list-query'
import type { OfferList } from '@/lib/schemas/offers/offers.list.schema'

import { getColumns } from './columns'
import { offersApi } from '@/lib/api/offers'

interface Props {
  title: string
  pathname: string
  resource: string
}

export function OffersPage({ title, pathname, resource }: Props) {
  const { data, error } = useListQuery<OfferList[]>(pathname, [resource], () => offersApi.getAll(1))

  const columns = useMemo(() => getColumns(), [])

  if (error) {
    console.error(`Failed to fetch ${resource}:`, error)
  }

  return (
    <TableListLayout
      columns={columns}
      data={data}
      resource={resource}
      title={title}
      description="Gestión del inventario y catálogo de productos."
      pathname={pathname}
    />
  )
}
