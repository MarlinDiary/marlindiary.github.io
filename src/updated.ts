import { execSync } from 'node:child_process';

/**
 * When the site last changed, for the line in the footer.
 *
 * Taken from the last commit rather than the build clock: re-running a
 * workflow, or rebuilding locally, would otherwise advance the date while
 * nothing had actually changed. A commit date only moves when content does.
 *
 * `actions/checkout` clones at depth 1, which is still enough for `-1`.
 * Falls back to the build time outside a git checkout.
 */
function lastChanged(): Date {
  try {
    const iso = execSync('git log -1 --format=%cI', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    const date = new Date(iso);
    if (!Number.isNaN(date.valueOf())) return date;
  } catch {
    // Not a git checkout, or git is unavailable.
  }
  return new Date();
}

export const siteUpdated = lastChanged();

/**
 * Month and year only. To the day it reads like a changelog entry and invites
 * the reader to work out how stale the site is; the month is enough to answer
 * the only question being asked, which is whether anyone is still here.
 */
export const siteUpdatedLabel = new Intl.DateTimeFormat('en-NZ', {
  month: 'long',
  year: 'numeric',
}).format(siteUpdated);
