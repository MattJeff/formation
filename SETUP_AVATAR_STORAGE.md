# Configuration du stockage d'avatars Supabase

## Étapes pour configurer le bucket avatars

### 1. Créer le bucket via le dashboard Supabase

1. Se connecter à https://supabase.com/dashboard
2. Sélectionner votre projet
3. Aller dans **Storage** (menu de gauche)
4. Cliquer sur **"New bucket"**
5. Configurer :
   - **Name** : `avatars`
   - **Public** : ✅ Coché (les avatars doivent être publics)
   - **File size limit** : 5MB
   - **Allowed MIME types** : `image/jpeg, image/png, image/webp, image/jpg`
6. Cliquer sur **"Create bucket"**

### 2. Configurer les politiques RLS (Row Level Security)

Dans l'onglet **Policies** du bucket `avatars`, ajouter les politiques suivantes :

#### A) Politique de lecture publique

```sql
CREATE POLICY "Avatars are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');
```

Ou via l'interface :
- **Policy name** : `Avatars are publicly accessible`
- **Allowed operation** : SELECT
- **Target roles** : public
- **USING expression** : `bucket_id = 'avatars'`

#### B) Politique d'upload (utilisateurs authentifiés)

```sql
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

Ou via l'interface :
- **Policy name** : `Users can upload their own avatar`
- **Allowed operation** : INSERT
- **Target roles** : authenticated
- **WITH CHECK expression** : `bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]`

#### C) Politique de mise à jour (utilisateurs authentifiés)

```sql
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

#### D) Politique de suppression (utilisateurs authentifiés)

```sql
CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

### 3. Configuration alternative via SQL

Si vous préférez tout faire via SQL, voici le script complet :

```sql
-- Créer le bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

-- Politique de lecture publique
CREATE POLICY "Avatars are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Politique d'upload
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Politique de mise à jour
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Politique de suppression
CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

### 4. Vérification

Après configuration, vérifier que :

1. Le bucket `avatars` existe
2. Il est marqué comme **public**
3. Les 4 politiques RLS sont actives
4. Tester l'upload depuis l'application

### 5. Test manuel (optionnel)

Pour tester l'upload manuellement :

```typescript
import { supabase } from '@/lib/supabase';

// Upload test
const file = ... // votre fichier
const { data, error } = await supabase.storage
  .from('avatars')
  .upload(`${userId}/test-avatar.jpg`, file);

// Récupérer l'URL publique
const { data: publicUrlData } = supabase.storage
  .from('avatars')
  .getPublicUrl(`${userId}/test-avatar.jpg`);

console.log('URL publique:', publicUrlData.publicUrl);
```

### 6. Structure des fichiers

Les avatars sont organisés comme suit :

```
avatars/
├── {userId}/
│   ├── avatar-1234567890.jpg
│   ├── avatar-1234567891.png
│   └── ...
```

Chaque utilisateur a son propre dossier, identifié par son `userId`.

---

## Configuration Next.js

Pour permettre l'affichage des images Supabase dans Next.js, ajouter le domaine dans `next.config.js` :

```javascript
module.exports = {
  images: {
    domains: [
      'dwwkjhorxfjxhzozacxe.supabase.co', // Remplacer par votre URL Supabase
    ],
  },
};
```

Ou avec le nouveau format Next.js 14 :

```javascript
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};
```

---

## Troubleshooting

### Erreur : "new row violates row-level security policy"

**Solution** : Vérifier que les politiques RLS sont correctement configurées et que l'utilisateur est bien authentifié.

### Erreur : "Bucket not found"

**Solution** : Vérifier que le bucket `avatars` existe et est bien nommé.

### Les images ne s'affichent pas

**Solution** :
1. Vérifier que le bucket est **public**
2. Vérifier la configuration `next.config.js`
3. Vérifier l'URL de l'image dans le navigateur

### Upload échoue

**Solution** :
1. Vérifier la taille du fichier (max 5MB)
2. Vérifier le type MIME (jpg, png, webp)
3. Vérifier que l'utilisateur est authentifié
4. Vérifier les politiques RLS

---

**Date de création** : 2025-11-16
**Statut** : Guide de configuration pour Supabase Storage
