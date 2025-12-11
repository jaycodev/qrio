'use client'

import { useMemo, useState } from 'react'

import { TableListLayout } from '@admin/components/shared/table-list-layout'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'

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

  const [open, setOpen] = useState(false)
  const form = useForm<{ name: string }>({ defaultValues: { name: '' } })

  const handleAdd = async () => {
    setOpen(true)
  }

  const onSubmit = async (values: { name: string }) => {
    await categoriesApi.create({ name: values.name })
    form.reset()
    setOpen(false)
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
            <DialogTitle>Agregar Categoría</DialogTitle>
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
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                <Button type="submit">Agregar</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
