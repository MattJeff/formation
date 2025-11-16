'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { Header } from '@/components/layout/Header';
import { Settings, Award, BookOpen, Target, Loader2, User, Github, Linkedin, Twitter, Globe } from 'lucide-react';

export function ProfileClient() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<any>(null);
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
      loadProfile();
      loadStats();
    }
  }, [user?.id, authLoading, hasAttemptedLoad]);

  const loadProfile = async () => {
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      setProfile(profileData);
    } catch (error) {
      console.error('❌ [PROFILE] Error loading profile:', error);
    }
  };

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
  const firstName = profile?.first_name || user?.user_metadata?.first_name || 'Utilisateur';
  const lastName = profile?.last_name || user?.user_metadata?.last_name || '';
  const fullName = `${firstName} ${lastName}`;
  const email = user?.email || '';
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url;
  const bio = profile?.bio || user?.user_metadata?.bio;
  const website = profile?.website || user?.user_metadata?.website;
  const github = profile?.github || user?.user_metadata?.github;
  const linkedin = profile?.linkedin || user?.user_metadata?.linkedin;
  const twitter = profile?.twitter || user?.user_metadata?.twitter;
  const createdAt = user?.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : '';

  const hasSocialLinks = website || github || linkedin || twitter;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-3 sm:gap-6">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={fullName}
                width={96}
                height={96}
                className="h-16 w-16 rounded-full object-cover sm:h-24 sm:w-24"
              />
            ) : (
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-blue-500/20 text-xl font-bold sm:h-24 sm:w-24 sm:text-3xl">
                {firstName.charAt(0)}{lastName.charAt(0)}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h1 className="mb-1 text-xl font-bold sm:mb-2 sm:text-3xl">{fullName}</h1>
              <p className="truncate text-sm text-muted-foreground sm:text-base">{email}</p>
              {bio && <p className="mt-2 text-xs text-muted-foreground sm:text-sm max-w-md">{bio}</p>}
              <p className="mt-2 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary sm:px-3">
                  {userRole === 'creator' ? '👨‍🏫 Créateur' : '🎓 Apprenant'}
                </span>
                <span className="text-muted-foreground">
                  Membre depuis {createdAt}
                </span>
              </p>
            </div>
          </div>
          <div className="flex gap-2 sm:flex-shrink-0">
            <Link
              href="/profile/edit"
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:bg-accent sm:flex-none sm:px-4"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Modifier le profil</span>
              <span className="sm:hidden">Modifier</span>
            </Link>
            <Link
              href="/profile/settings"
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:bg-accent sm:flex-none sm:px-4"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Paramètres</span>
              <span className="sm:hidden">Réglages</span>
            </Link>
          </div>
        </div>

        {hasSocialLinks && (
          <div className="mb-6 rounded-lg border border-border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold">Liens sociaux</h2>
            <div className="flex flex-wrap gap-3">
              {website && (
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 hover:bg-accent"
                >
                  <Globe className="h-4 w-4" />
                  Site web
                </a>
              )}
              {github && (
                <a
                  href={`https://github.com/${github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 hover:bg-accent"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
              )}
              {linkedin && (
                <a
                  href={`https://linkedin.com/in/${linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 hover:bg-accent"
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </a>
              )}
              {twitter && (
                <a
                  href={`https://twitter.com/${twitter.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 hover:bg-accent"
                >
                  <Twitter className="h-4 w-4" />
                  Twitter
                </a>
              )}
            </div>
          </div>
        )}

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
            {stats.courses === 0 ? (
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
            ) : (
              <div className="rounded-lg border border-border bg-card p-6">
                <p className="mb-4 text-muted-foreground">
                  Vous avez créé {stats.courses} cours. Gérez-les depuis votre tableau de bord créateur.
                </p>
                <Link
                  href="/creator/courses"
                  className="inline-block rounded-lg bg-primary px-6 py-2 font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Voir mes cours
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
