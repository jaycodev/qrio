"use client"
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import { useTenant } from '@/app/providers/tenant-provider'
import { getBranchStats, getRestaurantStats } from '@/lib/api/stats'

// Removed time-series placeholder that didn't match available data
import { ChartBarMixed } from './chart-bar-mixed'
import { ChartPieLegend } from './chart-pie-legend'
import { ChartRadarDots } from './chart-radar-dots'
import { ChartBarBranches } from './chart-bar-branches'
import { SectionCards } from './section-cards'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Spinner } from '@/components/ui/spinner'

export function DashboardPage() {
  const tenant = useTenant()
  const isAdmin = tenant.user?.role === 'ADMIN' || tenant.user?.role === 'APP_ADMIN'
  const [mode, setMode] = useState<'branch' | 'restaurant'>(isAdmin ? 'restaurant' : 'branch')

  const canRestaurant = isAdmin && !!tenant.restaurantId && tenant.branches.length > 0
  const canBranch = !!tenant.branchId

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard', 'stats', mode, tenant.restaurantId, tenant.branchId, tenant.branches.length],
    enabled: tenant.loading === false && (!!tenant.branchId || (!!tenant.restaurantId && tenant.branches.length > 0)),
    queryFn: async () => {
      if (mode === 'branch' && tenant.branchId) {
        return getBranchStats(tenant.branchId)
      }
      if (mode === 'restaurant' && tenant.restaurantId) {
        return getRestaurantStats(tenant.restaurantId, tenant.branches)
      }
      return {
        totalOrders: 0,
        totalRevenue: 0,
        avgTicket: 0,
        totalItems: 0,
        statusBreakdown: {},
      }
    },
  })

  const pieData = Object.entries(stats?.statusBreakdown ?? {}).map(([status, value]) => ({ status, value }))

  return (
    <>
      <div className="@container/main flex flex-1 flex-col gap-2 mt-2">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {mode === 'branch' && tenant.branchId ? 'Sucursal actual' : 'Todas las sucursales'}
          </div>
          {isAdmin ? (
            <ToggleGroup type="single" value={mode} onValueChange={(v) => v && setMode(v as any)} variant="outline">
              <ToggleGroupItem value="branch" disabled={!canBranch}>Sucursal</ToggleGroupItem>
              <ToggleGroupItem value="restaurant" disabled={!canRestaurant}>Restaurante</ToggleGroupItem>
            </ToggleGroup>
          ) : null}
        </div>

        <div className="flex flex-col gap-4">
          {isLoading || tenant.loading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Spinner className="size-4" /> Cargando estadísticas...
            </div>
          ) : (
            <SectionCards
              totalOrders={stats?.totalOrders ?? 0}
              totalRevenue={stats?.totalRevenue ?? 0}
              avgTicket={stats?.avgTicket ?? 0}
              totalItems={stats?.totalItems ?? 0}
            />
          )}

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <ChartPieLegend data={pieData} title="Estados de pedidos" description="Distribución por estado" />
            <ChartRadarDots />
            <ChartBarMixed />
          </div>
          <div className="grid grid-cols-1 gap-4">
            <ChartBarBranches />
          </div>
        </div>
      </div>
    </>
  )
}
