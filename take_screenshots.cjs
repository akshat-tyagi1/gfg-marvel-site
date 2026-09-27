const { chromium } = require('playwright');

const OUT_DIR = '/Users/akshattyagi1303/.gemini/antigravity-ide/brain/de4a13d3-5412-4578-a0bc-723f623a0818';

(async () => {
  const browser = await chromium.launch();
  // 1:1 scale context with deviceScaleFactor: 2 for sharp actual pixel density
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 1200 },
    deviceScaleFactor: 2
  });
  const page = await ctx.newPage();
  await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });

  const trialsEl = await page.$('#trials');
  if (trialsEl) {
    await trialsEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1400);

    // Capture initial accordion state
    await trialsEl.screenshot({ path: `${OUT_DIR}/trials_accordion_1440.png` });
    console.log(`Saved: ${OUT_DIR}/trials_accordion_1440.png`);

    // Capture individual collapsed icons while 2, 3, 4 are collapsed
    const panels = [
      { id: 'trial-sentience', name: 'sentience' },
      { id: 'trial-construct', name: 'construct' },
      { id: 'trial-fortress', name: 'fortress' },
      { id: 'trial-wildcard', name: 'wildcard' }
    ];

    for (const p of panels) {
      // If panel is currently expanded, click another panel to collapse it so we can get its collapsed sigil
      const isExpanded = await page.$eval(`#${p.id}`, el => el.classList.contains('is-expanded'));
      if (isExpanded) {
        // Click a different panel to collapse this one
        const targetOther = p.id === 'trial-sentience' ? 'trial-construct' : 'trial-sentience';
        await page.click(`#${targetOther}`);
        await page.waitForTimeout(600);
      }

      const sigil = await page.$(`#${p.id} .trial-panel__collapsed-sigil`);
      if (sigil) {
        const iconPath = `${OUT_DIR}/icon_${p.name}_collapsed.png`;
        await sigil.screenshot({ path: iconPath });
        console.log(`Saved: ${iconPath}`);
      }
    }

    // Now click trial-wildcard to leave the last one open and screenshot the full strip
    await trialsEl.screenshot({ path: `${OUT_DIR}/trials_icons_side_by_side.png` });
    console.log(`Saved: ${OUT_DIR}/trials_icons_side_by_side.png`);
  }

  await ctx.close();
  await browser.close();
})();


