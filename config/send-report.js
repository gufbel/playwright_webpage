import fs from 'fs';
import sendSlackReport from './slack.js';

const exchangeData = fs.existsSync('exports/exchange-latencies.json')
  ? JSON.parse(fs.readFileSync('exports/exchange-latencies.json'))
  : {};

const homepageData = fs.existsSync('exports/homepage-stats.json')
  ? JSON.parse(fs.readFileSync('exports/homepage-stats.json'))
  : {};

await sendSlackReport({
  exchangeCalculator: exchangeData,
  homepageStats: homepageData
});
