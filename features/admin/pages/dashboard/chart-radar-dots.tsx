'use client'

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts'
import { useQuery } from '@tanstack/react-query'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { useTenant } from '@/app/providers/tenant-provider'
import { tablesApi } from '@/lib/api/tables'

type Datum = { floor: string; count: number }

export function ChartRadarDots() {
  const tenant = useTenant()
  const { data: items } = useQuery({
    queryKey: ['dashboard', 'tables', tenant.branchId],
    enabled: !!tenant.branchId && tenant.loading === false,
    queryFn: async () => tablesApi.getAll(tenant.branchId as number),
  })

  const chartData: Datum[] = Object.values(
    (items ?? []).reduce<Record<string, Datum>>((acc, t) => {
      const key = `Piso ${t.floor}`
      acc[key] = acc[key] ?? { floor: key, count: 0 }
      acc[key].count += 1
      return acc
    }, {})
  )

  const chartConfig: ChartConfig = {
    count: { label: 'Mesas', color: 'var(--chart-1)' },
  }

  return (
    <Card>
      <CardHeader className="items-center">
        <CardTitle>Mesas por Piso</CardTitle>
        <CardDescription>Distribución de mesas por nivel/piso.</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="floor" />
            <PolarGrid />
            <Radar
              dataKey="count"
              fill="var(--color-count)"
              fillOpacity={0.6}
              dot={{ r: 4, fillOpacity: 1 }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
