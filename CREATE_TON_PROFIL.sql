-- ============================================
-- CRÉER TON PROFIL MAINTENANT
-- ============================================

-- Exécute cette requête dans Supabase SQL Editor

INSERT INTO profiles (id, email, role, first_name, last_name)
VALUES (
  '97047dd5-00c7-4c09-9da3-5125b96388c6',
  'mhiguinen235@gmail.com',
  'creator',  -- Change en 'learner' si tu veux être apprenant
  'Mathis',   -- Ton prénom
  'Higuinen'  -- Ton nom
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name;

-- Vérifier que c'est créé
SELECT * FROM profiles WHERE id = '97047dd5-00c7-4c09-9da3-5125b96388c6';
