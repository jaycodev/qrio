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
    // Volver a llamar directamente al backend
    console.log('Logging in with', payload)
    await apiClient.post('/auth/login', payload)
  },
  async me(): Promise<MeResponse> {
    return apiClient.get<MeResponse>('/auth/me')
  },
  async logout(): Promise<void> {
    // Volver a llamar directamente al backend
    await apiClient.post('/auth/logout')
  },
}
