import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Politique de Confidentialité',
  description: 'Politique de confidentialité et protection des données personnelles de SkillForge',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-900">
            Politique de Confidentialité
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
          <p className="mt-2 text-sm font-medium text-blue-600">
            Conforme au RGPD (Règlement Général sur la Protection des Données)
          </p>
        </div>

        {/* Content */}
        <div className="rounded-lg bg-white p-8 shadow-sm">
          <div className="prose prose-slate max-w-none">

            {/* Introduction */}
            <section className="mb-8">
              <p className="text-slate-700">
                La protection de vos données personnelles est une priorité pour SkillForge. Cette politique de confidentialité explique comment nous collectons, utilisons, conservons et protégeons vos données personnelles conformément au Règlement Général sur la Protection des Données (RGPD - Règlement UE 2016/679).
              </p>
            </section>

            {/* Article 1 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">1. Responsable du Traitement</h2>
              <p className="mt-4 text-slate-700">
                Le responsable du traitement des données personnelles est :
              </p>
              <ul className="mt-2 space-y-1 text-slate-700">
                <li><strong>Raison sociale :</strong> [VOTRE_ENTREPRISE]</li>
                <li><strong>Forme juridique :</strong> [FORME_JURIDIQUE]</li>
                <li><strong>Siège social :</strong> [ADRESSE_COMPLETE]</li>
                <li><strong>SIRET :</strong> [NUMÉRO_SIRET]</li>
                <li><strong>Email :</strong> [EMAIL_CONTACT]</li>
                <li><strong>Délégué à la Protection des Données (DPO) :</strong> [EMAIL_DPO]</li>
              </ul>
            </section>

            {/* Article 2 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">2. Données Collectées</h2>

              <h3 className="mt-4 text-xl font-semibold text-slate-800">2.1 Données d'identification</h3>
              <ul className="mt-2 list-disc space-y-1 pl-6 text-slate-700">
                <li>Nom et prénom</li>
                <li>Adresse email</li>
                <li>Mot de passe (chiffré)</li>
                <li>Photo de profil (optionnel)</li>
                <li>Biographie (optionnel)</li>
                <li>Liens réseaux sociaux (optionnel)</li>
              </ul>

              <h3 className="mt-4 text-xl font-semibold text-slate-800">2.2 Données de paiement</h3>
              <ul className="mt-2 list-disc space-y-1 pl-6 text-slate-700">
                <li>Informations de facturation</li>
                <li>Historique des transactions</li>
                <li>Données bancaires (traitées uniquement par Stripe, non stockées par nous)</li>
              </ul>

              <h3 className="mt-4 text-xl font-semibold text-slate-800">2.3 Données d'utilisation</h3>
              <ul className="mt-2 list-disc space-y-1 pl-6 text-slate-700">
                <li>Cours consultés et progression</li>
                <li>Commentaires et avis publiés</li>
                <li>Historique des achats</li>
                <li>Statistiques d'utilisation</li>
              </ul>

              <h3 className="mt-4 text-xl font-semibold text-slate-800">2.4 Données techniques</h3>
              <ul className="mt-2 list-disc space-y-1 pl-6 text-slate-700">
                <li>Adresse IP</li>
                <li>Type de navigateur</li>
                <li>Système d'exploitation</li>
                <li>Pages visitées et durée</li>
                <li>Cookies (voir section Cookies)</li>
              </ul>
            </section>

            {/* Article 3 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">3. Finalités et Bases Légales du Traitement</h2>

              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Finalité</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Base légale</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    <tr>
                      <td className="px-4 py-3 text-sm text-slate-700">Création et gestion de votre compte</td>
                      <td className="px-4 py-3 text-sm text-slate-700">Exécution du contrat (Art. 6.1.b RGPD)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-slate-700">Traitement des paiements</td>
                      <td className="px-4 py-3 text-sm text-slate-700">Exécution du contrat (Art. 6.1.b RGPD)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-slate-700">Envoi d'emails transactionnels</td>
                      <td className="px-4 py-3 text-sm text-slate-700">Exécution du contrat (Art. 6.1.b RGPD)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-slate-700">Newsletter marketing</td>
                      <td className="px-4 py-3 text-sm text-slate-700">Consentement (Art. 6.1.a RGPD)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-slate-700">Amélioration de nos services</td>
                      <td className="px-4 py-3 text-sm text-slate-700">Intérêt légitime (Art. 6.1.f RGPD)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-slate-700">Prévention de la fraude</td>
                      <td className="px-4 py-3 text-sm text-slate-700">Intérêt légitime (Art. 6.1.f RGPD)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-slate-700">Respect des obligations légales</td>
                      <td className="px-4 py-3 text-sm text-slate-700">Obligation légale (Art. 6.1.c RGPD)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Article 4 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">4. Destinataires des Données</h2>
              <p className="mt-4 text-slate-700">
                Vos données personnelles peuvent être transmises aux catégories de destinataires suivants :
              </p>

              <h3 className="mt-4 text-xl font-semibold text-slate-800">4.1 Personnel autorisé</h3>
              <p className="mt-2 text-slate-700">
                Nos employés et prestataires habilités, dans la limite de leurs attributions respectives.
              </p>

              <h3 className="mt-4 text-xl font-semibold text-slate-800">4.2 Sous-traitants</h3>
              <ul className="mt-2 list-disc space-y-1 pl-6 text-slate-700">
                <li><strong>Supabase</strong> : hébergement de la base de données (UE/US - Privacy Shield)</li>
                <li><strong>Stripe</strong> : traitement des paiements (conforme PCI-DSS)</li>
                <li><strong>Resend</strong> : envoi d'emails transactionnels</li>
                <li><strong>Vercel</strong> : hébergement de l'application web</li>
              </ul>

              <h3 className="mt-4 text-xl font-semibold text-slate-800">4.3 Créateurs de cours</h3>
              <p className="mt-2 text-slate-700">
                Lorsque vous achetez un cours, le créateur a accès à votre nom et email pour pouvoir vous contacter si nécessaire.
              </p>

              <h3 className="mt-4 text-xl font-semibold text-slate-800">4.4 Autorités publiques</h3>
              <p className="mt-2 text-slate-700">
                En cas de réquisition judiciaire ou pour se conformer à une obligation légale.
              </p>
            </section>

            {/* Article 5 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">5. Transferts Hors Union Européenne</h2>
              <p className="mt-4 text-slate-700">
                Certaines de nos données sont hébergées en dehors de l'Union Européenne :
              </p>
              <ul className="mt-2 list-disc space-y-2 pl-6 text-slate-700">
                <li>
                  <strong>Stripe (États-Unis) :</strong> Conformité PCI-DSS et clauses contractuelles types de la Commission Européenne
                </li>
                <li>
                  <strong>Supabase :</strong> Possibilité de choisir la région de stockage (par défaut EU)
                </li>
                <li>
                  <strong>Vercel (Global CDN) :</strong> Clauses contractuelles types
                </li>
              </ul>
              <p className="mt-2 text-slate-700">
                Ces transferts sont encadrés par des garanties appropriées conformément aux articles 44 et suivants du RGPD.
              </p>
            </section>

            {/* Article 6 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">6. Durée de Conservation</h2>

              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Type de données</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Durée</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    <tr>
                      <td className="px-4 py-3 text-sm text-slate-700">Compte actif</td>
                      <td className="px-4 py-3 text-sm text-slate-700">Durée du compte + 1 an après clôture</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-slate-700">Données de facturation</td>
                      <td className="px-4 py-3 text-sm text-slate-700">10 ans (obligation légale comptable)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-slate-700">Logs de connexion</td>
                      <td className="px-4 py-3 text-sm text-slate-700">1 an (obligation légale LCEN)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-slate-700">Cookies analytics</td>
                      <td className="px-4 py-3 text-sm text-slate-700">13 mois maximum</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-slate-700">Newsletter</td>
                      <td className="px-4 py-3 text-sm text-slate-700">Jusqu'au retrait du consentement</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="mt-4 text-slate-700">
                À l'expiration de ces délais, vos données sont supprimées ou anonymisées de manière irréversible.
              </p>
            </section>

            {/* Article 7 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">7. Vos Droits</h2>
              <p className="mt-4 text-slate-700">
                Conformément au RGPD, vous disposez des droits suivants :
              </p>

              <h3 className="mt-4 text-xl font-semibold text-slate-800">7.1 Droit d'accès (Art. 15 RGPD)</h3>
              <p className="mt-2 text-slate-700">
                Vous pouvez obtenir la confirmation que vos données sont traitées et accéder à ces données.
              </p>

              <h3 className="mt-4 text-xl font-semibold text-slate-800">7.2 Droit de rectification (Art. 16 RGPD)</h3>
              <p className="mt-2 text-slate-700">
                Vous pouvez demander la rectification de données inexactes ou incomplètes.
              </p>

              <h3 className="mt-4 text-xl font-semibold text-slate-800">7.3 Droit à l'effacement (Art. 17 RGPD)</h3>
              <p className="mt-2 text-slate-700">
                Vous pouvez demander la suppression de vos données dans certains cas (sauf obligations légales de conservation).
              </p>

              <h3 className="mt-4 text-xl font-semibold text-slate-800">7.4 Droit à la limitation (Art. 18 RGPD)</h3>
              <p className="mt-2 text-slate-700">
                Vous pouvez demander la limitation du traitement de vos données dans certaines situations.
              </p>

              <h3 className="mt-4 text-xl font-semibold text-slate-800">7.5 Droit à la portabilité (Art. 20 RGPD)</h3>
              <p className="mt-2 text-slate-700">
                Vous pouvez recevoir vos données dans un format structuré et les transmettre à un autre responsable de traitement.
              </p>

              <h3 className="mt-4 text-xl font-semibold text-slate-800">7.6 Droit d'opposition (Art. 21 RGPD)</h3>
              <p className="mt-2 text-slate-700">
                Vous pouvez vous opposer au traitement de vos données pour des raisons tenant à votre situation particulière.
              </p>

              <h3 className="mt-4 text-xl font-semibold text-slate-800">7.7 Retrait du consentement</h3>
              <p className="mt-2 text-slate-700">
                Lorsque le traitement est basé sur votre consentement, vous pouvez le retirer à tout moment.
              </p>

              <h3 className="mt-4 text-xl font-semibold text-slate-800">7.8 Directives post-mortem</h3>
              <p className="mt-2 text-slate-700">
                Vous pouvez définir des directives relatives au sort de vos données après votre décès.
              </p>

              <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                <p className="text-sm font-medium text-blue-900">
                  Pour exercer vos droits, contactez-nous à : <a href="mailto:[EMAIL_DPO]" className="underline">[EMAIL_DPO]</a>
                </p>
                <p className="mt-2 text-sm text-blue-800">
                  Vous devrez fournir une preuve d'identité. Nous répondrons dans un délai d'un mois maximum.
                </p>
              </div>

              <h3 className="mt-6 text-xl font-semibold text-slate-800">7.9 Droit de réclamation auprès de la CNIL</h3>
              <p className="mt-2 text-slate-700">
                Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de la CNIL :
              </p>
              <ul className="mt-2 space-y-1 text-slate-700">
                <li><strong>Site web :</strong> <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">www.cnil.fr</a></li>
                <li><strong>Adresse :</strong> 3 Place de Fontenoy - TSA 80715 - 75334 PARIS CEDEX 07</li>
                <li><strong>Téléphone :</strong> 01 53 73 22 22</li>
              </ul>
            </section>

            {/* Article 8 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">8. Sécurité des Données</h2>
              <p className="mt-4 text-slate-700">
                Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour garantir la sécurité de vos données :
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-6 text-slate-700">
                <li><strong>Chiffrement :</strong> HTTPS/TLS pour toutes les communications, mots de passe hashés avec bcrypt</li>
                <li><strong>Authentification :</strong> Supabase Auth avec tokens JWT sécurisés</li>
                <li><strong>Hébergement :</strong> Serveurs sécurisés avec sauvegardes automatiques</li>
                <li><strong>Accès restreint :</strong> Politique de moindre privilège pour les accès internes</li>
                <li><strong>Surveillance :</strong> Logs d'activité et détection des anomalies</li>
                <li><strong>Conformité PCI-DSS :</strong> Pour les données de paiement via Stripe</li>
              </ul>
            </section>

            {/* Article 9 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">9. Cookies et Technologies Similaires</h2>

              <h3 className="mt-4 text-xl font-semibold text-slate-800">9.1 Cookies essentiels</h3>
              <p className="mt-2 text-slate-700">
                Nécessaires au fonctionnement du site (session, authentification). Ils ne nécessitent pas de consentement.
              </p>

              <h3 className="mt-4 text-xl font-semibold text-slate-800">9.2 Cookies analytics</h3>
              <p className="mt-2 text-slate-700">
                Nous utilisons des cookies pour analyser l'utilisation de notre site (pages visitées, durée, etc.). Vous pouvez refuser ces cookies via notre bandeau de consentement.
              </p>

              <h3 className="mt-4 text-xl font-semibold text-slate-800">9.3 Gestion des cookies</h3>
              <p className="mt-2 text-slate-700">
                Vous pouvez gérer vos préférences de cookies à tout moment :
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-6 text-slate-700">
                <li>Via notre bandeau de consentement</li>
                <li>Via les paramètres de votre navigateur</li>
                <li>Via notre page de gestion des cookies : <a href="/legal/cookies" className="text-blue-600 hover:underline">/legal/cookies</a></li>
              </ul>

              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Cookie</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Type</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Durée</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Finalité</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    <tr>
                      <td className="px-4 py-3 text-sm text-slate-700">supabase-auth-token</td>
                      <td className="px-4 py-3 text-sm text-slate-700">Essentiel</td>
                      <td className="px-4 py-3 text-sm text-slate-700">Session</td>
                      <td className="px-4 py-3 text-sm text-slate-700">Authentification</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-slate-700">cookie-consent</td>
                      <td className="px-4 py-3 text-sm text-slate-700">Essentiel</td>
                      <td className="px-4 py-3 text-sm text-slate-700">1 an</td>
                      <td className="px-4 py-3 text-sm text-slate-700">Mémoriser vos préférences</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-slate-700">_ga, _gid</td>
                      <td className="px-4 py-3 text-sm text-slate-700">Analytics</td>
                      <td className="px-4 py-3 text-sm text-slate-700">13 mois</td>
                      <td className="px-4 py-3 text-sm text-slate-700">Statistiques d'audience</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Article 10 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">10. Mineurs</h2>
              <p className="mt-4 text-slate-700">
                Notre service est destiné aux personnes âgées d'au moins 18 ans. Si vous avez moins de 18 ans, vous devez obtenir l'autorisation de vos parents ou tuteurs légaux.
              </p>
              <p className="mt-2 text-slate-700">
                Si nous découvrons qu'un mineur de moins de 15 ans nous a fourni des données personnelles sans le consentement parental, nous supprimerons ces données immédiatement.
              </p>
            </section>

            {/* Article 11 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">11. Modifications de la Politique</h2>
              <p className="mt-4 text-slate-700">
                Nous pouvons modifier cette politique de confidentialité à tout moment. En cas de modification substantielle, nous vous en informerons par email et/ou via un avis visible sur la plateforme.
              </p>
              <p className="mt-2 text-slate-700">
                La version en vigueur est celle disponible sur cette page. La date de dernière mise à jour est indiquée en haut de cette page.
              </p>
            </section>

            {/* Article 12 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">12. Contact</h2>
              <p className="mt-4 text-slate-700">
                Pour toute question concernant cette politique de confidentialité ou l'exercice de vos droits :
              </p>
              <ul className="mt-2 space-y-2 text-slate-700">
                <li>
                  <strong>Délégué à la Protection des Données (DPO) :</strong><br />
                  Email : <a href="mailto:[EMAIL_DPO]" className="text-blue-600 hover:underline">[EMAIL_DPO]</a><br />
                  Courrier : [ADRESSE_COMPLETE]
                </li>
                <li>
                  <strong>Support général :</strong><br />
                  Email : <a href="mailto:[EMAIL_SUPPORT]" className="text-blue-600 hover:underline">[EMAIL_SUPPORT]</a>
                </li>
              </ul>
            </section>

            {/* Footer */}
            <div className="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-lg font-semibold text-slate-900">Résumé de vos droits RGPD</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-slate-900">✓ Accès</p>
                  <p className="text-sm text-slate-600">Accéder à vos données</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">✓ Rectification</p>
                  <p className="text-sm text-slate-600">Corriger vos données</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">✓ Effacement</p>
                  <p className="text-sm text-slate-600">Supprimer vos données</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">✓ Portabilité</p>
                  <p className="text-sm text-slate-600">Récupérer vos données</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">✓ Opposition</p>
                  <p className="text-sm text-slate-600">Vous opposer au traitement</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">✓ Réclamation</p>
                  <p className="text-sm text-slate-600">Saisir la CNIL</p>
                </div>
              </div>
            </div>

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
          <a href="/legal/mentions" className="text-sm text-blue-600 hover:underline">
            Mentions légales
          </a>
        </div>
      </div>
    </div>
  );
}
