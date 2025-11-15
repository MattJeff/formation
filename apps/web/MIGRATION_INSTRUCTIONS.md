# 🚀 Migration à appliquer : Colonnes pour les leçons

## Problème
La table `lessons` ne possède pas les colonnes nécessaires pour stocker les URLs des fichiers et vidéos.

## Solution rapide

### Option 1 : Via le Dashboard Supabase (RECOMMANDÉ)

1. Va sur [Supabase Dashboard](https://supabase.com/dashboard)
2. Sélectionne ton projet
3. Va dans **SQL Editor** (icône </> dans le menu latéral)
4. Clique sur **New query**
5. Copie-colle le SQL ci-dessous :

```sql
-- Migration: Ajouter les champs de contenu aux leçons
-- Date: 2025-11-14

-- Ajouter les colonnes pour le contenu des leçons si elles n'existent pas déjà
ALTER TABLE lessons
ADD COLUMN IF NOT EXISTS video_url TEXT,
ADD COLUMN IF NOT EXISTS content TEXT,
ADD COLUMN IF NOT EXISTS file_url TEXT;

-- Ajouter des commentaires pour documentation
COMMENT ON COLUMN lessons.video_url IS 'URL de la vidéo (YouTube, Vimeo, etc.)';
COMMENT ON COLUMN lessons.content IS 'Contenu texte de la leçon (Markdown) ou questions du quiz (JSON)';
COMMENT ON COLUMN lessons.file_url IS 'URL du fichier (PDF, etc.)';
```

6. Clique sur **Run** (ou appuie sur Ctrl+Enter / Cmd+Enter)
7. Tu devrais voir "Success. No rows returned"

### Option 2 : Via psql (si tu as accès direct)

```bash
# Récupère ton DATABASE_URL depuis Supabase Dashboard > Project Settings > Database
psql "postgresql://..." -f supabase/migrations/add_lesson_content_fields.sql
```

## Vérification

Une fois la migration appliquée, redémarre le serveur de développement et essaie de créer un cours avec des leçons. Les fichiers devraient maintenant être correctement sauvegardés.

## Autres migrations à appliquer (si nécessaire)

Si tu as d'autres migrations dans le dossier `supabase/migrations/`, applique-les aussi :

```bash
ls -l supabase/migrations/
```

Puis applique chaque fichier `.sql` de la même manière.
