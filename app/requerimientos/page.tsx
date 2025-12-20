import type { Metadata } from 'next'

import { RequirementsPage } from '@admin/pages/requirements'

import { pageMap } from '@/config/page-map'

const PATHNAME = '/requerimientos'
const page = pageMap[PATHNAME]

const title = page.title
const resource = page.resource!

export const metadata: Metadata = {
  title,
}

export default function Page() {
  return <RequirementsPage title={title} pathname={PATHNAME} resource={resource} />
}
