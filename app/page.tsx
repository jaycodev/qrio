import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Inicio',
}

export default async function Page() {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')
  if (token?.value) {
    redirect('/admin')
  }
  redirect('/iniciar-sesion')
}
