import { expect, test } from "@playwright/test";

test("loads the landing experience", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Super Entrenador/i);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
