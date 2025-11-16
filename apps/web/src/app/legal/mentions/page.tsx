import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mentions Légales',
  description: 'Mentions légales de SkillForge',
};

export default function MentionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-900">
            Mentions Légales
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Conformément à la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique
          </p>
        </div>

        {/* Content */}
        <div className="rounded-lg bg-white p-8 shadow-sm">
          <div className="prose prose-slate max-w-none">

            {/* Section 1 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">1. Éditeur du Site</h2>
              <p className="mt-4 text-slate-700">
                Le site web SkillForge accessible à l'adresse [VOTRE_URL] est édité par :
              </p>
              <ul className="mt-4 space-y-2 text-slate-700">
                <li><strong>Raison sociale :</strong> [VOTRE_ENTREPRISE]</li>
                <li><strong>Forme juridique :</strong> [FORME_JURIDIQUE] au capital de [CAPITAL] euros</li>
                <li><strong>Siège social :</strong> [ADRESSE_COMPLETE]</li>
                <li><strong>SIRET :</strong> [NUMÉRO_SIRET]</li>
                <li><strong>RCS :</strong> [VILLE] [NUMÉRO_RCS]</li>
                <li><strong>Numéro de TVA intracommunautaire :</strong> [NUMÉRO_TVA]</li>
                <li><strong>Téléphone :</strong> [NUMÉRO_TÉLÉPHONE]</li>
                <li><strong>Email :</strong> <a href="mailto:[EMAIL_CONTACT]" className="text-blue-600 hover:underline">[EMAIL_CONTACT]</a></li>
              </ul>

              <p className="mt-4 text-slate-700">
                <strong>Directeur de la publication :</strong> [NOM_PRÉNOM_DIRECTEUR], [FONCTION]
              </p>
            </section>

            {/* Section 2 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">2. Hébergement du Site</h2>

              <h3 className="mt-4 text-xl font-semibold text-slate-800">2.1 Hébergeur Web</h3>
              <ul className="mt-2 space-y-2 text-slate-700">
                <li><strong>Nom :</strong> Vercel Inc.</li>
                <li><strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, USA</li>
                <li><strong>Site web :</strong> <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">vercel.com</a></li>
              </ul>

              <h3 className="mt-4 text-xl font-semibold text-slate-800">2.2 Hébergeur Base de Données</h3>
              <ul className="mt-2 space-y-2 text-slate-700">
                <li><strong>Nom :</strong> Supabase Inc.</li>
                <li><strong>Adresse :</strong> 970 Toa Payoh North, #07-04, Singapore 318992</li>
                <li><strong>Site web :</strong> <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">supabase.com</a></li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">3. Propriété Intellectuelle</h2>
              <p className="mt-4 text-slate-700">
                L'ensemble du contenu du site SkillForge (structure, textes, logos, images, éléments graphiques, vidéos, sons, bases de données, logiciels, etc.) est la propriété exclusive de [VOTRE_ENTREPRISE] ou de ses partenaires.
              </p>
              <p className="mt-2 text-slate-700">
                Toute représentation, reproduction, adaptation ou exploitation partielle ou totale du contenu du site, par quelque procédé que ce soit, sans l'autorisation préalable, expresse et écrite de [VOTRE_ENTREPRISE], est strictement interdite et constitue un délit de contrefaçon sanctionné par les articles L.335-2 et suivants du Code de la propriété intellectuelle.
              </p>
              <p className="mt-2 text-slate-700">
                Les marques et logos figurant sur le site sont des marques déposées. Toute reproduction ou utilisation sans autorisation expresse est interdite.
              </p>

              <h3 className="mt-4 text-xl font-semibold text-slate-800">3.1 Contenu des cours</h3>
              <p className="mt-2 text-slate-700">
                Les créateurs de cours conservent l'intégralité de leurs droits de propriété intellectuelle sur le contenu de leurs cours. Ils concèdent à SkillForge une licence non exclusive d'utilisation, de reproduction et de représentation pour la durée de diffusion du cours sur la plateforme.
              </p>

              <h3 className="mt-4 text-xl font-semibold text-slate-800">3.2 Licences logicielles</h3>
              <p className="mt-2 text-slate-700">
                Le site utilise des bibliothèques et frameworks open source dont les licences sont disponibles dans notre dépôt de code source.
              </p>
            </section>

            {/* Section 4 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">4. Protection des Données Personnelles</h2>
              <p className="mt-4 text-slate-700">
                Conformément au Règlement Général sur la Protection des Données (RGPD - Règlement UE 2016/679) et à la loi Informatique et Libertés, vous disposez de droits sur vos données personnelles.
              </p>
              <p className="mt-2 text-slate-700">
                Pour plus d'informations, consultez notre{' '}
                <a href="/legal/privacy" className="text-blue-600 hover:underline">
                  Politique de Confidentialité
                </a>.
              </p>

              <ul className="mt-4 space-y-2 text-slate-700">
                <li><strong>Responsable du traitement :</strong> [VOTRE_ENTREPRISE]</li>
                <li><strong>Délégué à la Protection des Données (DPO) :</strong> <a href="mailto:[EMAIL_DPO]" className="text-blue-600 hover:underline">[EMAIL_DPO]</a></li>
                <li><strong>Déclaration CNIL :</strong> [NUMÉRO_DÉCLARATION] (si applicable)</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">5. Cookies</h2>
              <p className="mt-4 text-slate-700">
                Le site utilise des cookies pour améliorer l'expérience utilisateur et réaliser des statistiques de visite.
              </p>
              <p className="mt-2 text-slate-700">
                Conformément aux recommandations de la CNIL, vous pouvez accepter ou refuser les cookies non essentiels via notre bandeau de consentement.
              </p>
              <p className="mt-2 text-slate-700">
                Pour plus d'informations, consultez notre{' '}
                <a href="/legal/cookies" className="text-blue-600 hover:underline">
                  Politique de Cookies
                </a>.
              </p>
            </section>

            {/* Section 6 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">6. Responsabilité</h2>

              <h3 className="mt-4 text-xl font-semibold text-slate-800">6.1 Contenu du site</h3>
              <p className="mt-2 text-slate-700">
                SkillForge s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur le site. Toutefois, SkillForge ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition sur le site.
              </p>
              <p className="mt-2 text-slate-700">
                SkillForge se réserve le droit de corriger le contenu du site à tout moment et sans préavis.
              </p>

              <h3 className="mt-4 text-xl font-semibold text-slate-800">6.2 Disponibilité du site</h3>
              <p className="mt-2 text-slate-700">
                SkillForge met en œuvre tous les moyens raisonnables à sa disposition pour assurer un accès de qualité au site, mais n'est tenu à aucune obligation d'y parvenir.
              </p>
              <p className="mt-2 text-slate-700">
                SkillForge ne peut être tenue responsable de tout dysfonctionnement du réseau ou des serveurs ou de tout autre événement échappant au contrôle raisonnable qui empêcherait ou dégraderait l'accès au site.
              </p>

              <h3 className="mt-4 text-xl font-semibold text-slate-800">6.3 Contenu des cours</h3>
              <p className="mt-2 text-slate-700">
                SkillForge agit en tant qu'intermédiaire technique et n'est pas responsable du contenu des cours publiés par les créateurs. La responsabilité du contenu incombe exclusivement aux créateurs.
              </p>
              <p className="mt-2 text-slate-700">
                SkillForge se réserve néanmoins le droit de retirer tout contenu manifestement illicite ou contraire aux présentes mentions légales.
              </p>

              <h3 className="mt-4 text-xl font-semibold text-slate-800">6.4 Liens hypertextes</h3>
              <p className="mt-2 text-slate-700">
                Le site peut contenir des liens hypertextes vers d'autres sites. SkillForge n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.
              </p>
            </section>

            {/* Section 7 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">7. Loi Applicable et Juridiction</h2>
              <p className="mt-4 text-slate-700">
                Les présentes mentions légales sont régies par le droit français.
              </p>
              <p className="mt-2 text-slate-700">
                En cas de litige et à défaut d'accord amiable, le litige sera porté devant les tribunaux français conformément aux règles de compétence en vigueur.
              </p>
            </section>

            {/* Section 8 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">8. Médiation de la Consommation</h2>
              <p className="mt-4 text-slate-700">
                Conformément à l'article L.616-1 du Code de la consommation, nous proposons un dispositif de médiation de la consommation.
              </p>
              <p className="mt-2 text-slate-700">
                En cas de litige, vous pouvez déposer votre réclamation sur la plateforme de résolution des litiges mise en ligne par la Commission Européenne à l'adresse suivante :{' '}
                <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  https://ec.europa.eu/consumers/odr/
                </a>
              </p>

              <p className="mt-4 text-slate-700">
                <strong>Médiateur de la consommation :</strong>
              </p>
              <ul className="mt-2 space-y-1 text-slate-700">
                <li><strong>Nom :</strong> [NOM_MÉDIATEUR]</li>
                <li><strong>Adresse :</strong> [ADRESSE_MÉDIATEUR]</li>
                <li><strong>Site web :</strong> <a href="[URL_MÉDIATEUR]" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">[URL_MÉDIATEUR]</a></li>
                <li><strong>Email :</strong> [EMAIL_MÉDIATEUR]</li>
              </ul>
            </section>

            {/* Section 9 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">9. Signalement de Contenu Illicite</h2>
              <p className="mt-4 text-slate-700">
                Conformément à la loi pour la confiance dans l'économie numérique (LCEN), si vous constatez la présence de contenu illicite sur notre plateforme, vous pouvez nous le signaler à l'adresse suivante :{' '}
                <a href="mailto:[EMAIL_SIGNALEMENT]" className="text-blue-600 hover:underline">[EMAIL_SIGNALEMENT]</a>
              </p>
              <p className="mt-2 text-slate-700">
                Votre signalement doit contenir :
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-6 text-slate-700">
                <li>Votre identité (nom, prénom, adresse)</li>
                <li>La description des faits litigieux et leur localisation précise (URL)</li>
                <li>Les motifs pour lesquels le contenu doit être retiré</li>
                <li>La copie de la correspondance adressée à l'auteur ou à l'éditeur des informations litigieuses demandant leur interruption, leur retrait ou leur modification, ou la justification de ce que l'auteur ou l'éditeur n'a pu être contacté</li>
              </ul>
            </section>

            {/* Section 10 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">10. Crédits</h2>

              <h3 className="mt-4 text-xl font-semibold text-slate-800">10.1 Conception et développement</h3>
              <ul className="mt-2 space-y-1 text-slate-700">
                <li><strong>Développement :</strong> [NOM_DÉVELOPPEUR ou VOTRE_ENTREPRISE]</li>
                <li><strong>Design :</strong> [NOM_DESIGNER ou VOTRE_ENTREPRISE]</li>
              </ul>

              <h3 className="mt-4 text-xl font-semibold text-slate-800">10.2 Technologies utilisées</h3>
              <ul className="mt-2 list-disc space-y-1 pl-6 text-slate-700">
                <li><strong>Framework :</strong> Next.js 14 (React)</li>
                <li><strong>Base de données :</strong> Supabase (PostgreSQL)</li>
                <li><strong>Paiement :</strong> Stripe</li>
                <li><strong>Hébergement :</strong> Vercel</li>
                <li><strong>Emails :</strong> Resend</li>
                <li><strong>UI :</strong> Tailwind CSS</li>
              </ul>

              <h3 className="mt-4 text-xl font-semibold text-slate-800">10.3 Ressources graphiques</h3>
              <p className="mt-2 text-slate-700">
                Les icônes utilisées proviennent de :<br />
                - Lucide Icons (<a href="https://lucide.dev" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">lucide.dev</a>) - Licence ISC<br />
                - [AUTRES_SOURCES_SI_APPLICABLE]
              </p>
            </section>

            {/* Section 11 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">11. Contact</h2>
              <p className="mt-4 text-slate-700">
                Pour toute question concernant le site ou les présentes mentions légales, vous pouvez nous contacter :
              </p>
              <ul className="mt-4 space-y-2 text-slate-700">
                <li>
                  <strong>Par email :</strong>{' '}
                  <a href="mailto:[EMAIL_CONTACT]" className="text-blue-600 hover:underline">[EMAIL_CONTACT]</a>
                </li>
                <li>
                  <strong>Par courrier :</strong><br />
                  [VOTRE_ENTREPRISE]<br />
                  [ADRESSE_COMPLETE]
                </li>
                <li>
                  <strong>Par téléphone :</strong> [NUMÉRO_TÉLÉPHONE]<br />
                  <span className="text-sm text-slate-600">(Horaires : [HORAIRES_OUVERTURE])</span>
                </li>
              </ul>
            </section>

            {/* Footer */}
            <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-6">
              <h3 className="text-lg font-semibold text-blue-900">Dernière modification</h3>
              <p className="mt-2 text-sm text-blue-800">
                Les présentes mentions légales ont été mises à jour le{' '}
                {new Date().toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}.
              </p>
              <p className="mt-2 text-sm text-blue-800">
                Nous nous réservons le droit de les modifier à tout moment. Nous vous invitons donc à les consulter régulièrement.
              </p>
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
          <a href="/legal/privacy" className="text-sm text-blue-600 hover:underline">
            Politique de confidentialité
          </a>
        </div>
      </div>
    </div>
  );
}
