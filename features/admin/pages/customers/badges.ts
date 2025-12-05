import { CheckCircle, Clock, Loader, type LucideIcon, XCircle } from 'lucide-react'

export const statusBadges = {
  ACTIVO: {
    label: 'Activo',
    icon: Clock,
    variant: 'success',
  },
  INACTIVO: {
    label: 'Inactivo',
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
