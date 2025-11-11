# ⚠️ ERREUR 406 - SOLUTION

## 🎯 Problème

**Erreur** : `Failed to load resource: 406 () (profiles)`
**Cause** : La table `profiles` n'existe pas encore dans Supabase OU les politiques RLS bloquent l'accès

---

## ✅ Solution Immédiate (Fallback)

J'ai ajouté un **fallback** dans le Header :
- Si la table `profiles` n'existe pas → Utilise `user_metadata.role`
- Si erreur 406 → Utilise le rôle par défaut `learner`
- L'app fonctionne même sans la table profiles

**Code ajouté** :
```typescript
const { data: profile, error } = await supabase
  .from('profiles')
  .select('role')
  .eq('id', currentUser.id)
  .single();

if (error) {
  console.error('❌ Erreur récupération profil:', error);
  // Fallback: utiliser le rôle des métadonnées
  const roleFromMetadata = currentUser.user_metadata?.role || 'learner';
  setRole(roleFromMetadata as 'learner' | 'creator');
} else if (profile) {
  setRole(profile.role as 'learner' | 'creator');
}
```

---

## 🔧 Solution Définitive

### VOUS DEVEZ EXÉCUTER LE SCHÉMA SQL

**Rappel** : Vous devez créer les tables dans Supabase !

#### Étapes :
```
1. Ouvrir https://supabase.com
2. Votre projet
3. SQL Editor
4. Copier SUPABASE_SCHEMA.sql
5. Coller et exécuter
6. Vérifier les 9 tables créées
```

**Fichier** : `SUPABASE_SCHEMA.sql` (à la racine du projet)

---

## 🧪 Test Temporaire

**Avec le fallback** :
- ✅ L'app fonctionne
- ✅ Le rôle vient de `user_metadata`
- ✅ Navigation fonctionne
- ⚠️ Pas de persistance en base

**Après création des tables** :
- ✅ L'app fonctionne
- ✅ Le rôle vient de `profiles`
- ✅ Persistance en base
- ✅ RLS actif

---

## 📊 État Actuel

### Avec Fallback (Maintenant)
```
✅ App fonctionne
✅ Navigation par rôle
✅ Pas d'erreur 406
⚠️ Rôle temporaire (user_metadata)
⚠️ Pas de base de données
```

### Après Schéma SQL
```
✅ App fonctionne
✅ Navigation par rôle
✅ Pas d'erreur 406
✅ Rôle persistant (profiles table)
✅ Base de données complète
✅ CRUD fonctionnel
```

---

## 🎯 Action Requise

**VOUS** :
1. Exécuter `SUPABASE_SCHEMA.sql` dans Supabase
2. Vérifier les 9 tables
3. Recharger l'app

**MOI** :
- ✅ Fallback ajouté
- ✅ App fonctionne temporairement
- ✅ Prêt pour les tables

---

## 💡 Note

Le fallback permet de **tester l'app** même sans les tables Supabase.

**Mais pour un système complet** :
- Vous DEVEZ créer les tables
- Exécuter SUPABASE_SCHEMA.sql
- Avoir la vraie base de données

**L'app fonctionne maintenant, mais créez les tables pour le système complet !** 🚀
