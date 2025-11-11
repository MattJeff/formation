import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const token_hash = requestUrl.searchParams.get('token_hash');
  const type = requestUrl.searchParams.get('type');

  if (token_hash && type) {
    // Vérifier le token avec Supabase
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as any,
    });

    if (!error) {
      // Email vérifié avec succès, rediriger vers le choix de rôle
      return NextResponse.redirect(new URL('/onboarding/role', requestUrl.origin));
    }
  }

  // En cas d'erreur, rediriger vers la page de vérification avec un message
  return NextResponse.redirect(new URL('/verify-email?error=verification_failed', requestUrl.origin));
}
