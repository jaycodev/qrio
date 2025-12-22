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
}

export interface UserBranchResponse {
  restaurant?: {
    id: number
    name: string
  } | null
  branch?: {
    id: number
    name: string
  } | null
}

export const authApi = {
  async login(payload: LoginPayload): Promise<void> {
    if (typeof window !== 'undefined') {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'same-origin',
      })
      if (!res.ok) throw new Error('Login failed')
      return
    }
    await apiClient.post('/auth/login', payload)
  },
  async adminLogin(payload: LoginPayload): Promise<void> {
    if (typeof window !== 'undefined') {
      const res = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'same-origin',
      })
      if (!res.ok) throw new Error('Admin login failed')
      return
    }
    await apiClient.post('/auth/admin/login', payload)
  },
  async me(): Promise<MeResponse> {
    return apiClient.get<MeResponse>('/auth/me')
  },
  async branches(): Promise<UserBranchResponse[]> {
    if (typeof window !== 'undefined') {
      const res = await fetch('/api/auth/branches', { credentials: 'same-origin' })
      if (!res.ok) throw new Error('Failed to fetch branches')
      return res.json()
    }
    return apiClient.get<UserBranchResponse[]>('/auth/branches')
  },
  async logout(): Promise<void> {
    if (typeof window !== 'undefined') {
      const res = await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' })
      if (!res.ok) throw new Error('Logout failed')
      return
    }
    await apiClient.post('/auth/logout')
  },
}
