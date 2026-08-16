---
title: First Post
date: 2026-08-15
description: A sample post used to check the blog typography. Delete it.
tags: [meta, typography]
---

This is body copy. The common Markdown elements appear below so you can check
how each one is set.

## A second-level heading

Paragraph spacing, line height, and grey values all follow the site tokens.
Change the variables at the top of `src/styles/global.css` and everything moves
together.

- First list item
- Second list item
- Third list item

And numbered, which sets its own counters:

1. First numbered item
2. Second numbered item
3. Third numbered item

Inline code looks like `const x = 1`, and a code block looks like this:

```ts
export function greet(name: string) {
  return `Hello, ${name}`;
}
```

> A block quote. It sits at body colour, marked by a rule rather than dimmed.

| Element | Set in | Note |
| --- | --- | --- |
| Body | Crimson Pro | 20.25px, measure capped at 33rem |
| Code | ui-monospace | 0.8em, matched to the serif x-height |
| Headings | Cormorant Garamond | display face, 600 |

To write a post, add a `.md` file under `src/content/blog/`. The frontmatter
needs `title` and `date`; `description` is optional. Set `draft: true` to keep
a post out of the build.

## Math

Inline math like $E = mc^2$ sits in the line, and a display block gets its own
space:

$$
\mathcal{L}(\theta) = -\frac{1}{N}\sum_{i=1}^{N} \log p_\theta(y_i \mid x_i)
$$

The stylesheet is only linked on posts that actually contain formulas.
