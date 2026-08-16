import { readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeExternalLinks from 'rehype-external-links';
import pruneOriginals from './src/prune-originals';

const codeThemeLight = JSON.parse(
  readFileSync(new URL('./src/code-theme-light.json', import.meta.url), 'utf8')
);
const codeThemeDark = JSON.parse(
  readFileSync(new URL('./src/code-theme-dark.json', import.meta.url), 'utf8')
);

export default defineConfig({
  site: 'https://chenyeni.com',
  integrations: [sitemap(), pruneOriginals()],
  markdown: {
    // Astro 7 defaults to Sätteri, which has no math support, so the pipeline
    // is switched back to remark/rehype. Math is rendered to HTML at build
    // time by KaTeX: pages ship no formula JavaScript and nothing reflows
    // after load. Write $inline$ or $$display$$ in a post; the stylesheet is
    // linked only on posts that actually contain math.
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [
        rehypeKatex,
        // Same rule as src/links.ts, for anchors written in Markdown.
        [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
      ],
    }),
    /*
     * A pair of themes derived from Vitesse rather than used as shipped.
     *
     * Vitesse was the most restrained of the light themes measured — 30%
     * average saturation, nothing above 59%, where github-light averages 61%
     * and reaches a fully saturated red. But no stock theme clears 4.5:1 for
     * every token against this site's code background: they all dim comments,
     * which is what makes them syntax themes, and a comment is still text.
     * Vitesse bottomed out at 2.18:1. The one theme that did pass,
     * github-light-high-contrast, averages 66% saturation with three tokens
     * above 94% — on a page whose only other colour is inside a photograph,
     * the loudest thing on the screen.
     *
     * So each colour was walked toward its scheme's extreme, hue and
     * saturation intact, until it cleared 4.6:1 on `--fill` (#f2f2f2 light,
     * #232327 dark). 31 colours moved in the light theme and 12 in the dark;
     * the result measures 4.64:1 and 4.66:1 at worst, at 43% and 41% average
     * saturation. Regenerating means repeating that walk against whatever
     * `--fill` becomes.
     *
     * `defaultColor: false` makes Shiki write both themes as custom properties
     * on each token instead of baking one in, so the prose styles can pick with
     * a media query — and the block's own surface stays the site's `--fill`.
     */
    shikiConfig: {
      themes: { light: codeThemeLight, dark: codeThemeDark },
      defaultColor: false,
      wrap: true,
    },
  },
});
