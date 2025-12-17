'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Package } from 'lucide-react'

import { DataTableRowActions } from '@admin/components/data-table/data-table-row-actions'

import { Checkbox } from '@/components/ui/checkbox'
import { CategoryList } from '@/lib/schemas/categories/category.list.schema'
import { withMetaLabelHeader } from '@/lib/utils/components/with-meta-label-header'

export const getColumns = (
  onEdit?: (category: CategoryList) => void,
  onDetails?: (category: CategoryList) => void
): ColumnDef<CategoryList>[] => {
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
      id: 'name',
      accessorKey: 'name',
      header: withMetaLabelHeader<CategoryList>(),
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
      id: 'actions',
      cell: ({ row }) => <DataTableRowActions row={row} onEdit={onEdit} onDetails={onDetails} />,
    },
  ]
}
