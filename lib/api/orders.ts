import { type OrderList, orderListSchema } from '@/lib/schemas/order/order.list.schema'

import { apiClient } from './client'

export const ordersApi = {
  async getAll(restaurantId: number, branchId?: number): Promise<OrderList[]> {
    const query = `restaurantId=${restaurantId}${branchId ? `&branchId=${branchId}` : ''}`
    const data = await apiClient.get(`/orders?${query}`)
    return orderListSchema.array().parse(data)
  },
}
