/**
 * ============================================
 * 📚 TESTS E2E - CATALOGUE DE COURS
 * ============================================
 * Tests de navigation et recherche dans le catalogue
 */

import { test, expect } from '@playwright/test';

test.describe('Catalogue de cours', () => {
  test('devrait afficher la page catalogue', async ({ page }) => {
    await page.goto('/courses');

    // Vérifier le titre
    await expect(page.getByRole('heading', { name: /cours|catalogue/i })).toBeVisible();

    // Vérifier la barre de recherche
    await expect(page.getByPlaceholder(/recherch/i)).toBeVisible();
  });

  test('devrait permettre de rechercher des cours', async ({ page }) => {
    await page.goto('/courses');

    // Taper dans la recherche
    const searchInput = page.getByPlaceholder(/recherch/i);
    await searchInput.fill('javascript');

    // Attendre que les résultats se filtrent
    await page.waitForTimeout(500); // Debounce

    // Vérifier que des résultats sont affichés ou message "aucun résultat"
    // Note: dépend de votre base de données
  });

  test('devrait permettre de filtrer par catégorie', async ({ page }) => {
    await page.goto('/courses');

    // Cliquer sur un filtre catégorie (si disponible)
    const filterButton = page.getByRole('button', { name: /filtres|catégorie/i });

    if (await filterButton.isVisible()) {
      await filterButton.click();
      // Sélectionner une catégorie
      // await page.getByText(/développement web/i).click();
    }
  });

  test('devrait ouvrir la page détail d\'un cours', async ({ page }) => {
    await page.goto('/courses');

    // Attendre que les cours se chargent
    await page.waitForLoadState('networkidle');

    // Cliquer sur le premier cours (si existe)
    const firstCourse = page.locator('a[href*="/courses/"]').first();

    if (await firstCourse.isVisible()) {
      await firstCourse.click();

      // Devrait être sur la page d'un cours
      await expect(page).toHaveURL(/\/courses\/[a-f0-9-]+/);

      // Vérifier que les éléments du cours sont visibles
      await expect(page.getByRole('heading')).toBeVisible();
    }
  });

  test('devrait afficher le bouton d\'inscription sur un cours', async ({ page }) => {
    await page.goto('/courses');
    await page.waitForLoadState('networkidle');

    const firstCourse = page.locator('a[href*="/courses/"]').first();

    if (await firstCourse.isVisible()) {
      await firstCourse.click();
      await page.waitForLoadState('networkidle');

      // Devrait avoir un bouton "S'inscrire" ou "Acheter"
      const enrollButton = page.getByRole('button', { name: /inscrire|acheter/i });
      await expect(enrollButton).toBeVisible({ timeout: 5000 });
    }
  });
});
