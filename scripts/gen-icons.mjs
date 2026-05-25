// Generate PNG icons from the SVG source for PWA / iOS home screen.
import sharp from 'sharp';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const svg = await readFile(path.join(root, 'public', 'icon.svg'));

const out = path.join(root, 'public');
await mkdir(out, { recursive: true });

const tasks = [
  { size: 192, file: 'icon-192.png' },
  { size: 512, file: 'icon-512.png' },
  { size: 180, file: 'apple-touch-icon.png' }, // iOS home screen
  { size: 512, file: 'icon-maskable-512.png', padding: 0.1 },
];

for (const t of tasks) {
  let img = sharp(svg, { density: 384 });
  if (t.padding) {
    const inner = Math.round(t.size * (1 - t.padding * 2));
    img = sharp({
      create: { width: t.size, height: t.size, channels: 4, background: '#0a0a0a' },
    }).composite([{ input: await sharp(svg, { density: 384 }).resize(inner, inner).png().toBuffer() }]);
  } else {
    img = img.resize(t.size, t.size);
  }
  const buf = await img.png().toBuffer();
  await writeFile(path.join(out, t.file), buf);
  console.log('wrote', t.file, buf.length, 'bytes');
}
