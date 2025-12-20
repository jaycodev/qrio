'use client'

import type { ColumnDef, Row } from '@tanstack/react-table'
import { Phone, User } from 'lucide-react'

import { DataTableRowActions } from '@admin/components/data-table/data-table-row-actions'

import { Badge } from '@/components/ui/badge'
import type { EmployeeList } from '@/lib/schemas/employees/employee.list.schema'
import { withMetaLabelFilter } from '@/lib/utils/components/with-meta-label-filter'
import { withMetaLabelHeader } from '@/lib/utils/components/with-meta-label-header'

export const getColumns = (onEdit?: (emp: EmployeeList) => void): ColumnDef<EmployeeList>[] => {
  return [
    {
      accessorKey: 'name',
      header: withMetaLabelHeader<EmployeeList>(),
      cell: ({ row }) => {
        return (
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{row.original.name}</span>
          </div>
        )
      },
      meta: { searchable: true },
    },
    {
      accessorKey: 'email',
      header: withMetaLabelHeader<EmployeeList>(),
      cell: ({ row }) => <span>{row.original.email}</span>,
      meta: { searchable: true },
    },
    {
      accessorKey: 'phone',
      header: withMetaLabelHeader<EmployeeList>(),
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span>{row.original.phone ?? '-'}</span>
        </div>
      ),
    },
    {
      accessorKey: 'role',
      header: withMetaLabelHeader<EmployeeList>(),
      cell: ({ row }) => <Badge variant="outline">{row.original.role}</Badge>,
      meta: withMetaLabelFilter<EmployeeList>({
        columnId: 'role',
        options: [
          { label: 'Empleado', value: 'EMPLEADO' },
          { label: 'Cocina', value: 'COCINA' },
        ],
      }),
    },
    {
      accessorKey: 'status',
      header: withMetaLabelHeader<EmployeeList>(),
      cell: ({ row }) => {
        const s = row.original.status
        const meta =
          s === 'ACTIVO'
            ? { label: 'Activo', variant: 'default' as const }
            : { label: 'Inactivo', variant: 'secondary' as const }
        return <Badge variant={meta.variant}>{meta.label}</Badge>
      },
      meta: withMetaLabelFilter<EmployeeList>({
        columnId: 'status',
        options: [
          { label: 'Activo', value: 'ACTIVO' },
          { label: 'Inactivo', value: 'INACTIVO' },
        ],
      }),
    },
    {
      id: 'actions',
      cell: ({ row }: { row: Row<EmployeeList> }) => (
        <DataTableRowActions row={row} onEdit={onEdit} />
      ),
    },
  ]
}
