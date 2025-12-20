import { apiClient } from './client'

export interface LoginPayload {
  email: string
  password: string
}

export interface MeResponse {
  id: number
  email: string
  name: string
  role: string
  restaurantId: number | null
  branchId: number | null
}

export const authApi = {
  async login(payload: LoginPayload): Promise<void> {
    await apiClient.post('/auth/login', payload)
  },
  async adminLogin(payload: LoginPayload): Promise<void> {
    await apiClient.post('/auth/admin/login', payload)
  },
  async me(): Promise<MeResponse> {
    return apiClient.get<MeResponse>('/auth/me')
  },
  async logout(): Promise<void> {
    await apiClient.post('/auth/logout')
  },
}
