# 📋 Guide de Configuration des Documents Légaux

**Date de création :** 2024-11-16
**Statut :** À personnaliser avant mise en production

---

## 🎯 Vue d'Ensemble

Ce guide liste **tous les placeholders** à remplacer dans vos documents légaux pour rendre votre plateforme conforme à la législation française et européenne.

**Fichiers concernés :**
- ✅ CGU/CGV : `/app/legal/terms/page.tsx`
- ✅ Politique de Confidentialité : `/app/legal/privacy/page.tsx`
- ✅ Mentions Légales : `/app/legal/mentions/page.tsx`
- ✅ Cookie Consent Banner : `/components/legal/CookieConsent.tsx`
- ✅ Gestion des Cookies : `/app/legal/cookies/page.tsx`
- ✅ Conformité Stripe : `/app/legal/stripe-compliance/page.tsx`

---

## 📝 Placeholders à Remplacer

### 1. Informations sur votre Entreprise

| Placeholder | Description | Exemple | Où le trouver |
|------------|-------------|---------|---------------|
| `[VOTRE_URL]` | URL de votre site web | `https://skillforge.fr` | Votre hébergeur |
| `[VOTRE_ENTREPRISE]` | Nom de votre entreprise | `SkillForge SAS` | Statuts / KBIS |
| `[FORME_JURIDIQUE]` | Statut juridique | `SAS`, `SARL`, `Auto-entrepreneur` | Statuts / KBIS |
| `[CAPITAL]` | Capital social (en euros) | `10000` | Statuts / KBIS |
| `[ADRESSE_COMPLETE]` | Adresse du siège social | `123 Rue de la Paix, 75001 Paris, France` | KBIS |
| `[NUMÉRO_SIRET]` | Numéro SIRET (14 chiffres) | `123 456 789 00012` | KBIS / INSEE |
| `[VILLE]` | Ville du RCS | `Paris` | KBIS |
| `[NUMÉRO_RCS]` | Numéro RCS | `Paris B 123 456 789` | KBIS |
| `[NUMÉRO_TVA]` | Numéro de TVA intracommunautaire | `FR 12 345678901` | Impôts / KBIS |

**Où obtenir ces informations :**
- **KBIS :** [infogreffe.fr](https://www.infogreffe.fr/)
- **Numéro SIRET :** [entreprise.data.gouv.fr](https://entreprise.data.gouv.fr/)
- **TVA :** [impots.gouv.fr](https://www.impots.gouv.fr/)

### 2. Contacts et Communication

| Placeholder | Description | Exemple |
|------------|-------------|---------|
| `[EMAIL_CONTACT]` | Email de contact général | `contact@skillforge.fr` |
| `[EMAIL_SUPPORT]` | Email du support technique | `support@skillforge.fr` |
| `[EMAIL_DPO]` | Email du Délégué à la Protection des Données | `dpo@skillforge.fr` |
| `[EMAIL_SIGNALEMENT]` | Email pour signaler du contenu illicite | `abuse@skillforge.fr` |
| `[NUMÉRO_TÉLÉPHONE]` | Numéro de téléphone | `+33 1 23 45 67 89` |
| `[HORAIRES_OUVERTURE]` | Horaires du support | `Lun-Ven 9h-18h` |

**Conseil :** Créez des alias email professionnels même si ils redirigent tous vers la même boîte.

### 3. Personnel et Responsables

| Placeholder | Description | Exemple |
|------------|-------------|---------|
| `[NOM_PRÉNOM_DIRECTEUR]` | Nom du directeur de publication | `Mathis Higuinen` |
| `[FONCTION]` | Fonction du directeur | `Président` / `Gérant` / `CEO` |
| `[NOM_DÉVELOPPEUR]` | Crédit développement | `Mathis Higuinen` / `[VOTRE_ENTREPRISE]` |
| `[NOM_DESIGNER]` | Crédit design | `[VOTRE_NOM]` / Agence |

### 4. Médiation et Conformité

| Placeholder | Description | Exemple | Comment choisir |
|------------|-------------|---------|-----------------|
| `[NOM_MÉDIATEUR]` | Nom du médiateur de la consommation | `CNPM - Médiation de la consommation` | [Liste CECMC](https://www.economie.gouv.fr/mediation-conso) |
| `[ADRESSE_MÉDIATEUR]` | Adresse du médiateur | `27 avenue de la Libération, 42400 Saint-Chamond` | Site du médiateur |
| `[URL_MÉDIATEUR]` | Site web du médiateur | `https://cnpm-mediation-consommation.eu` | Site du médiateur |
| `[EMAIL_MÉDIATEUR]` | Email du médiateur | `contact@cnpm-mediation.eu` | Site du médiateur |

**Médiateurs recommandés (gratuit ou low-cost) :**
- **CM2C** : [cm2c.net](https://www.cm2c.net/) - Gratuit
- **CNPM** : [cnpm-mediation-consommation.eu](https://cnpm-mediation-consommation.eu) - Gratuit
- **Médicys** : [medicys.fr](https://www.medicys.fr/) - ~100€/an

### 5. Données Techniques (Optionnel)

| Placeholder | Description | Recommandation |
|------------|-------------|----------------|
| `[NUMÉRO_DÉCLARATION]` | Numéro de déclaration CNIL | N/A si RGPD respecté (pas obligatoire depuis 2018) |
| `[AUTRES_SOURCES_SI_APPLICABLE]` | Autres sources graphiques | Unsplash, Pexels, etc. |

---

## 🔧 Instructions de Personnalisation

### Étape 1 : Remplacer les Placeholders

Utilisez la fonction "Rechercher et Remplacer" de votre éditeur :

```bash
# Exemple avec VS Code
# Ctrl + Shift + H (Windows/Linux) ou Cmd + Shift + H (Mac)

Rechercher : [VOTRE_ENTREPRISE]
Remplacer par : SkillForge SAS
```

**Fichiers à modifier :**
1. `apps/web/src/app/legal/terms/page.tsx`
2. `apps/web/src/app/legal/privacy/page.tsx`
3. `apps/web/src/app/legal/mentions/page.tsx`
4. `apps/web/src/app/legal/cookies/page.tsx`
5. `apps/web/src/app/legal/stripe-compliance/page.tsx`

### Étape 2 : Vérification Obligatoire

Après remplacement, vérifiez chaque page :

```bash
# Lancer le serveur de dev
npm run dev

# Visiter chaque page légale
http://localhost:3000/legal/terms
http://localhost:3000/legal/privacy
http://localhost:3000/legal/mentions
http://localhost:3000/legal/cookies
http://localhost:3000/legal/stripe-compliance
```

**Checklist de vérification :**
- [ ] Aucun placeholder `[...]` visible
- [ ] Toutes les informations sont exactes
- [ ] Les liens email fonctionnent (`mailto:` cliquables)
- [ ] Les numéros de téléphone sont au bon format
- [ ] Le cookie banner s'affiche correctement

### Étape 3 : Adaptations Spécifiques

#### Pour Auto-Entrepreneurs :

Remplacez dans **Mentions Légales** :
```
[FORME_JURIDIQUE] au capital de [CAPITAL] euros
```
Par :
```
Entreprise Individuelle (Auto-Entrepreneur)
```

Supprimez la ligne :
```
RCS : [VILLE] [NUMÉRO_RCS]
```

#### Pour Associations (Loi 1901) :

Remplacez :
```
[FORME_JURIDIQUE] au capital de [CAPITAL] euros
```
Par :
```
Association Loi 1901
```

Ajoutez :
```
Numéro RNA : [NUMÉRO_RNA]
```

#### Pour Sites Sans Paiement :

Si vous n'utilisez pas Stripe, vous pouvez :
1. Supprimer la page `/legal/stripe-compliance`
2. Retirer les sections paiement des CGU/CGV
3. Simplifier la politique de cookies (pas de cookies marketing)

---

## 🔐 Configuration du Cookie Consent

### Activer Google Analytics (Optionnel)

Si vous utilisez Google Analytics, ajoutez dans `app/layout.tsx` :

```tsx
import Script from 'next/script';

// Dans le component
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID`}
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){window.dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID', {
      anonymize_ip: true,
      cookie_flags: 'SameSite=None;Secure'
    });
  `}
</Script>
```

Remplacez `GA_MEASUREMENT_ID` par votre ID Google Analytics (ex: `G-XXXXXXXXXX`).

### Désactiver les Cookies Non-Essentiels

Si vous ne souhaitez PAS utiliser de cookies analytics/marketing :

1. Modifiez `/components/legal/CookieConsent.tsx`
2. Supprimez les sections `analytics` et `marketing`
3. Simplifiez le banner pour n'afficher qu'une notice

---

## 📄 Documents Supplémentaires Recommandés

### 1. Politique de Modération

Créez `/app/legal/moderation/page.tsx` pour expliquer :
- Comment vous modérez les contenus
- Les contenus interdits
- La procédure de signalement
- Les sanctions applicables

### 2. Charte d'Utilisation pour les Créateurs

Créez `/app/legal/creator-guidelines/page.tsx` pour :
- Les bonnes pratiques de création de cours
- Les obligations des créateurs
- La qualité attendue
- Les droits d'auteur

### 3. FAQ Légale

Créez `/app/legal/faq/page.tsx` pour répondre aux questions courantes :
- Puis-je me faire rembourser ?
- Comment supprimer mon compte ?
- Mes données sont-elles sécurisées ?
- etc.

---

## ⚖️ Validation Juridique

**IMPORTANT :** Ces documents sont des modèles. Pour une conformité totale, faites-les relire par :

### Option 1 : Avocat Spécialisé (Recommandé pour MVP vendu)
- **Coût :** 500-2000€
- **Avantages :** Personnalisé, juridiquement solide
- **Quand :** Avant de vendre le MVP ou lever des fonds

### Option 2 : Services en Ligne
- **Captain Contrat** : [captaincontrat.com](https://www.captaincontrat.com/) (~300€)
- **LegalPlace** : [legalplace.fr](https://www.legalplace.fr/) (~200€)
- **Legalstart** : [legalstart.fr](https://www.legalstart.fr/) (~250€)

### Option 3 : Générateurs Gratuits (Pour tester uniquement)
- **Subdelirium** : [subdelirium.com](https://www.subdelirium.com/) - Gratuit
- **Privacy Policy Generator** : [freeprivacypolicy.com](https://www.freeprivacypolicy.com/) - Gratuit

**Note :** Les modèles fournis sont conformes aux exigences RGPD/LCEN, mais une validation professionnelle est recommandée.

---

## 🚀 Mise en Production

Avant de déployer :

### Checklist Finale

- [ ] Tous les placeholders sont remplacés
- [ ] Les emails de contact fonctionnent (testez-les !)
- [ ] Le cookie banner s'affiche au premier visit
- [ ] Les liens entre pages légales fonctionnent
- [ ] La page de confidentialité est accessible depuis le footer
- [ ] Vous avez choisi et contacté un médiateur de la consommation
- [ ] Vous avez un moyen de prouver l'acceptation des CGU lors de l'inscription

### Footer Légal

Ajoutez dans votre footer global :

```tsx
<footer className="border-t border-slate-200 bg-white py-8">
  <div className="container mx-auto px-4">
    <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-600">
      <a href="/legal/terms" className="hover:text-slate-900">CGU/CGV</a>
      <span>•</span>
      <a href="/legal/privacy" className="hover:text-slate-900">Confidentialité</a>
      <span>•</span>
      <a href="/legal/mentions" className="hover:text-slate-900">Mentions légales</a>
      <span>•</span>
      <a href="/legal/cookies" className="hover:text-slate-900">Cookies</a>
    </div>
    <p className="mt-4 text-center text-xs text-slate-500">
      © {new Date().getFullYear()} [VOTRE_ENTREPRISE]. Tous droits réservés.
    </p>
  </div>
</footer>
```

### Acceptation des CGU lors de l'Inscription

Modifiez le formulaire d'inscription pour ajouter :

```tsx
<label className="flex items-start gap-2">
  <input
    type="checkbox"
    required
    className="mt-1"
  />
  <span className="text-sm text-slate-600">
    J'accepte les{' '}
    <a href="/legal/terms" target="_blank" className="text-blue-600 hover:underline">
      Conditions Générales d'Utilisation
    </a>
    {' '}et la{' '}
    <a href="/legal/privacy" target="_blank" className="text-blue-600 hover:underline">
      Politique de Confidentialité
    </a>
  </span>
</label>
```

Conservez la date d'acceptation dans votre base de données :

```typescript
// Dans votre table users/profiles
{
  id: 'uuid',
  email: 'user@example.com',
  terms_accepted_at: '2024-11-16T10:30:00Z', // Timestamp
  terms_version: '1.0', // Version des CGU acceptées
}
```

---

## 📊 Suivi de la Conformité

### Actions Récurrentes

| Fréquence | Action | Responsable |
|-----------|--------|-------------|
| **Mensuel** | Vérifier que les liens légaux fonctionnent | Dev |
| **Trimestriel** | Mettre à jour la date sur les documents | Legal |
| **Annuel** | Audit de conformité RGPD | DPO / Avocat |
| **À chaque modification majeure** | Versionner les CGU et demander réacceptation | Product |

### Registre des Traitements (RGPD)

Créez et maintenez un registre des traitements de données :

```
Traitement 1 : Gestion des comptes utilisateurs
- Finalité : Authentification et gestion des accès
- Données : Email, mot de passe hashé, nom, prénom
- Base légale : Exécution du contrat
- Durée de conservation : Durée du compte + 1 an
- Destinataires : Supabase (hébergement)

Traitement 2 : Paiements
- Finalité : Traitement des transactions
- Données : Montant, date, références Stripe
- Base légale : Exécution du contrat
- Durée de conservation : 10 ans (obligation comptable)
- Destinataires : Stripe (sous-traitant)
...
```

---

## 📞 Besoin d'Aide ?

- **Documentation Stripe Connect :** [stripe.com/docs/connect](https://stripe.com/docs/connect)
- **Guide CNIL :** [cnil.fr](https://www.cnil.fr/)
- **RGPD officiel :** [europa.eu/gdpr](https://europa.eu/youreurope/business/dealing-with-customers/data-protection/data-protection-gdpr/index_en.htm)

---

**✅ Vous êtes maintenant prêt à déployer des documents légaux conformes !**

N'oubliez pas de faire relire par un professionnel avant de vendre votre MVP.
