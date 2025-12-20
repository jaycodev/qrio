'use client'

import * as React from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { employeesApi } from '@/lib/api/employees'
import { useTenant } from '@/app/providers/tenant-provider'
import type { EmployeeDetail } from '@/lib/schemas/employees/employee.detail.schema'

const employeeCreateSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  name: z.string().min(1, 'Nombre requerido'),
  phone: z.string().optional(),
  restaurantId: z.number(),
  branchId: z.number().optional(),
  role: z.enum(['EMPLEADO', 'COCINA']),
  status: z.enum(['ACTIVO', 'INACTIVO']).optional(),
})

const employeeUpdateSchema = z.object({
  name: z.string().min(1, 'Nombre requerido'),
  phone: z.string().optional(),
  branchId: z.number().optional(),
  role: z.enum(['EMPLEADO', 'COCINA']),
  status: z.enum(['ACTIVO', 'INACTIVO']),
})

type CreateValues = z.infer<typeof employeeCreateSchema>
type UpdateValues = z.infer<typeof employeeUpdateSchema>

interface Props {
  open: boolean
  mode: 'create' | 'edit'
  initialDetail?: EmployeeDetail
  onClose: () => void
  onSubmitted: () => Promise<void>
}

export function EmployeeDialog({ open, mode, initialDetail, onClose, onSubmitted }: Props) {
  const tenant = useTenant()
  const form = useForm<CreateValues | UpdateValues>({
    resolver: zodResolver(mode === 'create' ? employeeCreateSchema : employeeUpdateSchema),
    mode: 'onChange',
    defaultValues:
      mode === 'create'
        ? ({
            email: '',
            password: '',
            name: '',
            phone: '',
            restaurantId: tenant.restaurantId ?? 0,
            branchId: tenant.branchId ?? undefined,
            role: 'EMPLEADO',
            status: 'ACTIVO',
          } as CreateValues)
        : ({
            name: initialDetail?.name ?? '',
            phone: initialDetail?.phone ?? '',
            branchId: initialDetail?.branchId ?? undefined,
            role: (initialDetail?.role as 'EMPLEADO' | 'COCINA') ?? 'EMPLEADO',
            status: (initialDetail?.status as 'ACTIVO' | 'INACTIVO') ?? 'ACTIVO',
          } as UpdateValues),
  })

  React.useEffect(() => {
    if (open) {
      if (mode === 'edit' && initialDetail) {
        form.reset({
          name: initialDetail.name,
          phone: initialDetail.phone ?? '',
          branchId: initialDetail.branchId ?? undefined,
          role: (initialDetail.role as 'EMPLEADO' | 'COCINA') ?? 'EMPLEADO',
          status: (initialDetail.status as 'ACTIVO' | 'INACTIVO') ?? 'ACTIVO',
        } as UpdateValues)
      } else if (mode === 'create') {
        form.reset({
          email: '',
          password: '',
          name: '',
          phone: '',
          restaurantId: tenant.restaurantId ?? 0,
          branchId: tenant.branchId ?? undefined,
          role: 'EMPLEADO',
          status: 'ACTIVO',
        } as CreateValues)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, mode, initialDetail?.id, tenant.restaurantId, tenant.branchId])

  const [submitting, setSubmitting] = React.useState(false)

  const handleSubmit = async (values: CreateValues | UpdateValues) => {
    setSubmitting(true)
    try {
      if (mode === 'create') {
        const v = values as CreateValues
        await employeesApi.create({
          email: v.email,
          password: v.password,
          name: v.name,
          phone: v.phone,
          restaurantId: v.restaurantId,
          branchId: v.branchId,
          role: v.role,
          status: v.status,
          permissions: [],
        })
      } else if (initialDetail) {
        const v = values as UpdateValues
        await employeesApi.update(initialDetail.id, {
          name: v.name,
          phone: v.phone,
          branchId: v.branchId,
          role: v.role,
          status: v.status,
          permissions: initialDetail.permissions?.map((p) => ({
            restaurantId: p.restaurantId,
            branchId: p.branchId ?? undefined,
            permission: p.permission,
          })),
        })
      }
      await onSubmitted()
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  const isEdit = mode === 'edit'

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar Empleado' : 'Agregar Empleado'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
            {!isEdit && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="empleado@qrio.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="********" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre del empleado" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <Input placeholder="999999999" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rol</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EMPLEADO">Empleado</SelectItem>
                        <SelectItem value="COCINA">Cocina</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVO">Activo</SelectItem>
                        <SelectItem value="INACTIVO">Inactivo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={
                  submitting || !form.formState.isValid || (isEdit && !form.formState.isDirty)
                }
              >
                {isEdit ? 'Guardar cambios' : 'Agregar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
