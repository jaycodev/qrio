'use client'

import { useMemo, useState } from 'react'

import { useForm } from 'react-hook-form'

import { CustomerDialog } from '@admin/components/customers/customer-dialog'
import { TableListLayout } from '@admin/components/shared/table-list-layout'

import { Button } from '@/components/ui/button'
import { useListQuery } from '@/hooks/use-list-query'
import { customerApi } from '@/lib/api/customers'
import type {
  CustomerList,
  customerListSchema,
} from '@/lib/schemas/customers/customers.list.schema'

import { getColumns } from './columns'

interface Props {
  title: string
  pathname: string
  resource: string
}

export function CustomersPage({ title, pathname, resource }: Props) {
  const { data, error } = useListQuery<CustomerList[]>(pathname, [resource], () =>
    customerApi.getAll(1)
  )

  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'details'>('create')
  const [selected, setSelected] = useState<CustomerList | null>(null)

  const columns = useMemo(
    () =>
      getColumns(
        (row) => {
          setSelected(row)
          setDialogMode('edit')
          setDialogOpen(true)
        },
        (row) => {
          setSelected(row)
          setDialogMode('details')
          setDialogOpen(true)
        }
      ),
    []
  )

  const handleAdd = () => {
    setSelected(null)
    setDialogMode('create')
    setDialogOpen(true)
  }

  const onSubmitCreate = async (values: { name: string; email: string }) => {
    await customerApi.create({ name: values.name, email: values.email })
  }

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
        description="Gestión de clientes."
        pathname={pathname}
        onAdd={handleAdd}
      />
      <CustomerDialog
        open={dialogOpen}
        mode={dialogMode}
        initial={selected}
        onClose={() => setDialogOpen(false)}
        onSubmitCreate={onSubmitCreate}
      />
    </>
  )
}
