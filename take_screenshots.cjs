const { chromium } = require('playwright');

const VIEWPORTS = [
  { name: 'mobile_375',   width: 375,  height: 812 },
  { name: 'tablet_768',   width: 768,  height: 1024 },
  { name: 'desktop_1440', width: 1440, height: 900 },
];

const OUT_DIR = '/Users/akshattyagi1303/.gemini/antigravity-ide/brain/de4a13d3-5412-4578-a0bc-723f623a0818';

(async () => {
  const browser = await chromium.launch();

  for (const vp of VIEWPORTS) {
    const ctx  = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await ctx.newPage();
    await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });

    // Scroll to Footer section
    const footerEl = await page.$('#footer');
    if (footerEl) {
      await footerEl.scrollIntoViewIfNeeded();
      await page.waitForTimeout(600);
      const footerPath = `${OUT_DIR}/footer_${vp.name}.png`;
      await footerEl.screenshot({ path: footerPath });
      console.log(`Saved: ${footerPath}`);
    }

    // Scroll full page to ensure everything has revealed
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    const fullPath = `${OUT_DIR}/site_${vp.name}.png`;
    await page.screenshot({ path: fullPath, fullPage: true });
    console.log(`Saved: ${fullPath}`);

    await ctx.close();
  }

  await browser.close();
})();
