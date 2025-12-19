import { type CategoryList, categorySchema } from '@/lib/schemas/categories/category.list.schema'

import { apiClient } from './client'

const resource = '/categories'

export const categoriesApi = {
  async getAll(restaurantId: number): Promise<CategoryList[]> {
    const data = await apiClient.get(`${resource}?restaurantId=${restaurantId}`)
    return categorySchema.array().parse(data)
  },
  async create(body: { restaurantId: number; name: string }): Promise<CategoryList> {
    const data = await apiClient.post(resource, body)
    return categorySchema.parse(data)
  },
  async update(id: number, body: { name: string }): Promise<CategoryList> {
    const data = await apiClient.put(`${resource}/${id}`, body)
    return categorySchema.parse(data)
  },
}
