# marlindiary.github.io

Personal academic homepage. Astro, fully static, deployed to
<https://marlindiary.github.io> by GitHub Actions on every push to `main`.

## Local development

Requires Node 22.12 or newer.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # output in dist/
```

## Where to change things

| To change | Edit |
| --- | --- |
| Name, greeting, bio, links | `src/site.ts` |
| Avatar | drop `avatar.jpg` into `src/assets/` (picked up automatically) |
| Avatar hover frame | drop `avatar-hover.jpg` alongside it (optional) |
| Collaborators | `src/authors.ts` |
| Publications | add a `.md` under `src/content/publications/` |
| CV | the `role`, `education` and `employment` arrays at the top of `src/pages/cv.astro` |
| CV PDF | place it at `public/cv.pdf` |
| Blog posts | add a `.md` under `src/content/blog/` |
| Type sizes, greys, spacing | the CSS variables at the top of `src/styles/global.css` |

## Adding a publication

Register each author once in `src/authors.ts`, then reference them by id.
Create a `.md` under `src/content/publications/`:

```yaml
---
title: Paper title
authors: [me, zhangsan, lisi]   # ids from src/authors.ts, in byline order
venue: NeurIPS                  # original casing preserved
year: 2026
awards: [Oral Presentation]     # optional, several allowed
blurb: One plain sentence saying what the paper does.
project: https://...            # optional
dataset: https://...            # optional, sits at the front of the row
arxiv: '2601.00010'             # optional, generates both PDF and arXiv links
github: owner/repo              # optional, generates the Code link
image: ./thumb.jpg              # optional, falls back to a placeholder
imageHover: /pubs/demo.mp4      # optional, played on hover only
links:                          # anything else: Video, Poster, BibTeX
  - { label: Video, href: 'https://...' }
---
```

**`arxiv` must be quoted.** Unquoted, YAML reads `2301.00010` as a float and
drops the trailing zero, silently breaking the link. The schema requires a
string, so a bare number fails the build.

Referencing an unregistered author id **also fails the build**, naming the file
at fault, rather than quietly dropping a co-author from the page.

Thumbnails are optimised at build time by `astro:assets` (WebP/AVIF, correct
dimensions). `imageHover` is a video served from `public/`: the first paint
loads only the still, and the video is fetched on hover.

## Writing a post

Frontmatter needs `title` and `date`; `description` is optional and is used for
the list page and the RSS feed. `draft: true` keeps a post out of the build.

Math is written as `$inline$` or `$$display$$` and rendered to HTML at build
time by KaTeX, so pages ship no formula JavaScript and nothing reflows after
load. The stylesheet is linked only on posts that actually contain math, which
is detected from the source — no frontmatter flag to remember.

## Feed

RSS is generated at `/rss.xml` and advertised from every page via
`<link rel="alternate">`.

## Design conventions

- **Greyscale only**, no accent colour. Hierarchy comes from size, weight and
  grey value alone. Every colour is a token in `src/styles/global.css`; nothing
  is hardcoded at a call site.
- **No `text-transform`.** `arXiv`, `NeurIPS` and `PhD` must keep their casing.
- **18px root size.** Every dimension is in rem, so 1.5rem = 27px, 2rem = 36px,
  4rem = 72px. Changing the root rescales the whole site proportionally.
- **Two widths.** `--measure` (53rem) frames the page and holds the layouts that
  need the room — the publication list and the CV. Running prose is capped
  separately and much narrower.
- **Icons come from three sets**, split by what they represent: Heroicons for
  generic glyphs, Academicons for academic brands (Scholar, arXiv, ORCID),
  Simple Icons for everything else. All inlined at build time — no icon font,
  no CDN. Add or remap names in `src/components/Icon.astro`.
- **The CV runs its own rhythm.** Tighter leading and smaller type than the rest
  of the site, because it is scanned rather than read.

## First deployment

In the repository settings: **Settings → Pages → Source → GitHub Actions**, then
push to `main`.
