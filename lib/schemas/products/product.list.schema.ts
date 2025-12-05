import { z } from 'zod'

export const categorySchema = z.object({
  id: z.number(),
  name: z.string(),
})

export const productListSchema = z.object({
  id: z.number(),
  category: categorySchema,
  name: z.string().min(1, 'El nombre del producto no puede estar vacío'),
  description: z.string().optional(),
  price: z.number().positive('El precio debe ser un número positivo'),
  available: z.boolean(),
})

export type ProductList = z.infer<typeof productListSchema>
export type Category = z.infer<typeof categorySchema>
