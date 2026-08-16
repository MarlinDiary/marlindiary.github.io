import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Publications. One .md file per paper in src/content/publications/.
 *
 * `image` is optional: entries without one fall back to a neutral placeholder
 * so the layout keeps its shape.
 */
const publications = defineCollection({
  loader: glob({ base: './src/content/publications', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),

      /** Author ids from src/authors.ts. Array order is byline order. */
      authors: z.array(z.string()).nonempty(),

      /** Venue name, original casing preserved: NeurIPS, SIGGRAPH Asia, arXiv. */
      venue: z.string(),
      year: z.number().int(),

      /** Honors. Multiple allowed: ['Oral Presentation', 'Best Paper Nominee'] */
      awards: z.array(z.string()).default([]),

      /** One plain-language sentence. A non-expert should understand it. */
      blurb: z.string(),

      /** Thumbnail, kept alongside the .md file. Falls back to a placeholder. */
      image: image().optional(),
      imageAlt: z.string().optional(),
      /**
       * A second still swapped in on hover, kept beside the .md like `image`
       * and optimised the same way. Touch devices never fire hover, so they
       * simply keep showing `image`.
       */
      imageHover: image().optional(),
      /**
       * Video played on hover instead. Lives in public/, referenced by an
       * absolute path, and fetched only when the pointer arrives.
       */
      videoHover: z.string().optional(),

      // ── Links: give the shorthand, the template expands the full URL ──
      /** Full project page URL. */
      project: z.string().url().optional(),
      /**
       * Dataset or artefact release. Sits with the project page at the front of
       * the row, ahead of the paper links: for a benchmark paper the data is a
       * primary output, not an appendix to the PDF.
       */
      dataset: z.string().url().optional(),
      /**
       * arXiv id. **Must be quoted**: arxiv: '2301.00010'
       * Unquoted, YAML parses it as a float and drops the trailing zero, which
       * silently breaks the link. Supplying this generates both PDF and arXiv links.
       */
      arxiv: z.string().optional(),
      /** GitHub repository as owner/repo. Expands to a Code link. */
      github: z.string().optional(),
      /** Full URL for a non-arXiv PDF. Overrides the arXiv-derived PDF link. */
      pdf: z.string().url().optional(),
      /**
       * Escape hatch for anything else: Dataset, Video, Poster, BibTeX.
       * `icon` takes any name from src/components/Icon.astro; omit it for the
       * generic globe.
       */
      links: z
        .array(z.object({ label: z.string(), href: z.string(), icon: z.string().optional() }))
        .default([]),

      /** Lower sorts first. Ties break by year, descending. */
      order: z.number().default(0),
      draft: z.boolean().default(false),
    }),
});

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),

    /**
     * Topic labels, shown beside the date. Plain text, not links: a tag that
     * goes somewhere needs an archive page behind it, and an archive holding one
     * post is a page that exists to disappoint. Making them clickable later
     * touches nothing already written.
     */
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { publications, blog };
