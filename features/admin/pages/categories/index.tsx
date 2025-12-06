'use client'

import { useMemo } from 'react'

import { TableListLayout } from '@admin/components/shared/table-list-layout'

import { useListQuery } from '@/hooks/use-list-query'
import { categoriesApi } from '@/lib/api/categories'
import type { CategoryList } from '@/lib/schemas/categories/category.list.schema'

import { getColumns } from './columns'

interface Props {
  title: string
  pathname: string
  resource: string
}

export function CategoryPage({ title, pathname, resource }: Props) {
  const { data, error } = useListQuery<CategoryList[]>(pathname, [resource], () =>
    categoriesApi.getAll(1)
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
      description="Gestión del inventario y catálogo de productos."
      pathname={pathname}
    />
  )
}
