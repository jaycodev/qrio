import { z } from 'zod'

export const CustomerStatus = z.enum(['ACTIVO', 'INACTIVO'])
export type CustomerStatus = z.infer<typeof CustomerStatus>
