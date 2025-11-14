'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Header } from '@/components/layout/Header';
import { ArrowLeft, Bell, Lock, CreditCard, Globe, Trash2, Users, GraduationCap, Loader2, CheckCircle, XCircle } from 'lucide-react';

export function SettingsClient() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [changingRole, setChangingRole] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (!currentUser) {
        router.push('/login');
        return;
      }

      setUser(currentUser);
      setLoading(false);
    };

    loadUser();
  }, [router]);

  const handleRoleChange = async (newRole: 'learner' | 'creator') => {
    if (user?.user_metadata?.role === newRole) {
      setMessage({ type: 'error', text: 'Vous avez déjà ce rôle' });
      return;
    }

    setChangingRole(true);
    setMessage(null);

    try {
      // 1. Mettre à jour le rôle dans user_metadata
      const { error } = await supabase.auth.updateUser({
        data: {
          role: newRole,
        },
      });

      if (error) {
        setMessage({ type: 'error', text: error.message });
        setChangingRole(false);
        return;
      }

      // 2. Mettre à jour le rôle dans la table profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', user.id);

      if (profileError) {
        console.error('Erreur mise à jour profil:', profileError);
        // Continue même si la table profiles n'existe pas encore
      }

      // 3. Rafraîchir la session pour obtenir les nouvelles metadata
      const { error: refreshError } = await supabase.auth.refreshSession();

      if (refreshError) {
        console.error('Erreur refresh session:', refreshError);
      }

      setMessage({
        type: 'success',
        text: `Rôle changé avec succès ! Redirection vers votre nouveau dashboard...`
      });

      // 3. Rediriger après 1.5 secondes (la session sera mise à jour par AuthProvider)
      setTimeout(() => {
        if (newRole === 'creator') {
          router.push('/creator/dashboard');
        } else {
          router.push('/dashboard');
        }
        window.location.reload(); // Force le reload pour rafraîchir complètement
      }, 1500);
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Une erreur est survenue' });
      setChangingRole(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const currentRole = user?.user_metadata?.role;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Link href="/profile" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au profil
        </Link>

        <h1 className="mb-8 text-3xl font-bold">Paramètres</h1>

        {message && (
          <div className={`mb-6 flex items-center gap-3 rounded-lg border p-4 ${
            message.type === 'success' 
              ? 'border-green-500 bg-green-500/10 text-green-500' 
              : 'border-destructive bg-destructive/10 text-destructive'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <XCircle className="h-5 w-5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <div className="space-y-6">
          {/* Section: Changement de rôle */}
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-3">
              <Users className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Rôle sur la plateforme</h2>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">
              Vous pouvez changer de rôle à tout moment. Votre profil et vos données seront conservés.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => handleRoleChange('learner')}
                disabled={changingRole || currentRole === 'learner'}
                className={`flex w-full items-center justify-between rounded-lg border p-4 transition-all ${
                  currentRole === 'learner'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary hover:bg-accent'
                } ${changingRole ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-5 w-5 text-blue-500" />
                  <div className="text-left">
                    <p className="font-semibold">Apprenant</p>
                    <p className="text-sm text-muted-foreground">Suivre des cours et développer mes compétences</p>
                  </div>
                </div>
                {currentRole === 'learner' && (
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    Actif
                  </span>
                )}
              </button>

              <button
                onClick={() => handleRoleChange('creator')}
                disabled={changingRole || currentRole === 'creator'}
                className={`flex w-full items-center justify-between rounded-lg border p-4 transition-all ${
                  currentRole === 'creator'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary hover:bg-accent'
                } ${changingRole ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-purple-500" />
                  <div className="text-left">
                    <p className="font-semibold">Créateur</p>
                    <p className="text-sm text-muted-foreground">Créer des cours et partager mes connaissances</p>
                  </div>
                </div>
                {currentRole === 'creator' && (
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    Actif
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Section: Notifications */}
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-3">
              <Bell className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Notifications</h2>
            </div>
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Emails de cours</p>
                  <p className="text-sm text-muted-foreground">Recevoir des mises à jour sur vos cours</p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4" />
              </label>
              <label className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Newsletter</p>
                  <p className="text-sm text-muted-foreground">Nouveautés et conseils d'apprentissage</p>
                </div>
                <input type="checkbox" className="h-4 w-4" />
              </label>
              <label className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Promotions</p>
                  <p className="text-sm text-muted-foreground">Offres spéciales et réductions</p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4" />
              </label>
            </div>
          </div>

          {/* Section: Sécurité */}
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-3">
              <Lock className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Sécurité</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Mot de passe</p>
                  <p className="text-sm text-muted-foreground">Modifier votre mot de passe</p>
                </div>
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Modifier
                </Link>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Authentification à deux facteurs</p>
                  <p className="text-sm text-muted-foreground">Sécurisez votre compte</p>
                </div>
                <button className="text-sm text-muted-foreground">Bientôt disponible</button>
              </div>
            </div>
          </div>

          {/* Section: Abonnement */}
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Abonnement</h2>
            </div>
            <div className="rounded-lg bg-secondary p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-semibold">Plan Gratuit</span>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">Actif</span>
              </div>
              <p className="mb-4 text-sm text-muted-foreground">Passez à Premium pour débloquer toutes les fonctionnalités</p>
              <Link href="/pricing" className="inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Voir les plans
              </Link>
            </div>
          </div>

          {/* Section: Préférences */}
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-3">
              <Globe className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Préférences</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Langue</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2">
                  <option>Français</option>
                  <option>English</option>
                  <option>Español</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Fuseau horaire</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2">
                  <option>Europe/Paris (GMT+1)</option>
                  <option>America/New_York (GMT-5)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section: Zone de danger */}
          <div className="rounded-lg border border-destructive bg-card p-6">
            <div className="mb-4 flex items-center gap-3">
              <Trash2 className="h-5 w-5 text-destructive" />
              <h2 className="text-xl font-semibold text-destructive">Zone de danger</h2>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">
              Une fois votre compte supprimé, toutes vos données seront définitivement effacées
            </p>
            <button className="rounded-lg border border-destructive px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive hover:text-destructive-foreground">
              Supprimer mon compte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
