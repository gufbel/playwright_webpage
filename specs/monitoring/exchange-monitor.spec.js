import { test, expect } from '@playwright/test';
import fs from 'fs';
import { HomePage } from '../../pages/HomePage';
import { FxCalculator } from '../../pages/FxCalculator';
import { COUNTRIES } from '../../config/countries';
import sendSlackReport from '../../config/slack';

test.describe('Tuma Exchange Calculator (Visual Monitoring)', () => {
  const latencies = {};
  let homepageStats = [];

  // ---------------------------
  // Homepage Stats Collector
  // ---------------------------
  const collectHomepageStats = async (page) => {
    const tests = [
      { name: 'should load homepage successfully', selector: 'body' },
      { name: 'main navigation links', selector: 'nav' },
      { name: 'hero section', selector: 'text=Experience the future' },
      { name: 'app download buttons', selector: 'text=Download on' },
      { name: 'exchange calculator section', selector: 'text=Tuma Exchange Calculator' },
      { name: 'security section', selector: 'text=We protect your money' },
      { name: 'testimonials', selector: 'text=TESTIMONIALS' },
      { name: 'footer', selector: 'text=Privacy Policy' },
    ];

    for (const t of tests) {
      try {
        const el = page.locator(t.selector).first();
        await expect(el).toBeVisible({ timeout: 10000 });
        homepageStats.push({ test: t.name, status: '✅ Visible' });
      } catch {
        homepageStats.push({ test: t.name, status: '❌ Missing' });
      }
    }
  };

  // ---------------------------
  // Main Test
  // ---------------------------
  test('records visual exchange calculator metrics sequentially', async ({ page }) => {
    const home = new HomePage(page);
    const fx = new FxCalculator(page);

    await home.goto('/'); // homepage
    await home.validateCoreLoaded();

    // Collect homepage stats
    await collectHomepageStats(page);

    // Loop through first 3 currencies
    for (const country of COUNTRIES.slice(0, 3)) {
      await home.goto(country.path);
      await home.validateCoreLoaded();

      const data = await fx.measureCurrencyLatency(country.currency);

      latencies[country.currency] = {
        visualLatency: data.dropdown,
        recipientDisplay: data.recipient,
        status: data.status,
      };

      console.log(
        `[${country.currency}] Visual: ${data.dropdown}ms | Recipient: ${data.recipient} | Currency: ${country.currency} | Status: ${data.status}`
      );
    }

    // ---------------------------
    // Write combined JSON
    // ---------------------------
      fs.writeFileSync(
        'exports/exchange-latencies.json',
        JSON.stringify(latencies, null, 2)
      );
  });
});
