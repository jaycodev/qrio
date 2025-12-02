'use client'

import { useMemo } from 'react'

import { TableListLayout } from '@admin/components/shared/table-list-layout'

import { useListQuery } from '@/hooks/use-list-query'
import { ordersApi } from '@/lib/api/orders'
import type { OrderList } from '@/lib/schemas/order/order.list.schema'

import { getColumns } from './columns'

interface Props {
  title: string
  pathname: string
  resource: string
}

export function OrdersPage({ title, pathname, resource }: Props) {
  const { data, error } = useListQuery<OrderList[]>(pathname, [resource], () => ordersApi.getAll(1))

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
      description="Rápidos, claros y ordenados."
      pathname={pathname}
    />
  )
}
