import {
  OrderFilterOptions,
  orderFilterOptionsSchema,
} from '@/lib/schemas/order/order.filter.options.schema'
import { type OrderList, orderListSchema } from '@/lib/schemas/order/order.list.schema'

import { apiClient } from './client'

const resource = '/orders'

export const ordersApi = {
  async getAll(branchId: number): Promise<OrderList[]> {
    const data = await apiClient.get(`${resource}?branchId=${branchId}`)
    return orderListSchema.array().parse(data)
  },

  async getFilterOptions(branchId: number): Promise<OrderFilterOptions> {
    const data = await apiClient.get(`${resource}/filter-options?branchId=${branchId}`)
    return orderFilterOptionsSchema.parse(data)
  },
}
