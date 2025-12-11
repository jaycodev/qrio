'use client'

import { useMemo, useState } from 'react'

import { TableListLayout } from '@admin/components/shared/table-list-layout'
import { OrderDialog } from '@admin/components/orders/order-dialog'

import { useFilterOptions } from '@/hooks/use-filter-options'
import { useListQuery } from '@/hooks/use-list-query'
import { ordersApi } from '@/lib/api/orders'
import { OrderFilterOptions } from '@/lib/schemas/order/order.filter.options.schema'
import type { OrderList } from '@/lib/schemas/order/order.list.schema'
import { useQueryClient } from '@tanstack/react-query'

import { getColumns } from './columns'

interface Props {
  title: string
  pathname: string
  resource: string
}

export function OrdersPage({ title, pathname, resource }: Props) {
  const { data, error } = useListQuery<OrderList[]>(pathname, [resource], () => ordersApi.getAll(1))
  const { data: filterOptions } = useFilterOptions<OrderFilterOptions>(
    ['orders-filter-options'],
    () => ordersApi.getFilterOptions(1)
  )
  const queryClient = useQueryClient()

  const [showDialog, setShowDialog] = useState(false)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'details'>('create')
  const [selected, setSelected] = useState<OrderList | undefined>(undefined)

  const columns = useMemo(
    () =>
      getColumns(
        {
          tables: filterOptions?.tables,
          customers: filterOptions?.customers,
        },
        (order) => {
          setSelected(order)
          setDialogMode('edit')
          setShowDialog(true)
        },
        (order) => {
          setSelected(order)
          setDialogMode('details')
          setShowDialog(true)
        }
      ),
    [filterOptions]
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
        description="Rápidos, claros y ordenados."
        pathname={pathname}
        onAdd={() => {
          setSelected(undefined)
          setDialogMode('create')
          setShowDialog(true)
        }}
      />
      <OrderDialog
        open={showDialog}
        mode={dialogMode}
        initialValues={selected ? {
          id: selected.id,
          customerId: selected.customer.id,
          people: selected.people,
          status: selected.status,
          items: [],
        } : undefined}
        tables={filterOptions?.tables?.map((t) => ({ id: Number(t.value), label: t.label }))}
        customers={filterOptions?.customers?.map((c) => ({ id: Number(c.value), label: c.label }))}
        onClose={() => setShowDialog(false)}
        onSubmit={async (values, id) => {
          if (dialogMode === 'create') {
            await ordersApi.create({
              customerId: values.customerId,
              people: values.people,
              items: values.items,
            })
          } else if (id) {
            await ordersApi.update(id, {
              customerId: values.customerId,
              status: values.status,
              people: values.people,
              items: values.items,
            })
          }
          await queryClient.invalidateQueries({ queryKey: [resource] })
          await queryClient.invalidateQueries({ queryKey: ['orders-filter-options'] })
        }}
      />
    </>
  )
}
