// Default: Playwright + Chromium. --sharp uses the installed SVG rasterizer
// when Chromium cannot launch; all outputs are checked by Pillow either way.
import { readFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const directory = dirname(fileURLToPath(import.meta.url));

async function main() {
  const root = resolve(directory, '..');
  const scratch = mkdtempSync(join(tmpdir(), 'polishpal-brand-'));
  const fallback = process.argv.includes('--sharp');
  const browser = fallback ? null : await (await import('playwright')).chromium.launch();
  const page = browser ? await browser.newPage({ deviceScaleFactor: 1 }) : null;
  try {
    async function rasterize(source, size, destination, background) {
      if (fallback) {
        const { default: sharp } = await import('sharp');
        let pipeline = sharp(Buffer.from(source)).resize(size, size);
        if (background) pipeline = pipeline.flatten({ background });
        await pipeline.png().toFile(destination);
      } else {
        await page.setViewportSize({ width: size, height: size });
        await page.setContent(`<style>html,body{margin:0;width:100%;height:100%;background:${background || 'transparent'}}svg{display:block;width:100%;height:100%}</style>${source}`);
        await page.screenshot({ path: destination, omitBackground: !background });
      }
    }
    const mark = readFileSync(join(root, 'public/logo.svg'), 'utf8');
    for (const [file, size] of [
      ['icon-192.png', 192], ['icon-512.png', 512], ['apple-touch-icon.png', 180],
    ]) {
      await rasterize(mark, size, join(root, 'public', file), '#FFFFFF');
    }
    const favicon = readFileSync(join(root, 'design/logo-concepts/chosen/favicon.svg'), 'utf8');
    for (const size of [16, 32, 48]) {
      await rasterize(favicon, size, join(scratch, `favicon-${size}.png`));
    }
    await rasterize(mark.replace('#D91F3B', '#FFFFFF'), 512, join(scratch, 'og-mark.png'));
    execFileSync('python3', [join(directory, 'assemble-brand-assets.py'), scratch], { stdio: 'inherit', cwd: root });
    console.log(`Generated brand assets with ${fallback ? 'Sharp' : 'Chromium'} + Pillow.`);
  } finally {
    if (browser) await browser.close();
    rmSync(scratch, { recursive: true, force: true });
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
