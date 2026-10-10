/**
 * Parses a metric the way a human would read it.
 * Handles: 12345, "12,500", "12.5K", "1.2M", "3.2%", "+296", "-45", "(45)", "R1 200", "$1,200", "1 200".
 * Returns a finite number, or null when the value is missing / not numeric.
 * It NEVER silently returns 0 for unparseable input; callers decide what "unknown" means.
 */
export function parseMetric(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value !== 'string') return null;

  let s = value.trim().replace(/\u2212/g, '-'); // unicode minus
  if (!s) return null;
  if (/^(n\/?a|none|null|undefined|not provided|not monitored|[-—–]+)$/i.test(s)) return null;

  let negative = false;
  if (/^\(.*\)$/.test(s)) {
    negative = true;
    s = s.slice(1, -1);
  }

  s = s.replace(/^(zar|usd|eur|gbp|[R$€£])\s*/i, ''); // leading currency
  s = s.replace(/[,\s]/g, '');                         // thousands separators
  s = s.replace(/%$/, '');                              // trailing percent

  const m = s.match(/^([+-]?)(\d*\.?\d+)([kmb])?$/i);
  if (!m) return null;

  let n = parseFloat(m[2]);
  const suffix = (m[3] || '').toLowerCase();
  if (suffix === 'k') n *= 1_000;
  else if (suffix === 'm') n *= 1_000_000;
  else if (suffix === 'b') n *= 1_000_000_000;

  if (m[1] === '-') n = -n;
  if (negative) n = -Math.abs(n);
  return Number.isFinite(n) ? n : null;
}

/** parseMetric, but unknown becomes 0. Use only where "unknown" and "zero" are meant to be the same. */
export function metricOrZero(value: unknown): number {
  return parseMetric(value) ?? 0;
}
