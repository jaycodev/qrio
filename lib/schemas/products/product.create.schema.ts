import { z } from 'zod'

export const productCreateSchema = z.object({
  categoryId: z.number({}).int().positive(),
  name: z.string().min(1, 'El nombre del producto no puede estar vacío'),
  description: z.string().optional().nullable(),
  price: z.number({}).positive('El precio debe ser un número positivo'),
  imageUrl: z.string().url('Debe ser una URL válida').optional().nullable(),
})

export type ProductCreate = z.infer<typeof productCreateSchema>
