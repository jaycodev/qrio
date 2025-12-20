import {
  type EmployeeDetail,
  employeeDetailSchema,
} from '@/lib/schemas/employees/employee.detail.schema'
import { type EmployeeList, employeeListSchema } from '@/lib/schemas/employees/employee.list.schema'

import { apiClient } from './client'

const resource = '/users/employees'

export const employeesApi = {
  async getAll(branchId: number): Promise<EmployeeList[]> {
    const data = await apiClient.get(`${resource}?branchId=${branchId}`)
    return employeeListSchema.array().parse(data)
  },
  async getById(id: number): Promise<EmployeeDetail> {
    const data = await apiClient.get(`${resource}/${id}`)
    return employeeDetailSchema.parse(data)
  },
  async create(payload: {
    email: string
    password: string
    name: string
    phone?: string | null
    restaurantId: number
    branchId?: number | null
    role: string
    status?: string
    permissions?: Array<{ restaurantId: number; branchId?: number | null; permission: string }>
  }): Promise<EmployeeList> {
    const data = await apiClient.post(resource, payload)
    return employeeListSchema.parse(data)
  },
  async update(
    id: number,
    payload: {
      name: string
      phone?: string | null
      branchId?: number | null
      role: string
      status: string
      permissions?: Array<{ restaurantId: number; branchId?: number | null; permission: string }>
    }
  ): Promise<EmployeeList> {
    const data = await apiClient.put(`${resource}/${id}`, payload)
    return employeeListSchema.parse(data)
  },
}
