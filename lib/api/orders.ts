import {
  OrderFilterOptions,
  orderFilterOptionsSchema,
} from '@/lib/schemas/order/order.filter.options.schema'
import { type OrderList, orderListSchema } from '@/lib/schemas/order/order.list.schema'

import { apiClient } from './client'

const resource = '/orders'

export const ordersApi = {
  async getAll(restaurantId: number, branchId?: number): Promise<OrderList[]> {
    const query = `restaurantId=${restaurantId}${branchId ? `&branchId=${branchId}` : ''}`
    const data = await apiClient.get(`${resource}?${query}`)
    return orderListSchema.array().parse(data)
  },

  async getFilterOptions(branchId: number): Promise<OrderFilterOptions> {
    const data = await apiClient.get(`${resource}/filter-options?branchId=${branchId}`)
    return orderFilterOptionsSchema.parse(data)
  },
}
