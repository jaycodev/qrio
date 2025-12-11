import { type DiningTableList, diningTableListSchema } from '@/lib/schemas/table/table.list.schema'

import { apiClient } from './client'

const resource = '/tables'

export const tablesApi = {
  async getAll(branchId: number): Promise<DiningTableList[]> {
    const data = await apiClient.get(`${resource}?branchId=${branchId}`)
    return diningTableListSchema.array().parse(data)
  },
  async create(payload: { tableNumber: number; floor: number }): Promise<DiningTableList> {
    const data = await apiClient.post(resource, payload)
    return diningTableListSchema.parse(data)
  },
}
