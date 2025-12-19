'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Building, QrCode, Table2 } from 'lucide-react'

import { DataTableRowActions } from '@admin/components/data-table/data-table-row-actions'

import { Badge } from '@/components/ui/badge'
import type { DiningTableList } from '@/lib/schemas/table/table.list.schema'
import { withMetaLabelHeader } from '@/lib/utils/components/with-meta-label-header'

export const getColumns = (
  onEdit?: (row: DiningTableList) => void,
  onDetails?: (row: DiningTableList) => void
): ColumnDef<DiningTableList>[] => {
  return [
    {
      id: 'tableNumber',
      accessorFn: (row) => `Mesa ${row.tableNumber}`,
      header: withMetaLabelHeader<DiningTableList>(),
      cell: ({ row }) => {
        const tableNumber = row.original.tableNumber
        return (
          <Badge variant="outline">
            <Table2 className="mr-1" />
            Mesa {tableNumber}
          </Badge>
        )
      },
      meta: {
        headerClass: 'text-center',
        cellClass: 'text-center',
        searchable: true,
      },
    },
    {
      accessorKey: 'floor',
      header: withMetaLabelHeader<DiningTableList>(),
      cell: ({ getValue }) => {
        const floor = getValue<number>()
        return (
          <Badge variant="outline">
            <Building className="mr-1" />
            Piso {floor}
          </Badge>
        )
      },
      meta: {
        headerClass: 'text-center',
        cellClass: 'text-center',
      },
    },
    {
      accessorKey: 'qrCode',
      header: withMetaLabelHeader<DiningTableList>(),
      cell: ({ getValue }) => {
        const qrCode = getValue<string>()
        return (
          <Badge variant="outline" className="font-mono">
            <QrCode className="mr-1" />
            {qrCode}
          </Badge>
        )
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => <DataTableRowActions row={row} onEdit={onEdit} onDetails={onDetails} />,
    },
  ]
}
