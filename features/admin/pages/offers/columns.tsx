'use client'

import type { ColumnDef, Row } from '@tanstack/react-table'
import { HandPlatter, Package } from 'lucide-react'

import { DataTableRowActions } from '@admin/components/data-table/data-table-row-actions'

import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { OfferList } from '@/lib/schemas/offers/offers.list.schema'
import { withMetaLabelFilter } from '@/lib/utils/components/with-meta-label-filter'
import { withMetaLabelHeader } from '@/lib/utils/components/with-meta-label-header'

import { statusOptions } from '../offers/filter-options'
import { statusBadges } from '../products/badged'

export const getColumns = (
  onEdit?: (offer: OfferList) => void,
  onDetails?: (offer: OfferList) => void,
  onToggleActive?: (offer: OfferList) => void
): ColumnDef<OfferList>[] => {
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
      header: withMetaLabelHeader<OfferList>(),
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
      accessorKey: 'Title',
      header: withMetaLabelHeader<OfferList>(),
      cell: ({ row }) => {
        const name = row.original.title
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
      id: 'Description',
      accessorKey: 'description',
      header: withMetaLabelHeader<OfferList>(),
      cell: ({ row }) => {
        const name = row.original.description
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
      id: 'discount',
      accessorKey: 'offerDiscountPercentage',
      header: withMetaLabelHeader<OfferList>(),
      cell: ({ getValue }) => {
        const discount = getValue<number>()

        return <span className="font-bold text-md">{discount}%</span>
      },
      meta: {
        headerClass: 'text-center',
        cellClass: 'text-center',
      },
    },
    {
      accessorKey: 'Estado',
      header: withMetaLabelHeader<OfferList>(),
      cell: ({ row }) => {
        const meta = statusBadges[row.original.active.toString() as keyof typeof statusBadges]
        if (!meta) return null
        return (
          <div className="flex items-center justify-center gap-2">
            <Switch
              checked={row.original.active}
              onCheckedChange={() => onToggleActive?.(row.original)}
              aria-label="Cambiar estado"
            />
            <Badge variant={meta.variant}>{meta.label}</Badge>
          </div>
        )
      },
      enableSorting: false,
      meta: {
        headerClass: 'text-center',
        cellClass: 'text-center',
        ...withMetaLabelFilter<OfferList>({
          columnId: 'status',
          options: statusOptions,
        }),
      },
    },
    {
      id: 'actions',
      cell: ({ row }: { row: Row<OfferList> }) => (
        <DataTableRowActions row={row} onEdit={onEdit} onDetails={onDetails} />
      ),
    },
  ]
}
