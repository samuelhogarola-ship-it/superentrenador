import { expect, test } from '@playwright/test';

test('permite entrar en demo desde la landing y llegar al panel', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByRole('button', { name: 'Entrar ahora' })).toBeVisible();
  await page.getByRole('button', { name: 'Entrar ahora' }).click();
  await expect(page).toHaveURL(/\/clientes/);
  await expect(page.getByRole('heading', { name: 'Base de clientes del entrenador' })).toBeVisible();
});

test('muestra footer, banner de cookies y acceso a la pagina legal', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByRole('link', { name: 'Informacion legal', exact: true })).toBeVisible();
  await expect(page.getByRole('dialog', { name: 'Aviso de cookies' })).toBeVisible();
  await page.getByRole('button', { name: 'Rechazar' }).click();
  await expect(page.getByRole('dialog', { name: 'Aviso de cookies' })).toBeHidden();
  await page.getByRole('link', { name: 'Informacion legal' }).click();
  await expect(page).toHaveURL(/\/legal/);
  await expect(page.getByRole('heading', { name: 'Información Legal' })).toBeVisible();
});
