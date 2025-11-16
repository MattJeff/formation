import { Metadata } from 'next';
import { Shield, CheckCircle, AlertCircle, Lock, FileText, CreditCard } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Conformité Stripe - Vérification d\'identité',
  description: 'Informations sur les exigences de vérification d\'identité pour les créateurs de cours',
};

export default function StripeCompliancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-center">
            <Shield className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="mt-4 text-4xl font-bold text-slate-900">
            Conformité et Vérification d'Identité
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Pourquoi nous devons vérifier votre identité pour vendre des cours
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Introduction */}
          <div className="rounded-lg bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">Pourquoi cette vérification ?</h2>
            <p className="mt-4 text-slate-700">
              Pour protéger notre communauté et respecter la réglementation, nous travaillons avec <strong>Stripe</strong>, notre partenaire de paiement certifié, qui doit vérifier l'identité de tous les créateurs vendant des cours sur notre plateforme.
            </p>
            <p className="mt-4 text-slate-700">
              Cette vérification est <strong>obligatoire</strong> et répond à des exigences légales européennes et internationales en matière de lutte contre le blanchiment d'argent (LCB-FT) et de connaissance client (KYC).
            </p>
          </div>

          {/* Why Stripe */}
          <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-6">
            <div className="flex items-start gap-3">
              <Lock className="mt-1 h-6 w-6 flex-shrink-0 text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900">
                  Stripe : Un partenaire de confiance
                </h3>
                <p className="mt-2 text-sm text-blue-800">
                  Stripe est le leader mondial du paiement en ligne, utilisé par des millions d'entreprises (Amazon, Google, Shopify, etc.). Vos données sont protégées par les plus hauts standards de sécurité (PCI-DSS Level 1).
                </p>
              </div>
            </div>
          </div>

          {/* Legal Requirements */}
          <div className="rounded-lg bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">Obligations Légales (KYC/AML)</h2>

            <div className="mt-6 space-y-4">
              <div className="flex gap-4">
                <FileText className="h-6 w-6 flex-shrink-0 text-slate-600" />
                <div>
                  <h3 className="font-semibold text-slate-900">KYC - Know Your Customer</h3>
                  <p className="mt-1 text-sm text-slate-700">
                    La connaissance client est une obligation réglementaire imposée par la directive européenne anti-blanchiment (directive (UE) 2015/849). Elle exige de vérifier l'identité de toute personne effectuant des transactions financières.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Shield className="h-6 w-6 flex-shrink-0 text-slate-600" />
                <div>
                  <h3 className="font-semibold text-slate-900">AML - Anti-Money Laundering</h3>
                  <p className="mt-1 text-sm text-slate-700">
                    La lutte contre le blanchiment d'argent et le financement du terrorisme (LCB-FT) impose des contrôles stricts sur les flux financiers pour prévenir les activités illégales.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <CreditCard className="h-6 w-6 flex-shrink-0 text-slate-600" />
                <div>
                  <h3 className="font-semibold text-slate-900">PSD2 - Services de Paiement</h3>
                  <p className="mt-1 text-sm text-slate-700">
                    La directive européenne sur les services de paiement (PSD2) renforce la sécurité et la protection des consommateurs dans les transactions en ligne.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* What Information */}
          <div className="rounded-lg bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">Informations Demandées</h2>
            <p className="mt-4 text-slate-700">
              En fonction de votre profil et de votre volume de ventes, Stripe peut vous demander :
            </p>

            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">Informations personnelles</h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                    <li>Nom complet</li>
                    <li>Date de naissance</li>
                    <li>Adresse complète</li>
                    <li>Numéro de téléphone</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">Pièces d'identité</h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                    <li>Carte d'identité nationale, passeport ou permis de conduire</li>
                    <li>Photo du document (recto-verso si applicable)</li>
                    <li>Selfie pour vérification biométrique (dans certains cas)</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">Informations bancaires</h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                    <li>IBAN (compte bancaire pour recevoir vos paiements)</li>
                    <li>BIC/SWIFT</li>
                    <li>Justificatif de compte bancaire (RIB)</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">Informations fiscales</h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                    <li>Numéro de TVA (si applicable)</li>
                    <li>Numéro SIRET/SIREN (pour les entreprises françaises)</li>
                    <li>Statut fiscal (auto-entrepreneur, entreprise, etc.)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-yellow-600" />
                <p className="text-sm text-yellow-800">
                  <strong>Note importante :</strong> Les documents demandés peuvent varier selon votre pays de résidence et le volume de vos ventes. Stripe peut demander des documents supplémentaires si nécessaire.
                </p>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="rounded-lg bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">Sécurité de vos Données</h2>

            <div className="mt-6 space-y-4">
              <div className="flex gap-4">
                <Lock className="h-6 w-6 flex-shrink-0 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-slate-900">Chiffrement de bout en bout</h3>
                  <p className="mt-1 text-sm text-slate-700">
                    Toutes vos données sont chiffrées en transit (TLS 1.3) et au repos (AES-256). Aucune donnée sensible n'est stockée en clair.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Shield className="h-6 w-6 flex-shrink-0 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-slate-900">Conformité PCI-DSS Level 1</h3>
                  <p className="mt-1 text-sm text-slate-700">
                    Stripe respecte les normes les plus strictes de l'industrie des paiements, auditées annuellement par des organismes indépendants.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <FileText className="h-6 w-6 flex-shrink-0 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-slate-900">Protection RGPD</h3>
                  <p className="mt-1 text-sm text-slate-700">
                    Vos données personnelles sont traitées conformément au RGPD. Vous disposez d'un droit d'accès, de rectification et de suppression de vos données.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <CheckCircle className="h-6 w-6 flex-shrink-0 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-slate-900">Accès restreint</h3>
                  <p className="mt-1 text-sm text-slate-700">
                    Seuls les employés Stripe autorisés et formés ont accès à vos informations, dans le strict cadre de la vérification KYC/AML.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Process */}
          <div className="rounded-lg bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">Processus de Vérification</h2>

            <div className="mt-6">
              <div className="relative">
                {/* Timeline */}
                <div className="absolute left-4 top-8 h-full w-0.5 bg-slate-200" />

                {/* Steps */}
                <div className="space-y-8">
                  <div className="relative flex gap-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                      1
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">Création du compte Stripe Connect</h3>
                      <p className="mt-1 text-sm text-slate-700">
                        Lors de votre première vente, vous serez redirigé vers Stripe pour créer votre compte de paiement.
                      </p>
                    </div>
                  </div>

                  <div className="relative flex gap-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                      2
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">Fourniture des informations</h3>
                      <p className="mt-1 text-sm text-slate-700">
                        Remplissez le formulaire sécurisé Stripe avec vos informations personnelles et bancaires.
                      </p>
                    </div>
                  </div>

                  <div className="relative flex gap-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                      3
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">Vérification automatique</h3>
                      <p className="mt-1 text-sm text-slate-700">
                        Stripe vérifie automatiquement vos informations (généralement en quelques minutes).
                      </p>
                    </div>
                  </div>

                  <div className="relative flex gap-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-600 text-white">
                      ✓
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">Validation et paiements</h3>
                      <p className="mt-1 text-sm text-slate-700">
                        Une fois validé, vous pouvez recevoir vos paiements. Les fonds sont transférés automatiquement sur votre compte bancaire.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm text-blue-800">
                <strong>Délai de vérification :</strong> La plupart des vérifications sont instantanées. Dans de rares cas, Stripe peut demander des documents supplémentaires, ce qui peut prendre 1-3 jours ouvrés.
              </p>
            </div>
          </div>

          {/* FAQ */}
          <div className="rounded-lg bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">Questions Fréquentes</h2>

            <div className="mt-6 space-y-6">
              <div>
                <h3 className="font-semibold text-slate-900">Pourquoi Stripe et pas un autre service ?</h3>
                <p className="mt-2 text-sm text-slate-700">
                  Stripe est le leader mondial du paiement en ligne, reconnu pour sa sécurité, sa fiabilité et sa conformité réglementaire. C'est le meilleur choix pour protéger à la fois les créateurs et les étudiants.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">Mes données sont-elles partagées avec SkillForge ?</h3>
                <p className="mt-2 text-sm text-slate-700">
                  Non. Vos informations d'identité et bancaires sont stockées exclusivement par Stripe. SkillForge ne reçoit que les informations nécessaires au fonctionnement de la plateforme (statut du compte, montants des transactions).
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">Combien de temps sont conservées mes données ?</h3>
                <p className="mt-2 text-sm text-slate-700">
                  Conformément à la réglementation AML, vos données sont conservées pendant la durée de la relation commerciale + 5 ans après la fin de celle-ci. Vous pouvez demander leur suppression après ce délai.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">Que se passe-t-il si je refuse la vérification ?</h3>
                <p className="mt-2 text-sm text-slate-700">
                  La vérification est obligatoire pour vendre des cours. Sans validation Stripe, vous ne pourrez pas recevoir de paiements. Vous pourrez toujours créer des cours gratuits.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">Mon compte a été refusé, que faire ?</h3>
                <p className="mt-2 text-sm text-slate-700">
                  Contactez le support Stripe qui vous expliquera les raisons du refus et les documents nécessaires pour compléter votre dossier. Vous pouvez également nous contacter à [EMAIL_SUPPORT].
                </p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-6">
            <h3 className="text-lg font-semibold text-blue-900">Besoin d'aide ?</h3>
            <p className="mt-2 text-sm text-blue-800">
              Si vous avez des questions concernant la vérification d'identité, contactez-nous :
            </p>
            <ul className="mt-3 space-y-2 text-sm text-blue-800">
              <li>
                <strong>Email :</strong>{' '}
                <a href="mailto:[EMAIL_SUPPORT]" className="underline hover:text-blue-900">
                  [EMAIL_SUPPORT]
                </a>
              </li>
              <li>
                <strong>Support Stripe :</strong>{' '}
                <a href="https://support.stripe.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">
                  support.stripe.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 flex flex-wrap justify-center gap-4 text-center">
          <a href="/" className="text-sm text-blue-600 hover:underline">
            ← Retour à l'accueil
          </a>
          <span className="text-slate-300">|</span>
          <a href="/legal/terms" className="text-sm text-blue-600 hover:underline">
            CGU/CGV
          </a>
          <span className="text-slate-300">|</span>
          <a href="/legal/privacy" className="text-sm text-blue-600 hover:underline">
            Politique de confidentialité
          </a>
        </div>
      </div>
    </div>
  );
}
