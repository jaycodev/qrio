import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const branchId = body?.branchId ?? null
    const restaurantId = body?.restaurantId ?? null

    const headers = new Headers()
    const isProd = process.env.NODE_ENV === 'production'

    if (branchId === null || branchId === undefined) {
      headers.append('Set-Cookie', `branchId=; Max-Age=0; Path=/;`)
      headers.append('Set-Cookie', `restaurantId=; Max-Age=0; Path=/;`)
      return new NextResponse(null, { status: 204, headers })
    }

    const maxAge = 60 * 60 * 24 * 365
    const branchCookie = `branchId=${encodeURIComponent(String(branchId))}; Max-Age=${maxAge}; Path=/; ${
      isProd ? 'Secure; ' : ''
    }SameSite=Lax`
    headers.append('Set-Cookie', branchCookie)

    if (restaurantId !== null && restaurantId !== undefined) {
      const restCookie = `restaurantId=${encodeURIComponent(String(restaurantId))}; Max-Age=${maxAge}; Path=/; ${
        isProd ? 'Secure; ' : ''
      }SameSite=Lax`
      headers.append('Set-Cookie', restCookie)
    }

    return new NextResponse(null, { status: 204, headers })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'invalid request'
    return new NextResponse(msg, { status: 400 })
  }
}
