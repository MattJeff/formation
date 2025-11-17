import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/providers/AuthProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import CookieConsent from '@/components/legal/CookieConsent';
import { Footer } from '@/components/layout/Footer';

// Force dynamic rendering for the entire app (required for authentication)
export const dynamic = 'force-dynamic';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Brainow - Forge Your Professional Skills',
  description:
    'Plateforme de formation nouvelle génération avec IA et Sandbox interactif. Construisez des compétences vérifiables, pas seulement des certificats.',
  keywords: [
    'formation',
    'développement',
    'programmation',
    'IA',
    'sandbox',
    'portfolio',
    'compétences',
  ],
  authors: [{ name: 'Brainow Team' }],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://brainow.com',
    siteName: 'Brainow',
    title: 'Brainow - Forge Your Professional Skills',
    description: 'De la théorie à la pratique professionnelle',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased flex flex-col min-h-screen`}>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
          <Footer />
          <CookieConsent />
        </ThemeProvider>
      </body>
    </html>
  );
}
