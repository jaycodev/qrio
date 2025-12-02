import type { Metadata } from 'next'

import { OrdersPage } from '@admin/pages/orders'

import { pageMap } from '@/config/page-map'

const PATHNAME = '/admin/pedidos'
const page = pageMap[PATHNAME]

const title = page.title
const resource = page.resource!

export const metadata: Metadata = {
  title,
}

export default function Page() {
  return <OrdersPage title={title} pathname={PATHNAME} resource={resource} />
}
