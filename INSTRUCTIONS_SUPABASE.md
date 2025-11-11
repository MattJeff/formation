# 📋 INSTRUCTIONS SUPABASE - CONFIGURATION COMPLÈTE

## 🎯 Étapes à Suivre

### 1. Accéder à Supabase
```
1. Aller sur https://supabase.com
2. Se connecter à votre compte
3. Sélectionner votre projet SkillForge
```

### 2. Exécuter le Schéma SQL

#### Option A: Via l'Interface Supabase (Recommandé)
```
1. Dans le menu latéral, cliquer sur "SQL Editor"
2. Cliquer sur "New query"
3. Copier TOUT le contenu du fichier SUPABASE_SCHEMA.sql
4. Coller dans l'éditeur SQL
5. Cliquer sur "Run" (ou Ctrl+Enter)
6. ✅ Attendre la confirmation "Success"
```

#### Option B: Via la CLI Supabase
```bash
# Installer la CLI si nécessaire
npm install -g supabase

# Se connecter
supabase login

# Exécuter le schéma
supabase db push
```

### 3. Vérifier les Tables Créées
```
1. Dans le menu latéral, cliquer sur "Table Editor"
2. Vous devriez voir 9 tables:
   ✅ profiles
   ✅ courses
   ✅ sections
   ✅ lessons
   ✅ lesson_resources
   ✅ enrollments
   ✅ lesson_progress
   ✅ reviews
   ✅ payments
```

### 4. Vérifier les Politiques RLS
```
1. Cliquer sur une table (ex: courses)
2. Aller dans l'onglet "Policies"
3. Vous devriez voir les politiques de sécurité
```

---

## 📊 Structure des Tables

### 1. profiles
```sql
- id (UUID, PK) - Lié à auth.users
- email (TEXT)
- first_name, last_name (TEXT)
- role (TEXT) - 'learner' ou 'creator'
- bio, avatar_url, website (TEXT)
- social media (twitter, linkedin, github)
```

### 2. courses
```sql
- id (UUID, PK)
- creator_id (UUID, FK → profiles)
- title, subtitle, description (TEXT)
- category, level, language (TEXT)
- price, compare_price (DECIMAL)
- cover_image, promo_video (TEXT)
- status (TEXT) - 'draft', 'published', 'archived'
- requirements, learning_objectives (TEXT[])
- statistiques (total_duration, total_lessons, etc.)
```

### 3. sections
```sql
- id (UUID, PK)
- course_id (UUID, FK → courses)
- title, description (TEXT)
- order_index (INTEGER)
```

### 4. lessons
```sql
- id (UUID, PK)
- section_id (UUID, FK → sections)
- title, description (TEXT)
- type (TEXT) - 'video', 'text', 'pdf', 'link', 'file', 'quiz'
- content (TEXT) - URL ou contenu
- duration (INTEGER) - en secondes
- order_index (INTEGER)
- is_preview (BOOLEAN)
```

### 5. enrollments
```sql
- id (UUID, PK)
- user_id (UUID, FK → profiles)
- course_id (UUID, FK → courses)
- progress (INTEGER) - 0-100%
- completed_lessons (INTEGER)
- dates (last_accessed_at, completed_at)
```

### 6. reviews
```sql
- id (UUID, PK)
- user_id (UUID, FK → profiles)
- course_id (UUID, FK → courses)
- rating (INTEGER) - 1-5
- comment (TEXT)
```

---

## 🔒 Sécurité (RLS)

### Politiques Implémentées

**Profiles** :
- ✅ Tout le monde peut voir les profils publics
- ✅ Chacun peut modifier son propre profil

**Courses** :
- ✅ Tout le monde peut voir les cours publiés
- ✅ Les créateurs voient leurs brouillons
- ✅ Les créateurs peuvent CRUD leurs cours

**Sections/Lessons** :
- ✅ Visibles si le cours est accessible
- ✅ Les créateurs peuvent tout gérer

**Enrollments** :
- ✅ Chacun voit ses propres inscriptions
- ✅ Chacun peut s'inscrire aux cours

**Reviews** :
- ✅ Tout le monde peut voir les avis
- ✅ Seuls les étudiants inscrits peuvent laisser un avis

---

## 🔧 Triggers Automatiques

### 1. Création de Profil
```sql
Quand un utilisateur s'inscrit via auth.users
→ Un profil est automatiquement créé dans profiles
→ Le rôle est extrait des métadonnées
```

### 2. Mise à Jour Automatique
```sql
Quand une ligne est modifiée
→ Le champ updated_at est automatiquement mis à jour
```

---

## ✅ Vérification Post-Installation

### Test 1: Créer un Profil
```sql
-- Dans SQL Editor
SELECT * FROM profiles;
-- Devrait être vide au début
```

### Test 2: Créer un Cours (via l'app)
```
1. Aller sur /creator/courses/new
2. Créer un cours
3. Vérifier dans Supabase:
   SELECT * FROM courses;
```

### Test 3: Vérifier les Politiques
```sql
-- Tester en tant qu'utilisateur non connecté
SELECT * FROM courses WHERE status = 'published';
-- Devrait fonctionner

SELECT * FROM courses WHERE status = 'draft';
-- Devrait être vide (sauf vos propres brouillons)
```

---

## 🚀 Prochaines Étapes

Après avoir exécuté le schéma :

1. ✅ **Tester la création de profil**
   - S'inscrire avec un nouvel utilisateur
   - Vérifier que le profil est créé automatiquement

2. ✅ **Tester le CRUD de cours**
   - Créer un cours
   - Le modifier
   - Le publier
   - Vérifier dans Supabase

3. ✅ **Tester les inscriptions**
   - S'inscrire à un cours
   - Vérifier la table enrollments

4. ✅ **Tester les avis**
   - Laisser un avis sur un cours
   - Vérifier la table reviews

---

## 📝 Notes Importantes

### Sécurité
- ✅ RLS activé sur toutes les tables
- ✅ Politiques de sécurité configurées
- ✅ Seuls les propriétaires peuvent modifier leurs données

### Performance
- ✅ Index créés sur les colonnes fréquemment utilisées
- ✅ Optimisé pour les requêtes courantes

### Évolutivité
- ✅ Structure extensible
- ✅ Facile d'ajouter de nouvelles tables
- ✅ Relations bien définies

---

## 🆘 En Cas de Problème

### Erreur lors de l'exécution
```
1. Vérifier que vous êtes sur le bon projet
2. Vérifier les permissions
3. Essayer de supprimer les tables existantes:
   DROP TABLE IF EXISTS [nom_table] CASCADE;
4. Réexécuter le schéma
```

### Tables déjà existantes
```sql
-- Supprimer toutes les tables (ATTENTION: perte de données)
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS lesson_progress CASCADE;
DROP TABLE IF EXISTS enrollments CASCADE;
DROP TABLE IF EXISTS lesson_resources CASCADE;
DROP TABLE IF EXISTS lessons CASCADE;
DROP TABLE IF EXISTS sections CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Puis réexécuter SUPABASE_SCHEMA.sql
```

---

## ✅ Checklist Finale

Avant de continuer :

- [ ] Schéma SQL exécuté sans erreur
- [ ] 9 tables créées et visibles
- [ ] Politiques RLS actives
- [ ] Triggers créés
- [ ] Test de création de profil réussi
- [ ] Prêt pour l'intégration avec l'app

**Une fois terminé, je vais réimplémenter l'authentification dans l'app !** 🚀
