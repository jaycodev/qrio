import { z } from 'zod'

export const orderDetailSchema = z.object({
  id: z.number(),
  tableId: z.number(),
  customerId: z.number(),
  status: z.string(),
  total: z.number(),
  people: z.number(),
  items: z.array(
    z.object({
      productId: z.number(),
      productName: z.string(),
      productImageUrl: z.string().url().optional().nullable(),
      quantity: z.number(),
      unitPrice: z.number(),
      subtotal: z.number(),
    })
  ),
})

export type OrderDetail = z.infer<typeof orderDetailSchema>
