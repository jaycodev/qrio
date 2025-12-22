import { NextRequest, NextResponse } from 'next/server'

import { config } from '@/config'

async function forward(req: NextRequest, params?: { path?: string[] }) {
  try {
    const path = params?.path ? params.path.join('/') : ''
    const url = new URL(req.url)
    const search = url.search ?? ''
    const target = `${config.api.baseUrl}/${path}${search}`

    const headers: Record<string, string> = {}
    const contentType = req.headers.get('content-type')
    if (contentType) headers['Content-Type'] = contentType
    headers['Cookie'] = req.headers.get('cookie') || ''

    const backendRes = await fetch(target, {
      method: req.method,
      headers,
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : req.body,
      redirect: 'manual',
    })

    const buffer = await backendRes.arrayBuffer()

    const resHeaders = new Headers()
    backendRes.headers.forEach((value, key) => {
      const k = key.toLowerCase()
      if (k === 'content-encoding' || k === 'content-length') return
      if (k === 'set-cookie') {
        resHeaders.append('Set-Cookie', value)
      } else {
        resHeaders.set(key, value)
      }
    })

    return new NextResponse(Buffer.from(buffer), { status: backendRes.status, headers: resHeaders })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'proxy error'
    return new NextResponse(msg, { status: 500 })
  }
}

export async function GET(req: NextRequest, context: any) {
  return forward(req, context?.params)
}

export async function POST(req: NextRequest, context: any) {
  return forward(req, context?.params)
}

export async function PUT(req: NextRequest, context: any) {
  return forward(req, context?.params)
}

export async function PATCH(req: NextRequest, context: any) {
  return forward(req, context?.params)
}

export async function DELETE(req: NextRequest, context: any) {
  return forward(req, context?.params)
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}
