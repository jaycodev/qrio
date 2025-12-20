import { z } from 'zod'

export const branchListSchema = z.object({
  id: z.number(),
  code: z.string().nullable().optional(),
  restaurantId: z.number(),
  name: z.string(),
  address: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  schedule: z.string().nullable().optional(),
  createdAt: z.coerce.date(),
})

export type BranchList = z.infer<typeof branchListSchema>
