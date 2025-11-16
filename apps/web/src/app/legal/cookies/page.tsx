'use client';

import { useState, useEffect } from 'react';
import { Cookie, Check, X } from 'lucide-react';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
}

export default function CookiesPage() {
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    marketing: false,
    timestamp: Date.now(),
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Charger les préférences sauvegardées
    const savedPrefs = localStorage.getItem('cookie-consent');
    if (savedPrefs) {
      try {
        const parsed = JSON.parse(savedPrefs);
        setPreferences(parsed);
      } catch (e) {
        console.error('Error loading preferences:', e);
      }
    }
  }, []);

  const savePreferences = () => {
    const toSave = {
      ...preferences,
      timestamp: Date.now(),
    };
    localStorage.setItem('cookie-consent', JSON.stringify(toSave));
    setPreferences(toSave);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);

    // Recharger la page pour appliquer les changements
    setTimeout(() => window.location.reload(), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-center">
            <Cookie className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="mt-4 text-4xl font-bold text-slate-900">
            Gestion des Cookies
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Personnalisez vos préférences de cookies
          </p>
        </div>

        {/* Main Content */}
        <div className="rounded-lg bg-white p-8 shadow-sm">
          <div className="prose prose-slate max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Qu'est-ce qu'un cookie ?</h2>
              <p className="mt-4 text-slate-700">
                Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, smartphone, tablette) lors de la visite d'un site web.
                Les cookies permettent de reconnaître votre navigateur et de mémoriser certaines informations vous concernant.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Comment utilisons-nous les cookies ?</h2>
              <p className="mt-4 text-slate-700">
                Nous utilisons différents types de cookies pour différentes finalités :
              </p>
            </section>

            {/* Cookie Categories */}
            <div className="mt-8 space-y-6">
              {/* Essential */}
              <div className="rounded-lg border-2 border-slate-200 bg-slate-50 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Check className="h-6 w-6 text-green-600" />
                      <h3 className="text-xl font-semibold text-slate-900">
                        Cookies Essentiels
                      </h3>
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        Toujours actifs
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-slate-600">
                      Ces cookies sont strictement nécessaires au fonctionnement du site. Ils ne peuvent pas être désactivés.
                    </p>
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-slate-700">Cookies utilisés :</h4>
                      <ul className="mt-2 list-disc space-y-1 pl-6 text-sm text-slate-600">
                        <li><strong>supabase-auth-token</strong> - Gestion de votre session (durée : session)</li>
                        <li><strong>cookie-consent</strong> - Mémorisation de vos choix (durée : 1 an)</li>
                      </ul>
                    </div>
                  </div>
                  <div className="ml-4 flex items-center">
                    <input
                      type="checkbox"
                      checked={true}
                      disabled
                      className="h-6 w-6 cursor-not-allowed rounded border-slate-300 bg-slate-100 text-blue-600"
                    />
                  </div>
                </div>
              </div>

              {/* Analytics */}
              <div className={`rounded-lg border-2 p-6 ${preferences.analytics ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Cookie className="h-6 w-6 text-blue-600" />
                      <h3 className="text-xl font-semibold text-slate-900">
                        Cookies Analytiques
                      </h3>
                    </div>
                    <p className="mt-3 text-sm text-slate-600">
                      Ces cookies nous permettent de mesurer l'audience de notre site et d'améliorer son contenu et sa navigation.
                    </p>
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-slate-700">Cookies utilisés :</h4>
                      <ul className="mt-2 list-disc space-y-1 pl-6 text-sm text-slate-600">
                        <li><strong>_ga, _gid</strong> - Google Analytics (durée : 13 mois)</li>
                        <li><strong>_gat</strong> - Limitation du taux de requêtes (durée : 1 minute)</li>
                      </ul>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-slate-700">Données collectées :</h4>
                      <ul className="mt-2 list-disc space-y-1 pl-6 text-sm text-slate-600">
                        <li>Pages visitées et temps passé</li>
                        <li>Type de navigateur et système d'exploitation</li>
                        <li>Résolution d'écran</li>
                        <li>Parcours de navigation</li>
                      </ul>
                    </div>
                  </div>
                  <div className="ml-4 flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                      className="h-6 w-6 cursor-pointer rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Marketing */}
              <div className={`rounded-lg border-2 p-6 ${preferences.marketing ? 'border-purple-500 bg-purple-50' : 'border-slate-200 bg-white'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Cookie className="h-6 w-6 text-purple-600" />
                      <h3 className="text-xl font-semibold text-slate-900">
                        Cookies Marketing
                      </h3>
                    </div>
                    <p className="mt-3 text-sm text-slate-600">
                      Ces cookies sont utilisés pour vous proposer des publicités personnalisées et mesurer l'efficacité de nos campagnes.
                    </p>
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-slate-700">Cookies utilisés :</h4>
                      <ul className="mt-2 list-disc space-y-1 pl-6 text-sm text-slate-600">
                        <li><strong>_fbp</strong> - Facebook Pixel (durée : 3 mois)</li>
                        <li><strong>ads/ga-audiences</strong> - Google Ads (durée : 540 jours)</li>
                      </ul>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-slate-700">Données collectées :</h4>
                      <ul className="mt-2 list-disc space-y-1 pl-6 text-sm text-slate-600">
                        <li>Comportement de navigation</li>
                        <li>Interactions avec les publicités</li>
                        <li>Conversions et achats</li>
                      </ul>
                    </div>
                  </div>
                  <div className="ml-4 flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                      className="h-6 w-6 cursor-pointer rounded border-slate-300 text-purple-600 focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                onClick={savePreferences}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-3 text-white hover:bg-blue-700"
              >
                {saved ? (
                  <>
                    <Check className="h-5 w-5" />
                    Enregistré !
                  </>
                ) : (
                  <>
                    <Cookie className="h-5 w-5" />
                    Enregistrer mes préférences
                  </>
                )}
              </button>
            </div>

            {/* Additional Info */}
            <section className="mt-12">
              <h2 className="text-2xl font-bold text-slate-900">Comment gérer vos cookies ?</h2>

              <h3 className="mt-6 text-xl font-semibold text-slate-800">1. Via notre plateforme</h3>
              <p className="mt-2 text-slate-700">
                Vous pouvez à tout moment modifier vos préférences de cookies sur cette page.
              </p>

              <h3 className="mt-6 text-xl font-semibold text-slate-800">2. Via votre navigateur</h3>
              <p className="mt-2 text-slate-700">
                Vous pouvez également configurer votre navigateur pour accepter ou refuser les cookies :
              </p>
              <ul className="mt-2 list-disc space-y-2 pl-6 text-slate-700">
                <li>
                  <strong>Google Chrome :</strong>{' '}
                  <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Guide Chrome
                  </a>
                </li>
                <li>
                  <strong>Firefox :</strong>{' '}
                  <a href="https://support.mozilla.org/fr/kb/protection-renforcee-contre-pistage-firefox-ordinateur" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Guide Firefox
                  </a>
                </li>
                <li>
                  <strong>Safari :</strong>{' '}
                  <a href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Guide Safari
                  </a>
                </li>
                <li>
                  <strong>Edge :</strong>{' '}
                  <a href="https://support.microsoft.com/fr-fr/microsoft-edge/supprimer-les-cookies-dans-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Guide Edge
                  </a>
                </li>
              </ul>

              <div className="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                <p className="text-sm text-yellow-800">
                  <strong>⚠️ Attention :</strong> La désactivation de certains cookies peut limiter votre accès à certaines fonctionnalités du site.
                </p>
              </div>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold text-slate-900">En savoir plus</h2>
              <p className="mt-4 text-slate-700">
                Pour plus d'informations sur la protection de vos données personnelles, consultez notre{' '}
                <a href="/legal/privacy" className="text-blue-600 hover:underline">
                  Politique de Confidentialité
                </a>.
              </p>
              <p className="mt-2 text-slate-700">
                Pour toute question concernant les cookies, contactez-nous à :{' '}
                <a href="mailto:[EMAIL_CONTACT]" className="text-blue-600 hover:underline">
                  [EMAIL_CONTACT]
                </a>
              </p>
            </section>
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
          <span className="text-slate-300">|</span>
          <a href="/legal/mentions" className="text-sm text-blue-600 hover:underline">
            Mentions légales
          </a>
        </div>
      </div>
    </div>
  );
}
