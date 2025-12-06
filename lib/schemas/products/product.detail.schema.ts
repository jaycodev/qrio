import { z } from 'zod'

export const categorySchema = z.object({
  id: z.number(),
  name: z.string(),
})
export type Category = z.infer<typeof categorySchema>

export const productDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  price: z.number(),
  image_url: z.string().optional(),
  category: categorySchema,
})

export type ProductDetail = z.infer<typeof productDetailSchema>
