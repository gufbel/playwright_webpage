import { expect } from '@playwright/test';

export class HomePage {
  constructor(page) {
    this.page = page;

    // CORE elements (needed for exchange monitoring)
    this.logo = page.getByAltText(/tuma/i).first();
    this.exchangeRateText = page.locator('span').filter({ hasText: /GBP =/ }).first();
    this.calculatorTitle = page.locator('text=Tuma Exchange Calculator').first();

    // HERO (homepage only)
    this.heroTitle = page.locator('h1,h2,h3').filter({ hasText: /Welcome/i }).first();
  }

  async goto(path = '/') {
    await this.page.goto(`https://tuma.com${path}`);
  }

  // ✅ Used by exchange monitor
  async validateCoreLoaded() {
    await expect(this.logo).toBeVisible({ timeout: 30000 });
    await expect(this.calculatorTitle).toBeVisible({ timeout: 30000 });
    await expect(this.exchangeRateText).toBeVisible({ timeout: 30000 });
  }

  // ✅ Used only by homepage.spec.js
  async validateFullHomepage() {
    await this.validateCoreLoaded();
    await expect(this.heroTitle).toBeVisible({ timeout: 30000 });
  }
}
