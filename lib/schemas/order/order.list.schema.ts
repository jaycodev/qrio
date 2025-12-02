import { z } from 'zod'

import { OrderStatus } from './order.enums'

export const orderListSchema = z.object({
  id: z.number(),
  table: z.object({
    id: z.number(),
    number: z.number(),
  }),
  customer: z.object({
    id: z.number(),
    name: z.string(),
  }),
  status: OrderStatus,
  total: z.number(),
  people: z.number(),
  itemCount: z.number(),
})

export type OrderList = z.infer<typeof orderListSchema>
