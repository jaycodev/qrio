import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

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
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'
    const res = await fetch(`${backendUrl}/auth/me`, {
      headers: {
        Cookie: req.headers.get('cookie') || '',
      },
    })
    if (res.ok) {
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
