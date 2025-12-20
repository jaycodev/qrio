import { type BranchList, branchListSchema } from '@/lib/schemas/branches/branch.list.schema'

import {
  type CreateBranchRequest,
  createBranchRequestSchema,
} from '../schemas/branches/branch.create.request.schema'
import { apiClient } from './client'

const resource = '/branches'

export const branchesApi = {
  async getAll(restaurantId?: number): Promise<BranchList[]> {
    const url = restaurantId ? `${resource}?restaurantId=${restaurantId}` : resource
    const data = await apiClient.get(url)
    return branchListSchema.array().parse(data)
  },
  async create(request: CreateBranchRequest): Promise<BranchList> {
    const payload = createBranchRequestSchema.parse(request)
    const data = await apiClient.post(resource, payload)
    return branchListSchema.parse(data)
  },
}
