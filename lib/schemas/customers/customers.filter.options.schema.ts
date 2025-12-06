import { z } from 'zod'

import { filterOptionsArraySchema } from '@/lib/schemas/common/filter-option.schema'

export const customersFilterOptionsSchema = z.object({
  tables: filterOptionsArraySchema,
  customers: filterOptionsArraySchema,
})

export type CustomerFilterOptions = z.infer<typeof customersFilterOptionsSchema>

export type CustomerFilterOptionsParams = Partial<CustomerFilterOptions>
