import { NextResponse, type NextRequest } from 'next/server'
import { verifySession, SESSION_COOKIE } from '@/lib/session'

async function isLoggedIn(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value
  return !!token && !!(await verifySession(token))
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const loggedIn = await isLoggedIn(req)

  if (loggedIn && pathname === '/') {
    return NextResponse.redirect(new URL('/app', req.url))
  }

  if (!loggedIn && pathname.startsWith('/app')) {
    const res = NextResponse.redirect(new URL('/', req.url))
    res.cookies.delete(SESSION_COOKIE)
    return res
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/app/:path*', '/']
}
