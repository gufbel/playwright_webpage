#!/bin/bash
echo "🚀 Starting Playwright monitoring..."

# -----------------------------
# 1️⃣ Clean previous reports
# -----------------------------
rm -f exports/*.json
rm -rf test-results/*

# -----------------------------
# 2️⃣ Run all monitoring specs
# -----------------------------
echo "🧪 Running all monitoring specs..."
npx playwright test specs/monitoring --workers=1

# -----------------------------
# 3️⃣ Send Slack Report (AFTER all tests)
# -----------------------------
echo "📤 Sending Slack report..."
node config/send-report.js

echo "✅ Playwright monitoring finished."
