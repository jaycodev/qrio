'use client'

import { Bar, BarChart, XAxis, YAxis } from 'recharts'
import { useQuery } from '@tanstack/react-query'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { useTenant } from '@/app/providers/tenant-provider'
import { productsApi } from '@/lib/api/products'

type Datum = { category: string; count: number }

export function ChartBarMixed() {
  const tenant = useTenant()
  const { data: items } = useQuery({
    queryKey: ['dashboard', 'products', tenant.branchId],
    enabled: !!tenant.branchId && tenant.loading === false,
    queryFn: async () => productsApi.getAll(tenant.branchId as number),
  })

  const grouped: Datum[] = Object.values(
    (items ?? []).reduce<Record<string, Datum>>((acc, p) => {
      const key = p.category.name
      acc[key] = acc[key] ?? { category: key, count: 0 }
      acc[key].count += 1
      return acc
    }, {})
  )

  const chartConfig: ChartConfig = {
    count: {
      label: 'Productos',
      theme: { light: '#6366f1', dark: '#818cf8' },
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Productos por Categoría</CardTitle>
        <CardDescription>Distribución del catálogo por categoría.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={grouped} layout="vertical" margin={{ left: 20 }}>
            <YAxis dataKey="category" type="category" tickLine={false} tickMargin={10} axisLine={false} />
            <XAxis dataKey="count" type="number" hide />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="count" layout="vertical" radius={6} fill="var(--color-count)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
