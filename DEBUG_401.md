# 🔍 DEBUG ERREUR 401

## 🎯 Problème

**Erreur** : `401 Unauthorized` lors de la publication d'un cours
**Cause possible** : L'API ne peut pas authentifier l'utilisateur

---

## ✅ Corrections Appliquées

### 1. Ajout de Logs Détaillés
```typescript
console.log('✅ Utilisateur authentifié:', user.id);
console.error('❌ Erreur profil:', profileError);
```

### 2. Fallback sur user_metadata
```typescript
if (profileError) {
  // Si le profil n'existe pas, utiliser les métadonnées
  const roleFromMetadata = user.user_metadata?.role || 'learner';
  if (roleFromMetadata !== 'creator') {
    return 403;
  }
}
```

---

## 🧪 Tests à Faire

### 1. Vérifier les Logs du Serveur
```bash
# Dans le terminal où tourne npm run dev
# Vous devriez voir:
✅ Utilisateur authentifié: [uuid]
✅ Création de cours pour: [uuid]
```

### 2. Vérifier dans la Console du Navigateur
```javascript
// Ouvrir la console (F12)
// Essayer de publier un cours
// Regarder les erreurs
```

### 3. Vérifier l'Authentification
```javascript
// Dans la console du navigateur
const { data } = await supabase.auth.getUser();
console.log('User:', data.user);
console.log('Role:', data.user?.user_metadata?.role);
```

---

## 🔧 Solutions Possibles

### Solution 1: Exécuter FIX_PROFIL_MANQUANT.sql
```sql
-- Dans Supabase SQL Editor
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
```

### Solution 2: Vérifier le Rôle
```
1. Aller dans Supabase
2. Authentication → Users
3. Cliquer sur votre utilisateur
4. Vérifier que user_metadata contient: { "role": "creator" }
```

### Solution 3: Se Reconnecter
```
1. Se déconnecter de l'app
2. Se reconnecter
3. Vérifier que le Header affiche "Créateur"
4. Réessayer de publier
```

---

## 📊 Checklist de Debug

- [ ] Exécuté FIX_PROFIL_MANQUANT.sql
- [ ] Vérifié les logs du serveur
- [ ] Vérifié la console du navigateur
- [ ] Vérifié que user_metadata.role = "creator"
- [ ] Vérifié que le profil existe dans la table profiles
- [ ] Rechargé l'app après les corrections
- [ ] Réessayé de publier un cours

---

## 🎯 Actions Immédiates

### 1. Exécuter le Fix SQL (Si pas encore fait)
```
Supabase → SQL Editor → FIX_PROFIL_MANQUANT.sql → Run
```

### 2. Recharger le Serveur
```bash
# Arrêter le serveur (Ctrl+C)
# Nettoyer le cache
cd apps/web && rm -rf .next
# Redémarrer
npm run dev
```

### 3. Recharger l'App
```
1. Fermer tous les onglets
2. Ouvrir http://localhost:3000
3. Se connecter
4. Vérifier le menu (doit afficher "Mes Formations")
5. Essayer de créer un cours
```

---

## 💡 Logs à Surveiller

### Serveur (Terminal)
```
✅ Utilisateur authentifié: [uuid]
✅ Création de cours pour: [uuid]
✅ Cours créé: [course-id]
```

### Navigateur (Console)
```
POST /api/courses 200 OK
{
  "success": true,
  "message": "Cours publié avec succès !"
}
```

---

## 🚀 Si Ça Ne Fonctionne Toujours Pas

**Partagez-moi** :
1. Les logs du serveur (terminal)
2. Les erreurs de la console (navigateur)
3. Le résultat de `SELECT * FROM profiles;` dans Supabase

**Je pourrai alors identifier le problème exact !** 🎯
