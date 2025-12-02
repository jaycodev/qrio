import { CheckCircle, Clock, Loader, type LucideIcon, XCircle } from 'lucide-react'

export const statusBadges = {
  PENDIENTE: {
    label: 'Pendiente',
    icon: Clock,
    variant: 'warning',
  },
  EN_PROGRESO: {
    label: 'En progreso',
    icon: Loader,
    variant: 'info',
  },
  COMPLETADO: {
    label: 'Completado',
    icon: CheckCircle,
    variant: 'success',
  },
  CANCELADO: {
    label: 'Cancelado',
    icon: XCircle,
    variant: 'danger',
  },
} as const

export type Status = keyof typeof statusBadges

export type StatusBadgeMeta = {
  label: string
  icon: LucideIcon
  variant: string
}
