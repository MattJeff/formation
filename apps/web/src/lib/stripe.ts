import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};

// Types pour Stripe
export type CheckoutSession = {
  courseId: string;
  userId: string;
  priceId?: string;
  successUrl?: string;
  cancelUrl?: string;
};

// Fonctions Stripe
export const stripe = {
  // Créer une session de paiement pour un cours
  createCheckoutSession: async (session: CheckoutSession) => {
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(session),
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      return { sessionId: data.sessionId, error: null };
    } catch (error: any) {
      return { sessionId: null, error: error.message };
    }
  },

  // Rediriger vers Stripe Checkout
  redirectToCheckout: async (sessionId: string) => {
    const stripeInstance = await getStripe();
    if (!stripeInstance) {
      throw new Error('Stripe n\'a pas pu être chargé');
    }

    // @ts-ignore - redirectToCheckout exists on Stripe.js client
    const { error } = await stripeInstance.redirectToCheckout({ sessionId });

    if (error) {
      throw error;
    }
  },

  // Créer un abonnement Premium
  createSubscription: async (userId: string, priceId: string) => {
    try {
      const response = await fetch('/api/stripe/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, priceId }),
      });

      const data = await response.json();
      return { subscription: data.subscription, error: null };
    } catch (error: any) {
      return { subscription: null, error: error.message };
    }
  },

  // Annuler un abonnement
  cancelSubscription: async (subscriptionId: string) => {
    try {
      const response = await fetch('/api/stripe/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscriptionId }),
      });

      const data = await response.json();
      return { success: data.success, error: null };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Récupérer le portail client Stripe
  createCustomerPortalSession: async (customerId: string) => {
    try {
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId }),
      });

      const data = await response.json();
      return { url: data.url, error: null };
    } catch (error: any) {
      return { url: null, error: error.message };
    }
  },
};

// Prix des plans (à synchroniser avec Stripe Dashboard)
export const STRIPE_PRICES = {
  PREMIUM_MONTHLY: 'price_premium_monthly', // À remplacer par le vrai Price ID
  PREMIUM_YEARLY: 'price_premium_yearly',
  CREATOR_PRO: 'price_creator_pro',
  CREATOR_ACADEMY: 'price_creator_academy',
};
