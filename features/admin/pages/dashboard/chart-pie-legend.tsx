'use client'

import { Pie, PieChart } from 'recharts'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent } from '@/components/ui/chart'

type Slice = { status: string; value: number; fill?: string }

type Props = {
  data: Slice[]
  title?: string
  description?: string
}

export function ChartPieLegend({ data, title, description }: Props) {
  const chartConfig: ChartConfig = {
    value: { label: 'Pedidos' },
    PENDIENTE: {
      label: 'Pendiente',
      theme: { light: '#f59e0b', dark: '#fbbf24' },
    },
    EN_PROGRESO: {
      label: 'En progreso',
      theme: { light: '#3b82f6', dark: '#60a5fa' },
    },
    COMPLETADO: {
      label: 'Completado',
      theme: { light: '#22c55e', dark: '#4ade80' },
    },
    CANCELADO: {
      label: 'Cancelado',
      theme: { light: '#ef4444', dark: '#f87171' },
    },
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title ?? 'Distribución por estado de pedidos'}</CardTitle>
        <CardDescription>{description ?? 'Estado actual de pedidos'}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
          <PieChart>
            <Pie
              data={data.map((d) => ({
                status: d.status,
                value: d.value,
                fill: `var(--color-${d.status})`,
              }))}
              dataKey="value"
              innerRadius={50}
              stroke="transparent"
            />
            <ChartLegend
              content={<ChartLegendContent nameKey="status" />}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
