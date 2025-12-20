'use client'

import { useMemo } from 'react'
import { AlertCircle } from 'lucide-react'

import { TableListLayout } from '@admin/components/shared/table-list-layout'

import { useListQuery } from '@/hooks/use-list-query'
import { requirementsApi } from '@/lib/api/requirements'
import type { RequirementList } from '@/lib/schemas/requirements/requirement.list.schema'

import { getColumns } from './columns'

interface Props {
  title: string
  pathname: string
  resource: string
}

export function RequirementsPage({ title, pathname, resource }: Props) {
  const { data, error, isLoading } = useListQuery<RequirementList[]>(pathname, [resource], () =>
    requirementsApi.getAll(1)
  )

  const columns = useMemo(
    () =>
      getColumns(
        (row) => {
          // TODO: Implementar edición de requerimientos
          console.log('Editar requerimiento:', row)
        },
        (row) => {
          // TODO: Implementar detalles de requerimientos
          console.log('Ver detalles de requerimiento:', row)
        }
      ),
    []
  )

  if (error) {
    console.error(`Failed to fetch ${resource}:`, error)
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Ocurrió un error al obtener los requerimientos. Por favor, intenta nuevamente.'

    return (
      <div className="p-6">
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <h3 className="font-semibold">Error al cargar requerimientos</h3>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{errorMessage}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Revisa la consola del navegador para más detalles.
          </p>
        </div>
      </div>
    )
  }

  return (
    <TableListLayout
      columns={columns}
      data={data}
      resource={resource}
      title={title}
      description="Lista de requerimientos del sistema."
      pathname={pathname}
    />
  )
}
