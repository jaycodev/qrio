import type { Metadata } from 'next'

import { OffersPage } from '@admin/pages/offers'

import { pageMap } from '@/config/page-map'

const PATHNAME = '/admin/ofertas'
const page = pageMap[PATHNAME]

const title = page.title
const resource = page.resource!

export const metadata: Metadata = {
  title,
}

export default function Page() {
  return <OffersPage title={title} pathname={PATHNAME} resource={resource} />
}
