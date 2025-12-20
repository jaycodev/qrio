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
    console.log('[BranchesAPI] getAll -> url:', url, 'restaurantId:', restaurantId)
    const data = await apiClient.get(url)
    console.log('[BranchesAPI] response:', data)
    return branchListSchema.array().parse(data)
  },
  async create(request: CreateBranchRequest): Promise<BranchList> {
    const payload = createBranchRequestSchema.parse(request)
    console.log('[BranchesAPI] create -> payload:', payload)
    const data = await apiClient.post(resource, payload)
    console.log('[BranchesAPI] create response:', data)
    return branchListSchema.parse(data)
  },
}
