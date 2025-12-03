import { z } from 'zod'

export const diningTableListSchema = z.object({
  id: z.number(),
  tableNumber: z.number(),
  floor: z.number(),
  qrCode: z.string(),
})

export type DiningTableList = z.infer<typeof diningTableListSchema>
