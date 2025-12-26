'use client'

import * as React from 'react'

import type { MeResponse } from '@/lib/api/auth'
import { authApi } from '@/lib/api/auth'
import { ApiClientError } from '@/lib/api/client'
import type { BranchList } from '@/lib/schemas/branches/branch.list.schema'
import type { RestaurantDetail } from '@/lib/schemas/restaurants/restaurant.detail.schema'

type TenantState = {
  loading: boolean
  restaurantId: number | null
  branchId: number | null
  restaurant?: RestaurantDetail
  branches: (BranchList & { restaurantName?: string })[]
  user?: Pick<MeResponse, 'id' | 'email' | 'name' | 'role'>
  setBranchId: (id: number | null) => void
  refresh: () => Promise<void>
  updateUser: (patch: Partial<Pick<MeResponse, 'email' | 'name'>>) => void
  reset: () => void
}

const TenantContext = React.createContext<TenantState | undefined>(undefined)

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = React.useState(true)
  const [restaurantId, setRestaurantId] = React.useState<number | null>(null)
  const [branchId, setBranchId] = React.useState<number | null>(null)
  const [branches, setBranches] = React.useState<(BranchList & { restaurantName?: string })[]>([])
  const [restaurant, setRestaurant] = React.useState<RestaurantDetail | undefined>(undefined)
  const [user, setUser] = React.useState<
    Pick<MeResponse, 'id' | 'email' | 'name' | 'role'> | undefined
  >(undefined)

  const load = React.useCallback(async () => {
    setLoading(true)
    try {
      const me = await authApi.me()
      setUser({ id: me.id, email: me.email, name: me.name, role: me.role })

      setRestaurantId(null)

      try {
        const userBranches = await authApi.branches()
        const stripPrefix = (branchName?: string, restName?: string) => {
          if (!branchName) return ''
          if (!restName) return branchName
          const trimmedRest = restName.trim()
          const trimmedBranch = branchName.trim()
          const separators = [' - ', ' – ', ' — ', ': ', ' -', '- ']
          for (const sep of separators) {
            const prefix = trimmedRest + sep
            if (trimmedBranch.startsWith(prefix)) return trimmedBranch.slice(prefix.length).trim()
          }
          if (trimmedBranch.toLowerCase().startsWith(trimmedRest.toLowerCase() + ' ')) {
            return trimmedBranch
              .slice(trimmedRest.length)
              .replace(/^[-–—:\s]+/, '')
              .trim()
          }
          return trimmedBranch
        }

        const mapped: (BranchList & { restaurantName?: string })[] = userBranches.map((b) => ({
          id: b.branch?.id ?? 0,
          name: stripPrefix(b.branch?.name ?? '', b.restaurant?.name ?? ''),
          address: null,
          phone: null,
          schedule: null,
          createdAt: new Date(),
          restaurantName: b.restaurant?.name ?? '',
          restaurantId: b.restaurant?.id ?? 0,
          code: null,
        }))
        setBranches(mapped)
        const preferred = mapped.length ? mapped[0].id : null
        setBranchId((prev) => prev ?? preferred)

        const firstRestaurant = userBranches[0]?.restaurant
        if (firstRestaurant) {
          setRestaurantId(firstRestaurant.id ?? null)
          try {
            setRestaurant({
              id: firstRestaurant.id,
              name: firstRestaurant.name ?? '',
            } as unknown as RestaurantDetail)
          } catch {}
        }
      } catch (brErr) {
        console.error('[TenantProvider] user branches fetch error:', brErr)
        setBranches([])
      }
    } catch (error) {
      if (error instanceof ApiClientError && (error.status === 401 || error.status === 403)) {
      } else {
        console.error('[TenantProvider] load() error:', error)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      const path = url.pathname
      const expired = url.searchParams.get('session') === 'expired'
      const isAuthPage = path.startsWith('/auth')
      if (expired || isAuthPage) {
        setLoading(false)
        return
      }
    }
    load()
  }, [load])

  const value: TenantState = {
    loading,
    restaurantId,
    branchId,
    restaurant,
    branches,
    user,
    setBranchId: (id) => {
      setBranchId(id)
      try {
        const b = branches.find((x) => x.id === id)
        if (b) setRestaurantId(b.restaurantId ?? null)
      } catch {}
    },
    refresh: load,
    updateUser: (patch) => setUser((prev) => (prev ? { ...prev, ...patch } : undefined)),
    reset: () => {
      setUser(undefined)
      setBranchId(null)
      setBranches([])
      setRestaurant(undefined)
      setRestaurantId(null)
    },
  }

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
}

export function useTenant(): TenantState {
  const ctx = React.useContext(TenantContext)
  if (!ctx) {
    throw new Error('useTenant must be used within TenantProvider')
  }
  return ctx
}
