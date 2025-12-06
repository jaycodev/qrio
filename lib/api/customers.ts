import {
  CustomerFilterOptions,
  customersFilterOptionsSchema,
} from '@/lib/schemas/customers/customers.filter.options.schema'
import {
  type CustomerList,
  customerListSchema,
} from '@/lib/schemas/customers/customers.list.schema'

import { apiClient } from './client'

const resource = '/customers'

export const customerApi = {
  async getAll(branchId: number): Promise<CustomerList[]> {
    const data = await apiClient.get(`${resource}?branchId=${branchId}`)
    return customerListSchema.array().parse(data)
  },
}
