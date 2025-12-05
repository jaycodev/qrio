import { title } from 'process'
import { z } from 'zod'

export const offerListSchema = z.object({
  id: z.number(),
  code: z.string(),
  title: z.string(),
  description: z.string().optional(),
  offerDiscountPercentage: z.number(),
  active: z.boolean(),
})

export type OfferList = z.infer<typeof offerListSchema>
