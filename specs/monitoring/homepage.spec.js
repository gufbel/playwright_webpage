// homepage.spec.js
import { test, expect } from '@playwright/test';
import fs from 'fs';

// -----------------------------
// Collector for Slack / combined reports
// -----------------------------
const homepageStats = {};
test.describe('Tuma.com Homepage - Full QA Suite', () => {
  const homepageIssues = [];
  // -----------------------------
  // Hero, navigation, and section texts
  // -----------------------------
  const heroTexts = [
    'Experience the future',
    'Your Gateway to Seamless Money Transfers in Africa',
    'Secure Payments'
  ];

  const downloadTexts = ['Download on the', 'Get it on'];

  const exchangeTexts = [
    'Tuma Exchange Calculator',
    'You Send',
    'Recipient gets',
    'Current Exchange Rate',
    'Transaction fees',
    'Disclaimer'
  ];

  const securityTexts = [
    'We protect your money',
    'Two-factor authentication',
    'Fraud detection',
    'Biometric access',
    'End-to-end encryption',
    '24/7 Protection support'
  ];

  const testimonialsTexts = [
    'TESTIMONIALS',
    'What people who already trust us with their money say',
    'what they have to say.'
  ];

  const footerTexts = ['Privacy Policy', 'Terms and Conditions', 'Socials'];

  // -----------------------------
  // Before each test
  // -----------------------------
  test.beforeEach(async ({ page }) => {
    await page.goto('https://tuma.com/');
    await page.locator('div.fixed.inset-0').waitFor({ state: 'detached', timeout: 15000 });
  });

  // -----------------------------
  // Tests with status collection
  // -----------------------------
  test('should load homepage successfully', async ({ page }) => {
    try {
      await expect(page).toHaveURL(/tuma\.com/);
      await expect(page).toHaveTitle(/Tuma - Instant Money Transfer From UK Bank Cards to MPESA/);
      homepageStats['should load homepage successfully'] = true;
    } catch (e) {
      homepageStats['should load homepage successfully'] = false;
      throw e;
    }
  });

  test('should display main navigation links', async ({ page }) => {
    try {
      const nav = page.getByRole('navigation');
      const navLinks = ['Home', 'Who We Are', 'Tuma Buzz', 'Careers', 'Contact Us'];

      for (const link of navLinks) {
        const el = nav.getByRole('link', { name: link });
        if (!(await el.isVisible())) homepageIssues.push(`Navigation link missing: ${link}`);
      }

      homepageStats['should display main navigation links'] = homepageIssues.length === 0;
    } catch (e) {
      homepageStats['should display main navigation links'] = false;
      throw e;
    }
  });

  test('should display hero section content', async ({ page }) => {
    try {
      for (const text of heroTexts) {
        const el = page.locator(`text=${text}`).first();
        if (!(await el.isVisible())) homepageIssues.push(`Hero missing: ${text}`);
      }
      homepageStats['should display hero section content'] = homepageIssues.length === 0;
    } catch (e) {
      homepageStats['should display hero section content'] = false;
      throw e;
    }
  });

  test('should display app download buttons', async ({ page }) => {
    try {
      for (const text of downloadTexts) {
        const el = page.locator(`text=${text}`).first();
        if (!(await el.isVisible())) homepageIssues.push(`Download button missing: ${text}`);
      }
      homepageStats['should display app download buttons'] = homepageIssues.length === 0;
    } catch (e) {
      homepageStats['should display app download buttons'] = false;
      throw e;
    }
  });

  test('should display exchange calculator section', async ({ page }) => {
    try {
      for (const text of exchangeTexts) {
        const el = page.locator(`text=${text}`).first();
        if (!(await el.isVisible())) homepageIssues.push(`Exchange section missing: ${text}`);
      }
      homepageStats['should display exchange calculator section'] = homepageIssues.length === 0;
    } catch (e) {
      homepageStats['should display exchange calculator section'] = false;
      throw e;
    }
  });

  test('should display security section', async ({ page }) => {
    try {
      for (const text of securityTexts) {
        const el = page.locator(`text=${text}`).first();
        if (!(await el.isVisible())) homepageIssues.push(`Security section missing: ${text}`);
      }
      homepageStats['should display security section'] = homepageIssues.length === 0;
    } catch (e) {
      homepageStats['should display security section'] = false;
      throw e;
    }
  });

  test('should display testimonials', async ({ page }) => {
    try {
      for (const text of testimonialsTexts) {
        const el = page.locator(`text=${text}`).first();
        if (!(await el.isVisible())) homepageIssues.push(`Testimonials missing: ${text}`);
      }
      homepageStats['should display testimonials'] = homepageIssues.length === 0;
    } catch (e) {
      homepageStats['should display testimonials'] = false;
      throw e;
    }
  });

  test('should display footer content', async ({ page }) => {
    try {
      for (const text of footerTexts) {
        const el = page.locator(`text=${text}`).first();
        if (!(await el.isVisible())) homepageIssues.push(`Footer missing: ${text}`);
      }
      homepageStats['should display footer content'] = homepageIssues.length === 0;
    } catch (e) {
      homepageStats['should display footer content'] = false;
      throw e;
      }
    });
    // ---------------------------
    // Write combined JSON
    // ---------------------------
    test.afterAll(async () => {
    fs.writeFileSync(
      'exports/homepage-stats.json',
      JSON.stringify(homepageStats, null, 2)
    );
  });
});
