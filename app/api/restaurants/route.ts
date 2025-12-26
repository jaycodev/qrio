import { NextResponse } from 'next/server'

import { config } from '@/config'

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))

    const backendRes = await fetch(`${config.api.baseUrl}/restaurants`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: req.headers.get('cookie') || '',
      },
      body: JSON.stringify(body),
    })

    const text = await backendRes.text()

    const headers = new Headers()
    backendRes.headers.forEach((value, key) => {
      if (key.toLowerCase() === 'set-cookie') headers.append('Set-Cookie', value)
    })

    return new NextResponse(text, { status: backendRes.status, headers })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'proxy error'
    return new NextResponse(msg, { status: 500 })
  }
}
