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

/**
 * Profiles that belong to this person but not on the page.
 *
 * `links` above is the visible row — how a reader reaches him — and every entry
 * there is something worth clicking. This list is the other half of the same
 * identity: addresses that mean nothing to a reader and everything to a machine
 * trying to work out whether two mentions of "Chenye Ni" are the same person.
 * They are folded into the structured data's `sameAs` and rendered nowhere.
 */
export const alsoKnownAs = [
  'https://orcid.org/0009-0003-3461-2056',
  'https://www.linkedin.com/in/chenyeni/',
  // The institution's own record, and the strongest of the three: it is on
  // auckland.ac.nz, so it turns the affiliation this site claims in its
  // structured data into something a machine can verify against the
  // university rather than take on the site's word. It links back here too.
  'https://profiles.auckland.ac.nz/chenye-ni',
  // Worth declaring precisely because the handle does not match the others: a
  // machine has no way to guess that `deerspost` is the same person as
  // `MarlinDiary`, so the statement carries information the rest do not. The
  // account already displays the same real name, so it discloses nothing that
  // searching for it would not.
  'https://www.instagram.com/deerspost/',
  // Declared for completeness, and the weakest of the set: Weibo serves a
  // login wall to anything not signed in, so a crawler following this URL sees
  // no name and no content and can corroborate nothing. Harmless, but it does
  // not do the work the others do.
  'https://weibo.com/u/7873964072',
  // The canonical profile, not the xhslink.cn share link it was given as. That
  // short link carries `xsec_token`, `share_id` and a timestamp — a session's
  // worth of parameters that expire — and puts a redirect in front of the
  // address besides. Verified: the bare URL serves the same page without them.
  'https://www.xiaohongshu.com/user/profile/689d3bd10000000019019d2a',
];
