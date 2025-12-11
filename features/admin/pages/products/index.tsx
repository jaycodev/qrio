'use client'

import { useMemo, useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'

import { ProductDialog } from '@admin/components/products/product-dialog'
import { TableListLayout } from '@admin/components/shared/table-list-layout'

import { useListQuery } from '@/hooks/use-list-query'
import { productsApi } from '@/lib/api/products'
import type { ProductCreate } from '@/lib/schemas/products/product.create.schema'
import type { ProductList } from '@/lib/schemas/products/product.list.schema'

import { getColumns } from './columns'

interface Props {
  title: string
  pathname: string
  resource: string
}

export function ProductsPage({ title, pathname, resource }: Props) {
  const { data, error } = useListQuery<ProductList[]>(pathname, [resource], () =>
    productsApi.getAll(1)
  )
  const queryClient = useQueryClient()

  const [showDialog, setShowDialog] = useState(false)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'details'>('create')
  const [selected, setSelected] = useState<ProductList | undefined>(undefined)

  const columns = useMemo(
    () =>
      getColumns(
        (product) => {
          setSelected(product)
          setDialogMode('edit')
          setShowDialog(true)
        },
        (product) => {
          setSelected(product)
          setDialogMode('details')
          setShowDialog(true)
        }
      ),
    []
  )

  if (error) {
    console.error(`Failed to fetch ${resource}:`, error)
  }

  return (
    <>
      <TableListLayout
        columns={columns}
        data={data}
        resource={resource}
        title={title}
        description="Gestión del inventario y catálogo de productos."
        pathname={pathname}
        onAdd={() => {
          setSelected(undefined)
          setDialogMode('create')
          setShowDialog(true)
        }}
      />
      <ProductDialog
        open={showDialog}
        mode={dialogMode}
        initialValues={
          selected
            ? {
                id: selected.id,
                name: selected.name,
                description: selected.description,
                price: selected.price,
                categoryId: selected.category.id,
                imageUrl: undefined,
              }
            : undefined
        }
        onClose={() => setShowDialog(false)}
        onSubmit={async (values: ProductCreate, id?: number) => {
          if (dialogMode === 'create') {
            await productsApi.create(values, 1)
          } else if (id) {
            await productsApi.update(id, values, 1)
          }
          await queryClient.invalidateQueries({ queryKey: [resource] })
        }}
      />
    </>
  )
}
