/**
 * External links open in a new tab.
 *
 * Applied at build time rather than by a script that rewrites anchors after
 * load, so the behaviour is in the HTML itself and does not depend on
 * JavaScript running.
 *
 * `rel="noopener noreferrer"` goes with every `target="_blank"`: without
 * `noopener` the opened page gets a handle on this one through `window.opener`
 * and can navigate it elsewhere.
 */

const EXTERNAL = /^https?:\/\//i;

/** Site's own origin, so a full URL pointing back home is treated as internal. */
const SITE_HOST = 'marlindiary.github.io';

export function isExternal(href: string | undefined): boolean {
  if (!href || !EXTERNAL.test(href)) return false;
  try {
    return new URL(href).host !== SITE_HOST;
  } catch {
    return false;
  }
}

/**
 * Spread onto an anchor: `<a href={href} {...linkAttrs(href)}>`.
 * Returns nothing for internal links and for mailto:, which should hand off to
 * the mail client in place rather than open a blank tab.
 */
export function linkAttrs(href: string | undefined) {
  return isExternal(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {};
}

/**
 * Same rule for hand-written HTML — the homepage bio is authored as a string,
 * so its anchors never pass through a component.
 */
export function externalLinksInHtml(html: string): string {
  return html.replace(/<a\s+href="(https?:\/\/[^"]+)"/gi, (match, href) =>
    isExternal(href) ? `${match} target="_blank" rel="noopener noreferrer"` : match
  );
}
