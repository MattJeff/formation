'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

interface RoleGuardProps {
  allowedRoles: ('learner' | 'creator')[];
  children: React.ReactNode;
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      try {
        // Vérifier si l'utilisateur est connecté
        const { data: { user }, error: userError } = await supabase.supabase.auth.getUser();

        if (userError || !user) {
          console.log('❌ Utilisateur non connecté, redirection vers /login');
          router.push('/login');
          return;
        }

        // Récupérer le rôle depuis la table profiles
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profileError || !profile) {
          console.error('❌ Erreur lors de la récupération du profil:', profileError);
          router.push('/onboarding/role');
          return;
        }

        // Vérifier si le rôle est autorisé
        if (!allowedRoles.includes(profile.role as 'learner' | 'creator')) {
          console.log(`🚫 Rôle ${profile.role} non autorisé, redirection...`);
          const redirectUrl = profile.role === 'creator' 
            ? '/creator/dashboard' 
            : '/dashboard';
          router.push(redirectUrl);
          return;
        }

        console.log(`✅ Rôle ${profile.role} autorisé`);
        setIsAuthorized(true);
      } catch (error) {
        console.error('❌ Erreur dans RoleGuard:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkRole();
  }, [allowedRoles, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-sm text-muted-foreground">Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
