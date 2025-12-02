'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { HandPlatter, Hash, Users, UtensilsCrossed } from 'lucide-react'

import { DataTableRowActions } from '@admin/components/data-table/data-table-row-actions'

import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import type { OrderFilterOptionsParams } from '@/lib/schemas/order/order.filter.options.schema'
import type { OrderList } from '@/lib/schemas/order/order.list.schema'
import { withMetaLabelFilter } from '@/lib/utils/components/with-meta-label-filter'
import { withMetaLabelHeader } from '@/lib/utils/components/with-meta-label-header'

import { statusBadges } from './badges'
import { statusOptions } from './filter-options'

export const getColumns = (options?: OrderFilterOptionsParams): ColumnDef<OrderList>[] => {
  const { tables: tablesOptions = [], customers: customersOptions = [] } = options ?? {}

  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Seleccionar todo"
          className="translate-y-0.5"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Seleccionar fila"
          className="translate-y-0.5"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'code',
      header: withMetaLabelHeader<OrderList>(),
      cell: ({ getValue }) => {
        const code = getValue<string>()
        return (
          <Badge variant="outline" className="font-mono">
            <HandPlatter className="mr-1" />
            {code}
          </Badge>
        )
      },
      meta: {
        searchable: true,
      },
    },
    {
      id: 'table',
      accessorFn: (row) => String(row.table.id),
      header: withMetaLabelHeader<OrderList>(),
      cell: ({ row }) => {
        const number = row.original.table.number
        return (
          <Badge variant="outline">
            <Hash className="mr-1" />
            Mesa {number}
          </Badge>
        )
      },
      enableSorting: false,
      meta: withMetaLabelFilter<OrderList>({
        columnId: 'table',
        options: tablesOptions,
      }),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      id: 'customer',
      accessorFn: (row) => String(row.customer.id),
      header: withMetaLabelHeader<OrderList>(),
      cell: ({ row }) => {
        const name = row.original.customer.name
        return <span>{name}</span>
      },
      meta: {
        ...withMetaLabelFilter<OrderList>({
          columnId: 'customer',
          options: customersOptions,
        }),
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: 'people',
      header: withMetaLabelHeader<OrderList>(),
      cell: ({ getValue }) => {
        const people = getValue<number>()
        return (
          <Badge variant="outline">
            <Users className="mr-1" />
            {people}
          </Badge>
        )
      },
      meta: {
        headerClass: 'text-center',
        cellClass: 'text-center',
      },
    },
    {
      accessorKey: 'itemCount',
      header: withMetaLabelHeader<OrderList>(),
      cell: ({ getValue }) => {
        const itemCount = getValue<number>()
        return (
          <Badge variant="outline">
            <UtensilsCrossed className="mr-1" />
            {itemCount}
          </Badge>
        )
      },
      meta: {
        headerClass: 'text-center',
        cellClass: 'text-center',
      },
    },
    {
      accessorKey: 'total',
      header: withMetaLabelHeader<OrderList>(),
      cell: ({ getValue }) => {
        const total = getValue<number>()
        const formatted = `S/. ${total.toFixed(2)}`

        return <Badge variant="outline">{formatted}</Badge>
      },
      meta: {
        headerClass: 'text-center',
        cellClass: 'text-center',
      },
    },
    {
      accessorKey: 'status',
      header: withMetaLabelHeader<OrderList>(),
      cell: ({ row }) => {
        const meta = statusBadges[row.original.status]

        if (!meta) return null
        const Icon = meta.icon

        return (
          <Badge variant={meta.variant}>
            <Icon className="mr-1" />
            {meta.label}
          </Badge>
        )
      },
      enableSorting: false,
      meta: {
        headerClass: 'text-center',
        cellClass: 'text-center',
        ...withMetaLabelFilter<OrderList>({
          columnId: 'status',
          options: statusOptions,
        }),
      },
    },
    {
      id: 'actions',
      cell: () => <DataTableRowActions />,
    },
  ]
}
