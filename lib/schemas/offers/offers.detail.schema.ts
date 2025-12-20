import { z } from 'zod'

export const offerDetailSchema = z.object({
  id: z.number().int().positive(),
  code: z.string(),
  restaurantId: z.number().int().positive(),
  title: z.string(),
  description: z.string().nullable().optional(),
  offerDiscountPercentage: z.number(),
  active: z.boolean(),
  products: z
    .array(
      z.object({
        productId: z.number().int().positive(),
        quantity: z.number().int().positive(),
      })
    )
    .default([]),
})

export type OfferDetail = z.infer<typeof offerDetailSchema>
