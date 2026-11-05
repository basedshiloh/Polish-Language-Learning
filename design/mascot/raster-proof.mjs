// Uses existing Sharp and Python/Pillow only. No installs or browser claims.
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';

const sharp = createRequire(import.meta.url)('sharp');
const directory = dirname(fileURLToPath(import.meta.url));
const root = resolve(directory, '../..');
const scratch = mkdtempSync(join(tmpdir(), 'polishpal-zubek-'));
const manifest = JSON.parse(readFileSync(join(root, 'src/data/mascot.json'), 'utf8'));

async function main() {
  try {
    let sizeChecks = 0;
    for (const [pose, entry] of Object.entries(manifest.poses)) {
      const source = readFileSync(join(root, 'public', entry.file), 'utf8');
      for (const size of [48, 96, 160, 320]) {
        const png = await sharp(Buffer.from(source)).resize(size, Math.round(size * 1.2)).png().toBuffer();
        for (const background of ['#FFFFFF', '#F6F7FA', '#D91F3B']) {
          const rendered = await sharp(png).flatten({ background }).png().toBuffer();
          const meta = await sharp(rendered).metadata();
          if (meta.width !== size || meta.height !== Math.round(size * 1.2)) throw new Error(`Size mismatch: ${pose}`);
          sizeChecks++;
        }
        if (size === 320) writeFileSync(join(scratch, `${pose}.png`), png);
      }
      await sharp(Buffer.from(source)).resize(40, 48).png().toFile(join(scratch, `${pose}-48-high.png`));
    }
    // Independently alter actual XML nodes to exercise expressions and the
    // declared SVG-space rotation/translation limits. CSS/WAAPI still needs a browser.
    const fixtureCode = `
from pathlib import Path
import json,sys,copy
import xml.etree.ElementTree as E
E.register_namespace('', 'http://www.w3.org/2000/svg')
root=Path(sys.argv[1]);m=json.loads((root/'src/data/mascot.json').read_text());out=[]
for pose,item in m['poses'].items():
 base=E.parse(root/'public'/item['file'].lstrip('/')).getroot()
 for mode in ['base','mouth-s','mouth-l','happy','closed','wave-min','wave-max','tilt-min','tilt-max','hop-up','hop-land']:
  doc=copy.deepcopy(base);parts={n.get('data-part'):n for n in doc.iter() if n.get('data-part')}
  if mode.startswith('mouth-'):
   wanted='open-s' if mode=='mouth-s' else 'open-l'
   for n in parts['mouth']:n.set('visibility','visible' if n.get('data-state')==wanted else 'hidden')
  if mode in ['happy','closed']:
   for side in ['l','r']:
    for n in parts['eye-'+side]:n.set('visibility','visible' if n.get('data-state')==mode else 'hidden')
    parts['lid-'+side].set('visibility','visible' if mode=='closed' else 'hidden')
  if mode.startswith('wave-') or mode.startswith('tilt-'):
   name='arm-l' if mode.startswith('wave-') else 'head';angle={'wave-min':-18,'wave-max':9,'tilt-min':-8,'tilt-max':6}[mode]
   parts[name].set('transform',f"rotate({angle} {parts[name].get('data-pivot')})")
  if mode.startswith('hop-'):
   node=next(n for n in doc.iter() if n.get('data-rig')=='character');node.set('transform','translate(0 -25)' if mode=='hop-up' else 'translate(0 5)')
  out.append({'name':pose+'/'+mode,'svg':E.tostring(doc,encoding='unicode')})
print(json.dumps(out))
`;
    const fixtures = JSON.parse(execFileSync('python3', ['-c', fixtureCode, root], { encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 }));
    for (const fixture of fixtures) {
      const { data, info } = await sharp(Buffer.from(fixture.svg)).resize(400, 480).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      let visible = 0;
      for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
        const alpha = data[(y * info.width + x) * info.channels + 3];
        if (alpha) {
          visible++;
          if (x === 0 || y === 0 || x === info.width - 1 || y === info.height - 1) throw new Error(`Edge clipping: ${fixture.name}`);
        }
      }
      if (!visible) throw new Error(`Empty fixture: ${fixture.name}`);
    }
    for (const name of ['model-sheet', 'expressions']) {
      await sharp(join(directory, `${name}.svg`)).resize(1200).flatten({ background: '#FFFFFF' }).png().toFile(join(scratch, `${name}.png`));
    }
    execFileSync('python3', [join(directory, 'compose-proof.py'), scratch], { stdio: 'inherit' });
    const report = {
      renderer: 'Sharp SVG rasterizer; this is not a browser screenshot',
      sizeBackgroundChecks: sizeChecks, stateAndMotionBoundChecks: fixtures.length,
      nominalSizes: [48, 96, 160, 320], backgrounds: ['#FFFFFF', '#F6F7FA', '#D91F3B'],
      outlineWidth: 8, groundLine: 448,
      browserRuntimeVerified: false,
      pending: ['WAAPI runtime and CSS pivot rendering', 'desktop/mobile HTML layout and screenshots', 'Safari integration and product accessibility controls'],
    };
    writeFileSync(join(directory, 'verification.json'), JSON.stringify(report, null, 2) + '\n');
    console.log(`${sizeChecks} size/background checks and ${fixtures.length} state/motion-bound checks passed.`);
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
