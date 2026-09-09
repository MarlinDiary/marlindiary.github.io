import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { site, alsoKnownAs } from '../site';
import { sections } from '../cv';
import { primaryLink, publicationLinks } from '../publications';

/** Static Markdown, built from the same biography, CV and papers as the pages. */
export const GET: APIRoute = async ({ site: origin }) => {
  const publications = (await getCollection('publications', ({ data }) => !data.draft))
    .sort((a, b) => a.data.order - b.data.order || b.data.year - a.data.year);
  const bio = site.bio[0].replace(/<a href="([^"]+)">([^<]+)<\/a>/g, '[$2]($1)');
  const orcid = alsoKnownAs.find((url) => url.startsWith('https://orcid.org/'));
  const link = (label: string, url?: string) => url ? `[${label}](${url})` : label;
  const text = [
    `# ${site.name}`,
    `${site.name}'s Chinese name is 倪晨烨.`,
    bio,
    '## Publications',
    publications.map(({ data }) => {
      const resources = publicationLinks(data)
        .map(({ label, href }) => `${label}: ${href}`).join('; ');
      return `- ${link(data.title, primaryLink(data))}: ${data.venue} ${data.year}. ${data.blurb}`
        + (resources ? `\n  ${resources}` : '');
    }).join('\n'),
    ...(orcid ? [`ORCID: ${orcid}`] : []),
    '## Background',
    ...sections.map(({ heading, items }) => `### ${heading}\n\n` + items.map((item) =>
      `- ${link(item.title, item.href)}. ${item.detail ?? ''} (${[item.when, item.where].filter(Boolean).join('; ')}).`
    ).join('\n')),
    '## Pages',
    [
      `- [Home](${origin}): biography and publications`,
      `- [CV](${new URL('/cv/', origin)}): education, experience, teaching, awards`,
      `- [Blog](${new URL('/blog/', origin)}): writing, also available via [RSS](${new URL('/rss.xml', origin)})`,
    ].join('\n'),
  ].join('\n\n') + '\n';

  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
