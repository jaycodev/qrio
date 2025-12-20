import { z } from 'zod'

export const createBranchRequestSchema = z.object({
  restaurantId: z.number(),
  name: z.string().min(1, 'El nombre es obligatorio').max(150, 'Máximo 150 caracteres'),
  address: z
    .string()
    .max(255, 'Máximo 255 caracteres')
    .nullable()
    .optional(),
  phone: z
    .string()
    .max(20, 'Máximo 20 caracteres')
    .nullable()
    .optional(),
  schedule: z.string().nullable().optional(),
})

export type CreateBranchRequest = z.infer<typeof createBranchRequestSchema>
