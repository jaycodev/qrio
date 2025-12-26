import { type OrderDetail, orderDetailSchema } from '@/lib/schemas/order/order.detail.schema'
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

  async getById(id: number): Promise<OrderDetail> {
    const data = await apiClient.get(`${resource}/${id}`)
    return orderDetailSchema.parse(data)
  },

  async create(payload: {
    customerId: number
    people: number
    items: { productId: number; quantity: number; unitPrice: number }[]
  }): Promise<OrderList> {
    const data = await apiClient.post(`${resource}`, payload)
    return orderListSchema.parse(data)
  },

  async update(
    id: number,
    payload: {
      customerId: number
      status: string
      people: number
      items: { productId: number; quantity: number; unitPrice: number }[]
    }
  ): Promise<OrderList> {
    const data = await apiClient.put(`${resource}/${id}`, payload)
    return orderListSchema.parse(data)
  },
}
