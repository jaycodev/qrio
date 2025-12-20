import React from 'react'

import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { RedirectIfCookie } from '@auth/components/redirect-if-cookie'
import { LoginPage } from '@auth/pages/login'

export const metadata: Metadata = {
  title: 'Iniciar sesión',
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
