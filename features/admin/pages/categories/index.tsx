'use client'

import { useMemo, useState } from 'react'

import { useForm } from 'react-hook-form'

import { TableListLayout } from '@admin/components/shared/table-list-layout'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useListQuery } from '@/hooks/use-list-query'
import { categoriesApi } from '@/lib/api/categories'
import { useTenant } from '@/app/providers/tenant-provider'
import type { CategoryList } from '@/lib/schemas/categories/category.list.schema'

import { getColumns } from './columns'

interface Props {
  title: string
  pathname: string
  resource: string
}

export function CategoryPage({ title, pathname, resource }: Props) {
  const tenant = useTenant()
  const { data, error, refetch } = useListQuery<CategoryList[]>(
    pathname,
    [resource, String(tenant.restaurantId ?? '')],
    () => (tenant.restaurantId ? categoriesApi.getAll(tenant.restaurantId) : Promise.resolve([]))
  )

  const [selected, setSelected] = useState<CategoryList | null>(null)
  const [mode, setMode] = useState<'create' | 'edit'>('create')
  const columns = useMemo(
    () =>
      getColumns((category) => {
        setSelected(category)
        setMode('edit')
        setOpen(true)
        form.reset({ name: category.name })
      }, undefined),
    []
  )

  const [open, setOpen] = useState(false)
  const form = useForm<{ name: string }>({ defaultValues: { name: '' } })

  const handleAdd = async () => {
    setSelected(null)
    setMode('create')
    form.reset({ name: '' })
    setOpen(true)
  }

  const onSubmit = async (values: { name: string }) => {
    if (mode === 'create') {
      await categoriesApi.create({ restaurantId: tenant.restaurantId ?? 0, name: values.name })
    } else if (mode === 'edit' && selected?.id) {
      await categoriesApi.update(selected.id, { name: values.name })
    }
    form.reset()
    setOpen(false)
    // Refrescar datos inmediatamente tras crear
    await refetch()
    // naive refetch: reload route query by window focus behavior; alternatively integrate react-query invalidate
    // For now, rely on refetchOnWindowFocus or add explicit reload:
    // location.reload()
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
        description="Gestión del inventario y catálogo de productos."
        pathname={pathname}
        onAdd={handleAdd}
      />

      {/* Inline simple dialog to add category */}
      <Dialog open={open} onOpenChange={(v) => !v && setOpen(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{mode === 'edit' ? 'Editar Categoría' : 'Agregar Categoría'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                rules={{ required: 'El nombre es requerido' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre de la categoría" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">{mode === 'edit' ? 'Guardar' : 'Agregar'}</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
