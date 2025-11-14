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
