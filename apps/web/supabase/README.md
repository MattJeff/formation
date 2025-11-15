# Supabase RLS Policies - Guide d'Installation

## 🔒 Sécurité Row Level Security (RLS)

Ce dossier contient les policies de sécurité pour Supabase.

## ⚠️ IMPORTANT - Pourquoi c'est CRITIQUE?

**SANS ces policies, ton application est VULNÉRABLE:**
- ❌ N'importe qui peut modifier/supprimer les cours des autres
- ❌ N'importe qui peut voir les données privées (enrollments, progression)
- ❌ N'importe qui peut s'attribuer des cours qu'il n'a pas achetés
- ❌ AUCUNE protection des données utilisateurs

**AVEC ces policies:**
- ✅ Seul le créateur peut modifier ses cours
- ✅ Seul l'utilisateur peut voir ses inscriptions
- ✅ Seul l'utilisateur peut modifier sa progression
- ✅ Les données sont protégées au niveau de la base de données

## 📝 Comment appliquer les policies?

### Étape 1: Ouvrir Supabase Dashboard

1. Va sur https://supabase.com/dashboard
2. Sélectionne ton projet
3. Clique sur "SQL Editor" dans le menu de gauche

### Étape 2: Exécuter le script SQL

1. Clique sur "New Query"
2. Copie TOUT le contenu du fichier `rls-policies.sql`
3. Colle-le dans l'éditeur SQL
4. Clique sur "Run" (ou Cmd/Ctrl + Enter)

### Étape 3: Vérifier l'activation

Exécute cette requête pour vérifier que les policies sont actives:

```sql
SELECT tablename, policyname
FROM pg_policies
WHERE schemaname = 'public';
```

Tu devrais voir toutes les policies listées.

## 📋 Policies créées

### 1. **profiles** (4 policies)
- ✅ Tout le monde peut voir les profils publics
- ✅ Seul l'utilisateur peut modifier son profil
- ✅ Les utilisateurs peuvent créer leur profil

### 2. **courses** (4 policies)
- ✅ Tout le monde peut voir les cours publiés
- ✅ Le créateur peut voir ses brouillons
- ✅ Seul le créateur peut modifier/supprimer ses cours

### 3. **sections** (4 policies)
- ✅ Visibles si le cours est publié ou appartient à l'utilisateur
- ✅ Seul le créateur du cours peut modifier/supprimer

### 4. **lessons** (4 policies)
- ✅ Visibles si le cours est publié ou appartient à l'utilisateur
- ✅ Seul le créateur du cours peut modifier/supprimer

### 5. **enrollments** (4 policies)
- ✅ L'utilisateur voit ses inscriptions
- ✅ Le créateur voit les inscriptions à ses cours
- ✅ Seul l'utilisateur peut modifier ses inscriptions

### 6. **lesson_progress** (4 policies)
- ✅ L'utilisateur voit sa progression
- ✅ Le créateur voit la progression sur ses cours
- ✅ Seul l'utilisateur peut modifier sa progression

### 7. **reviews** (4 policies)
- ✅ Tout le monde voit les avis publiés
- ✅ Seuls les inscrits peuvent créer un avis
- ✅ L'utilisateur peut modifier son avis
- ✅ Le créateur peut modérer (supprimer) les avis

## 🧪 Comment tester?

### Test 1: Créer un cours
```typescript
// ✅ DEVRAIT FONCTIONNER: Créer son propre cours
const { data, error } = await supabase
  .from('courses')
  .insert({ title: 'Mon cours', creator_id: user.id });

// ❌ DEVRAIT ÉCHOUER: Créer un cours pour quelqu'un d'autre
const { data, error } = await supabase
  .from('courses')
  .insert({ title: 'Cours', creator_id: 'autre-user-id' });
```

### Test 2: Modifier un cours
```typescript
// ✅ DEVRAIT FONCTIONNER: Modifier son propre cours
const { data, error } = await supabase
  .from('courses')
  .update({ title: 'Nouveau titre' })
  .eq('id', myCourseId)
  .eq('creator_id', user.id);

// ❌ DEVRAIT ÉCHOUER: Modifier le cours de quelqu'un d'autre
const { data, error } = await supabase
  .from('courses')
  .update({ title: 'Hack' })
  .eq('id', otherUserCourseId);
```

### Test 3: Voir les enrollments
```typescript
// ✅ DEVRAIT FONCTIONNER: Voir ses propres inscriptions
const { data, error } = await supabase
  .from('enrollments')
  .select('*')
  .eq('user_id', user.id);

// ❌ DEVRAIT RETOURNER VIDE: Voir les inscriptions des autres
const { data, error } = await supabase
  .from('enrollments')
  .select('*')
  .eq('user_id', 'autre-user-id');
```

## 🚨 Dépannage

### Erreur: "new row violates row-level security policy"
**C'est NORMAL!** Ça veut dire que la policy fonctionne et empêche une action non autorisée.

Vérifie que:
1. L'utilisateur est bien connecté (`auth.uid()` existe)
2. L'utilisateur a bien les droits (ex: creator_id = auth.uid())
3. La policy correspond bien à ton besoin

### Les queries ne retournent plus rien
Vérifie que:
1. Les policies `SELECT` sont bien créées
2. L'utilisateur est authentifié
3. Les conditions des policies sont remplies

### Comment désactiver temporairement RLS (DANGER!)
```sql
-- ⚠️ NE FAIRE QUE POUR DEBUG!
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;
-- Réactiver après:
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
```

## 📚 Ressources

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)

## ✅ Checklist

- [ ] J'ai exécuté le script `rls-policies.sql` dans Supabase
- [ ] J'ai vérifié que les policies sont actives
- [ ] J'ai testé la création de cours (doit fonctionner)
- [ ] J'ai testé la modification du cours d'un autre (doit échouer)
- [ ] Mon application fonctionne toujours normalement
- [ ] Je peux créer/modifier/supprimer MES propres ressources
- [ ] Je NE PEUX PAS modifier les ressources des autres

---

**🎯 Une fois les policies appliquées, ton application est SÉCURISÉE au niveau de la base de données!**
