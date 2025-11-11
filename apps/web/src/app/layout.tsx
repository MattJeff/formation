import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/providers/AuthProvider';

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
  title: 'SkillForge - Forge Your Professional Skills',
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
  authors: [{ name: 'SkillForge Team' }],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://skillforge.com',
    siteName: 'SkillForge',
    title: 'SkillForge - Forge Your Professional Skills',
    description: 'De la théorie à la pratique professionnelle',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
