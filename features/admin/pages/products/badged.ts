import { CheckCircle, Clock, Loader, type LucideIcon, XCircle } from 'lucide-react'

export const statusBadges = {
  true: {
    label: 'Disponible',
    icon: CheckCircle,
    variant: 'success',
  },
  false: {
    label: 'No disponible',
    icon: XCircle,
    variant: 'warning',
  },
} as const

export type Status = keyof typeof statusBadges

export type StatusBadgeMeta = {
  label: string
  icon: LucideIcon
  variant: string
}
