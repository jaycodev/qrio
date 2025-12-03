import { type DiningTableList, diningTableListSchema } from '@/lib/schemas/table/table.list.schema'

import { apiClient } from './client'

const resource = '/tables'

export const tablesApi = {
  async getAll(branchId: number): Promise<DiningTableList[]> {
    const data = await apiClient.get(`${resource}?branchId=${branchId}`)
    return diningTableListSchema.array().parse(data)
  },
}
