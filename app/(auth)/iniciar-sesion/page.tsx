import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { RedirectIfCookie } from '@auth/components/redirect-if-cookie'
import { LoginPage } from '@auth/pages/login'

import { pageMap } from '@/config/page-map'

const page = pageMap['/iniciar-sesion']

export const metadata: Metadata = {
  title: page.title,
}

export default async function Page() {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')
  if (token?.value) {
    redirect('/admin')
  }

  return (
    <>
      <RedirectIfCookie />
      <LoginPage />
    </>
  )
}
