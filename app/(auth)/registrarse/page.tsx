import type { Metadata } from 'next'

import { SignupPage } from '@auth/pages/signup'

import { pageMap } from '@/config/page-map'

const page = pageMap['/registrarse']

export const metadata: Metadata = {
  title: page.title,
}

export default function Page() {
  return <SignupPage />
}
