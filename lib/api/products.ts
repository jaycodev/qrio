import {
  type ProductCreate,
  productCreateSchema,
} from '@/lib/schemas/products/product.create.schema'
import {
  type ProductDetail,
  productDetailSchema,
} from '@/lib/schemas/products/product.detail.schema'
import { type ProductList, productListSchema } from '@/lib/schemas/products/product.list.schema'

import { apiClient } from './client'

const resource = '/products'

export const productsApi = {
  async getAll(branchId: number): Promise<ProductList[]> {
    const data = await apiClient.get(`${resource}?branchId=${branchId}`)
    return productListSchema.array().parse(data)
  },
}
