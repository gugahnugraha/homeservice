import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT, UserSessionPayload } from './lib/auth/jwt';
import { Role } from '@prisma/client';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const COOKIE_NAME = process.env.SESSION_COOKIE_NAME || 'homeservice_session';
  const token = request.cookies.get(COOKIE_NAME)?.value;
  let session: UserSessionPayload | null = null;

  if (token) {
    session = await verifyJWT(token);
  }

  // Protecting /customer routes
  if (pathname.startsWith('/customer')) {
    if (!session) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protecting /provider routes (except provider registration page)
  if (pathname.startsWith('/provider') && pathname !== '/provider/register') {
    if (!session || (session.role !== Role.PROVIDER && session.role !== Role.ADMIN)) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protecting /admin routes (except admin login page)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!session || session.role !== Role.ADMIN) {
      const adminLoginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(adminLoginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/customer/:path*',
    '/provider/:path*',
    '/admin/:path*',
  ],
};
