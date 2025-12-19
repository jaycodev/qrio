'use client'

import type { ColumnDef, Row } from '@tanstack/react-table'
import { DollarSign, Package, PoundSterling, Tag, TagIcon } from 'lucide-react'

import { DataTableRowActions } from '@admin/components/data-table/data-table-row-actions'

import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import type { Category, ProductList } from '@/lib/schemas/products/product.list.schema'
import { withMetaLabelFilter } from '@/lib/utils/components/with-meta-label-filter'
import { withMetaLabelHeader } from '@/lib/utils/components/with-meta-label-header'

import { statusBadges } from '../products/badged'
import { statusOptions } from '../products/filter-options'

export const getColumns = (
  onEdit?: (product: ProductList) => void,
  onDetails?: (product: ProductList) => void,
  onToggleAvailability?: (product: ProductList, next: boolean) => void
): ColumnDef<ProductList>[] => {
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
      id: 'Name',
      accessorKey: 'name',
      header: withMetaLabelHeader<ProductList>(),
      cell: ({ row }) => {
        const name = row.original.name
        const src = row.original.imageUrl || '/images/placeholders/product.png'
        return (
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 overflow-hidden rounded-md bg-muted">
              <img src={src} alt={name} className="h-9 w-9 object-cover" loading="lazy" />
            </div>
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
      id: 'Price',
      accessorKey: 'price',
      header: withMetaLabelHeader<ProductList>(),
      cell: ({ getValue }) => {
        const price = getValue<number>()

        const formattedPrice = new Intl.NumberFormat('es-PE', {
          style: 'currency',
          currency: 'PEN',
        }).format(price)
        return (
          <Badge variant="outline" className="font-mono">
            <DollarSign className="mr-1 h-3.5 w-3.5" />
            {formattedPrice}
          </Badge>
        )
      },
      meta: {
        headerClass: 'text-center',
        cellClass: 'text-center',
      },
    },
    {
      id: 'Category',
      accessorKey: 'category',
      header: withMetaLabelHeader<ProductList>(),
      cell: ({ getValue }) => {
        const category = getValue<Category>()

        const categoryName = category?.name ?? 'Sin Categoría'

        return (
          <Badge variant="outline" className="font-mono">
            <TagIcon className="mr-1 h-3.5 w-3.5" />
            {categoryName}
          </Badge>
        )
      },
    },
    {
      id: 'Status',
      accessorKey: 'available',
      header: withMetaLabelHeader<ProductList>(),
      cell: ({ row }) => {
        const available = row.original.available ?? false
        const meta = statusBadges[available.toString() as keyof typeof statusBadges]
        const Icon = meta?.icon
        return (
          <div className="flex items-center justify-center gap-2">
            {Icon ? (
              <Badge variant={meta.variant}>
                <Icon className="mr-1" />
                {meta.label}
              </Badge>
            ) : null}
            <Switch
              checked={available}
              onCheckedChange={(next) => onToggleAvailability?.(row.original, !!next)}
              aria-label="Cambiar disponibilidad"
            />
          </div>
        )
      },
      enableSorting: false,
      meta: {
        headerClass: 'text-center',
        cellClass: 'text-center',
        ...withMetaLabelFilter<ProductList>({
          columnId: 'available',
          options: statusOptions,
        }),
      },
    },
    {
      id: 'actions',
      cell: ({ row }: { row: Row<ProductList> }) => (
        <DataTableRowActions row={row} onEdit={onEdit} onDetails={onDetails} />
      ),
    },
  ]
}
