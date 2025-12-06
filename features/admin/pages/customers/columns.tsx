'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Calendar, DollarSign, Mail, Package, PoundSterling, Tag, TagIcon } from 'lucide-react'

import { DataTableRowActions } from '@admin/components/data-table/data-table-row-actions'

import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { CustomerList } from '@/lib/schemas/customers/customers.list.schema'
import { withMetaLabelFilter } from '@/lib/utils/components/with-meta-label-filter'
import { withMetaLabelHeader } from '@/lib/utils/components/with-meta-label-header'

import { statusBadges } from '../customers/badges'
import { statusOptions } from '../customers/filter-options'

export const getColumns = (): ColumnDef<CustomerList>[] => {
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
      id: 'Fire Base UID',
      accessorKey: 'firebaseUid',
      header: withMetaLabelHeader<CustomerList>(),
      cell: ({ row }) => {
        const name = row.original.firebaseUid
        return (
          <div className="flex items-center space-x-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{name}</span>
          </div>
        )
      },
      meta: {
        headerClass: 'text-left',
        cellClass: 'text-left',
        searchable: true,
      },
    },
    {
      id: 'Name',
      accessorKey: 'name',
      header: withMetaLabelHeader<CustomerList>(),
      cell: ({ row }) => {
        const name = row.original.name
        return (
          <div className="flex items-center space-x-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{name}</span>
          </div>
        )
      },
      meta: {
        headerClass: 'text-left',
        cellClass: 'text-left',
        searchable: true,
      },
    },
    {
      id: 'Email ',
      accessorKey: 'email',
      header: withMetaLabelHeader<CustomerList>(),
      cell: ({ getValue }) => {
        const email = getValue<string>()
        return (
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4 text-muted-foreground" />{' '}
            <span className="text-sm font-medium">{email}</span>{' '}
          </div>
        )
      },
      meta: {
        searchable: true,
        headerClass: 'text-left',
        cellClass: 'text-left',
      },
    },
    {
      id: 'CustomerCreatedAt',
      accessorKey: 'createdAt',
      header: withMetaLabelHeader<CustomerList>(),
      cell: ({ getValue }) => {
        const date = getValue<Date>()
        const formattedDate = new Intl.DateTimeFormat('es-PE', {
          dateStyle: 'medium',
          timeStyle: 'short',
        }).format(date)

        return (
          <Badge variant="outline">
            <Calendar className="mr-1 h-3.5 w-3.5" />
            {formattedDate}{' '}
          </Badge>
        )
      },
      meta: {
        headerClass: 'text-center',
        cellClass: 'text-center',
      },
    },
    {
      id: 'Status',
      accessorKey: 'active',
      header: withMetaLabelHeader<CustomerList>(),
      cell: ({ row }) => {
        const meta = statusBadges[row.original.status.toString() as keyof typeof statusBadges]
        if (!meta) return null
        const Icon = meta.icon
        return (
          <Badge variant={meta.variant}>
            <Icon className="mr-1" />
            {meta.label}{' '}
          </Badge>
        )
      },
      enableSorting: false,
      meta: {
        headerClass: 'text-center',
        cellClass: 'text-center',
        ...withMetaLabelFilter<CustomerList>({
          columnId: 'active',
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
