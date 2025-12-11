import { z } from 'zod'

export const customerListSchema = z.object({
  id: z.number(),
  name: z.string(),
  firebaseUid: z.string(),
  email: z.string(),
  status: z.string(),
  createdAt: z.coerce.date(),
})

export type CustomerList = z.infer<typeof customerListSchema>
