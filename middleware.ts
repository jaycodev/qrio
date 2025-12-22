import { NextRequest, NextResponse } from 'next/server'

import { config as appConfig } from '@/config'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  try {
    const cookieHeader = req.headers.get('cookie') || ''
    const hasAccess = !!req.cookies.get('access_token')?.value
    const hasRefresh = !!req.cookies.get('refresh_token')?.value
    const branchId = req.cookies.get('branchId')?.value
    // eslint-disable-next-line no-console
    console.debug(
      `[middleware] pathname=${pathname} access=${hasAccess} refresh=${hasRefresh} branchId=${branchId} cookieHeaderPresent=${cookieHeader.length > 0}`
    )
  } catch {}

  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  const access = req.cookies.get('access_token')?.value
  if (!access) {
    const url = req.nextUrl.clone()
    url.pathname = '/iniciar-sesion'
    return NextResponse.redirect(url)
  }

  try {
    const res = await fetch(`${appConfig.api.baseUrl}/auth/me`, {
      headers: {
        Cookie: req.headers.get('cookie') || '',
      },
    })
    if (res.ok) {
      if (pathname === '/admin/seleccionar-sucursal') {
        return NextResponse.next()
      }

      const branchId = req.cookies.get('branchId')?.value
      if (!branchId) {
        const url = req.nextUrl.clone()
        url.pathname = '/admin/seleccionar-sucursal'
        return NextResponse.redirect(url)
      }

      return NextResponse.next()
    }
  } catch {}

  const url = req.nextUrl.clone()
  url.pathname = '/iniciar-sesion'
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/admin/:path*'],
}
