import { NextResponse } from 'next/server'

import { config } from '@/config'

export async function GET(req: Request) {
  try {
    const backendRes = await fetch(`${config.api.baseUrl}/auth/me`, {
      method: 'GET',
      headers: {
        Cookie: req.headers.get('cookie') || '',
      },
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
