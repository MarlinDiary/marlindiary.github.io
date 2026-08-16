// ─────────────────────────────────────────────────────────────
//  All personal information lives here. No other file needs edits.
// ─────────────────────────────────────────────────────────────

export const site = {
  /** Used in <title>, and bolded in publication author lists. */
  name: 'Chenye Ni',

  /** Homepage headline. Falls back to `Hello, I'm ${name}` when empty. */
  greeting: "Kia ora, I'm Chenye Ni",

  /** <meta name="description">, also used for social sharing. */
  description:
    'Ph.D. student at the University of Auckland, working on software supply chain security.',

  // The avatar is not configured here: drop a file named avatar.jpg into
  // src/assets/ and it is picked up automatically.

  /** Homepage bio. One array item per paragraph. Inline <a> tags are allowed. */
  bio: [
    `I am a Ph.D. student at the <a href="https://www.auckland.ac.nz">University of Auckland</a>, advised by <a href="https://www.elliottwen.info/">Elliott Wen</a> and <a href="https://valerio-terragni.github.io/">Valerio Terragni</a>. My research is on software supply chain security, and reproducible builds in particular: whether the software you install really came from the source it claims.`,
    `Away from research, I like well-made hardware — Apple's especially — and I spend more time than I should refining how I work rather than working. The rest of my attention goes to indie software, films and AI.`,
  ],

  /**
   * The link row under the homepage bio, also used in the footer.
   *
   * `label` is what the homepage shows — short, scannable.
   * `handle` is what the CV header shows instead: the actual address or
   * username, because a CV is a document someone may print or read away from
   * the link. Omit it to fall back to the label.
   *
   * Valid icon names are listed in src/components/Icon.astro:
   * cv / scholar / github / email / twitter / link
   */
  links: [
    {
      label: 'Scholar',
      // `hl=en` only pins Scholar's interface language; leaving it off lets the
      // visitor's own setting apply. `user` is the only parameter that matters.
      href: 'https://scholar.google.com/citations?user=B69okv8AAAAJ',
      icon: 'scholar',
      handle: 'Google Scholar',
    },
    {
      label: 'GitHub',
      href: 'https://github.com/MarlinDiary',
      icon: 'github',
      handle: 'MarlinDiary',
    },
    {
      label: 'X',
      href: 'https://x.com/MarlinDiary',
      icon: 'x',
      handle: '@MarlinDiary',
    },
    {
      label: 'Email',
      href: 'mailto:cni586@aucklanduni.ac.nz',
      icon: 'email',
      handle: 'cni586@aucklanduni.ac.nz',
    },
  ] satisfies { label: string; href: string; icon?: string; handle?: string }[],
};

/** Top navigation. */
export const nav = [
  { label: 'Home', href: '/' },
  { label: 'CV', href: '/cv' },
  { label: 'Blog', href: '/blog' },
];
