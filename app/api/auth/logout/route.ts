import { NextResponse } from 'next/server'

import { config } from '@/config'

export async function POST(req: Request) {
  try {
    const bodyText = await req.text()
    const contentType = req.headers.get('content-type') ?? 'application/json'

    const backendRes = await fetch(`${config.api.baseUrl}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': contentType,
        Cookie: req.headers.get('cookie') || '',
      },
      body: bodyText || undefined,
    })

    const text = await backendRes.text()

    const headers = new Headers()
    backendRes.headers.forEach((value, key) => {
      if (key.toLowerCase() === 'set-cookie') headers.append('Set-Cookie', value)
    })

    if (backendRes.status === 204 || backendRes.status === 205) {
      return new NextResponse(null, { status: backendRes.status, headers })
    }

    return new NextResponse(text, { status: backendRes.status, headers })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'proxy error'
    return new NextResponse(msg, { status: 500 })
  }
}
