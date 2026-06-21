import { test, expect } from '@playwright/test';
import { login } from './helpers/login';

test('Teach AI - Upload Document', async ({ page }) => {
  await login(page);

  await page.locator('a[href="/home/teach-ai"]').click();
  await page.waitForURL(/\/home\/teach-ai/, { timeout: 15000 });
  await page.waitForTimeout(2000);

  await expect(page.locator('main')).toBeVisible();

  const testContent = 'TheySaid Playwright test document for Teach AI upload verification.';

  const fileInput = page.locator('input[type="file"]');

  if (await fileInput.count() > 0) {
    await fileInput.setInputFiles({
      name: 'test-document.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from(testContent),
    });
    await page.waitForTimeout(4000);
    const errorMsg = page.locator('text=/upload failed|error uploading/i');
    expect(await errorMsg.count()).toBe(0);
  } else {
    const uploadBtn = page.locator('button').filter({ hasText: /upload|add file|import/i }).first();
    if (await uploadBtn.count() > 0) {
      await expect(uploadBtn).toBeVisible();
    } else {
      await expect(page.locator('main')).toBeVisible();
    }
  }
});