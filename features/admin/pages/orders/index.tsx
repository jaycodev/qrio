'use client'

import { useMemo, useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'

import { OrderDialog } from '@admin/components/orders/order-dialog'
import { TableListLayout } from '@admin/components/shared/table-list-layout'

import { useTenant } from '@/app/providers/tenant-provider'
import { useFilterOptions } from '@/hooks/use-filter-options'
import { useListQuery } from '@/hooks/use-list-query'
import { ordersApi } from '@/lib/api/orders'
import { OrderFilterOptions } from '@/lib/schemas/order/order.filter.options.schema'
import type { OrderList } from '@/lib/schemas/order/order.list.schema'

import { getColumns } from './columns'

interface Props {
  title: string
  pathname: string
  resource: string
}

export function OrdersPage({ title, pathname, resource }: Props) {
  const tenant = useTenant()
  const { data, error } = useListQuery<OrderList[]>(
    pathname,
    [resource, String(tenant.branchId ?? '')],
    () => ordersApi.getAll(tenant.branchId ?? 0)
  )
  const { data: filterOptions } = useFilterOptions<OrderFilterOptions>(
    ['orders-filter-options', String(tenant.branchId ?? '')],
    () => ordersApi.getFilterOptions(tenant.branchId ?? 0)
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
        undefined,
        (order) => {
          // Cargar detalle antes de abrir el diálogo
          ordersApi.getById(order.id).then((detail) => {
            setSelected({
              id: detail.id,
              code: order.code,
              table: { id: Number(detail.tableId), number: order.table.number },
              customer: {
                id: Number(detail.customerId),
                code: order.customer.code,
                name: order.customer.name,
              },
              status: order.status,
              total: detail.total,
              people: detail.people,
              itemCount: detail.items.length,
            })

            setDialogMode('details')
            setShowDialog(true)
            // Rehidratar items enriquecidos en el diálogo mediante initialValues
            // (se pasan como parte de initialValues abajo)
          })
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
      />
      <OrderDialog
        open={showDialog}
        mode={dialogMode}
        initialValues={
          selected
            ? {
                id: selected.id,
                customerId: selected.customer.id,
                people: selected.people,
                status: selected.status,
                // Cuando se abre detalles, llenamos items via otro fetch y reseteamos desde el diálogo
                items: [],
              }
            : undefined
        }
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
