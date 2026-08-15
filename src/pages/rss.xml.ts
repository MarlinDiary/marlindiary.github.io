import rss from '@astrojs/rss';
import { getCollection, render } from 'astro:content';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import type { APIContext } from 'astro';
import { site } from '../site';

/**
 * Full text in the feed, rendered through the site's own pipeline rather than
 * by re-parsing the Markdown with a second processor. That keeps the feed and
 * the page in step: syntax highlighting, KaTeX markup and the `target="_blank"`
 * on external links are all applied once, in one place.
 *
 * Root-relative URLs are rewritten to absolute. Inside a reader the entry no
 * longer sits on this origin, so `/_astro/…` would resolve against the reader's
 * own host and 404. Done here rather than in the Markdown so the source files
 * stay portable.
 */
function absolutise(html: string, origin: string): string {
  return html
    .replace(/(<[^>]+\s(?:href|src)=")\/(?!\/)/g, `$1${origin}/`)
    .replace(
      /(\ssrcset=")([^"]+)"/g,
      (_, lead, set) => `${lead}${set.replace(/(^|,\s*)\/(?!\/)/g, `$1${origin}/`)}"`
    );
}

export async function GET(context: APIContext) {
  const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );

  // context.site comes from `site` in astro.config.mjs.
  const origin = context.site!.origin;
  const container = await AstroContainer.create();

  const items = await Promise.all(
    posts.map(async (post) => {
      const { Content } = await render(post);
      return {
        title: post.data.title,
        // Kept alongside the full text: readers that show a list before the
        // article use `description` for the preview line.
        description: post.data.description,
        pubDate: post.data.date,
        link: `/blog/${post.id}/`,
        content: absolutise(await container.renderToString(Content), origin),
      };
    })
  );

  return rss({
    title: site.name,
    description: site.description,
    site: context.site!,
    items,
    customData: '<language>en</language>',
  });
}
