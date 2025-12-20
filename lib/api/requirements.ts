import {
  type RequirementList,
  requirementListSchema,
} from '@/lib/schemas/requirements/requirement.list.schema'

import { apiClient } from './client'

const resource = '/restaurant-activations'

export const requirementsApi = {
  async getAll(branchId: number): Promise<RequirementList[]> {
    try {
      const data = await apiClient.get(`${resource}?branchId=${branchId}`)
      console.log('API Response:', data)
      return requirementListSchema.array().parse(data)
    } catch (error) {
      console.error('Error fetching requirements:', error)
      throw error
    }
  },
}
