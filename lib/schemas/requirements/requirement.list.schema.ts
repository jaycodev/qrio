import { z } from 'zod'

export const requirementListSchema = z.object({
  id: z.number(),
  restaurantId: z.number(),
  userId: z.number(),
  status: z.string(),
  comment: z.string().optional().nullable(),
  createdAt: z.string(),
  reviewedAt: z.string().optional().nullable(),
})

export type RequirementList = z.infer<typeof requirementListSchema>
