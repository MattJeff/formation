'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { Header } from '@/components/layout/Header';
import { Settings, Award, BookOpen, Target, Loader2 } from 'lucide-react';

export function ProfileClient() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState({ courses: 0, students: 0, duration: 0 });
  const [loading, setLoading] = useState(false);
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);

  useEffect(() => {
    console.log('🔄 [PROFILE] useEffect appelé - authLoading:', authLoading, 'user:', !!user, 'userId:', user?.id, 'hasAttempted:', hasAttemptedLoad);

    if (authLoading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    // Charger UNE SEULE FOIS
    if (user.id && !hasAttemptedLoad) {
      console.log('🚀 [PROFILE] Déclenchement du chargement');
      setHasAttemptedLoad(true);
      loadStats();
    }
  }, [user?.id, authLoading, hasAttemptedLoad]);

  const loadStats = async () => {
    try {
      const userRole = user?.user_metadata?.role;
      console.log('👤 [PROFILE] Chargement stats pour:', user?.id, 'Role:', userRole);

      if (userRole === 'creator') {
        // Charger les stats du créateur
        const { data: courses, error: coursesError } = await supabase
          .from('courses')
          .select('id')
          .eq('creator_id', user?.id);

        if (coursesError) {
          console.error('❌ [PROFILE] Erreur chargement cours:', coursesError);
        } else {
          console.log('✅ [PROFILE] Cours trouvés:', courses?.length || 0);
        }

        const { data: enrollments, error: enrollmentsError } = await supabase
          .from('enrollments')
          .select('id')
          .in('course_id', courses?.map(c => c.id) || []);

        if (enrollmentsError) {
          console.error('❌ [PROFILE] Erreur chargement inscriptions:', enrollmentsError);
        } else {
          console.log('✅ [PROFILE] Inscriptions trouvées:', enrollments?.length || 0);
        }

        setStats({
          courses: courses?.length || 0,
          students: enrollments?.length || 0,
          duration: 0
        });
      } else {
        // Charger les stats de l'apprenant
        const { data: enrollments, error } = await supabase
          .from('enrollments')
          .select('id')
          .eq('user_id', user?.id);

        if (error) {
          console.error('❌ [PROFILE] Erreur chargement inscriptions:', error);
        } else {
          console.log('✅ [PROFILE] Inscriptions trouvées:', enrollments?.length || 0);
        }

        setStats({
          courses: enrollments?.length || 0,
          students: 0,
          duration: 0
        });
      }
    } catch (error) {
      console.error('❌ [PROFILE] Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const userRole = user?.user_metadata?.role;
  const firstName = user?.user_metadata?.first_name || 'Utilisateur';
  const lastName = user?.user_metadata?.last_name || '';
  const fullName = user?.user_metadata?.full_name || `${firstName} ${lastName}`;
  const email = user?.email || '';
  const createdAt = user?.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : '';

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-start justify-between">
          <div className="flex gap-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-blue-500/20 text-3xl font-bold">
              {firstName.charAt(0)}{lastName.charAt(0)}
            </div>
            <div>
              <h1 className="mb-2 text-3xl font-bold">{fullName}</h1>
              <p className="text-muted-foreground">{email}</p>
              <p className="mt-2 text-sm">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {userRole === 'creator' ? '👨‍🏫 Créateur' : '🎓 Apprenant'}
                </span>
                <span className="ml-2 text-muted-foreground">
                  Membre depuis {createdAt}
                </span>
              </p>
            </div>
          </div>
          <Link
            href="/profile/edit"
            className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 hover:bg-accent"
          >
            <Settings className="h-4 w-4" />
            Modifier le profil
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-6">
            <BookOpen className="mb-4 h-12 w-12 text-blue-500" />
            <h3 className="mb-2 text-2xl font-bold">{stats.courses}</h3>
            <p className="text-muted-foreground">
              {userRole === 'creator' ? 'Cours créés' : 'Cours suivis'}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <Award className="mb-4 h-12 w-12 text-yellow-500" />
            <h3 className="mb-2 text-2xl font-bold">{userRole === 'creator' ? stats.students : 0}</h3>
            <p className="text-muted-foreground">
              {userRole === 'creator' ? 'Étudiants' : 'Certificats obtenus'}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <Target className="mb-4 h-12 w-12 text-green-500" />
            <h3 className="mb-2 text-2xl font-bold">{stats.duration}h</h3>
            <p className="text-muted-foreground">
              {userRole === 'creator' ? 'Contenu créé' : "Temps d'apprentissage"}
            </p>
          </div>
        </div>

        {userRole === 'learner' && (
          <div className="mt-8">
            <h2 className="mb-4 text-2xl font-bold">Badges & Réalisations</h2>
            <div className="rounded-lg border border-border bg-card p-8 text-center">
              <p className="text-muted-foreground">
                Commencez à suivre des cours pour débloquer des badges !
              </p>
              <Link
                href="/courses"
                className="mt-4 inline-block rounded-lg bg-primary px-6 py-2 font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Explorer les cours
              </Link>
            </div>
          </div>
        )}

        {userRole === 'creator' && (
          <div className="mt-8">
            <h2 className="mb-4 text-2xl font-bold">Vos cours</h2>
            <div className="rounded-lg border border-border bg-card p-8 text-center">
              <p className="text-muted-foreground">
                Vous n'avez pas encore créé de cours
              </p>
              <Link
                href="/creator/courses/new"
                className="mt-4 inline-block rounded-lg bg-primary px-6 py-2 font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Créer votre premier cours
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
