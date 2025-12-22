import { config } from '@/config'
import { ApiError, ApiResponse } from '@/lib/schemas/common/api-response.schema'

let sessionExpiredRedirected = false

export class ApiClientError extends Error {
  constructor(
    public status: number,
    public path: string,
    message: string,
    public errors?: ApiError['errors']
  ) {
    super(message)
  }

  static fromApiError(error: ApiError) {
    return new ApiClientError(error.status, error.path, error.message, error.errors)
  }
}

export class ApiClient {
  constructor(private baseUrl: string = config.api.baseUrl) {}

  private async refreshAccessToken(): Promise<boolean> {
    try {
      const url =
        typeof window !== 'undefined' ? '/api/auth/refresh' : `${this.baseUrl}/auth/refresh`
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })
      return res.ok
    } catch {
      return false
    }
  }

  private async handleSessionExpired(): Promise<void> {
    if (sessionExpiredRedirected) {
      return
    }
    sessionExpiredRedirected = true

    try {
      const refreshed = await this.refreshAccessToken()
      if (refreshed) {
        sessionExpiredRedirected = false
        return
      }
    } catch {}

    try {
      if (typeof window !== 'undefined') {
        await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' })
      } else {
        await fetch(`${this.baseUrl}/auth/logout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        })
      }
    } catch {}

    if (typeof window !== 'undefined') {
      try {
        const url = new URL('/iniciar-sesion', window.location.origin)
        window.location.href = url.toString()
      } catch {
        window.location.href = '/iniciar-sesion'
      }
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const isBrowser = typeof window !== 'undefined'
    let url: string
    if (isBrowser && endpoint.startsWith('/')) {
      url = `/api${endpoint}`
    } else {
      url = `${this.baseUrl}${endpoint}`
    }
    const devToken = config.dev?.accessToken
    const isAuthEndpoint = endpoint.startsWith('/auth/')

    const makeRequest = async () =>
      fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(devToken ? { Authorization: `Bearer ${devToken}` } : {}),
          ...options.headers,
        },
        credentials: 'include',
        ...options,
      })

    let res = await makeRequest()

    if (!res.ok) {
      try {
        // eslint-disable-next-line no-console
        console.debug(`[ApiClient] request ${endpoint} -> ${res.status}`)
      } catch {}
      if (res.status === 401 && !isAuthEndpoint) {
        try {
          // eslint-disable-next-line no-console
          console.debug(`[ApiClient] 401 received for ${endpoint}, attempting refresh`)
        } catch {}
        const refreshed = await this.refreshAccessToken()
        if (refreshed) {
          res = await makeRequest()
          if (res.ok) {
          } else {
          }
        }
      }

      if (!res.ok && (res.status === 401 || res.status === 403) && !isAuthEndpoint) {
        try {
          // eslint-disable-next-line no-console
          console.debug(`[ApiClient] triggering session expired flow for ${endpoint}`)
        } catch {}
        await this.handleSessionExpired()
      }

      if (!res.ok) {
        try {
          const errJson = (await res.json()) as ApiResponse<T>
          if (!('success' in errJson)) {
            throw new ApiClientError(res.status, endpoint, res.statusText)
          }
          throw ApiClientError.fromApiError(errJson as unknown as ApiError)
        } catch {
          throw new ApiClientError(res.status, endpoint, res.statusText)
        }
      }
    }

    const text = await res.text()
    if (!text) {
      return undefined as T
    }

    const parsed = JSON.parse(text) as unknown
    if (parsed && typeof parsed === 'object' && 'success' in (parsed as Record<string, unknown>)) {
      const json = parsed as ApiResponse<T>
      if (!json.success) {
        throw ApiClientError.fromApiError(json)
      }
      return json.data as T
    }

    return parsed as T
  }

  get<T>(endpoint: string, options?: RequestInit) {
    return this.request<T>(endpoint, { method: 'GET', ...options })
  }

  post<T>(endpoint: string, body?: unknown, options?: RequestInit) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    })
  }

  put<T>(endpoint: string, body?: unknown, options?: RequestInit) {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    })
  }

  delete<T>(endpoint: string, options?: RequestInit) {
    return this.request<T>(endpoint, { method: 'DELETE', ...options })
  }

  patch<T>(endpoint: string, body?: unknown, options?: RequestInit) {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    })
  }
}

export const apiClient = new ApiClient()
