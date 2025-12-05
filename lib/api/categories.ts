import { categorySchema, type CategoryList } from '@/lib/schemas/categories/category.list.schema'
import { apiClient } from './client'

const resource = '/categories'

export const categoriesApi = {
  async getAll(branchId: number): Promise<CategoryList[]> {
    const data = await apiClient.get(`${resource}?branchId=${branchId}`)
    return categorySchema.array().parse(data)
  },
}
