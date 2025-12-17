import { NextResponse, NextRequest } from 'next/server'

// Protege las rutas de admin verificando la cookie y, opcionalmente, el backend
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Solo proteger rutas bajo /admin
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  const access = req.cookies.get('access_token')?.value
  if (!access) {
    const url = req.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  // Validación opcional contra backend: /auth/me
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'
    const res = await fetch(`${backendUrl}/auth/me`, {
      headers: {
        // Reenviamos las cookies actuales al backend
        Cookie: req.headers.get('cookie') || '',
      },
    })
    if (res.ok) {
      return NextResponse.next()
    }
  } catch {}

  const url = req.nextUrl.clone()
  url.pathname = '/'
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/admin/:path*'],
}
