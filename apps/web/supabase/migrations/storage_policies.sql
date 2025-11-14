-- Migration: Politiques de sécurité pour Supabase Storage
-- Date: 2025-11-14

-- ==========================================
-- BUCKET: image (Images de couverture)
-- ==========================================

-- Permettre aux utilisateurs authentifiés d'uploader des images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'image');

-- Permettre à tout le monde de lire les images (public)
CREATE POLICY "Public can read images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'image');

-- Permettre aux utilisateurs de mettre à jour leurs propres images
CREATE POLICY "Users can update their own images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'image' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Permettre aux utilisateurs de supprimer leurs propres images
CREATE POLICY "Users can delete their own images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'image' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ==========================================
-- BUCKET: video (Fichiers vidéo)
-- ==========================================

-- Permettre aux utilisateurs authentifiés d'uploader des vidéos
CREATE POLICY "Authenticated users can upload videos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'video');

-- Permettre à tout le monde de lire les vidéos (public)
CREATE POLICY "Public can read videos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'video');

-- Permettre aux utilisateurs de mettre à jour leurs propres vidéos
CREATE POLICY "Users can update their own videos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'video' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Permettre aux utilisateurs de supprimer leurs propres vidéos
CREATE POLICY "Users can delete their own videos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'video' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ==========================================
-- BUCKET: pdf (Documents PDF et fichiers)
-- ==========================================

-- Permettre aux utilisateurs authentifiés d'uploader des PDFs
CREATE POLICY "Authenticated users can upload pdfs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'pdf');

-- Permettre à tout le monde de lire les PDFs (public)
CREATE POLICY "Public can read pdfs"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'pdf');

-- Permettre aux utilisateurs de mettre à jour leurs propres PDFs
CREATE POLICY "Users can update their own pdfs"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'pdf' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Permettre aux utilisateurs de supprimer leurs propres PDFs
CREATE POLICY "Users can delete their own pdfs"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'pdf' AND auth.uid()::text = (storage.foldername(name))[1]);
