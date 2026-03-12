import { expect } from '@playwright/test';

export class FxCalculator {
  constructor(page) {
    this.page = page;

    // The "Recipient gets" numeric input is the 2nd spinbutton
    this.recipientValue = page.getByRole('spinbutton').nth(1);

    // Dropdown trigger (first clickable .cursor-pointer div after recipient input)
    this.dropdownTrigger = page.locator('.cursor-pointer').first();
  }
  async measureCurrencyLatency(currencyCode) {
    const result = {};

    try {
      result.currency = currencyCode;

      await this.recipientValue.waitFor({ state: 'visible', timeout: 15000 });

      const startDropdown = Date.now();

      await this.dropdownTrigger.click();
      await this.page.waitForTimeout(500);
      await this.page.keyboard.type(currencyCode);
      await this.page.keyboard.press('Enter');

      await this.page.waitForFunction(
        (el) => {
          if (!el) return false;
          const value = el.value;
          return value && value.trim() !== '' && /\d/.test(value);
        },
        await this.recipientValue.elementHandle(),
        { timeout: 30000 }
      );

      const updatedValue = await this.recipientValue.evaluate(el => el.value);

      result.dropdown = Date.now() - startDropdown;
      result.recipient = `100 GBP converts to: ${updatedValue} ${currencyCode}`;
      result.status = updatedValue ? 'PASS' : 'FAIL';

    } catch (error) {
      result.dropdown = null;
      result.recipient = null;
      result.status = 'FAIL';
      result.error = error.message;
    }

    return result;   // 🔥 THIS MUST EXIST
  }
}
