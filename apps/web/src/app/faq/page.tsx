'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  Search,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Mail,
  Upload,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  // COMPTE & INSCRIPTION
  {
    category: 'Compte & Inscription',
    question: 'Comment créer un compte sur SkillForge ?',
    answer: 'Cliquez sur "S\'inscrire" en haut à droite, remplissez le formulaire avec votre email et mot de passe. Vous recevrez un email de vérification. Après vérification, choisissez votre rôle (Étudiant ou Formateur).'
  },
  {
    category: 'Compte & Inscription',
    question: 'Je n\'ai pas reçu l\'email de vérification',
    answer: 'Vérifiez d\'abord vos spams. Sur la page de vérification, vous pouvez cliquer sur "Renvoyer l\'email". Si le problème persiste, contactez-nous via le formulaire en bas de page.'
  },
  {
    category: 'Compte & Inscription',
    question: 'Puis-je modifier mon rôle après inscription ?',
    answer: 'Oui, vous pouvez créer des cours même en tant qu\'étudiant. Rendez-vous dans "Devenir formateur" pour accéder à l\'espace créateur.'
  },
  {
    category: 'Compte & Inscription',
    question: 'Comment modifier mes informations personnelles ?',
    answer: 'Accédez à votre profil via l\'icône en haut à droite, puis cliquez sur "Modifier le profil". Vous pouvez changer votre nom, prénom, bio et photo de profil.'
  },

  // COURS (ÉTUDIANTS)
  {
    category: 'Cours (Étudiants)',
    question: 'Comment acheter un cours ?',
    answer: 'Parcourez le catalogue, cliquez sur un cours qui vous intéresse, puis sur "S\'inscrire maintenant". Vous serez redirigé vers la page de paiement Stripe sécurisée. Après paiement, le cours apparaîtra dans "Mes cours".'
  },
  {
    category: 'Cours (Étudiants)',
    question: 'Les cours gratuits sont-ils vraiment gratuits ?',
    answer: 'Oui, si un cours affiche "Gratuit", vous pouvez vous inscrire sans payer. Cliquez simplement sur "S\'inscrire gratuitement".'
  },
  {
    category: 'Cours (Étudiants)',
    question: 'Comment suivre ma progression ?',
    answer: 'Allez dans "Mes cours", cliquez sur un cours. Votre progression s\'affiche en haut. Cochez les leçons terminées pour avancer. La barre de progression se met à jour automatiquement.'
  },
  {
    category: 'Cours (Étudiants)',
    question: 'Puis-je télécharger un certificat ?',
    answer: 'Oui, une fois que vous avez terminé 100% d\'un cours, un bouton "Télécharger le certificat" apparaît. Le certificat est généré en PDF avec votre nom et la date de complétion.'
  },
  {
    category: 'Cours (Étudiants)',
    question: 'Comment laisser un avis sur un cours ?',
    answer: 'Vous devez être inscrit au cours. Allez sur la page du cours, descendez à la section "Avis". Notez le cours avec des étoiles et laissez un commentaire (optionnel).'
  },

  // PAIEMENTS & STRIPE
  {
    category: 'Paiements & Stripe',
    question: 'Quels moyens de paiement sont acceptés ?',
    answer: 'Nous acceptons toutes les cartes bancaires (Visa, Mastercard, American Express) via Stripe. Le paiement est 100% sécurisé.'
  },
  {
    category: 'Paiements & Stripe',
    question: 'Comment demander un remboursement ?',
    answer: 'Contactez-nous via le formulaire en bas de page en sélectionnant "Demande de remboursement". Incluez votre email, le nom du cours et la raison. Nous traitons les demandes sous 48h.'
  },
  {
    category: 'Paiements & Stripe',
    question: 'Mon paiement a échoué, que faire ?',
    answer: 'Vérifiez que votre carte est valide et a suffisamment de fonds. Si le problème persiste, essayez avec une autre carte ou contactez votre banque. Vous pouvez aussi nous contacter.'
  },
  {
    category: 'Paiements & Stripe',
    question: 'Est-ce que je reçois une facture ?',
    answer: 'Oui, après chaque achat, vous recevez un email de confirmation avec un lien vers votre reçu Stripe. Vous pouvez le télécharger en PDF.'
  },

  // CRÉATION DE COURS (FORMATEURS)
  {
    category: 'Création de Cours',
    question: 'Comment créer mon premier cours ?',
    answer: 'Accédez à "Dashboard Créateur", cliquez sur "Créer un cours". Remplissez le titre, description, prix, catégorie et objectifs. Ajoutez des chapitres et leçons. Publiez quand vous êtes prêt.'
  },
  {
    category: 'Création de Cours',
    question: 'Quels formats de contenu puis-je ajouter ?',
    answer: 'Vous pouvez ajouter du texte, des vidéos (YouTube, Vimeo), des images, des PDF et des liens externes. Chaque leçon peut combiner plusieurs types de médias.'
  },
  {
    category: 'Création de Cours',
    question: 'Puis-je modifier un cours après publication ?',
    answer: 'Oui, allez dans "Mes cours créés", cliquez sur "Modifier". Vous pouvez changer le contenu, ajouter des leçons, modifier le prix (attention, ça n\'affecte pas les étudiants déjà inscrits).'
  },
  {
    category: 'Création de Cours',
    question: 'Comment fixer le prix de mon cours ?',
    answer: 'Lors de la création, entrez le prix en euros. Laissez 0 pour un cours gratuit. La plateforme prend une commission de 4%, vous recevez 96% du prix.'
  },

  // STRIPE CONNECT (FORMATEURS)
  {
    category: 'Stripe Connect',
    question: 'Pourquoi connecter mon compte Stripe ?',
    answer: 'C\'est obligatoire pour recevoir vos paiements. Stripe Connect transfère automatiquement 96% du prix de vos cours vendus sur votre compte bancaire.'
  },
  {
    category: 'Stripe Connect',
    question: 'Comment connecter mon compte Stripe ?',
    answer: 'Allez dans "Dashboard Créateur" → "Paramètres Stripe" → "Connecter mon compte Stripe". Suivez le processus d\'onboarding Stripe (identité, coordonnées bancaires).'
  },
  {
    category: 'Stripe Connect',
    question: 'Combien de temps pour recevoir mes paiements ?',
    answer: 'Les fonds sont transférés automatiquement après chaque vente. Le délai de retrait vers votre banque dépend de votre configuration Stripe (généralement 2-7 jours).'
  },
  {
    category: 'Stripe Connect',
    question: 'Quelle est la commission de la plateforme ?',
    answer: 'Nous prenons 4% sur chaque vente. Vous recevez 96% du prix. Exemple: cours à 100€ → vous recevez 96€.'
  },
  {
    category: 'Stripe Connect',
    question: 'Où voir mes revenus ?',
    answer: 'Rendez-vous dans "Dashboard Créateur" → "Analytiques" pour voir vos revenus totaux. Pour les détails, connectez-vous à votre dashboard Stripe.'
  },

  // PROBLÈMES TECHNIQUES
  {
    category: 'Problèmes Techniques',
    question: 'La vidéo ne se charge pas',
    answer: 'Vérifiez votre connexion internet. Si c\'est une vidéo YouTube/Vimeo, vérifiez qu\'elle n\'est pas privée. Essayez de rafraîchir la page ou de changer de navigateur.'
  },
  {
    category: 'Problèmes Techniques',
    question: 'Je ne peux pas télécharger le certificat',
    answer: 'Assurez-vous d\'avoir terminé 100% du cours. Vérifiez que votre navigateur autorise les téléchargements. Si le problème persiste, contactez-nous.'
  },
  {
    category: 'Problèmes Techniques',
    question: 'Mon image de profil ne s\'affiche pas',
    answer: 'L\'image doit faire moins de 5 MB et être au format JPG, PNG ou WebP. Si vous venez de la télécharger, attendez quelques secondes et rafraîchissez la page.'
  },

  // SÉCURITÉ & CONFIDENTIALITÉ
  {
    category: 'Sécurité & Confidentialité',
    question: 'Mes données sont-elles sécurisées ?',
    answer: 'Oui, nous utilisons les meilleurs standards de sécurité. Les paiements passent par Stripe (certifié PCI DSS). Les données sont hébergées sur Supabase avec chiffrement.'
  },
  {
    category: 'Sécurité & Confidentialité',
    question: 'Comment supprimer mon compte ?',
    answer: 'Contactez-nous via le formulaire en sélectionnant "Suppression de compte". Nous supprimerons vos données dans les 30 jours conformément au RGPD.'
  },
  {
    category: 'Sécurité & Confidentialité',
    question: 'Utilisez-vous des cookies ?',
    answer: 'Oui, uniquement pour le fonctionnement essentiel (authentification, préférences). Vous pouvez gérer vos préférences via la bannière de cookies.'
  },
];

const categories = Array.from(new Set(faqData.map(item => item.category)));

const problemTypes = [
  'Question générale',
  'Problème de paiement',
  'Demande de remboursement',
  'Problème technique',
  'Problème de cours',
  'Problème de compte',
  'Stripe Connect',
  'Suppression de compte',
  'Autre'
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  // Contact form state
  const [showContactForm, setShowContactForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    problemType: 'Question générale',
    description: '',
  });
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const toggleItem = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  const filteredFAQ = faqData.filter(item => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Tous' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setSubmitError('Le fichier ne doit pas dépasser 5 MB');
        return;
      }
      setScreenshot(file);
      setSubmitError('');
    }
  };

  const handleSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.description) {
      setSubmitError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('problemType', formData.problemType);
      formDataToSend.append('description', formData.description);
      if (screenshot) {
        formDataToSend.append('screenshot', screenshot);
      }

      const response = await fetch('/api/contact', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi');
      }

      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        problemType: 'Question générale',
        description: '',
      });
      setScreenshot(null);

      setTimeout(() => {
        setSubmitSuccess(false);
        setShowContactForm(false);
      }, 3000);
    } catch (error) {
      setSubmitError('Erreur lors de l\'envoi. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="container mx-auto px-4 py-12 flex-1">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <HelpCircle className="h-8 w-8 text-primary" />
          </div>
          <h1 className="mb-4 text-4xl font-bold">Centre d'aide</h1>
          <p className="text-lg text-muted-foreground">
            Trouvez des réponses à vos questions ou contactez-nous
          </p>
        </div>

        {/* Search */}
        <div className="mx-auto mb-8 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher dans la FAQ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border bg-background py-3 pl-12 pr-4 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setSelectedCategory('Tous')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              selectedCategory === 'Tous'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            Tous
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="mx-auto max-w-4xl space-y-4">
          {filteredFAQ.map((item, index) => (
            <div
              key={index}
              className="rounded-lg border border-border bg-card overflow-hidden"
            >
              <button
                onClick={() => toggleItem(index)}
                className="flex w-full items-center justify-between p-6 text-left hover:bg-accent transition-colors"
              >
                <div className="flex-1">
                  <span className="mb-1 inline-block text-xs font-medium text-primary">
                    {item.category}
                  </span>
                  <h3 className="text-lg font-semibold">{item.question}</h3>
                </div>
                {expandedItems.has(index) ? (
                  <ChevronUp className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                )}
              </button>
              {expandedItems.has(index) && (
                <div className="border-t border-border bg-secondary/30 p-6">
                  <p className="text-muted-foreground">{item.answer}</p>
                </div>
              )}
            </div>
          ))}

          {filteredFAQ.length === 0 && (
            <div className="rounded-lg border border-border bg-card p-12 text-center">
              <p className="text-muted-foreground">
                Aucune question trouvée. Essayez une autre recherche ou contactez-nous.
              </p>
            </div>
          )}
        </div>

        {/* Contact Form */}
        <div className="mx-auto mt-16 max-w-2xl">
          <div className="rounded-lg border border-border bg-card p-8">
            <div className="mb-6 flex items-center gap-3">
              <Mail className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Vous n'avez pas trouvé votre réponse ?</h2>
            </div>
            <p className="mb-6 text-muted-foreground">
              Contactez-nous directement et nous vous répondrons dans les plus brefs délais.
            </p>

            {!showContactForm ? (
              <button
                onClick={() => setShowContactForm(true)}
                className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Ouvrir le formulaire de contact
              </button>
            ) : (
              <form onSubmit={handleSubmitContact} className="space-y-4">
                {submitSuccess && (
                  <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-4 text-green-600 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Message envoyé avec succès! Nous vous répondrons bientôt.
                  </div>
                )}

                {submitError && (
                  <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-red-600 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    {submitError}
                  </div>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Nom complet <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Type de problème <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.problemType}
                    onChange={(e) => setFormData({ ...formData, problemType: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {problemTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={5}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Décrivez votre problème en détail..."
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Screenshot (optionnel, max 5 MB)
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 hover:bg-accent">
                      <Upload className="h-5 w-5" />
                      <span className="text-sm">Choisir un fichier</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    {screenshot && (
                      <span className="text-sm text-muted-foreground">
                        {screenshot.name}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    {submitting ? 'Envoi...' : 'Envoyer'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowContactForm(false)}
                    className="rounded-lg border border-border px-6 py-3 hover:bg-accent"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
