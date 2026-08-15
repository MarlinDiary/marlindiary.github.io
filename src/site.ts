// ─────────────────────────────────────────────────────────────
//  All personal information lives here. No other file needs edits.
// ─────────────────────────────────────────────────────────────

export const site = {
  /** Used in <title>, and bolded in publication author lists. */
  name: 'Chenye Ni',

  /** Homepage headline. Falls back to `Hello, I'm ${name}` when empty. */
  greeting: "Kia ora, I'm Chenye Ni",

  /** <meta name="description">, also used for social sharing. */
  description: 'Personal academic homepage.',

  // The avatar is not configured here: drop a file named avatar.jpg into
  // src/assets/ and it is picked up automatically.

  /** Homepage bio. One array item per paragraph. Inline <a> tags are allowed. */
  bio: [
    `I am a Ph.D. student at <a href="#">Some University</a>, advised by <a href="#">Advisor Name</a>. My research is on one sentence describing the problem you work on.`,
    `Previously I worked at <a href="#">Somewhere</a> on what you did before.`,
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
    { label: 'CV', href: '/cv', icon: 'cv' },
    {
      label: 'Scholar',
      href: 'https://scholar.google.com/citations?user=YOUR_ID',
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
      label: 'Email',
      href: 'mailto:you@example.com',
      icon: 'email',
      handle: 'you@example.com',
    },
  ] satisfies { label: string; href: string; icon?: string; handle?: string }[],
};

/** Top navigation. */
export const nav = [
  { label: 'Home', href: '/' },
  { label: 'CV', href: '/cv' },
  { label: 'Blog', href: '/blog' },
];
