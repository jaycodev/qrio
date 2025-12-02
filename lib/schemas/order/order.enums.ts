import { z } from 'zod'

export const OrderStatus = z.enum(['PENDIENTE', 'EN_PROGRESO', 'COMPLETADO', 'CANCELADO'])
export type OrderStatus = z.infer<typeof OrderStatus>
