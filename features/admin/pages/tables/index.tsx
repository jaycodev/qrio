'use client'

import { useMemo, useState } from 'react'

import { useForm } from 'react-hook-form'

import { TableListLayout } from '@admin/components/shared/table-list-layout'
import { TableDialog } from '@admin/components/tables/table-dialog'

import { Button } from '@/components/ui/button'
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

  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'details'>('create')
  const [selected, setSelected] = useState<DiningTableList | null>(null)

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

  const form = useForm<{ tableNumber: number; floor: number }>({
    defaultValues: { tableNumber: 0 as unknown as number, floor: 1 },
  })

  const handleAdd = () => {
    setSelected(null)
    setDialogMode('create')
    setDialogOpen(true)
  }

  const onSubmit = async (values: { tableNumber: number; floor: number }) => {
    await tablesApi.create({ tableNumber: Number(values.tableNumber), floor: Number(values.floor) })
    setDialogOpen(false)
    form.reset({ tableNumber: 0 as unknown as number, floor: 1 })
    // Optionally invalidate query via react-query if available in scope
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
        description="Gestión de mesas de comedor."
        pathname={pathname}
        onAdd={handleAdd}
      />
      <TableDialog
        open={dialogOpen}
        mode={dialogMode}
        initial={selected}
        onClose={() => setDialogOpen(false)}
        onSubmitCreate={async (payload) => {
          await tablesApi.create(payload)
        }}
      />
    </>
  )
}
