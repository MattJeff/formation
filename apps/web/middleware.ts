import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware désactivé - on utilise RoleGuard dans les pages
export function middleware(req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
