import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { LoginPage } from '@auth/pages/login'
import React from 'react'
import { RedirectIfCookie } from '@auth/components/redirect-if-cookie'

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
