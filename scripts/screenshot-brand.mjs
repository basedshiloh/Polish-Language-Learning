// Run next start on port 3000 first, then: node scripts/screenshot-brand.mjs
// Screenshots are browser captures, separate from the generated raster proofs.
// The redesigned site is light-only (no theme switcher), so there is one theme to capture.
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const output = fileURLToPath(new URL('../design/logo-concepts/chosen/screenshots/', import.meta.url));

async function assertMark(image, where) {
  await image.evaluate(img => img.decode());
  const box = await image.boundingBox();
  if (!box || Math.round(box.width) !== 36 || Math.round(box.height) !== 36) {
    throw new Error(`Incorrect ${where} mark size: ${JSON.stringify(box)}`);
  }
  const natural = await image.evaluate(img => img.naturalWidth);
  if (!natural) throw new Error(`${where} mark failed to load`);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  try {
    await mkdir(output, { recursive: true });
    for (const width of [1280, 390]) {
      for (const theme of ['light']) {
        const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
        await page.goto(process.env.BRAND_PREVIEW_URL || 'http://127.0.0.1:3000', { waitUntil: 'networkidle' });
        await page.evaluate(() => document.fonts.ready);
        const rejectCookies = page.getByRole('button', { name: /reject|necessary only/i });
        if (await rejectCookies.count()) await rejectCookies.first().click();
        const header = page.locator('header');
        const logo = header.locator('img[src="/logo.svg"]');
        await logo.evaluate(image => image.decode());
        const size = await logo.boundingBox();
        if (!size || size.width !== 36 || size.height !== 36) throw new Error('Incorrect header mark size');
        const clipped = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
        if (clipped) throw new Error(`Horizontal overflow at ${width}px`);
        await header.screenshot({ path: `${output}header-${width}-${theme}.png` });
        const footer = page.locator('footer');
        await footer.scrollIntoViewIfNeeded();
        await assertMark(footer.locator('img[src="/logo-white.svg"]'), 'footer');
        // The sticky header would otherwise be painted over the tall footer capture.
        const hideHeader = await page.addStyleTag({ content: 'header{visibility:hidden!important}' });
        await footer.screenshot({ path: `${output}footer-${width}-${theme}.png` });
        await hideHeader.evaluate(node => node.remove());
        await page.evaluate(() => scrollTo(0, 0));
        const openMenu = page.getByRole('button', { name: 'Open menu', exact: true });
        if (width === 390) {
          await openMenu.click();
          const menu = page.getByRole('dialog', { name: 'Navigation menu' });
          await menu.waitFor({ state: 'visible' });
          await menu.getByRole('link', { name: 'PolishPal home', exact: true }).waitFor();
          await page.waitForTimeout(350); // Let the drawer's CSS transition finish.
          await assertMark(menu.locator('img[src="/logo.svg"]'), 'mobile drawer');
          await page.screenshot({ path: `${output}mobile-menu-${width}-${theme}.png` });
          await page.getByRole('button', { name: 'Close menu', exact: true }).click();
        } else if (await openMenu.isVisible()) {
          throw new Error('Mobile menu should be hidden at desktop width');
        }
        await page.close();
      }
    }
    console.log('Captured header/footer at 1280px and 390px, and the mobile drawer at 390px.');
  } finally {
    await browser.close();
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
