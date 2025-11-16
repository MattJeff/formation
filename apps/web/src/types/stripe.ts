// ============================================
// 📋 STRIPE TYPES - TypeScript definitions for Stripe integration
// ============================================
// Ce fichier contient tous les types TypeScript pour l'intégration Stripe
// Utilisé pour la création de sessions de paiement et les webhooks
// ============================================

import Stripe from 'stripe';

// ============================================
// 🔹 CHECKOUT SESSION TYPES
// ============================================

/**
 * Données nécessaires pour créer une session de paiement Stripe
 * @field courseId - ID du cours dans Supabase
 * @field userId - ID de l'utilisateur Supabase
 * @field priceId - ID du prix Stripe (optionnel, créé dynamiquement si absent)
 */
export interface CreateCheckoutSessionData {
  courseId: string;
  userId: string;
  priceId?: string; // Optionnel: ID du prix Stripe préconfiguré
}

/**
 * Réponse de l'API create-checkout-session
 * @field sessionId - ID de la session Stripe pour redirectToCheckout()
 * @field url - URL de la page de paiement Stripe (alternative à redirectToCheckout)
 */
export interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
}

// ============================================
// 🔹 WEBHOOK TYPES
// ============================================

/**
 * Types d'événements Stripe que nous gérons
 */
export type StripeWebhookEvent =
  | 'checkout.session.completed'
  | 'checkout.session.expired'
  | 'payment_intent.succeeded'
  | 'payment_intent.payment_failed';

/**
 * Métadonnées ajoutées à la session Stripe Checkout
 * Ces données sont renvoyées dans le webhook et permettent
 * de créer l'enrollment dans Supabase
 *
 * IMPORTANT: Stripe exige un index signature pour les metadata
 */
export interface StripeCheckoutMetadata {
  courseId: string;
  userId: string;
  courseName: string; // Pour les emails et logs
  userEmail: string; // Pour les emails de confirmation
  [key: string]: string; // Index signature requis par Stripe
}

/**
 * Structure du webhook event de Stripe
 */
export interface StripeWebhookPayload {
  id: string;
  object: 'event';
  type: StripeWebhookEvent;
  data: {
    object: Stripe.Checkout.Session | Stripe.PaymentIntent;
  };
}

// ============================================
// 🔹 ENROLLMENT TYPES
// ============================================

/**
 * Données pour créer un enrollment après paiement réussi
 */
export interface CreateEnrollmentData {
  userId: string;
  courseId: string;
  paymentStatus: 'paid' | 'free' | 'refunded';
  paymentAmount: number;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
}

// ============================================
// 🔹 ERROR TYPES
// ============================================

/**
 * Erreurs personnalisées pour l'API Stripe
 */
export class StripeAPIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'StripeAPIError';
  }
}

// ============================================
// 🔹 STRIPE CLIENT SINGLETON
// ============================================

/**
 * Instance Stripe configurée avec la clé secrète
 * Utilisée côté serveur uniquement (API routes)
 */
let stripeInstance: Stripe | null = null;

export function getStripeServerInstance(): Stripe {
  // FORCE RESET: Toujours recréer l'instance pour éviter les problèmes de cache
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error(
      '❌ [STRIPE] STRIPE_SECRET_KEY manquante dans .env.local'
    );
  }

  // 🔍 DEBUG: Afficher les premiers caractères de la clé
  const keyPrefix = secretKey.substring(0, 20);
  const keyType = secretKey.startsWith('sk_test_') ? 'TEST' : secretKey.startsWith('sk_live_') ? 'LIVE' : 'UNKNOWN';
  console.log(`🔑 [STRIPE] Clé utilisée: ${keyPrefix}... (Type: ${keyType})`);

  stripeInstance = new Stripe(secretKey, {
    apiVersion: '2025-10-29.clover',
    typescript: true,
  });

  console.log('✅ [STRIPE] Instance serveur initialisée');

  return stripeInstance;
}
