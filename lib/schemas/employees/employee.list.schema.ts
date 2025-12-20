import { z } from 'zod'

export const employeeListSchema = z.object({
  id: z.number(),
  restaurantId: z.number(),
  branchId: z.number().nullable(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().nullable().optional(),
  role: z.string(),
  status: z.string(),
  createdAt: z.coerce.date(),
})

export type EmployeeList = z.infer<typeof employeeListSchema>
