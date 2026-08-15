// ─────────────────────────────────────────────────────────────
//  Author registry
//
//  Register each person once here, then reference them by id from a
//  publication's frontmatter:
//
//      authors: [me, zhangsan, lisi]
//
//  This keeps a collaborator's homepage in a single place and prevents the
//  same person being spelled two different ways across papers. Referencing an
//  unregistered id fails the build and names the offending file.
// ─────────────────────────────────────────────────────────────

export interface Author {
  first: string;
  middle?: string;
  last: string;
  /** Personal homepage. Rendered as a link when present, plain text otherwise. */
  website?: string;
  /** You. Rendered in bold and never linked — the reader is already here. */
  me?: boolean;
}

export const authors = {
  me: {
    first: 'Chenye',
    last: 'Ni',
    me: true,
  },
  collaboratorOne: {
    first: 'Collaborator',
    last: 'One',
    website: 'https://example.com',
  },
  collaboratorTwo: {
    first: 'Collaborator',
    last: 'Two',
  },
  collaboratorThree: {
    first: 'Collaborator',
    last: 'Three',
  },
} satisfies Record<string, Author>;

export type AuthorId = keyof typeof authors;

export function fullName(author: Author): string {
  return [author.first, author.middle, author.last].filter(Boolean).join(' ');
}

/** "Bardienus Duisterhof" → "B. Duisterhof". CV convention: bylines there are
 *  scanned, not read, so initials keep each line to one row. */
export function shortName(author: Author): string {
  return `${author.first.charAt(0)}. ${author.last}`;
}

/** Throws so the build fails loudly instead of silently dropping a co-author. */
export function lookupAuthor(id: string, context: string): Author {
  const author = (authors as Record<string, Author>)[id];
  if (!author) {
    throw new Error(
      `Unknown author id "${id}" (referenced from ${context}). Register it in src/authors.ts first.`
    );
  }
  return author;
}
