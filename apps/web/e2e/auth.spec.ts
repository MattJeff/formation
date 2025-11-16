/**
 * ============================================
 * 🔐 TESTS E2E - AUTHENTIFICATION
 * ============================================
 * Tests du flow d'authentification (signup, login, logout)
 */

import { test, expect } from '@playwright/test';

test.describe('Authentification', () => {
  test('devrait afficher la page de connexion', async ({ page }) => {
    await page.goto('/login');

    // Vérifier le titre
    await expect(page).toHaveTitle(/SkillForge/);

    // Vérifier les champs du formulaire
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/mot de passe/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /connexion/i })).toBeVisible();
  });

  test('devrait afficher la page d\'inscription', async ({ page }) => {
    await page.goto('/signup');

    // Vérifier les champs
    await expect(page.getByLabel(/prénom/i)).toBeVisible();
    await expect(page.getByLabel(/nom/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/mot de passe/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /créer/i })).toBeVisible();
  });

  test('devrait rediriger vers login depuis signup', async ({ page }) => {
    await page.goto('/signup');

    // Cliquer sur lien "Déjà un compte"
    await page.getByText(/déjà un compte/i).click();

    // Devrait être sur /login
    await expect(page).toHaveURL(/\/login/);
  });

  test('devrait afficher une erreur pour login invalide', async ({ page }) => {
    await page.goto('/login');

    // Remplir avec des credentials invalides
    await page.getByLabel(/email/i).fill('invalid@example.com');
    await page.getByLabel(/mot de passe/i).fill('wrongpassword');

    // Soumettre
    await page.getByRole('button', { name: /connexion/i }).click();

    // Devrait afficher une erreur (vérifier toast ou message)
    // Note: Adapter selon votre implémentation
    await expect(page.getByText(/erreur|invalide|incorrect/i)).toBeVisible({
      timeout: 5000,
    });
  });
});
