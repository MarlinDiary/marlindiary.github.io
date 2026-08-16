import type { CollectionEntry } from 'astro:content';

type PublicationData = CollectionEntry<'publications'>['data'];

export interface PublicationLink {
  label: string;
  href: string;
  icon: string;
}

/**
 * The link row for a publication, in the order it is shown.
 *
 * Frontmatter carries shorthand (`arxiv: 2602.20167`) rather than full URLs, so
 * an entry stays short and an id cannot be typed into the wrong shape of link.
 * The order is deliberate: a project page first when there is one, then the
 * dataset — for a benchmark paper whose contribution *is* the data, that is the
 * thing a reader wants — then the paper itself.
 */
export function publicationLinks(data: PublicationData): PublicationLink[] {
  const { project, dataset, arxiv, github, pdf, links: extra } = data;
  const links: PublicationLink[] = [];

  if (project) links.push({ label: 'Project', href: project, icon: 'link' });
  if (dataset) links.push({ label: 'Dataset', href: dataset, icon: 'dataset' });
  if (pdf) links.push({ label: 'PDF', href: pdf, icon: 'pdf' });
  else if (arxiv) links.push({ label: 'PDF', href: `https://arxiv.org/pdf/${arxiv}`, icon: 'pdf' });
  if (arxiv) links.push({ label: 'arXiv', href: `https://arxiv.org/abs/${arxiv}`, icon: 'arxiv' });
  if (github) links.push({ label: 'Code', href: `https://github.com/${github}`, icon: 'code' });
  links.push(...extra.map((link) => ({ ...link, icon: link.icon ?? 'link' })));

  return links;
}

/**
 * Where a publication's title points, on the homepage and on the CV alike.
 *
 * Defined as the head of the row above rather than as its own chain of
 * fallbacks. The two pages used to each carry their own copy of that chain, and
 * they drifted: the CV's was missing `dataset`, so RustBuildEq's title led to
 * the PDF on one page and to the benchmark on the other. Deriving it from the
 * single list is what stops that happening again.
 */
export function primaryLink(data: PublicationData): string | undefined {
  return publicationLinks(data)[0]?.href;
}
