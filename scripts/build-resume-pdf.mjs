// Renders resume/resume.html to public/Nitin_M_Resume.pdf using the system
// Edge install (via playwright-core's msedge channel), so no browser download
// is needed. Run with: npm run resume:pdf
import { chromium } from 'playwright-core';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const htmlPath = path.join(root, 'resume', 'resume.html');
const outPath = path.join(root, 'public', 'Nitin_M_Resume.pdf');

const browser = await chromium.launch({ channel: 'msedge' });
const page = await browser.newPage();
await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);

// Refuse to write a PDF if any image failed to load (broken screenshot path etc).
const broken = await page.evaluate(() =>
  [...document.images].filter((img) => !img.complete || img.naturalWidth === 0).map((img) => img.src),
);
if (broken.length) {
  console.error('Refusing to render: broken image(s):', broken);
  await browser.close();
  process.exit(1);
}

await page.pdf({
  path: outPath,
  format: 'A4',
  printBackground: true,
  margin: { top: '0', bottom: '0', left: '0', right: '0' },
});

await browser.close();
console.log('Wrote', outPath);
