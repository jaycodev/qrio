import type { Metadata } from 'next'

import { ProductsPage } from '@admin/pages/products'

import { pageMap } from '@/config/page-map'

const PATHNAME = '/admin/productos'
const page = pageMap[PATHNAME]

const title = page.title
const resource = page.resource!

export const metadata: Metadata = {
  title,
}

export default function Page() {
  return <ProductsPage title={title} pathname={PATHNAME} resource={resource} />
}
