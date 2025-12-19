import type { Metadata } from 'next'

import { AdminLoginPage } from '@auth/pages/admin-login'

import { pageMap } from '@/config/page-map'

const page = pageMap['/iniciar-sesion-admin']

export const metadata: Metadata = {
  title: page.title,
}

export default function Page() {
  return <AdminLoginPage />
}
