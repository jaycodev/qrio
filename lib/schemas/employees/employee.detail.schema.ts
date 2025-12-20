import { z } from 'zod'

export const employeePermissionItemSchema = z.object({
  restaurantId: z.number(),
  branchId: z.number().nullable(),
  permission: z.string(),
})

export const employeeDetailSchema = z.object({
  id: z.number(),
  restaurantId: z.number(),
  branchId: z.number().nullable(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().nullable().optional(),
  role: z.string(),
  status: z.string(),
  createdAt: z.coerce.date(),
  permissions: employeePermissionItemSchema.array().default([]),
})

export type EmployeeDetail = z.infer<typeof employeeDetailSchema>
