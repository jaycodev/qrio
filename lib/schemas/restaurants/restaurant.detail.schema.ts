import { z } from 'zod'

export const restaurantDetailSchema = z.object({
  id: z.number(),
  code: z.string().nullable().optional(),
  userId: z.number(),
  name: z.string(),
  description: z.string().nullable().optional(),
  logoUrl: z.string().nullable().optional(),
  isActive: z.boolean(),
  createdAt: z.coerce.date(),
})

export type RestaurantDetail = z.infer<typeof restaurantDetailSchema>
