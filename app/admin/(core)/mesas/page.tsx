import type { Metadata } from 'next'

import { TablesPage } from '@admin/pages/tables'

import { pageMap } from '@/config/page-map'

const PATHNAME = '/admin/mesas'
const page = pageMap[PATHNAME]

const title = page.title
const resource = page.resource!

export const metadata: Metadata = {
  title,
}

export default function Page() {
  return <TablesPage title={title} pathname={PATHNAME} resource={resource} />
}
