import { parseMetric } from './parseMetric';

/**
 * ONE definition of the headline numbers. Used by the server (reconcile), the browser fallback, and the UI cards,
 * so the executive summary, the cross-platform table and the exports can never disagree.
 */
export interface SummaryRowLike {
  platform?: string;
  followers?: unknown;
  followersDelta?: unknown;
  reach?: unknown;
  reachDelta?: unknown;
  engagementRate?: unknown;
}

export interface SummaryTotals {
  /** Sum of platform reach figures. NOT de-duplicated (the same person can follow several platforms). */
  reach: number;
  followers: number;
  netGrowth: number;
  /** Reach-weighted engagement rate (percent points), over platforms that actually reported one. */
  engagementRate: number;
  /** Period-on-period reach change in %, derived from per-platform deltas. null = cannot be computed. */
  reachMoM: number | null;
  /** True when some platform has reach but no engagement rate (it is left out of the weighted rate). */
  engagementGaps: boolean;
}

const n = (v: unknown) => parseMetric(v) ?? 0;

export function computeSummaryTotals(rows: SummaryRowLike[], activePlatforms?: string[]): SummaryTotals {
  const active = (activePlatforms ? rows.filter((r) => activePlatforms.includes(String(r.platform))) : rows)
    .map((r) => ({ followers: n(r.followers), followersDelta: n(r.followersDelta), reach: n(r.reach), reachDelta: n(r.reachDelta), eng: n(r.engagementRate) }))
    .filter((r) => r.followers > 0 || r.reach > 0);

  const reach = active.reduce((s, r) => s + r.reach, 0);
  const followers = active.reduce((s, r) => s + r.followers, 0);
  const netGrowth = active.reduce((s, r) => s + r.followersDelta, 0);

  const withEng = active.filter((r) => r.reach > 0 && r.eng > 0);
  const engWeight = withEng.reduce((s, r) => s + r.reach, 0);
  const engagementRate = engWeight > 0
    ? Number((withEng.reduce((s, r) => s + r.reach * r.eng, 0) / engWeight).toFixed(1))
    : 0;
  const engagementGaps = engWeight > 0 && active.some((r) => r.reach > 0 && r.eng === 0);

  // Overall MoM only when EVERY platform with reach supplied a (non-zero) delta. Averaging deltas, or counting
  // platforms with no data as 0%, would be wrong.
  const reaching = active.filter((r) => r.reach > 0);
  let reachMoM: number | null = null;
  if (reaching.length > 0 && reaching.every((r) => r.reachDelta !== 0 && r.reachDelta > -100)) {
    const prev = reaching.reduce((s, r) => s + r.reach / (1 + r.reachDelta / 100), 0);
    if (prev > 0) reachMoM = Number((((reach - prev) / prev) * 100).toFixed(1));
  }

  return { reach, followers, netGrowth, engagementRate, reachMoM, engagementGaps };
}
