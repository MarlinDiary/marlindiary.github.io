import type { AstroIntegration } from 'astro';
import { readdir, readFile, stat, unlink } from 'node:fs/promises';
import { join, extname } from 'node:path';

/**
 * Drop the untouched source images from the finished build.
 *
 * Astro's image service writes an optimised variant for every size a page asks
 * for, but Vite separately emits the original file into `_astro/` as a plain
 * asset. Nothing links to it — a 1.6MB PNG ships alongside the 70KB WebP that
 * replaced it. On this site that was 4.5MB of a 6.3MB build.
 *
 * The rule is deliberately narrow: a file is removed only when it is a raster
 * image sitting in `_astro/` whose name appears in none of the build's text
 * output. Anything referenced from HTML, CSS, JS, JSON, XML or SVG is kept, so
 * a file that turns out to be linked from somewhere unexpected survives.
 */
const RASTER = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif']);
const TEXT = new Set(['.html', '.css', '.js', '.mjs', '.json', '.xml', '.txt', '.svg', '.map']);

async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const path = join(dir, entry.name);
      return entry.isDirectory() ? walk(path) : Promise.resolve([path]);
    })
  );
  return files.flat();
}

export default function pruneOriginals(): AstroIntegration {
  return {
    name: 'prune-originals',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const root = dir.pathname;
        const files = await walk(root);

        // Every name mentioned anywhere in the build's text output.
        const mentioned = new Set<string>();
        await Promise.all(
          files
            .filter((file) => TEXT.has(extname(file)))
            .map(async (file) => {
              const source = await readFile(file, 'utf8');
              for (const match of source.matchAll(/[\w.\-]+\.(?:png|jpe?g|webp|avif|gif)/g)) {
                mentioned.add(match[0]);
              }
            })
        );

        let removed = 0;
        let bytes = 0;
        for (const file of files) {
          const name = file.slice(file.lastIndexOf('/') + 1);
          if (!file.includes('/_astro/') || !RASTER.has(extname(file))) continue;
          if (mentioned.has(name)) continue;

          bytes += (await stat(file)).size;
          await unlink(file);
          removed++;
        }

        if (removed > 0) {
          logger.info(
            `Removed ${removed} unreferenced source image${removed === 1 ? '' : 's'} ` +
              `(${(bytes / 1024 / 1024).toFixed(2)}MB)`
          );
        }
      },
    },
  };
}
