import { NextResponse } from 'next/server'

import { config } from '@/config'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const backendRes = await fetch(`${config.api.baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const text = await backendRes.text()

    const headers = new Headers()
    backendRes.headers.forEach((value, key) => {
      if (key.toLowerCase() === 'set-cookie') {
        // rewrite Path=/auth -> Path=/ so cookie is sent to our /api routes
        const adjusted = value.replace(/Path=\/auth/gi, 'Path=/')
        headers.append('Set-Cookie', adjusted)
        try {
          // Debug: log incoming and adjusted Set-Cookie values from backend
          // eslint-disable-next-line no-console
          console.debug('[login proxy] set-cookie original:', value)
          // eslint-disable-next-line no-console
          console.debug('[login proxy] set-cookie adjusted:', adjusted)
        } catch {}
      }
    })

    return new NextResponse(text, { status: backendRes.status, headers })
  } catch {
    return new NextResponse('proxy error', { status: 500 })
  }
}
