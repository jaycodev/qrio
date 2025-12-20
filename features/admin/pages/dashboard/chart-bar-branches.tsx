'use client'

import { useQuery } from '@tanstack/react-query'
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts'

import { useTenant } from '@/app/providers/tenant-provider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import { ordersApi } from '@/lib/api/orders'

type Datum = { branch: string; revenue: number }

export function ChartBarBranches() {
  const tenant = useTenant()

  const { data: chartData = [] } = useQuery({
    queryKey: ['dashboard', 'revenue-by-branch', tenant.restaurantId, tenant.branches.length],
    enabled: !!tenant.restaurantId && tenant.loading === false && tenant.branches.length > 0,
    queryFn: async (): Promise<Datum[]> => {
      const entries = await Promise.all(
        tenant.branches.map(async (b) => {
          try {
            const orders = await ordersApi.getAll(b.id)
            const revenue = orders.reduce((sum, o) => sum + (o.total ?? 0), 0)
            return { branch: b.name, revenue }
          } catch {
            return { branch: b.name, revenue: 0 }
          }
        })
      )
      return entries.sort((a, b) => b.revenue - a.revenue)
    },
  })

  const chartConfig: ChartConfig = {
    revenue: {
      label: 'Ingresos',
      theme: { light: '#10b981', dark: '#34d399' },
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ingresos por Sucursal</CardTitle>
        <CardDescription>Comparativa de ingresos por sucursal.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="branch" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip content={<ChartTooltipContent labelKey="branch" />} />
            <Bar dataKey="revenue" radius={6} fill="var(--color-revenue)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
