// Existing Playwright installation only. No server, packages or network needed.
import { chromium } from 'playwright';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { join, dirname } from 'node:path';

const directory = dirname(fileURLToPath(import.meta.url));

async function main() {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1800, height: 1000 }, deviceScaleFactor: 1 });
    const failures = [];
    page.on('requestfailed', request => failures.push(request.url()));
    page.on('pageerror', error => failures.push(error.message));
    await page.goto(pathToFileURL(join(directory, 'index.html')).href);
    await page.evaluate(() => document.fonts.ready);
    const state = await page.evaluate(async () => {
      await Promise.all([...document.images].map(image => image.decode()));
      return {
        fontsLoaded: [...document.fonts].every(font => font.status === 'loaded'),
        samples: document.querySelectorAll('.sample').length,
        sizesCorrect: [...document.querySelectorAll('.sample')].every(sample =>
          [48, 96, 160, 320].every(size =>
            sample.querySelector(`img[width="${size}"]`).getBoundingClientRect().width === size)),
        overflow: document.documentElement.scrollWidth > innerWidth,
      };
    });
    if (failures.length || !state.fontsLoaded || state.samples !== 9 ||
        !state.sizesCorrect || state.overflow) throw new Error(JSON.stringify({ failures, state }));
    await page.screenshot({ path: join(directory, 'preview.png'), fullPage: true });
    await page.setViewportSize({ width: 390, height: 844 });
    if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) {
      throw new Error('Comparison page overflows at 390px');
    }
    await page.screenshot({ path: join(directory, 'preview-mobile.png'), fullPage: true });
    console.log('Saved Chromium screenshots at 1800px and 390px.');
  } finally {
    await browser.close();
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
