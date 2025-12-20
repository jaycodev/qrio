'use client'

import * as React from 'react'

import { authApi } from '@/lib/api/auth'
import { branchesApi } from '@/lib/api/branches'
import { restaurantsApi } from '@/lib/api/restaurants'
import type { BranchList } from '@/lib/schemas/branches/branch.list.schema'
import type { RestaurantDetail } from '@/lib/schemas/restaurants/restaurant.detail.schema'
import type { MeResponse } from '@/lib/api/auth'

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
  const [user, setUser] = React.useState<Pick<MeResponse, 'id' | 'email' | 'name' | 'role'> | undefined>(
    undefined
  )

  const load = React.useCallback(async () => {
    console.log('[TenantProvider] load() start')
    setLoading(true)
    try {
      console.log('[TenantProvider] fetching /auth/me')
      const me = await authApi.me()
      console.log('[TenantProvider] /auth/me result:', me)
      setUser({ id: me.id, email: me.email, name: me.name, role: me.role })
      setRestaurantId(me.restaurantId ?? null)
      setBranchId(me.branchId ?? null)
      console.log('[TenantProvider] set ids -> restaurantId:', me.restaurantId ?? null, 'branchId:', me.branchId ?? null)

      if (me.restaurantId) {
        console.log('[TenantProvider] fetching restaurant and branches for restaurantId:', me.restaurantId)
        const [restRes, brsRes] = await Promise.allSettled([
          restaurantsApi.getById(me.restaurantId),
          branchesApi.getAll(me.restaurantId),
        ])

        if (restRes.status === 'fulfilled') {
          console.log('[TenantProvider] restaurant fetched:', restRes.value)
          setRestaurant(restRes.value)
        } else {
          console.error('[TenantProvider] restaurant fetch error:', restRes.reason)
          setRestaurant(undefined)
        }

        if (brsRes.status === 'fulfilled') {
          console.log('[TenantProvider] branches fetched count:', brsRes.value.length, brsRes.value)
          setBranches(brsRes.value)
          if (!me.branchId && brsRes.value.length) {
            setBranchId(brsRes.value[0].id)
            console.log('[TenantProvider] default branch set to:', brsRes.value[0].id)
          }
        } else {
          console.error('[TenantProvider] branches fetch error:', brsRes.reason)
          setBranches([])
        }
      } else {
        console.log('[TenantProvider] user has no restaurantId; resetting state')
        setRestaurant(undefined)
        setBranches([])
      }
    } catch (error) {
      console.error('[TenantProvider] load() error:', error)
    } finally {
      setLoading(false)
      console.log('[TenantProvider] load() end; current state -> restaurantId:', restaurantId, 'branchId:', branchId, 'branchesCount:', branches.length)
    }
  }, [])

  React.useEffect(() => {
    console.log('[TenantProvider] effect mount -> initiating load')
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      const path = url.pathname
      const expired = url.searchParams.get('session') === 'expired'
      const isAuthPage = path.startsWith('/auth')
      if (expired || isAuthPage) {
        console.log('[TenantProvider] on auth/expired page; skipping load')
        setLoading(false)
        return
      }
    }
    load()
  }, [load])

  React.useEffect(() => {
    console.log('[TenantProvider] branchId changed:', branchId)
  }, [branchId])

  React.useEffect(() => {
    console.log('[TenantProvider] branches updated -> count:', branches.length, branches)
  }, [branches])

  const value: TenantState = {
    loading,
    restaurantId,
    branchId,
    restaurant,
    branches,
    user,
    setBranchId: (id) => {
      console.log('[TenantProvider] setBranchId called with:', id)
      setBranchId(id)
    },
    refresh: load,
    updateUser: (patch) => {
      setUser((prev) => {
        const next = prev ? { ...prev, ...patch } : (undefined as any)
        console.log('[TenantProvider] updateUser patch:', patch, 'result:', next)
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
