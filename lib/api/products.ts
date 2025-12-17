import { type ProductCreate } from '@/lib/schemas/products/product.create.schema'
import { type ProductList, productListSchema } from '@/lib/schemas/products/product.list.schema'

import { apiClient } from './client'

const resource = '/products'

export const productsApi = {
  async getAll(branchId: number): Promise<ProductList[]> {
    const data = await apiClient.get(`${resource}?branchId=${branchId}`)
    return productListSchema.array().parse(data)
  },
  async create(payload: ProductCreate, branchId: number): Promise<ProductList> {
    const data = await apiClient.post(`${resource}?branchId=${branchId}`, payload)
    return productListSchema.parse(data)
  },
  async update(id: number, payload: ProductCreate, branchId: number): Promise<ProductList> {
    const data = await apiClient.put(`${resource}/${id}?branchId=${branchId}`, payload)
    return productListSchema.parse(data)
  },
}
