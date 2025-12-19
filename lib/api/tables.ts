import { type DiningTableList, diningTableListSchema } from '@/lib/schemas/table/table.list.schema'

import { apiClient } from './client'

const resource = '/tables'

export const tablesApi = {
  async getAll(branchId: number): Promise<DiningTableList[]> {
    const data = await apiClient.get(`${resource}?branchId=${branchId}`)
    return diningTableListSchema.array().parse(data)
  },
  async create(payload: { branchId: number; floor: number; tableNumber?: number; qrCode?: string }): Promise<DiningTableList> {
    const data = await apiClient.post(resource, payload)
    return diningTableListSchema.parse(data)
  },
  async updateFloor(id: number, payload: { floor: number }): Promise<DiningTableList> {
    const data = await apiClient.patch(`${resource}/${id}/floor`, payload)
    return diningTableListSchema.parse(data)
  },
}
