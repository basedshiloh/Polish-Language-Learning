// Run from the repo root: node design/logo-concepts/render.cjs
// Requires Playwright and its Chromium installation; does not install packages.
const { chromium } = require('playwright');
const { resolve, join } = require('node:path');
const { pathToFileURL } = require('node:url');

async function main() {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({
      viewport: { width: 1800, height: 1100 },
      deviceScaleFactor: 1,
    });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('requestfailed', request => errors.push(request.url()));
    await page.goto(pathToFileURL(join(__dirname, 'index.html')).href);
    await page.evaluate(() => document.fonts.ready);
    const state = await page.evaluate(() => ({
      fontFacesLoaded: [...document.fonts].every(font => font.status === 'loaded'),
      overflow: document.documentElement.scrollWidth > innerWidth,
      samples: document.querySelectorAll('.sample').length,
      sizes: [...document.querySelectorAll('.sample')].every(sample =>
        [16, 32, 48, 180, 512].every(size =>
          sample.querySelector(`svg[width="${size}"][height="${size}"]`))),
    }));
    if (errors.length || !state.fontFacesLoaded || state.overflow ||
        state.samples !== 12 || !state.sizes) {
      throw new Error(JSON.stringify({ errors, state }));
    }
    await page.screenshot({ path: join(__dirname, 'preview.png'), fullPage: true });
    for (const key of ['a', 'b', 'c']) {
      await page.goto(pathToFileURL(resolve(__dirname, `concept-${key}.svg`)).href);
      await page.setViewportSize({ width: 512, height: 512 });
      await page.screenshot({ path: join(__dirname, `proof-${key}-512.png`) });
      await page.setViewportSize({ width: 16, height: 16 });
      await page.screenshot({ path: join(__dirname, `proof-${key}-16.png`) });
    }
    console.log('Saved preview.png and actual-size Chromium proofs.');
  } finally {
    await browser.close();
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
