/**
 * ============================================
 * 🏠 TESTS E2E - LANDING PAGE
 * ============================================
 * Tests de la page d'accueil et navigation
 */

import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('devrait charger la page d\'accueil', async ({ page }) => {
    await page.goto('/');

    // Vérifier le titre
    await expect(page).toHaveTitle(/SkillForge/);

    // Vérifier le logo
    await expect(page.getByText('SkillForge')).toBeVisible();

    // Vérifier les CTAs
    await expect(page.getByRole('link', { name: /cours/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /connexion|connecter/i })).toBeVisible();
  });

  test('devrait naviguer vers la page cours depuis le CTA', async ({ page }) => {
    await page.goto('/');

    // Cliquer sur "Explorer les cours"
    await page.getByRole('link', { name: /explorer|cours/i }).first().click();

    // Devrait être sur /courses
    await expect(page).toHaveURL(/\/courses/);
  });

  test('devrait naviguer vers login', async ({ page }) => {
    await page.goto('/');

    // Cliquer sur connexion
    await page.getByRole('link', { name: /connexion|connecter/i }).click();

    // Devrait être sur /login
    await expect(page).toHaveURL(/\/login/);
  });

  test('devrait afficher les features', async ({ page }) => {
    await page.goto('/');

    // Vérifier que la section features est visible
    await expect(page.getByText(/pourquoi skillforge/i)).toBeVisible();

    // Vérifier qu'il y a des feature cards
    await expect(page.getByText(/formations pratiques/i)).toBeVisible();
  });

  test('devrait être responsive sur mobile', async ({ page }) => {
    // Simuler un mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // La page devrait charger sans erreur
    await expect(page.getByText('SkillForge')).toBeVisible();

    // Les CTAs devraient être visibles
    await expect(page.getByRole('link', { name: /cours/i })).toBeVisible();
  });
});
