import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const locales = ['ka', 'en']

  // 1. გამოვტოვოთ ფაილები
  if (pathname.startsWith('/_next') || pathname.includes('.') || pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  console.log('--- MiddleWare Check ---')
  console.log('Path:', pathname)

  if (pathname === '/') {
    console.log('Status: Root Path - No Redirect')
    return NextResponse.next()
  }

  const hasLocale = locales.some((loc) => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`)
  console.log('Has Locale:', hasLocale)

  if (hasLocale) return NextResponse.next()

  console.log('Redirecting to:', `/ka${pathname}`)
  const url = request.nextUrl.clone()
  url.pathname = `/ka${pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|admin).*)'],
}
