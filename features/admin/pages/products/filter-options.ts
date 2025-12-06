import { FilterOption } from '@/lib/types'

import { statusBadges } from '../products/badged'

export const statusOptions: FilterOption[] = Object.entries(statusBadges).map(
  ([key, { label, icon }]) => ({
    value: key,
    label,
    icon,
  })
)
