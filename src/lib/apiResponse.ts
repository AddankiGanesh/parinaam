// Centralized API response helpers

import { NextResponse } from 'next/server';

export function success<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function error(message: string, status = 400, details?: unknown) {
  return NextResponse.json({ success: false, error: message, details }, { status });
}

export function unauthorized(message = 'Unauthorized') {
  return NextResponse.json({ success: false, error: message }, { status: 401 });
}

export function forbidden(message = 'Forbidden') {
  return NextResponse.json({ success: false, error: message }, { status: 403 });
}

export function notFound(message = 'Not found') {
  return NextResponse.json({ success: false, error: message }, { status: 404 });
}

export function serverError(message = 'Internal server error') {
  return NextResponse.json({ success: false, error: message }, { status: 500 });
}
