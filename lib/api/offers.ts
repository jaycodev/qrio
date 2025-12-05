import { OfferList, offerListSchema } from '@/lib/schemas/offers/offers.list.schema'

import { apiClient } from './client'

const resource = '/offers'

export const offersApi = {
  async getAll(branchId: number): Promise<OfferList[]> {
    const data = await apiClient.get(`${resource}?branchId=${branchId}`)
    return offerListSchema.array().parse(data)
  },
}
