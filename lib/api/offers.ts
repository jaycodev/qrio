import { OfferDetail, offerDetailSchema } from '@/lib/schemas/offers/offers.detail.schema'
import { OfferList, offerListSchema } from '@/lib/schemas/offers/offers.list.schema'

import { apiClient } from './client'

const resource = '/offers'

export const offersApi = {
  async getAll(branchId: number): Promise<OfferList[]> {
    const data = await apiClient.get(`${resource}?branchId=${branchId}`)
    return offerListSchema.array().parse(data)
  },
  async getById(id: number): Promise<OfferDetail> {
    const data = await apiClient.get(`${resource}/${id}`)
    return offerDetailSchema.parse(data)
  },
  async create(payload: {
    restaurantId: number
    title: string
    description?: string
    offerDiscountPercentage: number
    active: boolean
    products: { productId: number; quantity: number }[]
  }): Promise<OfferList> {
    const data = await apiClient.post(`${resource}`, payload)
    return offerListSchema.parse(data)
  },
  async update(
    id: number,
    payload: {
      title: string
      description?: string
      offerDiscountPercentage: number
      active: boolean
      products: { productId: number; quantity: number }[]
    }
  ): Promise<OfferList> {
    const data = await apiClient.put(`${resource}/${id}`, payload)
    return offerListSchema.parse(data)
  },
  async updateActive(id: number, active: boolean): Promise<boolean> {
    const data = await apiClient.patch(`${resource}/${id}/active`, { active })
    return Boolean(data)
  },
}
