import { Clock, Loader, type LucideIcon } from 'lucide-react'

export const statusBadges = {
  true: {
    label: 'Disponible',
    icon: Clock,
    variant: 'success',
  },
  false: {
    label: 'No disponible',
    icon: Loader,
    variant: 'warning',
  },
} as const

export type Status = keyof typeof statusBadges

export type StatusBadgeMeta = {
  label: string
  icon: LucideIcon
  variant: string
}
