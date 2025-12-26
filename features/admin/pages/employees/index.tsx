'use client'

import { useMemo, useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'

import { EmployeeDialog } from '@admin/components/employees/employee-dialog'
import { TableListLayout } from '@admin/components/shared/table-list-layout'

import { useTenant } from '@/app/providers/tenant-provider'
import { useListQuery } from '@/hooks/use-list-query'
import { employeesApi } from '@/lib/api/employees'
import type { EmployeeList } from '@/lib/schemas/employees/employee.list.schema'

import { getColumns } from './columns'

interface Props {
  title: string
  pathname: string
  resource: string
}

export function EmployeesPage({ title, pathname, resource }: Props) {
  const tenant = useTenant()
  const { data, error } = useListQuery<EmployeeList[]>(
    pathname,
    [resource, String(tenant.branchId ?? '')],
    () => employeesApi.getAll(tenant.branchId ?? 0)
  )
  const queryClient = useQueryClient()

  const [showDialog, setShowDialog] = useState(false)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create')
  const [selectedDetail, setSelectedDetail] = useState<EmployeeList | undefined>(undefined)
  const [detail, setDetail] = useState<
    import('@/lib/schemas/employees/employee.detail.schema').EmployeeDetail | undefined
  >(undefined)

  const columns = useMemo(
    () =>
      getColumns(async (emp) => {
        const d = await employeesApi.getById(emp.id)
        setSelectedDetail(emp)
        setDetail(d)
        setDialogMode('edit')
        setShowDialog(true)
      }),
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
        description="Gestión de empleados."
        pathname={pathname}
        onAdd={() => {
          setSelectedDetail(undefined)
          setDetail(undefined)
          setDialogMode('create')
          setShowDialog(true)
        }}
      />
      <EmployeeDialog
        open={showDialog}
        mode={dialogMode}
        initialDetail={detail}
        onClose={() => setShowDialog(false)}
        onSubmitted={async () => {
          await queryClient.invalidateQueries({ queryKey: [resource] })
          await queryClient.refetchQueries({ queryKey: [resource], type: 'active' })
        }}
      />
    </>
  )
}
