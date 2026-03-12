// config/slack.js
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export default async function sendSlackReport({ exchangeCalculator, homepageStats }) {
  const webhook = process.env.SLACK_WEBHOOK_URL;
  if (!webhook) {
    console.log('No Slack webhook configured');
    return;
  }

  let text = `:rocket: Tuma Website Playwright Monitoring Report\n`;
  text += `Run Time: ${new Date().toISOString()}\n\n`;

  // -----------------------------
  // Exchange Calculator
  // -----------------------------
  if (exchangeCalculator) {
    text += `Tuma Exchange Calculator\nCountries Tested: ${Object.keys(exchangeCalculator).length}\n\n`;

    for (const [country, info] of Object.entries(exchangeCalculator)) {
      text += `${country}\n`;
      text += `Dropdown: ${info.visualLatency ?? 'N/A'}ms\n`;
      text += `Current Exhange Rate: ${info.recipientDisplay ?? 'N/A'}\n`;
      text += `Status: ${info.status === 'PASS' ? ':white_check_mark: PASS' : ':x: FAIL'}\n\n`;
    }
  }
  // -----------------------------
  // Homepage Stats
  // -----------------------------
  if (homepageStats) {
    text += `Homepage Statistics\n`;
    for (const [testName, passed] of Object.entries(homepageStats)) {
      text += `${testName}: ${passed ? ':white_check_mark: PASS' : ':x: FAIL'}\n`;
    }
  }

  try {
    await axios.post(webhook, { text });
    console.log('Slack report sent successfully');
  } catch (err) {
    console.error('Error sending Slack report:', err.message);
  }
}
