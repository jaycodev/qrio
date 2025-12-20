import { ordersApi } from '@/lib/api/orders'
import type { BranchList } from '@/lib/schemas/branches/branch.list.schema'
import type { OrderList } from '@/lib/schemas/order/order.list.schema'

export type DashboardStats = {
  totalOrders: number
  totalRevenue: number
  avgTicket: number
  totalItems: number
  statusBreakdown: Record<string, number>
}

function aggregateOrders(orders: OrderList[]): DashboardStats {
  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total ?? 0), 0)
  const totalItems = orders.reduce((sum, o) => sum + (o.itemCount ?? 0), 0)
  const avgTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0
  const statusBreakdown = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1
    return acc
  }, {})

  return { totalOrders, totalRevenue, avgTicket, totalItems, statusBreakdown }
}

export async function getBranchStats(branchId: number): Promise<DashboardStats> {
  const orders = await ordersApi.getAll(branchId)
  return aggregateOrders(orders)
}

export async function getRestaurantStats(
  restaurantId: number,
  branches: BranchList[]
): Promise<DashboardStats> {
  // Aggregate across all provided branches belonging to restaurant
  const allOrders: OrderList[] = []
  for (const br of branches) {
    try {
      const brOrders = await ordersApi.getAll(br.id)
      allOrders.push(...brOrders)
    } catch (err) {
      console.error('[stats] failed to fetch orders for branch', br.id, err)
    }
  }
  return aggregateOrders(allOrders)
}
