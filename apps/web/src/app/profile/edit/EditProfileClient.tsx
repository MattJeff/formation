'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { Header } from '@/components/layout/Header';
import { ArrowLeft, Upload, Loader2, CheckCircle, XCircle, User } from 'lucide-react';

export function EditProfileClient() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    website: '',
    github: '',
    linkedin: '',
    twitter: '',
    avatarUrl: '',
  });

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();

      if (!currentUser) {
        router.push('/login');
        return;
      }

      setUser(currentUser);

      // Charger le profil depuis la table profiles
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      setProfile(profileData);

      // Charger les données du profil
      setFormData({
        firstName: profileData?.first_name || currentUser.user_metadata?.first_name || '',
        lastName: profileData?.last_name || currentUser.user_metadata?.last_name || '',
        bio: profileData?.bio || currentUser.user_metadata?.bio || '',
        website: profileData?.website || currentUser.user_metadata?.website || '',
        github: profileData?.github || currentUser.user_metadata?.github || '',
        linkedin: profileData?.linkedin || currentUser.user_metadata?.linkedin || '',
        twitter: profileData?.twitter || currentUser.user_metadata?.twitter || '',
        avatarUrl: profileData?.avatar_url || currentUser.user_metadata?.avatar_url || '',
      });

      setLoading(false);
    };

    loadUser();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation du fichier
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

    if (!allowedTypes.includes(file.type)) {
      setMessage({ type: 'error', text: 'Format non autorisé. Utilisez JPG, PNG ou WebP' });
      return;
    }

    if (file.size > maxSize) {
      setMessage({ type: 'error', text: 'Le fichier ne doit pas dépasser 5MB' });
      return;
    }

    // Aperçu local
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload vers le serveur
    setUploadingAvatar(true);
    setMessage(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Session expirée');
      }

      const formDataToSend = new FormData();
      formDataToSend.append('file', file);

      const response = await fetch('/api/profile/upload-avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'upload');
      }

      setFormData({
        ...formData,
        avatarUrl: data.avatar_url,
      });

      setMessage({ type: 'success', text: 'Avatar uploadé avec succès !' });
    } catch (error: any) {
      console.error('Erreur upload avatar:', error);
      setMessage({ type: 'error', text: error.message || 'Erreur lors de l\'upload' });
      setAvatarPreview(null);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Session expirée');
      }

      // Appeler l'API de mise à jour du profil
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          bio: formData.bio,
          avatar_url: formData.avatarUrl,
          website: formData.website,
          github: formData.github,
          linkedin: formData.linkedin,
          twitter: formData.twitter,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la mise à jour');
      }

      setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });

      // Rediriger après 2 secondes
      setTimeout(() => {
        router.push('/profile');
        router.refresh();
      }, 2000);
    } catch (error: any) {
      console.error('Erreur mise à jour profil:', error);
      setMessage({ type: 'error', text: error.message || 'Une erreur est survenue' });
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Link href="/profile" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au profil
        </Link>

        <h1 className="mb-8 text-3xl font-bold">Modifier le profil</h1>

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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-4 text-xl font-semibold">Photo de profil</h2>
            <div className="flex items-center gap-6">
              <div className="relative h-24 w-24">
                {avatarPreview || formData.avatarUrl ? (
                  <Image
                    src={avatarPreview || formData.avatarUrl}
                    alt="Avatar"
                    width={96}
                    height={96}
                    className="h-24 w-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-blue-500/20 text-3xl font-bold">
                    {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
                  </div>
                )}
                {uploadingAvatar && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                  </div>
                )}
              </div>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={handleAvatarClick}
                  disabled={uploadingAvatar}
                  className="mb-2 flex items-center gap-2 rounded-lg border border-border px-4 py-2 hover:bg-accent disabled:opacity-50"
                >
                  <Upload className="h-4 w-4" />
                  {uploadingAvatar ? 'Upload en cours...' : 'Changer la photo'}
                </button>
                <p className="text-xs text-muted-foreground">JPG, PNG ou WebP jusqu'à 5MB</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-4 text-xl font-semibold">Informations personnelles</h2>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Prénom <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    required
                    disabled={saving}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Nom <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    required
                    disabled={saving}
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={user?.email}
                  className="w-full rounded-md border border-input bg-secondary px-3 py-2 text-muted-foreground"
                  disabled
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  L'email ne peut pas être modifié
                </p>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  placeholder="Parlez-nous de vous..."
                  disabled={saving}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Site web</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  disabled={saving}
                />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-4 text-xl font-semibold">Réseaux sociaux</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">GitHub</label>
                <input
                  type="text"
                  name="github"
                  value={formData.github}
                  onChange={handleChange}
                  placeholder="username"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  disabled={saving}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">LinkedIn</label>
                <input
                  type="text"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="username"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  disabled={saving}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Twitter</label>
                <input
                  type="text"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleChange}
                  placeholder="@username"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  disabled={saving}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Link
              href="/profile"
              className="rounded-lg border border-border px-6 py-2 hover:bg-accent"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2 text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                'Sauvegarder les modifications'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
