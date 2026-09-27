const { chromium } = require('playwright');

const OUT_DIR = '/Users/akshattyagi1303/.gemini/antigravity-ide/brain/de4a13d3-5412-4578-a0bc-723f623a0818';

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });
  const page = await ctx.newPage();
  await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });

  // 1. Screenshot Hero Countdown Area
  const countdownEl = await page.$('#countdown');
  if (countdownEl) {
    await countdownEl.screenshot({ path: `${OUT_DIR}/hero_countdown_1440.png` });
    console.log(`Saved: ${OUT_DIR}/hero_countdown_1440.png`);
  }

  // 2. Screenshot Trials Section
  const trialsEl = await page.$('#trials');
  if (trialsEl) {
    await trialsEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await trialsEl.screenshot({ path: `${OUT_DIR}/trials_accessibility_1440.png` });
    console.log(`Saved: ${OUT_DIR}/trials_accessibility_1440.png`);
  }

  // 3. Test Modal Focus Trap & Scroll Lock
  const sealBtn = await page.$('#seal-button');
  if (sealBtn) {
    await sealBtn.scrollIntoViewIfNeeded();
    await sealBtn.click();
    await page.waitForTimeout(800); // Wait for click press/flash animation & modal open

    // Check body scroll lock
    const bodyOverflow = await page.evaluate(() => document.body.style.overflow);
    console.log(`Body overflow on modal open: "${bodyOverflow}"`);

    // Trace focus steps during Tabbing inside modal
    const activeIds = [];

    // Initial focus
    activeIds.push(await page.evaluate(() => document.activeElement ? (document.activeElement.id || document.activeElement.className) : 'none'));

    // Tab 1 -> Should go to .modal-link
    await page.keyboard.press('Tab');
    activeIds.push(await page.evaluate(() => document.activeElement ? (document.activeElement.id || document.activeElement.className) : 'none'));

    // Tab 2 -> Should go to modal-ack-btn
    await page.keyboard.press('Tab');
    activeIds.push(await page.evaluate(() => document.activeElement ? (document.activeElement.id || document.activeElement.className) : 'none'));

    // Tab 3 -> Should TRAP and wrap back to modal-close
    await page.keyboard.press('Tab');
    activeIds.push(await page.evaluate(() => document.activeElement ? (document.activeElement.id || document.activeElement.className) : 'none'));

    // Shift+Tab -> Should TRAP and wrap backward to modal-ack-btn
    await page.keyboard.press('Shift+Tab');
    activeIds.push(await page.evaluate(() => document.activeElement ? (document.activeElement.id || document.activeElement.className) : 'none'));

    console.log('Focus trajectory during tabbing inside open modal:', activeIds.join(' -> '));

    // Test close and check body overflow restoration
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    const bodyOverflowAfterClose = await page.evaluate(() => document.body.style.overflow);
    console.log(`Body overflow after modal close: "${bodyOverflowAfterClose}"`);
  }

  await ctx.close();
  await browser.close();
})();
