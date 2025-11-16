'use client';

import { useState, useEffect } from 'react';
import { X, Cookie, Settings } from 'lucide-react';

interface CookiePreferences {
  essential: boolean; // Toujours true
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
}

const DEFAULT_PREFERENCES: CookiePreferences = {
  essential: true,
  analytics: false,
  marketing: false,
  timestamp: Date.now(),
};

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà fait son choix
    const saved = localStorage.getItem('cookie-consent');
    if (!saved) {
      // Afficher le banner après un petit délai pour une meilleure UX
      setTimeout(() => setIsVisible(true), 1000);
    } else {
      // Charger les préférences sauvegardées
      try {
        const parsed = JSON.parse(saved);
        setPreferences(parsed);
        applyPreferences(parsed);
      } catch (e) {
        console.error('Error parsing cookie preferences:', e);
      }
    }
  }, []);

  const applyPreferences = (prefs: CookiePreferences) => {
    // Appliquer les préférences aux cookies/scripts tiers

    // Google Analytics
    if (prefs.analytics) {
      // Activer Google Analytics si configuré
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('consent', 'update', {
          analytics_storage: 'granted',
        });
      }
    } else {
      // Désactiver Google Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('consent', 'update', {
          analytics_storage: 'denied',
        });
      }
    }

    // Marketing / Ads
    if (prefs.marketing) {
      // Activer marketing cookies si configuré
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('consent', 'update', {
          ad_storage: 'granted',
        });
      }
    } else {
      // Désactiver marketing cookies
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('consent', 'update', {
          ad_storage: 'denied',
        });
      }
    }
  };

  const savePreferences = (prefs: CookiePreferences) => {
    const toSave = {
      ...prefs,
      timestamp: Date.now(),
    };
    localStorage.setItem('cookie-consent', JSON.stringify(toSave));
    setPreferences(toSave);
    applyPreferences(toSave);
    setIsVisible(false);
  };

  const acceptAll = () => {
    savePreferences({
      essential: true,
      analytics: true,
      marketing: true,
      timestamp: Date.now(),
    });
  };

  const rejectAll = () => {
    savePreferences({
      essential: true, // Les essentiels ne peuvent pas être refusés
      analytics: false,
      marketing: false,
      timestamp: Date.now(),
    });
  };

  const saveCustom = () => {
    savePreferences(preferences);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" />

      {/* Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
        <div className="mx-auto max-w-6xl">
          <div className="relative rounded-lg border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">
            {/* Close button */}
            <button
              onClick={rejectAll}
              className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              aria-label="Fermer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Content */}
            <div className="pr-8">
              <div className="flex items-start gap-3">
                <Cookie className="mt-1 h-6 w-6 flex-shrink-0 text-blue-600" />
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Gestion des cookies
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">
                    Nous utilisons des cookies pour améliorer votre expérience, analyser notre trafic et personnaliser le contenu.
                    Vous pouvez choisir d'accepter tous les cookies, de les refuser ou de personnaliser vos préférences.
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    Pour plus d'informations, consultez notre{' '}
                    <a href="/legal/privacy" className="text-blue-600 underline hover:text-blue-700" target="_blank">
                      Politique de Confidentialité
                    </a>.
                  </p>
                </div>
              </div>

              {/* Détails des cookies */}
              {showDetails && (
                <div className="mt-6 space-y-4 border-t border-slate-200 pt-6">
                  {/* Essential */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">
                        Cookies essentiels
                      </h3>
                      <p className="mt-1 text-sm text-slate-600">
                        Nécessaires au fonctionnement du site (authentification, panier, préférences).
                        Ces cookies ne peuvent pas être désactivés.
                      </p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={true}
                        disabled
                        className="h-5 w-5 cursor-not-allowed rounded border-slate-300 bg-slate-100 text-blue-600"
                      />
                    </div>
                  </div>

                  {/* Analytics */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">
                        Cookies analytiques
                      </h3>
                      <p className="mt-1 text-sm text-slate-600">
                        Nous aident à comprendre comment vous utilisez notre site pour l'améliorer
                        (Google Analytics, statistiques de visite).
                      </p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={(e) =>
                          setPreferences({ ...preferences, analytics: e.target.checked })
                        }
                        className="h-5 w-5 cursor-pointer rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Marketing */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">
                        Cookies marketing
                      </h3>
                      <p className="mt-1 text-sm text-slate-600">
                        Utilisés pour vous proposer des publicités personnalisées et mesurer l'efficacité de nos campagnes.
                      </p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={preferences.marketing}
                        onChange={(e) =>
                          setPreferences({ ...preferences, marketing: e.target.checked })
                        }
                        className="h-5 w-5 cursor-pointer rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                  <Settings className="h-4 w-4" />
                  {showDetails ? 'Masquer les options' : 'Personnaliser'}
                </button>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    onClick={rejectAll}
                    className="rounded-lg border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Tout refuser
                  </button>
                  {showDetails ? (
                    <button
                      onClick={saveCustom}
                      className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      Enregistrer mes choix
                    </button>
                  ) : (
                    <button
                      onClick={acceptAll}
                      className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      Tout accepter
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Extension du type Window pour gtag
declare global {
  interface Window {
    gtag?: (
      command: string,
      action: string,
      params: Record<string, string>
    ) => void;
  }
}
