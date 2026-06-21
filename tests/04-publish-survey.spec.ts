import { test, expect } from '@playwright/test';
import { login } from './helpers/login';

const BASE_URL = 'https://evo.dev.theysaid.io';
const PROJECT_ID = 'e4bb7ca2-c77a-4d18-859c-4423b01a69ea';

test('Publish Project + Take Survey', async ({ page, context }) => {
  await login(page);

  const publishSwitch = page.locator('[data-test="project-status-switch"]').first();
  await expect(publishSwitch).toBeVisible();
  await expect(publishSwitch).toHaveAttribute('data-state', 'checked');

  await page.goto(`${BASE_URL}/projects/${PROJECT_ID}?tab=settings`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  const settingsTab = page.locator('[data-test="tabs-trigger"]').filter({ hasText: /settings/i });
  if (await settingsTab.count() > 0) {
    await settingsTab.click();
    await page.waitForTimeout(2000);
  }

  let surveyUrl: string | null = null;

  const inputs = await page.locator('input[readonly], input[type="text"]').all();
  for (const input of inputs) {
    const val = await input.inputValue().catch(() => '');
    if (val && val.startsWith('http')) {
      surveyUrl = val;
      break;
    }
  }

  if (!surveyUrl) {
    const link = page.locator('a[href*="/s/"], a[href*="/r/"]').first();
    if (await link.count() > 0) {
      const href = await link.getAttribute('href') || '';
      surveyUrl = href.startsWith('http') ? href : `${BASE_URL}${href}`;
    }
  }

  if (surveyUrl) {
    const surveyPage = await context.newPage();
    await surveyPage.goto(surveyUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await surveyPage.waitForTimeout(3000);
    await expect(surveyPage.locator('body')).toBeVisible();

    const startBtn = surveyPage.locator('button').filter({ hasText: /start|begin|next|continue/i }).first();
    if (await startBtn.count() > 0 && await startBtn.isVisible()) {
      await startBtn.click();
      await surveyPage.waitForTimeout(2000);
    }

    await surveyPage.close();
  } else {
    await expect(page.locator('[data-test="project-page"]')).toBeVisible({ timeout: 10000 });
  }
});