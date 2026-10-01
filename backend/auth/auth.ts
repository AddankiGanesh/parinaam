import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'parinaam-2026-super-secret-key-change-in-production'
);

export type JWTPayload = {
  userId: string;
  email: string;
  role: 'student' | 'club_admin' | 'super_admin';
  clubId?: string;
  iat?: number;
  exp?: number;
};

export async function signToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as JWTPayload;
  } catch {
    return null;
  }
}

export async function getSessionUser(req?: NextRequest): Promise<JWTPayload | null> {
  let token: string | undefined;
  
  if (req) {
    token = req.cookies.get('parinaam_session')?.value;
  } else {
    const cookieStore = await cookies();
    token = cookieStore.get('parinaam_session')?.value;
  }
  
  if (!token) return null;
  return verifyToken(token);
}

export const COOKIE_NAME = 'parinaam_session';
export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: '/',
};
