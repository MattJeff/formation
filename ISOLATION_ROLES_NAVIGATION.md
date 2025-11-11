# 🎯 ISOLATION DES RÔLES ET NAVIGATION PERSONNALISÉE

## 🔒 Problème à Résoudre

**Actuellement** :
- Apprenant et Formateur voient les mêmes menus
- Confusion entre "Mes cours" (apprenant) et "Mes cours" (formateur)
- Navigation pas adaptée au rôle

**Solution** :
- Navigation complètement différente selon le rôle
- Pages isolées par rôle
- Redirection automatique selon le rôle

---

## 📊 Navigation par Rôle

### LEARNER (Apprenant)
```
Header:
├─ Logo SkillForge
├─ Catalogue (tous les cours)
├─ Mes Cours (cours achetés)
├─ Parcours (learning paths)
└─ Profil
    ├─ Mon Profil
    ├─ Mes Certificats
    ├─ Paramètres
    └─ Déconnexion

Pages accessibles:
✅ /courses (catalogue)
✅ /courses/[id] (détails cours)
✅ /my-courses (mes cours achetés)
✅ /learn/[courseId] (suivre un cours)
✅ /dashboard (dashboard apprenant)
✅ /profile
✅ /settings
❌ /creator/* (INTERDIT)
```

### CREATOR (Formateur)
```
Header:
├─ Logo SkillForge
├─ Dashboard
├─ Mes Formations (créées)
├─ Étudiants
├─ Analytics
└─ Profil
    ├─ Mon Profil
    ├─ Revenus
    ├─ Paramètres
    └─ Déconnexion

Pages accessibles:
✅ /creator/dashboard
✅ /creator/courses (mes formations)
✅ /creator/courses/new
✅ /creator/courses/[id]/*
✅ /creator/students
✅ /creator/analytics
✅ /creator/earnings
✅ /profile
✅ /settings
❌ /my-courses (INTERDIT)
❌ /learn/* (INTERDIT)
```

---

## 🔧 Implémentation

### 1. Middleware de Protection
```typescript
// middleware.ts
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
  const learnerRoutes = ['/my-courses', '/learn'];
  // Routes protégées CREATOR
  const creatorRoutes = ['/creator'];

  if (session) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    const userRole = profile?.role;

    // Bloquer les routes creator pour les learners
    if (userRole === 'learner' && creatorRoutes.some(route => path.startsWith(route))) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Bloquer les routes learner pour les creators
    if (userRole === 'creator' && learnerRoutes.some(route => path.startsWith(route))) {
      return NextResponse.redirect(new URL('/creator/dashboard', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ['/creator/:path*', '/my-courses', '/learn/:path*'],
};
```

### 2. Header Dynamique Amélioré
```typescript
// components/layout/Header.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export function Header() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<'learner' | 'creator' | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        // Récupérer le rôle depuis la table profiles
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        setRole(profile?.role);
      }
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  // Navigation pour LEARNER
  if (role === 'learner') {
    return (
      <header className="border-b">
        <nav>
          <Link href="/">SkillForge</Link>
          <Link href="/courses">Catalogue</Link>
          <Link href="/my-courses">Mes Cours</Link>
          <Link href="/dashboard">Tableau de bord</Link>
          {/* Profil dropdown */}
        </nav>
      </header>
    );
  }

  // Navigation pour CREATOR
  if (role === 'creator') {
    return (
      <header className="border-b">
        <nav>
          <Link href="/">SkillForge</Link>
          <Link href="/creator/dashboard">Dashboard</Link>
          <Link href="/creator/courses">Mes Formations</Link>
          <Link href="/creator/students">Étudiants</Link>
          <Link href="/creator/analytics">Analytics</Link>
          {/* Profil dropdown */}
        </nav>
      </header>
    );
  }

  // Navigation publique (non connecté)
  return (
    <header className="border-b">
      <nav>
        <Link href="/">SkillForge</Link>
        <Link href="/courses">Cours</Link>
        <Link href="/login">Connexion</Link>
        <Link href="/signup">S'inscrire</Link>
      </nav>
    </header>
  );
}
```

### 3. Composant de Protection de Route
```typescript
// components/auth/RoleGuard.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

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
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!profile || !allowedRoles.includes(profile.role)) {
        const redirectUrl = profile?.role === 'creator' 
          ? '/creator/dashboard' 
          : '/dashboard';
        router.push(redirectUrl);
        return;
      }

      setIsAuthorized(true);
      setLoading(false);
    };

    checkRole();
  }, [allowedRoles, router]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
```

### 4. Utilisation dans les Pages
```typescript
// app/my-courses/page.tsx
import { RoleGuard } from '@/components/auth/RoleGuard';

export default function MyCoursesPage() {
  return (
    <RoleGuard allowedRoles={['learner']}>
      <div>
        <h1>Mes Cours (Apprenant)</h1>
        {/* Contenu pour learner uniquement */}
      </div>
    </RoleGuard>
  );
}

// app/creator/courses/page.tsx
import { RoleGuard } from '@/components/auth/RoleGuard';

export default function CreatorCoursesPage() {
  return (
    <RoleGuard allowedRoles={['creator']}>
      <div>
        <h1>Mes Formations (Créateur)</h1>
        {/* Contenu pour creator uniquement */}
      </div>
    </RoleGuard>
  );
}
```

---

## 📋 Pages à Créer/Modifier

### Pages Communes (les deux rôles)
- ✅ `/` - Home
- ✅ `/courses` - Catalogue (tous)
- ✅ `/courses/[id]` - Détails cours
- ✅ `/profile` - Profil
- ✅ `/settings` - Paramètres

### Pages LEARNER uniquement
- ✅ `/dashboard` - Dashboard apprenant
- ✅ `/my-courses` - Mes cours achetés
- ✅ `/learn/[courseId]` - Suivre un cours
- ✅ `/certificates` - Mes certificats

### Pages CREATOR uniquement
- ✅ `/creator/dashboard` - Dashboard créateur
- ✅ `/creator/courses` - Mes formations
- ✅ `/creator/courses/new` - Créer formation
- ✅ `/creator/courses/[id]/*` - Gérer formation
- ✅ `/creator/students` - Mes étudiants
- ✅ `/creator/analytics` - Analytics
- ✅ `/creator/earnings` - Revenus

---

## ✅ Checklist d'Implémentation

### Étape 1: Supabase
- [ ] Exécuter SUPABASE_SCHEMA.sql
- [ ] Vérifier les tables créées
- [ ] Tester la création de profil

### Étape 2: Middleware
- [ ] Créer middleware.ts
- [ ] Tester la protection des routes
- [ ] Vérifier les redirections

### Étape 3: Header
- [ ] Modifier Header.tsx
- [ ] Récupérer le rôle depuis profiles
- [ ] Afficher navigation selon rôle

### Étape 4: RoleGuard
- [ ] Créer RoleGuard.tsx
- [ ] Protéger les pages sensibles
- [ ] Tester les accès

### Étape 5: Tests
- [ ] Tester en tant que learner
- [ ] Tester en tant que creator
- [ ] Vérifier les redirections
- [ ] Vérifier les menus

---

## 🎯 Résultat Final

**Learner** :
- Voit uniquement ses cours achetés
- Peut suivre les cours
- Dashboard apprenant
- Ne peut pas créer de cours

**Creator** :
- Voit uniquement ses formations créées
- Peut créer/modifier des cours
- Dashboard créateur avec analytics
- Ne peut pas s'inscrire aux cours

**Sécurité** :
- Routes protégées par middleware
- Vérification côté serveur (RLS)
- Impossible d'accéder aux pages de l'autre rôle

**Le système sera parfaitement isolé !** 🔒
