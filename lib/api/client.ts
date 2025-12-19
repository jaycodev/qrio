import { config } from '@/config'
import { ApiError, ApiResponse } from '@/lib/schemas/common/api-response.schema'

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
      const res = await fetch(`${this.baseUrl}/auth/refresh`, {
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
    try {
      await fetch(`${this.baseUrl}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })
    } catch {
      // swallow errors on logout attempt
    }
    if (typeof window !== 'undefined') {
      try {
        const url = new URL('/', window.location.origin)
        url.searchParams.set('session', 'expired')
        window.location.href = url.toString()
      } catch {
        window.location.href = '/'
      }
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const devToken = process.env.NEXT_PUBLIC_DEV_ACCESS_TOKEN

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

    // If response is not OK, try to parse error JSON; otherwise fallback to generic error
    if (!res.ok) {
      // Attempt token refresh on 401 for non-auth endpoints, then retry once
      if (res.status === 401 && !endpoint.startsWith('/auth/')) {
        const refreshed = await this.refreshAccessToken()
        if (refreshed) {
          res = await makeRequest()
          if (res.ok) {
            // proceed to parse success body below
          } else {
            // if still not ok, continue to error parsing below
          }
        }
      }

      // Global redirect on expired session after refresh still fails
      if (!res.ok && (res.status === 401 || res.status === 403)) {
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

    // Handle empty body (e.g., 204) gracefully
    const text = await res.text()
    if (!text) {
      // No content: return undefined as T
      return undefined as T
    }

    const parsed = JSON.parse(text) as unknown
    // If server uses unified envelope { success, data, ... }
    if (parsed && typeof parsed === 'object' && 'success' in (parsed as Record<string, unknown>)) {
      const json = parsed as ApiResponse<T>
      if (!json.success) {
        throw ApiClientError.fromApiError(json)
      }
      return json.data as T
    }

    // Otherwise, accept plain JSON payloads as success
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
