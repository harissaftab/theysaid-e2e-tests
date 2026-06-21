import { test, expect } from '@playwright/test';
import { login } from './helpers/login';

test('Login Flow', async ({ page }) => {
  await login(page);

  await expect(page.locator('[data-test="manager-projects-page"]')).toBeVisible({ timeout: 15000 });
});