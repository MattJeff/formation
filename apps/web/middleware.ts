import { NextResponse } from 'next/server';

// Middleware désactivé - on utilise RoleGuard dans les pages
export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
