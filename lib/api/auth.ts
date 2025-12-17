import { apiClient } from './client'

export interface LoginPayload {
  email: string
  password: string
}

export const authApi = {
  async login(payload: LoginPayload): Promise<void> {
    // Volver a llamar directamente al backend
    console.log('Logging in with', payload)
    await apiClient.post('/auth/login', payload)
  },
  async logout(): Promise<void> {
    // Volver a llamar directamente al backend
    await apiClient.post('/auth/logout')
  },
}
