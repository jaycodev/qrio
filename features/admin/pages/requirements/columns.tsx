'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Building, Calendar, MessageSquare, Tag, User } from 'lucide-react'

import { DataTableRowActions } from '@admin/components/data-table/data-table-row-actions'

import { Badge } from '@/components/ui/badge'
import type { RequirementList } from '@/lib/schemas/requirements/requirement.list.schema'
import { withMetaLabelHeader } from '@/lib/utils/components/with-meta-label-header'

export const getColumns = (
  onEdit?: (row: RequirementList) => void,
  onDetails?: (row: RequirementList) => void
): ColumnDef<RequirementList>[] => {
  return [
    {
      accessorKey: 'id',
      header: withMetaLabelHeader<RequirementList>(),
      cell: ({ getValue }) => {
        const id = getValue<number>()
        return (
          <div className="flex items-center gap-2">
            <span className="font-medium">#{id}</span>
          </div>
        )
      },
    },
    {
      accessorKey: 'restaurantId',
      header: withMetaLabelHeader<RequirementList>(),
      cell: ({ getValue }) => {
        const restaurantId = getValue<number>()
        return (
          <Badge variant="outline">
            <Building className="mr-1 h-3 w-3" />
            Restaurante {restaurantId}
          </Badge>
        )
      },
      meta: {
        headerClass: 'text-center',
        cellClass: 'text-center',
      },
    },
    {
      accessorKey: 'userId',
      header: withMetaLabelHeader<RequirementList>(),
      cell: ({ getValue }) => {
        const userId = getValue<number>()
        return (
          <Badge variant="outline">
            <User className="mr-1 h-3 w-3" />
            Usuario {userId}
          </Badge>
        )
      },
      meta: {
        headerClass: 'text-center',
        cellClass: 'text-center',
      },
    },
    {
      accessorKey: 'status',
      header: withMetaLabelHeader<RequirementList>(),
      cell: ({ getValue }) => {
        const status = getValue<string>()
        const statusColors: Record<string, string> = {
          PENDIENTE: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
          APROBADO: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
          RECHAZADO: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
        }
        return (
          <Badge variant="outline" className={statusColors[status] || ''}>
            <Tag className="mr-1 h-3 w-3" />
            {status}
          </Badge>
        )
      },
      meta: {
        headerClass: 'text-center',
        cellClass: 'text-center',
      },
    },
    {
      accessorKey: 'comment',
      header: withMetaLabelHeader<RequirementList>(),
      cell: ({ getValue }) => {
        const comment = getValue<string | null | undefined>()
        return (
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {comment ? (comment.length > 50 ? `${comment.substring(0, 50)}...` : comment) : '-'}
            </span>
          </div>
        )
      },
      meta: {
        searchable: true,
      },
    },
    {
      accessorKey: 'createdAt',
      header: withMetaLabelHeader<RequirementList>(),
      cell: ({ getValue }) => {
        const date = getValue<string>()
        const formattedDate = new Date(date).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
        return (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{formattedDate}</span>
          </div>
        )
      },
      meta: {
        headerClass: 'text-center',
        cellClass: 'text-center',
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => <DataTableRowActions row={row} onEdit={onEdit} onDetails={onDetails} />,
    },
  ]
}
