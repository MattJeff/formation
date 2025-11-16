import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration
 * Documentation: https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Directory contenant les tests
  testDir: './e2e',

  // Timeout global par test (30s)
  timeout: 30 * 1000,

  // Retry failed tests (MVP: 2 retries)
  retries: process.env.CI ? 2 : 0,

  // Nombre de workers parallèles
  workers: process.env.CI ? 1 : undefined,

  // Reporter pour les résultats
  reporter: process.env.CI ? 'github' : 'html',

  // Configuration commune à tous les projets
  use: {
    // Base URL de l'application
    baseURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',

    // Trace en cas d'échec
    trace: 'on-first-retry',

    // Screenshots en cas d'échec
    screenshot: 'only-on-failure',

    // Vidéos en cas d'échec
    video: 'retain-on-failure',
  },

  // Projets de tests (navigateurs)
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // Optionnel: tests mobile
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },

    // Optionnel: autres navigateurs
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
  ],

  // Démarrer le serveur dev automatiquement pour les tests
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // 2 minutes pour démarrer le serveur
  },
});
