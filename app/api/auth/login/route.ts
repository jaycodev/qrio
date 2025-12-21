import { NextResponse } from 'next/server'

const BACKEND = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api-qrio.onrender.com'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const backendRes = await fetch(`${BACKEND}/auth/login`, {
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
