import type { Metadata } from 'next'

import { EmployeesPage } from '@admin/pages/employees'

import { pageMap } from '@/config/page-map'

const PATHNAME = '/admin/empleados'
const page = pageMap[PATHNAME]

const title = page.title
const resource = page.resource!

export const metadata: Metadata = {
  title,
}

export default function Page() {
  return <EmployeesPage title={title} pathname={PATHNAME} resource={resource} />
}
