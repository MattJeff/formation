import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const path = req.nextUrl.pathname;

  // Routes protégées LEARNER
  const learnerRoutes = ['/my-courses', '/learn', '/dashboard'];
  // Routes protégées CREATOR
  const creatorRoutes = ['/creator'];

  // Si l'utilisateur est connecté
  if (session) {
    // Récupérer le rôle depuis la table profiles
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    const userRole = profile?.role;

    // Bloquer les routes creator pour les learners
    if (userRole === 'learner' && creatorRoutes.some(route => path.startsWith(route))) {
      console.log('🚫 Learner essaie d\'accéder à une route creator, redirection vers /dashboard');
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Bloquer les routes learner pour les creators
    if (userRole === 'creator' && learnerRoutes.some(route => path.startsWith(route))) {
      console.log('🚫 Creator essaie d\'accéder à une route learner, redirection vers /creator/dashboard');
      return NextResponse.redirect(new URL('/creator/dashboard', req.url));
    }
  } else {
    // Si pas connecté et essaie d'accéder à une route protégée
    const protectedRoutes = [...learnerRoutes, ...creatorRoutes];
    if (protectedRoutes.some(route => path.startsWith(route))) {
      console.log('🚫 Utilisateur non connecté, redirection vers /login');
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: [
    '/creator/:path*',
    '/my-courses',
    '/learn/:path*',
    '/dashboard',
  ],
};
