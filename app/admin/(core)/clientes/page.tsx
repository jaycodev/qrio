import type { Metadata } from 'next'

import { CustomersPage } from '@admin/pages/customers'

import { pageMap } from '@/config/page-map'

const PATHNAME = '/admin/clientes'
const page = pageMap[PATHNAME]

const title = page.title
const resource = page.resource!

export const metadata: Metadata = {
  title,
}

export default function Page() {
  return <CustomersPage title={title} pathname={PATHNAME} resource={resource} />
}
