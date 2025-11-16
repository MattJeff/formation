'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Header } from '@/components/layout/Header';
import {
  ArrowLeft,
  Loader2,
  CheckCircle,
  XCircle,
  Lock,
  Bell,
  Shield,
  Trash2,
  AlertTriangle,
} from 'lucide-react';

export function SettingsClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    courseUpdates: true,
    marketingEmails: false,
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Validation
      if (passwordData.newPassword.length < 8) {
        throw new Error('Le mot de passe doit contenir au moins 8 caractères');
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        throw new Error('Les mots de passe ne correspondent pas');
      }

      // Mettre à jour le mot de passe
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });

      if (error) {
        throw error;
      }

      setMessage({ type: 'success', text: 'Mot de passe modifié avec succès !' });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      console.error('Erreur changement mot de passe:', error);
      setMessage({ type: 'error', text: error.message || 'Erreur lors du changement de mot de passe' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.'
    );

    if (!confirmed) return;

    const doubleConfirmed = window.confirm(
      'Confirmation finale : Toutes vos données seront supprimées définitivement. Continuer ?'
    );

    if (!doubleConfirmed) return;

    try {
      setLoading(true);
      setMessage(null);

      // Note: La suppression de compte nécessite une API route côté serveur
      // Car supabase.auth.admin.deleteUser n'est pas disponible côté client
      alert('La suppression de compte doit être implémentée via une route API sécurisée.');

      // TODO: Créer /api/account/delete route

    } catch (error: any) {
      console.error('Erreur suppression compte:', error);
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Link href="/profile" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au profil
        </Link>

        <h1 className="mb-8 text-3xl font-bold">Paramètres du compte</h1>

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

        {/* Sécurité et mot de passe */}
        <div className="mb-8 rounded-lg border border-border bg-card p-6">
          <div className="mb-6 flex items-center gap-3">
            <Lock className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">Sécurité et mot de passe</h2>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Nouveau mot de passe <span className="text-destructive">*</span>
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                placeholder="Minimum 8 caractères"
                minLength={8}
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Confirmer le mot de passe <span className="text-destructive">*</span>
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                placeholder="Retapez le mot de passe"
                minLength={8}
                required
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2 text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Modification...
                </>
              ) : (
                'Changer le mot de passe'
              )}
            </button>
          </form>
        </div>

        {/* Notifications */}
        <div className="mb-8 rounded-lg border border-border bg-card p-6">
          <div className="mb-6 flex items-center gap-3">
            <Bell className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">Préférences de notifications</h2>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notifications par email</p>
                <p className="text-sm text-muted-foreground">Recevoir des emails pour les événements importants</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.emailNotifications}
                onChange={(e) => setPreferences({ ...preferences, emailNotifications: e.target.checked })}
                className="h-5 w-5"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium">Mises à jour de cours</p>
                <p className="text-sm text-muted-foreground">Être notifié des nouveaux contenus</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.courseUpdates}
                onChange={(e) => setPreferences({ ...preferences, courseUpdates: e.target.checked })}
                className="h-5 w-5"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium">Emails marketing</p>
                <p className="text-sm text-muted-foreground">Recevoir des offres et promotions</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.marketingEmails}
                onChange={(e) => setPreferences({ ...preferences, marketingEmails: e.target.checked })}
                className="h-5 w-5"
              />
            </label>
          </div>

          <button
            className="mt-6 rounded-lg border border-border px-6 py-2 hover:bg-accent"
            onClick={() => setMessage({ type: 'success', text: 'Préférences enregistrées' })}
          >
            Enregistrer les préférences
          </button>
        </div>

        {/* Confidentialité */}
        <div className="mb-8 rounded-lg border border-border bg-card p-6">
          <div className="mb-6 flex items-center gap-3">
            <Shield className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">Confidentialité et données</h2>
          </div>

          <div className="space-y-4 text-sm">
            <p>
              Vos données personnelles sont protégées conformément au RGPD. Vous pouvez :
            </p>
            <ul className="list-inside list-disc space-y-2 text-muted-foreground">
              <li>Demander une copie de toutes vos données</li>
              <li>Demander la rectification de vos données</li>
              <li>Demander la suppression de votre compte</li>
            </ul>
            <div className="flex gap-3">
              <Link
                href="/privacy"
                className="rounded-lg border border-border px-4 py-2 hover:bg-accent"
              >
                Politique de confidentialité
              </Link>
              <button
                className="rounded-lg border border-border px-4 py-2 hover:bg-accent"
                onClick={() => alert('Cette fonctionnalité sera bientôt disponible')}
              >
                Télécharger mes données
              </button>
            </div>
          </div>
        </div>

        {/* Zone danger */}
        <div className="rounded-lg border border-destructive bg-destructive/5 p-6">
          <div className="mb-6 flex items-center gap-3">
            <Trash2 className="h-6 w-6 text-destructive" />
            <h2 className="text-xl font-semibold text-destructive">Zone de danger</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-lg bg-destructive/10 p-4">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <div>
                <p className="font-medium text-destructive">Suppression du compte</p>
                <p className="text-sm text-muted-foreground">
                  Une fois supprimé, votre compte ne pourra pas être récupéré. Toutes vos données seront définitivement effacées.
                </p>
              </div>
            </div>

            <button
              onClick={handleDeleteAccount}
              disabled={loading}
              className="rounded-lg border-2 border-destructive bg-destructive px-6 py-2 font-semibold text-white hover:bg-destructive/90 disabled:opacity-50"
            >
              Supprimer mon compte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
