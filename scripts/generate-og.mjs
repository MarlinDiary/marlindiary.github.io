import { fileURLToPath } from 'node:url';
import { openSync } from 'fontkit';
import sharp from 'sharp';

// Edit the wording here; positions and type sizes are in the SVG below.
const name = 'Chenye Ni';
const subtitle = 'Ph.D. student, University of Auckland';
const tagline = 'The world is my salmon.';
const asset = (relative) => fileURLToPath(new URL(`../${relative}`, import.meta.url));
const escapeXml = (text) => text.replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;',
})[char]);

// Outline the bundled fonts so rendering never depends on installed fonts.
function drawText(text, face, size, baseline, color) {
  if (!text.trim() || /[\r\n]/.test(text)) throw new Error('Card text must be a nonempty single line.');
  const font = openSync(asset(`public/fonts/${face}.woff2`));
  for (const char of text) {
    if (!font.hasGlyphForCodePoint(char.codePointAt(0))) throw new Error(`Font has no glyph for ${JSON.stringify(char)}.`);
  }
  const run = font.layout(text);
  const scale = size / font.unitsPerEm;
  let penX = 0, penY = 0, right = 0;
  const paths = run.glyphs.map((glyph, index) => {
    const position = run.positions[index];
    const x = penX + position.xOffset, y = penY + position.yOffset;
    right = Math.max(right, x + glyph.bbox.maxX);
    penX += position.xAdvance;
    penY += position.yAdvance;
    return `<path transform="translate(${x} ${y})" d="${glyph.path.toSVG()}"/>`;
  });
  if (Math.max(penX, right) * scale > 480) throw new Error(`Card text is too wide: ${text}`);
  return `<g fill="${color}" transform="translate(570 ${baseline}) scale(${scale} ${-scale})">${paths.join('')}</g>`;
}

const portrait = await sharp(asset('scripts/assets/og-portrait.png'))
  .resize(320, 320, { fit: 'cover' }).png().toBuffer();
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <title>${escapeXml(name)}</title>
  <desc>${escapeXml(`${subtitle}. ${tagline}`)}</desc>
  <rect width="1200" height="630" fill="#fdfdfd"/>
  <image x="178" y="155" width="320" height="320" href="data:image/png;base64,${portrait.toString('base64')}"/>
  ${drawText(name, 'cormorant-garamond-600-latin', 96, 257, '#18181b')}
  ${drawText(subtitle, 'crimson-pro-400-latin', 30, 335, '#444444')}
  <path d="M570 370.5 H1022" stroke="#e5e5e5" stroke-width="1"/>
  ${drawText(`“${tagline}”`, 'crimson-pro-400-italic-latin', 46, 430, '#444444')}
</svg>`;

const output = asset('public/og.jpg');
await sharp(Buffer.from(svg), { density: 144 }).resize(1200, 630)
  .jpeg({ quality: 92, chromaSubsampling: '4:4:4' }).toFile(output);
console.log(`Generated ${output} (1200x630 JPEG)`);
