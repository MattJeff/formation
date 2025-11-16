'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

export function SignupForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const validatePassword = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    setPasswordStrength(strength);
    return strength >= 2;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'password') {
      validatePassword(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validations
    if (!formData.firstName || !formData.lastName) {
      setError('Veuillez remplir tous les champs');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      setLoading(false);
      return;
    }

    if (!validatePassword(formData.password)) {
      setError('Le mot de passe doit contenir des lettres et des chiffres');
      setLoading(false);
      return;
    }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/verify-email`,
          data: {
            full_name: `${formData.firstName} ${formData.lastName}`,
            first_name: formData.firstName,
            last_name: formData.lastName,
          },
        },
      });

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          setError('Cet email est déjà utilisé');
        } else if (signUpError.message.includes('Password')) {
          setError('Le mot de passe ne respecte pas les critères de sécurité');
        } else {
          setError(signUpError.message);
        }
        setLoading(false);
        return;
      }

      if (data.user) {
        // Stocker l'email pour pouvoir renvoyer l'email de vérification
        localStorage.setItem('pendingVerificationEmail', formData.email);
        setSuccess(true);
        setTimeout(() => {
          router.push('/verify-email');
        }, 2000);
      }
    } catch (err: any) {
      setError('Une erreur est survenue. Veuillez réessayer.');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
          <CheckCircle2 className="h-8 w-8 text-green-500" />
        </div>
        <h2 className="mb-2 text-2xl font-bold">Inscription réussie !</h2>
        <p className="mb-4 text-muted-foreground">
          Un email de vérification a été envoyé à <strong>{formData.email}</strong>
        </p>
        <p className="text-sm text-muted-foreground">Redirection vers la page de vérification...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {error && (
        <div className="mb-4 flex items-start gap-3 rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
          <XCircle className="h-5 w-5 flex-shrink-0" />
          <div>
            <strong>Erreur:</strong> {error}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="mb-2 block text-sm font-medium">
              Prénom <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="John"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="lastName" className="mb-2 block text-sm font-medium">
              Nom <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Doe"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email <span className="text-destructive">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="vous@exemple.com"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium">
            Mot de passe <span className="text-destructive">*</span>
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="••••••••"
            required
            disabled={loading}
          />
          {formData.password && (
            <div className="mt-2">
              <div className="flex gap-1">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded ${
                      i < passwordStrength
                        ? passwordStrength <= 1
                          ? 'bg-destructive'
                          : passwordStrength <= 2
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                        : 'bg-secondary'
                    }`}
                  />
                ))}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {passwordStrength <= 1 && 'Faible'}
                {passwordStrength === 2 && 'Moyen'}
                {passwordStrength === 3 && 'Fort'}
                {passwordStrength === 4 && 'Très fort'}
              </p>
            </div>
          )}
          <p className="mt-1 text-xs text-muted-foreground">
            Minimum 8 caractères, lettres et chiffres
          </p>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium">
            Confirmer le mot de passe <span className="text-destructive">*</span>
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="••••••••"
            required
            disabled={loading}
          />
        </div>

        <div className="flex items-start">
          <input type="checkbox" id="terms" className="mr-2 mt-1" required disabled={loading} />
          <label htmlFor="terms" className="text-sm text-muted-foreground">
            J'accepte les{' '}
            <Link href="/terms" className="text-primary hover:underline">
              conditions d'utilisation
            </Link>{' '}
            et la{' '}
            <Link href="/privacy" className="text-primary hover:underline">
              politique de confidentialité
            </Link>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-primary py-2 font-semibold text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Création du compte...
            </span>
          ) : (
            'Créer mon compte'
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Vous avez déjà un compte ?{' '}
        <Link href="/login" className="text-primary hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
