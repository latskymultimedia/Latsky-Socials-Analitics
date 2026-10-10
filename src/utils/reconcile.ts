import { parseMetric } from './parseMetric';
import { VALID_PLATFORMS, PLATFORM_LABELS, normalizePlatforms, getReach, setReach } from './platforms';

/**
 * Single source of truth for report maths.
 *
 * Source precedence for every metric:  user-entered knownMetrics  >  platform detail object (CSV / AI)  >  summary-table row  >  0.
 * Order of operations: (1) normalise rows  (2) sync each platform  (3) clear inactive / data-less platforms  (4) compute totals.
 * Nothing in here invents a number.
 */

const NUM_ROW_FIELDS = ['followers', 'followersDelta', 'reach', 'reachDelta', 'engagementRate', 'totalPosts'];

function zeroDeep(node: any): any {
  if (Array.isArray(node)) return [];
  if (typeof node === 'number') return 0;
  if (node && typeof node === 'object') {
    for (const key of Object.keys(node)) {
      if (key === 'growthPlaybook') { node[key] = null; continue; }
      const v = node[key];
      if (typeof v === 'string' && /insight|commentary|summary/i.test(key)) {
        node[key] = 'Not monitored for this period.';
      } else if (v && typeof v === 'object') {
        node[key] = zeroDeep(v);
      } else if (typeof v === 'number') {
        node[key] = 0;
      }
    }
  }
  return node;
}

function firstKnown(known: Record<string, any>, keys: string[]): number | null {
  for (const k of keys) {
    if (known[k] !== undefined && known[k] !== '') {
      const n = parseMetric(known[k]);
      if (n !== null) return n;
    }
  }
  return null;
}

export function reconcileAndHarmonizeReport(
  report: any,
  requestedPlatforms?: string[],
  knownMetrics: Record<string, any> = {}
) {
  if (!report) return report;
  const known = knownMetrics || {};
  const active = normalizePlatforms(requestedPlatforms);
  const isActive = (p: string) => active.includes(String(p || '').toLowerCase());

  const dq = (report.dataQuality = report.dataQuality || { isFallback: false, warnings: [], sources: [] });
  dq.warnings = Array.isArray(dq.warnings) ? dq.warnings : [];
  dq.sources = Array.isArray(dq.sources) ? dq.sources : [];
  const warn = (msg: string) => { if (!dq.warnings.includes(msg)) dq.warnings.push(msg); };
  const addSource = (s: string) => { if (!dq.sources.includes(s)) dq.sources.push(s); };

  if (!report.crossPlatformOverview) report.crossPlatformOverview = {};
  const table: any[] = Array.isArray(report.crossPlatformOverview.summaryTable)
    ? report.crossPlatformOverview.summaryTable.filter((r: any) => r && r.platform)
    : [];

  // (1) one normalised row per platform (de-duplicated, numeric fields parsed with parseMetric)
  const rows: Record<string, any> = {};
  for (const plat of VALID_PLATFORMS) {
    const found = table.filter((r) => String(r.platform).toLowerCase() === plat);
    // merge duplicate rows: keep the one with the most data
    found.sort((a, b) => (parseMetric(b.reach) ?? 0) + (parseMetric(b.followers) ?? 0) - ((parseMetric(a.reach) ?? 0) + (parseMetric(a.followers) ?? 0)));
    const row = found[0] || {
      platform: plat, platformLabel: PLATFORM_LABELS[plat], followers: 0, followersDelta: 0, reach: 0,
      reachDelta: 0, engagementRate: 0, topContentType: 'Not Monitored', totalPosts: 0
    };
    for (const f of NUM_ROW_FIELDS) row[f] = parseMetric(row[f]) ?? 0;
    row.platform = plat;
    row.platformLabel = row.platformLabel || PLATFORM_LABELS[plat];
    rows[plat] = row;
  }

  // (2) + (3) sync, then clear
  for (const plat of VALID_PLATFORMS) {
    const row = rows[plat];
    const obj = report[plat];

    if (!isActive(plat)) {
      if (obj && typeof obj === 'object') report[plat] = zeroDeep(obj);
      Object.assign(row, { followers: 0, followersDelta: 0, reach: 0, reachDelta: 0, engagementRate: 0, totalPosts: 0, topContentType: 'Not Monitored' });
      continue;
    }

    // --- followers
    const knownFollowers = firstKnown(known, [`${plat}Subscribers`, `${plat}Followers`]);
    const objFollowers = obj ? (parseMetric(obj.subscribers) || parseMetric(obj.followers) || 0) : 0;
    let followers = knownFollowers ?? (objFollowers > 0 ? objFollowers : row.followers);
    if (knownFollowers !== null) addSource('user');

    // --- net growth
    const knownGrowth = firstKnown(known, [`${plat}NetGrowth`]);
    const objGrowth = obj ? (parseMetric(obj.netGrowth) ?? 0) : 0;
    const netGrowth = knownGrowth ?? (objGrowth !== 0 ? objGrowth : row.followersDelta);
    if (knownGrowth !== null) addSource('user');

    // --- reach
    const knownReach = firstKnown(known, [`${plat}Reach`]);
    const objReach = getReach(plat, obj);
    const reach = knownReach ?? (objReach > 0 ? objReach : row.reach);
    if (knownReach !== null) addSource('user');

    // --- engagement (percent points)
    const objEng = obj ? (parseMetric(obj.engagementRate) ?? 0) : 0;
    const engagement = objEng > 0 ? objEng : row.engagementRate;
    if (engagement > 100) warn(`${PLATFORM_LABELS[plat]} engagement rate (${engagement}) is above 100%. Check the source value.`);
    if (engagement > 0 && engagement < 1) warn(`${PLATFORM_LABELS[plat]} engagement rate (${engagement}) looks like a fraction rather than percent points. Check the source value.`);

    // write back to detail object ...
    if (obj && typeof obj === 'object') {
      obj.followers = followers;
      if (obj.subscribers !== undefined || plat === 'youtube') obj.subscribers = followers;
      obj.netGrowth = netGrowth;
      if (reach > 0 && (plat !== 'facebook' || reach !== objReach)) setReach(plat, obj, reach);
      if (obj.engagementRate !== undefined || engagement > 0) obj.engagementRate = engagement;
    }
    // ... and to the summary row
    row.followers = followers;
    row.followersDelta = netGrowth;
    row.reach = reach;
    row.engagementRate = engagement;
    if (row.topContentType === 'Not Monitored') row.topContentType = 'Awaiting Data Export';

    // active but nothing supplied -> clear any template/AI bleed in the detail section
    if (followers === 0 && reach === 0) {
      if (obj && typeof obj === 'object') report[plat] = zeroDeep(obj);
      warn(`${PLATFORM_LABELS[plat]} is selected but no followers or reach were supplied. Detail section left empty.`);
    }
  }

  report.crossPlatformOverview.summaryTable = VALID_PLATFORMS.map((p) => rows[p]);

  // (4) totals: deterministic, from active rows only
  if (!report.executiveSummary) report.executiveSummary = {};
  const activeRows = VALID_PLATFORMS.filter(isActive).map((p) => rows[p]).filter((r) => r.followers > 0 || r.reach > 0);

  const totalReach = activeRows.reduce((s, r) => s + r.reach, 0);
  report.executiveSummary.overallReach = totalReach;

  // reach-weighted engagement, over platforms that actually reported an engagement rate
  const withEng = activeRows.filter((r) => r.reach > 0 && r.engagementRate > 0);
  const engWeight = withEng.reduce((s, r) => s + r.reach, 0);
  report.executiveSummary.overallEngagementRate = engWeight > 0
    ? Number((withEng.reduce((s, r) => s + r.reach * r.engagementRate, 0) / engWeight).toFixed(1))
    : 0;
  if (activeRows.some((r) => r.reach > 0 && r.engagementRate === 0) && engWeight > 0) {
    warn('Some platforms have reach but no engagement rate. They are excluded from the weighted engagement rate.');
  }

  // overall deltas must agree with the recomputed total, so derive them from per-platform deltas or clear them
  const reaching = activeRows.filter((r) => r.reach > 0);
  if (reaching.length > 0 && reaching.every((r) => r.reachDelta !== 0 && r.reachDelta > -100)) {
    const prev = reaching.reduce((s, r) => s + r.reach / (1 + r.reachDelta / 100), 0);
    report.executiveSummary.overallReachPrevDelta = prev > 0 ? Number((((totalReach - prev) / prev) * 100).toFixed(1)) : 0;
  } else {
    report.executiveSummary.overallReachPrevDelta = 0;
  }
  report.executiveSummary.overallReachYoYDelta = 0;
  report.executiveSummary.overallEngagementPrevDelta = 0;

  // keep only active-platform content
  if (Array.isArray(report.contentPerformance?.topPostsAllPlatforms)) {
    report.contentPerformance.topPostsAllPlatforms = report.contentPerformance.topPostsAllPlatforms.filter(
      (p: any) => p && p.platform && isActive(p.platform)
    );
  }
  if (Array.isArray(report.recommendations?.actionableItems)) {
    report.recommendations.actionableItems = report.recommendations.actionableItems.filter(
      (item: any) => !item.platform || isActive(String(item.platform))
    );
  }
  return report;
}
