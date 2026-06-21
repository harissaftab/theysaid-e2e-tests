import { test, expect } from '@playwright/test';
import { login } from './helpers/login';

test('Create Project Flow', async ({ page }) => {
  await login(page);

  await page.locator('[data-test="add-project-button"]').click();

  await page.locator('[data-test="create-project-dialog-content"]').waitFor({ state: 'visible', timeout: 10000 });

  await page.locator('[data-test="create-project-button"]').click();

  await page.waitForURL(/\/projects\//, { timeout: 20000 });
  expect(page.url()).toMatch(/\/projects\//);

  try {
    const skip = page.locator('[data-test="skip-button"]');
    await skip.waitFor({ state: 'visible', timeout: 5000 });
    await skip.click();
  } catch { }

  await expect(page.locator('[data-test="project-page"]')).toBeVisible({ timeout: 10000 });
});