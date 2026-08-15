import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeExternalLinks from 'rehype-external-links';

export default defineConfig({
  site: 'https://chenyeni.com',
  integrations: [sitemap()],
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
    // Dark code blocks, matching the reference. Needs a dark syntax theme or
    // the tokens render dark-on-dark.
    shikiConfig: { theme: 'github-dark', wrap: true },
  },
});
