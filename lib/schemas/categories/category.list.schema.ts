import { z } from 'zod'

export const categorySchema = z.object({
  id: z.number({}).int().positive(),
  name: z.string().min(1, 'El nombre de la categoría no puede estar vacío'),
})

export type CategoryList = z.infer<typeof categorySchema>
