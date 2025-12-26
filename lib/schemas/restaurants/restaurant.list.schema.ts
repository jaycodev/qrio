import { z } from 'zod'

export const restaurantListSchema = z.object({
  id: z.number(),
  code: z.string().nullable().optional(),
  userId: z.number(),
  name: z.string(),
  logoUrl: z.string().nullable().optional(),
  isActive: z.boolean(),
})

export type RestaurantList = z.infer<typeof restaurantListSchema>
