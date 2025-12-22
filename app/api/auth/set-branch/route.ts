import { NextResponse } from 'next/server'

const COOKIE_NAME = 'branchId'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const branchId = body?.branchId ?? null

    const headers = new Headers()
    const isProd = process.env.NODE_ENV === 'production'
    if (branchId === null || branchId === undefined) {
      const cookie = `${COOKIE_NAME}=; Max-Age=0; Path=/;`
      headers.append('Set-Cookie', cookie)
      return new NextResponse(null, { status: 204, headers })
    }

    const maxAge = 60 * 60 * 24 * 365
    const cookie = `${COOKIE_NAME}=${encodeURIComponent(String(branchId))}; Max-Age=${maxAge}; Path=/; ${
      isProd ? 'Secure; ' : ''
    }SameSite=Lax`
    headers.append('Set-Cookie', cookie)

    return new NextResponse(null, { status: 204, headers })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'invalid request'
    return new NextResponse(msg, { status: 400 })
  }
}
