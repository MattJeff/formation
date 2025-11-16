// ============================================
// 💳 CHECKOUT PAGE - Page dynamique de paiement
// ============================================
// Route: /courses/[id]/checkout
// Redirige vers Stripe Checkout pour payer un cours
//
// FLOW:
// 1. Charge les infos du cours depuis Supabase
// 2. Appelle l'API /api/stripe/create-checkout-session
// 3. Redirige vers Stripe Checkout
//
// DEBUGGING:
// - Chercher les logs: [CHECKOUT PAGE]
// - Vérifier que l'utilisateur est connecté
// - Vérifier que le cours est payant (price > 0)
// ============================================

import { CheckoutClient } from './CheckoutClient';

interface CheckoutPageProps {
  params: {
    id: string;
  };
}

export default function CheckoutPage({ params }: CheckoutPageProps) {
  return <CheckoutClient courseId={params.id} />;
}
