'use client'

import { useMemo } from 'react'

import { TableListLayout } from '@admin/components/shared/table-list-layout'

import { useListQuery } from '@/hooks/use-list-query'
import { tablesApi } from '@/lib/api/tables'
import type { DiningTableList } from '@/lib/schemas/table/table.list.schema'

import { getColumns } from './columns'

interface Props {
  title: string
  pathname: string
  resource: string
}

export function TablesPage({ title, pathname, resource }: Props) {
  const { data, error } = useListQuery<DiningTableList[]>(pathname, [resource], () =>
    tablesApi.getAll(1)
  )

  const columns = useMemo(() => getColumns(), [])

  if (error) {
    console.error(`Failed to fetch ${resource}:`, error)
  }

  return (
    <TableListLayout
      columns={columns}
      data={data}
      resource={resource}
      title={title}
      description="Gestión de mesas de comedor."
      pathname={pathname}
    />
  )
}
