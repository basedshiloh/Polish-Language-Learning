// Uses an already installed Playwright/Chromium; never installs packages.
import { chromium } from 'playwright';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const directory = dirname(fileURLToPath(import.meta.url));

async function main() {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1500, height: 1000 }, deviceScaleFactor: 1 });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('requestfailed', request => errors.push(request.url()));
    await page.goto(pathToFileURL(join(directory, 'poses.html')).href);
    await page.evaluate(() => document.fonts.ready);
    const state = await page.evaluate(async () => {
      await Promise.all([...document.images].map(image => image.decode()));
      return {
        fonts: [...document.fonts].every(font => font.status === 'loaded'),
        cards: document.querySelectorAll('.pose-card').length,
        samples: document.querySelectorAll('.sample').length,
        widths: [...document.querySelectorAll('.sample')].every(sample =>
          [48, 96, 160, 320].every(size => sample.querySelector(`img[width="${size}"]`).getBoundingClientRect().width === size)),
        overflow: document.documentElement.scrollWidth > innerWidth,
      };
    });
    if (!state.fonts || state.cards !== 12 || state.samples !== 36 || !state.widths || state.overflow) {
      throw new Error(JSON.stringify(state));
    }
    await page.screenshot({ path: join(directory, 'poses-preview.png'), fullPage: true });
    await page.setViewportSize({ width: 390, height: 844 });
    if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) throw new Error('Pose sheet overflows at 390px');
    await page.goto(pathToFileURL(join(directory, 'rig-demo.html')).href);
    await page.evaluate(() => document.fonts.ready);
    const poses = await page.locator('#pose option').evaluateAll(options => options.map(o => o.value));
    for (const pose of poses) {
      await page.evaluate(next => window.zubekRigDemo.setPose(next), pose);
      for (const action of ['blink', 'talk', 'wave', 'tilt', 'hop', 'happy', 'reset']) {
        await page.evaluate(next => window.zubekRigDemo.run(next), action);
        if (await page.evaluate(() => window.zubekRigDemo.getState().busy)) throw new Error(`Action stuck: ${pose}/${action}`);
      }
      const resting = await page.evaluate(() => window.zubekRigDemo.getState());
      const expectedEyes = pose === 'sleep' ? 'closed' : pose === 'celebrate' ? 'happy' : 'open';
      if (resting.eyes !== expectedEyes || resting.mouth !== 'closed') throw new Error(`Reset failed: ${pose}`);
    }
    await page.evaluate(() => window.zubekRigDemo.setPose('hello'));
    await page.screenshot({ path: join(directory, 'rig-demo-mobile.png'), fullPage: true });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.evaluate(() => window.zubekRigDemo.run('hop'));
    if (!(await page.locator('#status').textContent()).includes('Reduced motion')) throw new Error('Reduced-motion hop was not suppressed');
    await page.evaluate(() => window.zubekRigDemo.run('talk'));
    await page.setViewportSize({ width: 1500, height: 1000 });
    await page.screenshot({ path: join(directory, 'rig-demo-preview.png'), fullPage: true });
    if (errors.length) throw new Error(JSON.stringify(errors));
    console.log('Captured pose sheet and demo; exercised 84 actions and reduced-motion behavior.');
  } finally {
    await browser.close();
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
