import { z } from 'zod'

import { filterOptionsArraySchema } from '@/lib/schemas/common/filter-option.schema'

export const orderFilterOptionsSchema = z.object({
  tables: filterOptionsArraySchema,
  customers: filterOptionsArraySchema,
})

export type OrderFilterOptions = z.infer<typeof orderFilterOptionsSchema>

export type OrderFilterOptionsParams = Partial<OrderFilterOptions>
