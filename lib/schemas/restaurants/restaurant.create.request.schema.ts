import { z } from 'zod'

export const createRestaurantRequestSchema = z.object({
  adminId: z.number(),
  name: z.string().min(1, 'El nombre es obligatorio').max(150, 'Máximo 150 caracteres'),
  description: z.string().nullable().optional(),
  logoUrl: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
})

export type CreateRestaurantRequest = z.infer<typeof createRestaurantRequestSchema>
