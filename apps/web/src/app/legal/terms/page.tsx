import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Conditions Générales d\'Utilisation et de Vente',
  description: 'Conditions générales d\'utilisation et de vente de SkillForge',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-900">
            Conditions Générales d'Utilisation et de Vente
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        {/* Content */}
        <div className="rounded-lg bg-white p-8 shadow-sm">
          <div className="prose prose-slate max-w-none">

            {/* Article 1 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">1. Objet</h2>
              <p className="mt-4 text-slate-700">
                Les présentes Conditions Générales d'Utilisation et de Vente (ci-après "CGU/CGV") régissent l'utilisation de la plateforme SkillForge (ci-après "la Plateforme"), accessible à l'adresse [VOTRE_URL], et les conditions de vente des cours en ligne proposés sur celle-ci.
              </p>
              <p className="mt-2 text-slate-700">
                La Plateforme est éditée par [VOTRE_ENTREPRISE], [FORME_JURIDIQUE], au capital de [CAPITAL] euros, dont le siège social est situé à [ADRESSE], immatriculée au RCS de [VILLE] sous le numéro [SIRET].
              </p>
            </section>

            {/* Article 2 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">2. Définitions</h2>
              <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-700">
                <li><strong>Utilisateur</strong> : toute personne physique ou morale accédant à la Plateforme</li>
                <li><strong>Étudiant</strong> : Utilisateur inscrit pour suivre des cours</li>
                <li><strong>Créateur</strong> : Utilisateur inscrit pour créer et vendre des cours</li>
                <li><strong>Cours</strong> : contenu pédagogique (vidéos, textes, quiz, etc.) proposé par un Créateur</li>
                <li><strong>Compte</strong> : espace personnel de l'Utilisateur sur la Plateforme</li>
              </ul>
            </section>

            {/* Article 3 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">3. Acceptation des CGU/CGV</h2>
              <p className="mt-4 text-slate-700">
                L'utilisation de la Plateforme implique l'acceptation pleine et entière des présentes CGU/CGV. L'Utilisateur reconnaît avoir pris connaissance de ces conditions et les accepter sans réserve.
              </p>
              <p className="mt-2 text-slate-700">
                En cas de non-acceptation, l'Utilisateur doit s'abstenir d'utiliser la Plateforme.
              </p>
            </section>

            {/* Article 4 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">4. Inscription et Compte Utilisateur</h2>

              <h3 className="mt-4 text-xl font-semibold text-slate-800">4.1 Création de compte</h3>
              <p className="mt-2 text-slate-700">
                Pour accéder à certaines fonctionnalités, l'Utilisateur doit créer un Compte en fournissant des informations exactes, à jour et complètes. L'Utilisateur s'engage à mettre à jour ces informations en cas de modification.
              </p>

              <h3 className="mt-4 text-xl font-semibold text-slate-800">4.2 Sécurité du compte</h3>
              <p className="mt-2 text-slate-700">
                L'Utilisateur est responsable de la confidentialité de ses identifiants de connexion. Toute utilisation du Compte est présumée émaner de l'Utilisateur. En cas d'utilisation frauduleuse, l'Utilisateur doit immédiatement en informer la Plateforme.
              </p>

              <h3 className="mt-4 text-xl font-semibold text-slate-800">4.3 Conditions d'inscription</h3>
              <ul className="mt-2 list-disc space-y-1 pl-6 text-slate-700">
                <li>Être âgé d'au moins 18 ans ou disposer de l'autorisation parentale</li>
                <li>Fournir des informations exactes et à jour</li>
                <li>Ne créer qu'un seul Compte par personne</li>
                <li>Ne pas usurper l'identité d'autrui</li>
              </ul>
            </section>

            {/* Article 5 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">5. Services Proposés</h2>

              <h3 className="mt-4 text-xl font-semibold text-slate-800">5.1 Pour les Étudiants</h3>
              <ul className="mt-2 list-disc space-y-1 pl-6 text-slate-700">
                <li>Accès à un catalogue de cours</li>
                <li>Inscription à des cours gratuits ou payants</li>
                <li>Suivi de progression</li>
                <li>Certificats de complétion</li>
                <li>Système de commentaires et de révisions</li>
              </ul>

              <h3 className="mt-4 text-xl font-semibold text-slate-800">5.2 Pour les Créateurs</h3>
              <ul className="mt-2 list-disc space-y-1 pl-6 text-slate-700">
                <li>Création et publication de cours</li>
                <li>Fixation des prix</li>
                <li>Suivi des inscriptions et des revenus</li>
                <li>Tableaux de bord analytiques</li>
                <li>Paiements via Stripe Connect</li>
              </ul>
            </section>

            {/* Article 6 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">6. Conditions de Vente</h2>

              <h3 className="mt-4 text-xl font-semibold text-slate-800">6.1 Prix</h3>
              <p className="mt-2 text-slate-700">
                Les prix des cours sont fixés librement par les Créateurs et affichés en euros TTC. La Plateforme prélève une commission de 4% sur chaque vente (frais Stripe inclus).
              </p>

              <h3 className="mt-4 text-xl font-semibold text-slate-800">6.2 Paiement</h3>
              <p className="mt-2 text-slate-700">
                Les paiements sont traités de manière sécurisée via Stripe. Les moyens de paiement acceptés sont : carte bancaire (Visa, Mastercard, American Express).
              </p>
              <p className="mt-2 text-slate-700">
                L'Étudiant garantit disposer des autorisations nécessaires pour utiliser le moyen de paiement choisi.
              </p>

              <h3 className="mt-4 text-xl font-semibold text-slate-800">6.3 Confirmation de commande</h3>
              <p className="mt-2 text-slate-700">
                Après validation du paiement, l'Étudiant reçoit un email de confirmation et accède immédiatement au cours acheté.
              </p>

              <h3 className="mt-4 text-xl font-semibold text-slate-800">6.4 Accès aux cours</h3>
              <p className="mt-2 text-slate-700">
                L'accès aux cours achetés est immédiat et illimité dans le temps, sauf mention contraire. L'Étudiant peut consulter le cours autant de fois qu'il le souhaite.
              </p>
            </section>

            {/* Article 7 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">7. Droit de Rétractation</h2>
              <p className="mt-4 text-slate-700">
                Conformément à l'article L221-28 du Code de la consommation, l'Étudiant dispose d'un délai de 14 jours à compter de l'achat pour exercer son droit de rétractation, SAUF s'il a commencé à consulter le cours.
              </p>
              <p className="mt-2 text-slate-700">
                En accédant au contenu du cours, l'Étudiant renonce expressément à son droit de rétractation conformément à l'article L221-28 13° du Code de la consommation.
              </p>
              <p className="mt-2 text-slate-700">
                Pour exercer son droit de rétractation, l'Étudiant peut contacter le support à l'adresse : [EMAIL_SUPPORT].
              </p>
            </section>

            {/* Article 8 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">8. Remboursements</h2>
              <p className="mt-4 text-slate-700">
                Les remboursements sont à la discrétion du Créateur. L'Étudiant peut demander un remboursement dans les cas suivants :
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-6 text-slate-700">
                <li>Contenu du cours non conforme à la description</li>
                <li>Problème technique empêchant l'accès au cours</li>
                <li>Erreur de transaction</li>
              </ul>
              <p className="mt-2 text-slate-700">
                Les demandes de remboursement doivent être adressées à [EMAIL_SUPPORT] dans un délai de 30 jours.
              </p>
            </section>

            {/* Article 9 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">9. Propriété Intellectuelle</h2>

              <h3 className="mt-4 text-xl font-semibold text-slate-800">9.1 Contenu de la Plateforme</h3>
              <p className="mt-2 text-slate-700">
                Tous les éléments de la Plateforme (logo, charte graphique, design, code source) sont la propriété exclusive de [VOTRE_ENTREPRISE] et sont protégés par le droit d'auteur.
              </p>

              <h3 className="mt-4 text-xl font-semibold text-slate-800">9.2 Contenu des cours</h3>
              <p className="mt-2 text-slate-700">
                Les Créateurs conservent l'intégralité de leurs droits de propriété intellectuelle sur le contenu de leurs cours. En publiant un cours, le Créateur concède à la Plateforme une licence non exclusive pour héberger, diffuser et promouvoir le contenu.
              </p>

              <h3 className="mt-4 text-xl font-semibold text-slate-800">9.3 Usage personnel</h3>
              <p className="mt-2 text-slate-700">
                L'accès à un cours est strictement personnel et non transférable. Il est interdit de :
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-6 text-slate-700">
                <li>Reproduire, copier ou télécharger le contenu à des fins commerciales</li>
                <li>Partager ses identifiants de connexion</li>
                <li>Diffuser ou revendre le contenu des cours</li>
                <li>Utiliser le contenu pour créer des œuvres dérivées sans autorisation</li>
              </ul>
            </section>

            {/* Article 10 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">10. Obligations des Créateurs</h2>
              <p className="mt-4 text-slate-700">
                Les Créateurs s'engagent à :
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-6 text-slate-700">
                <li>Publier uniquement du contenu original ou pour lequel ils disposent des droits nécessaires</li>
                <li>Ne pas publier de contenu illégal, diffamatoire, discriminatoire ou portant atteinte aux droits d'autrui</li>
                <li>Fournir un contenu de qualité conforme à la description</li>
                <li>Respecter la législation applicable en matière de formation professionnelle si applicable</li>
                <li>Déclarer leurs revenus conformément à la législation fiscale en vigueur</li>
              </ul>
              <p className="mt-2 text-slate-700">
                La Plateforme se réserve le droit de supprimer tout contenu ne respectant pas ces obligations, sans préavis ni indemnité.
              </p>
            </section>

            {/* Article 11 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">11. Obligations des Étudiants</h2>
              <p className="mt-4 text-slate-700">
                Les Étudiants s'engagent à :
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-6 text-slate-700">
                <li>Utiliser la Plateforme de manière loyale et conforme à sa destination</li>
                <li>Ne pas tenter de contourner les mesures de protection</li>
                <li>Ne pas partager ou revendre l'accès aux cours</li>
                <li>Publier des commentaires respectueux et constructifs</li>
                <li>Signaler tout contenu inapproprié</li>
              </ul>
            </section>

            {/* Article 12 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">12. Modération et Sanctions</h2>
              <p className="mt-4 text-slate-700">
                La Plateforme se réserve le droit de modérer les contenus publiés par les Utilisateurs. En cas de manquement aux présentes CGU/CGV, la Plateforme peut :
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-6 text-slate-700">
                <li>Avertir l'Utilisateur</li>
                <li>Suspendre temporairement le Compte</li>
                <li>Supprimer le Compte définitivement</li>
                <li>Supprimer le contenu litigieux</li>
                <li>Engager des poursuites judiciaires si nécessaire</li>
              </ul>
            </section>

            {/* Article 13 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">13. Responsabilité</h2>

              <h3 className="mt-4 text-xl font-semibold text-slate-800">13.1 Responsabilité de la Plateforme</h3>
              <p className="mt-2 text-slate-700">
                La Plateforme s'efforce d'assurer la disponibilité et la sécurité des services. Toutefois, elle ne peut garantir :
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-6 text-slate-700">
                <li>L'absence d'interruptions ou d'erreurs</li>
                <li>L'exactitude du contenu publié par les Créateurs</li>
                <li>L'obtention de résultats suite à la formation</li>
              </ul>
              <p className="mt-2 text-slate-700">
                La Plateforme agit en tant qu'intermédiaire technique et n'est pas responsable du contenu des cours ni de la relation entre Créateurs et Étudiants.
              </p>

              <h3 className="mt-4 text-xl font-semibold text-slate-800">13.2 Responsabilité des Créateurs</h3>
              <p className="mt-2 text-slate-700">
                Les Créateurs sont seuls responsables du contenu de leurs cours et des engagements pris auprès des Étudiants.
              </p>

              <h3 className="mt-4 text-xl font-semibold text-slate-800">13.3 Limitation de responsabilité</h3>
              <p className="mt-2 text-slate-700">
                En aucun cas la Plateforme ne pourra être tenue responsable des dommages indirects, tels que perte de données, perte de chance, perte de clientèle.
              </p>
            </section>

            {/* Article 14 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">14. Données Personnelles</h2>
              <p className="mt-4 text-slate-700">
                La collecte et le traitement des données personnelles sont régis par notre{' '}
                <a href="/legal/privacy" className="text-blue-600 hover:underline">
                  Politique de Confidentialité
                </a>
                , conforme au Règlement Général sur la Protection des Données (RGPD).
              </p>
            </section>

            {/* Article 15 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">15. Résiliation</h2>
              <p className="mt-4 text-slate-700">
                L'Utilisateur peut supprimer son Compte à tout moment depuis les paramètres de son profil. La suppression entraîne la perte de l'accès aux cours, sans remboursement.
              </p>
              <p className="mt-2 text-slate-700">
                La Plateforme peut résilier le Compte d'un Utilisateur en cas de violation des CGU/CGV, avec ou sans préavis.
              </p>
            </section>

            {/* Article 16 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">16. Modification des CGU/CGV</h2>
              <p className="mt-4 text-slate-700">
                La Plateforme se réserve le droit de modifier les présentes CGU/CGV à tout moment. Les modifications prennent effet dès leur publication sur la Plateforme.
              </p>
              <p className="mt-2 text-slate-700">
                L'Utilisateur sera informé des modifications majeures par email et/ou notification sur la Plateforme.
              </p>
            </section>

            {/* Article 17 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">17. Réclamations et Médiation</h2>
              <p className="mt-4 text-slate-700">
                Pour toute réclamation, l'Utilisateur peut contacter le service client à l'adresse : [EMAIL_SUPPORT].
              </p>
              <p className="mt-2 text-slate-700">
                Conformément aux articles L.616-1 et R.616-1 du Code de la consommation, nous proposons un dispositif de médiation de la consommation. L'entité de médiation retenue est : [NOM_MÉDIATEUR].
              </p>
              <p className="mt-2 text-slate-700">
                Site web : [URL_MÉDIATEUR]
              </p>
            </section>

            {/* Article 18 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">18. Loi Applicable et Juridiction</h2>
              <p className="mt-4 text-slate-700">
                Les présentes CGU/CGV sont régies par le droit français. En cas de litige, et à défaut de résolution amiable, les tribunaux français seront seuls compétents.
              </p>
            </section>

            {/* Article 19 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">19. Contact</h2>
              <p className="mt-4 text-slate-700">
                Pour toute question concernant les présentes CGU/CGV, vous pouvez nous contacter :
              </p>
              <ul className="mt-2 space-y-1 text-slate-700">
                <li><strong>Email :</strong> [EMAIL_SUPPORT]</li>
                <li><strong>Adresse :</strong> [ADRESSE_COMPLETE]</li>
                <li><strong>Téléphone :</strong> [TÉLÉPHONE]</li>
              </ul>
            </section>

          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-flex items-center text-sm text-blue-600 hover:underline"
          >
            ← Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  );
}
