'use client'

import * as React from 'react'

import type { MeResponse } from '@/lib/api/auth'
import { authApi } from '@/lib/api/auth'
import { branchesApi } from '@/lib/api/branches'
import { ApiClientError } from '@/lib/api/client'
import { restaurantsApi } from '@/lib/api/restaurants'
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
      setRestaurantId(me.restaurantId ?? null)
      setBranchId(me.branchId ?? null)

      if (me.restaurantId) {
        const [restRes, brsRes] = await Promise.allSettled([
          restaurantsApi.getById(me.restaurantId),
          branchesApi.getAll(me.restaurantId),
        ])

        if (restRes.status === 'fulfilled') {
          setRestaurant(restRes.value)
        } else {
          console.error('[TenantProvider] restaurant fetch error:', restRes.reason)
          setRestaurant(undefined)
        }

        if (brsRes.status === 'fulfilled') {
          setBranches(brsRes.value)
          if (!me.branchId && brsRes.value.length) {
            setBranchId(brsRes.value[0].id)
          }
        } else {
          console.error('[TenantProvider] branches fetch error:', brsRes.reason)
          setBranches([])
        }
      } else {
        setRestaurant(undefined)
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
    },
    refresh: load,
    updateUser: (patch) => {
      setUser((prev) => {
        const next = prev ? { ...prev, ...patch } : (undefined as any)
        return next
      })
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
