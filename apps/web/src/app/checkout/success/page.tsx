// ============================================
// ✅ CHECKOUT SUCCESS PAGE
// ============================================
// Route: /checkout/success?session_id={CHECKOUT_SESSION_ID}
// Affichée après un paiement réussi sur Stripe
//
// FLOW:
// 1. Stripe redirige ici après paiement réussi
// 2. On récupère le session_id depuis l'URL
// 3. On vérifie le statut et redirige vers le cours
//
// DEBUGGING:
// - Chercher les logs: [CHECKOUT SUCCESS]
// - Le webhook crée l'enrollment, pas cette page
// - Cette page est juste pour l'UX
// ============================================

import { CheckoutSuccessClient } from './CheckoutSuccessClient';

export default function CheckoutSuccessPage() {
  return <CheckoutSuccessClient />;
}
