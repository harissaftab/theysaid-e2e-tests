import { Page } from '@playwright/test';

const EMAIL = 'harisaftab018@gmail.com';
const PASSWORD = 'Haris@098123';
const BASE_URL = 'https://evo.dev.theysaid.io';

export async function login(page: Page) {
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'domcontentloaded' });

  await page.waitForSelector('input[type="email"]', { state: 'visible', timeout: 20000 });
  await page.fill('input[type="email"]', EMAIL);
  await page.waitForTimeout(500);

  await page.click('button.ak-PrimaryButton');

  await page.waitForSelector('input[type="password"]', { state: 'visible', timeout: 20000 });
  await page.fill('input[type="password"]', PASSWORD);
  await page.waitForTimeout(500);

  await page.click('button.ak-PrimaryButton');

  await page.waitForURL(url => !url.href.includes('/login'), { timeout: 30000 });
}