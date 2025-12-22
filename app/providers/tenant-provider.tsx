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
  branches: BranchList[]
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
  const [branches, setBranches] = React.useState<BranchList[]>([])
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
        const mapped: BranchList[] = userBranches.map((b) => ({
          id: b.id,
          code: null,
          restaurantId: 0,
          name: b.branchName,
          address: null,
          phone: null,
          schedule: null,
          createdAt: new Date(),
        }))
        setBranches(mapped)
        // prefer existing branchId, otherwise pick first available
        const preferred = mapped.length ? mapped[0].id : null
        setBranchIdWithCookie((prev) => prev ?? preferred)
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

  const setBranchIdWithCookie = (
    idOrUpdater: number | null | ((prev: number | null) => number | null)
  ) => {
    if (typeof idOrUpdater === 'function') {
      setBranchId((prev) => {
        const next = (idOrUpdater as (prev: number | null) => number | null)(prev)
        if (typeof window !== 'undefined') {
          if (next === null) {
            document.cookie = `branchId=; Max-Age=0; Path=/;`
          } else {
            document.cookie = `branchId=${next}; Path=/;`
          }
        }
        return next
      })
    } else {
      setBranchId(idOrUpdater)
      if (typeof window !== 'undefined') {
        if (idOrUpdater === null) {
          document.cookie = `branchId=; Max-Age=0; Path=/;`
        } else {
          document.cookie = `branchId=${idOrUpdater}; Path=/;`
        }
      }
    }
  }

  const value: TenantState = {
    loading,
    restaurantId,
    branchId,
    restaurant,
    branches,
    user,
    setBranchId: (id) => setBranchIdWithCookie(id),
    refresh: load,
    updateUser: (patch) => setUser((prev) => (prev ? { ...prev, ...patch } : undefined)),
    reset: () => {
      setUser(undefined)
      setBranchIdWithCookie(null)
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
