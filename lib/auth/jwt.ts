import { SignJWT, jwtVerify } from 'jose';
import { Role } from '@prisma/client';
import { NextResponse, NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-homeservice-jwt-key-change-in-production-2026';
const key = new TextEncoder().encode(JWT_SECRET);
const COOKIE_NAME = process.env.SESSION_COOKIE_NAME || 'homeservice_session';

export interface UserSessionPayload {
  userId: string;
  email: string;
  name: string;
  role: Role;
}

/**
 * Sign JWT Token
 */
export async function signJWT(payload: UserSessionPayload, expiresIn = '7d'): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(key);
}

/**
 * Verify JWT Token
 */
export async function verifyJWT(token: string): Promise<UserSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, key);
    return payload as unknown as UserSessionPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Extract token from HTTP Request cookies
 */
export function getSessionTokenFromRequest(request: NextRequest): string | null {
  const cookie = request.cookies.get(COOKIE_NAME);
  return cookie ? cookie.value : null;
}

/**
 * Set HTTP-Only Session Cookie on NextResponse
 */
export function setSessionCookie(response: NextResponse, token: string): NextResponse {
  response.cookies.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return response;
}

/**
 * Clear Session Cookie on NextResponse
 */
export function clearSessionCookie(response: NextResponse): NextResponse {
  response.cookies.set({
    name: COOKIE_NAME,
    value: '',
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });
  return response;
}
