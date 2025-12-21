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
      if (key.toLowerCase() === 'set-cookie') headers.append('Set-Cookie', value)
    })

    return new NextResponse(text, { status: backendRes.status, headers })
  } catch {
    return new NextResponse('proxy error', { status: 500 })
  }
}
