'use client'

import { useMemo, useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'

import { ProductDialog } from '@admin/components/products/product-dialog'
import { TableListLayout } from '@admin/components/shared/table-list-layout'

import { useTenant } from '@/app/providers/tenant-provider'
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
  const tenant = useTenant()
  const { data, error } = useListQuery<ProductList[]>(
    pathname,
    [resource, String(tenant.branchId ?? '')],
    () => productsApi.getAll(tenant.branchId ?? 0)
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
        },
        async (product, next) => {
          await productsApi.setAvailability(product.id, 1, next)
          await queryClient.invalidateQueries({ queryKey: [resource] })
        }
      ),
    [queryClient]
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
                imageUrl: selected.imageUrl ?? '',
              }
            : undefined
        }
        onClose={() => setShowDialog(false)}
        onSubmit={async (values: ProductCreate, id?: number) => {
          if (dialogMode === 'create') {
            await productsApi.create(values, tenant.branchId ?? 0)
          } else if (id) {
            await productsApi.update(id, values, tenant.branchId ?? 0)
          }
          await queryClient.invalidateQueries({ queryKey: [resource] })
        }}
      />
    </>
  )
}
