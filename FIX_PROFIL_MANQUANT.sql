-- ============================================
-- FIX: CRÉER LES PROFILS MANQUANTS
-- ============================================

-- Cette requête crée automatiquement les profils pour tous les utilisateurs
-- qui n'en ont pas encore (car le trigger n'a pas fonctionné)

INSERT INTO profiles (id, email, role, first_name, last_name)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'role', 'learner') as role,
  au.raw_user_meta_data->>'first_name' as first_name,
  au.raw_user_meta_data->>'last_name' as last_name
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM profiles p WHERE p.id = au.id
);

-- Vérifier les profils créés
SELECT 
  id,
  email,
  role,
  first_name,
  last_name,
  created_at
FROM profiles
ORDER BY created_at DESC;
