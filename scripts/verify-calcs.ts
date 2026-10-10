// Run with:  npx tsx scripts/verify-calcs.ts
import { parseMetric } from '../src/utils/parseMetric';
import { normalizePlatforms } from '../src/utils/platforms';
import { reconcileAndHarmonizeReport as reconcile } from '../src/utils/reconcile';
import { classifyMetaCsvType, parseMetaCsvExports, applyMetaCsvToReport, applyMetaCsvFilesToReport } from '../src/utils/metaCsvParser';
import { generateSynthesizedAgencyReport } from '../src/utils/reportSynthesizer';
import { formatNumber, escapeDeep } from '../src/utils/formatters';
import { detectPlatformFromFileName } from '../src/utils/fileUploadHelper';
import { saveReportToHistory, calculateMoMDelta } from '../src/utils/auditTools';

// minimal localStorage for node
const store: Record<string, string> = {};
(globalThis as any).localStorage = { getItem: (k: string) => store[k] ?? null, setItem: (k: string, v: string) => { store[k] = v; } };

let pass = 0, fail = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`[PASS] ${name}`); pass++; }
  catch (e: any) { console.log(`[FAIL] ${name} -> ${e.message}`); fail++; }
}
function eq(actual: any, expected: any, label = '') {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error(`${label} expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
}
const row = (p: string, o: any = {}) => ({ platform: p, platformLabel: p, followers: 0, followersDelta: 0, reach: 0, reachDelta: 0, engagementRate: 0, topContentType: 'x', totalPosts: 0, ...o });
const rowOf = (rep: any, p: string) => rep.crossPlatformOverview.summaryTable.find((r: any) => r.platform === p);

console.log('=== VERIFY-CALCS ===');

test('01 parseMetric formats', () => {
  eq([parseMetric('12,500'), parseMetric('45K'), parseMetric('1.2M'), parseMetric('3.2%'), parseMetric('+296'), parseMetric('(45)'), parseMetric('R1 200'), parseMetric('abc'), parseMetric('')],
     [12500, 45000, 1200000, 3.2, 296, -45, 1200, null, null]);
});
test('02 healthy case: reach 20,000 and weighted engagement 2.5', () => {
  const r = reconcile({ crossPlatformOverview: { summaryTable: [row('instagram', { followers: 1000, reach: 5000, engagementRate: 4 }), row('youtube', { followers: 200, reach: 15000, engagementRate: 2 })] },
    instagram: { followers: 1000, reach: 5000, engagementRate: 4 }, youtube: { subscribers: 200, views: 15000, engagementRate: 2 }, executiveSummary: {} }, ['instagram', 'youtube']);
  eq(r.executiveSummary.overallReach, 20000, 'reach'); eq(r.executiveSummary.overallEngagementRate, 2.5, 'eng');
});
test('03 zero-template table does NOT wipe real platform data', () => {
  const r = reconcile({ crossPlatformOverview: { summaryTable: [row('instagram')] }, instagram: { followers: 1000, reach: 5000, engagementRate: 4 }, executiveSummary: {} }, ['instagram']);
  eq(r.instagram.reach, 5000); eq(rowOf(r, 'instagram').reach, 5000); eq(r.executiveSummary.overallReach, 5000);
});
test('04 knownMetrics "12,500" lands in object AND row', () => {
  const r = reconcile({ crossPlatformOverview: { summaryTable: [row('instagram', { followers: 900, reach: 5000 })] }, instagram: { followers: 900, reach: 5000 }, executiveSummary: {} }, ['instagram'], { instagramFollowers: '12,500' });
  eq(r.instagram.followers, 12500); eq(rowOf(r, 'instagram').followers, 12500);
});
test('05 knownMetrics youtubeFollowers 777 beats existing subscribers 200', () => {
  const r = reconcile({ crossPlatformOverview: { summaryTable: [row('youtube', { followers: 200, reach: 1000 })] }, youtube: { subscribers: 200, followers: 200, views: 1000 }, executiveSummary: {} }, ['youtube'], { youtubeFollowers: '777' });
  eq(r.youtube.subscribers, 777); eq(rowOf(r, 'youtube').followers, 777);
});
test('06 AI string metrics ("1,200", "45K", "3.2%") are counted', () => {
  const r = reconcile({ crossPlatformOverview: { summaryTable: [row('instagram', { followers: '1,200', reach: '45K', engagementRate: '3.2%' })] }, executiveSummary: {} }, ['instagram']);
  eq(r.executiveSummary.overallReach, 45000); eq(r.executiveSummary.overallEngagementRate, 3.2);
});
test('07 empty platforms array means NONE (and undefined means all)', () => {
  eq(normalizePlatforms([]), []); eq(normalizePlatforms(undefined).length, 5);
  const r = reconcile({ crossPlatformOverview: { summaryTable: [row('tiktok', { followers: 5, reach: 5 })] }, tiktok: { followers: 5, videoViews: 5 }, executiveSummary: {} }, []);
  eq(r.executiveSummary.overallReach, 0);
});
test('08 inactive platform: recursive zero-out incl. fields the old list missed', () => {
  const r = reconcile({ crossPlatformOverview: { summaryTable: [row('facebook', { followers: 9, reach: 9 })] },
    facebook: { followers: 9, reachOrganic: 500, reachPaid: 100, pageVisitors: 40, profileVisits: 30, websiteTaps: 20, likes: 10, shares: 5, topPosts: [{ reach: 5 }], videoMetrics: { views: 8, commentary: 'fake' }, demographics: { topLocations: ['x'], summary: 'fake' } }, executiveSummary: {} }, ['instagram']);
  const f = r.facebook;
  eq([f.reachOrganic, f.reachPaid, f.pageVisitors, f.profileVisits, f.websiteTaps, f.likes, f.shares, f.topPosts, f.videoMetrics.views, f.demographics.topLocations], [0, 0, 0, 0, 0, 0, 0, [], 0, []]);
  eq(rowOf(r, 'facebook').topContentType, 'Not Monitored');
});
test('09 stale overall deltas are not left over from the AI', () => {
  const r = reconcile({ crossPlatformOverview: { summaryTable: [row('instagram', { followers: 10, reach: 1000, engagementRate: 4 })] }, instagram: { followers: 10, reach: 1000, engagementRate: 4 },
    executiveSummary: { overallReach: 99999, overallReachPrevDelta: 12.5, overallReachYoYDelta: 7, overallEngagementPrevDelta: 0.8 } }, ['instagram']);
  eq([r.executiveSummary.overallReach, r.executiveSummary.overallReachPrevDelta, r.executiveSummary.overallReachYoYDelta, r.executiveSummary.overallEngagementPrevDelta], [1000, 0, 0, 0]);
});
test('10 overall delta is derived from per-platform deltas when all are present', () => {
  const r = reconcile({ crossPlatformOverview: { summaryTable: [row('instagram', { followers: 1, reach: 1100, reachDelta: 10 }), row('youtube', { followers: 1, reach: 2200, reachDelta: 10 })] }, instagram: { followers: 1, reach: 1100 }, youtube: { followers: 1, views: 2200 }, executiveSummary: {} }, ['instagram', 'youtube']);
  eq(r.executiveSummary.overallReachPrevDelta, 10);
});
test('11 classify: "Page"/"Average" no longer mis-detected as audience', () => {
  eq(classifyMetaCsvType('Follows.csv', 'Date,Page follows,Page unfollows'), 'follows');
  eq(classifyMetaCsvType('Reach.csv', 'Date,Average reach'), 'viewers');
  eq(classifyMetaCsvType('Views.csv', 'Date,Page views'), 'views');
  eq(classifyMetaCsvType('Top content formats.csv', 'Format,Views,Count'), 'formats');
  eq(classifyMetaCsvType('Export.csv', 'Age,Women,Men'), 'audience');
});
test('12 daily unique viewers are NOT summed (warns instead)', () => {
  const m = parseMetaCsvExports([{ name: 'Viewers.csv', textContent: 'Date,Viewers\n2026-09-01,400\n2026-09-02,450\n2026-09-03,420\n' }]);
  eq(m.totalUniqueViewers, 0); if (!m.warnings?.some((w) => /cannot be summed/.test(w))) throw new Error('no warning');
});
test('13 views are summed from the views column only (dates ignored)', () => {
  const m = parseMetaCsvExports([{ name: 'Views.csv', textContent: 'Date,Primary\n2026-09-01,1000\n2026-09-02,1500\n' }]);
  eq(m.totalViews, 2500);
});
test('14 follows: net = follows - unfollows', () => {
  const m = parseMetaCsvExports([{ name: 'Follows.csv', textContent: 'Date,Page follows,Page unfollows\n2026-09-01,50,10\n2026-09-02,30,5\n' }]);
  eq(m.netFollowers, 65);
});
test('15 audience: <=50% women is parsed; cities not hardcoded', () => {
  const m = parseMetaCsvExports([{ name: 'Audience.csv', textContent: 'Gender,Percent\nWomen,40\nMen,60\nAge,Percent\n25-34,30.5\nTop cities,Percent\nDurban,12\n' }]);
  eq([m.demographics.genderWomenPct, m.demographics.genderMenPct, m.demographics.topAgeBrackets[0], m.demographics.topCities[0].city], [40, 60, { bracket: '25-34', percentage: 30.5 }, 'Durban']);
});
test('16 TSV with unquoted "1,234" values is parsed with the right delimiter', () => {
  const m = parseMetaCsvExports([{ name: 'Views.csv', textContent: 'Date\tPrimary\n2026-09-01\t1,234\n2026-09-02\t1,000\n' }]);
  eq(m.totalViews, 2234);
});
test('17 CSV with only 10 views: NOTHING fabricated anywhere', () => {
  const base = generateSynthesizedAgencyReport({ clientName: 'T', reportPeriod: 'P', platforms: ['facebook', 'instagram'] });
  const { report } = applyMetaCsvFilesToReport(base, [{ name: 'Views.csv', textContent: 'Date,Primary\n2026-09-01,10\n', platform: 'facebook' }], ['facebook', 'instagram']);
  const out = reconcile(report, ['facebook', 'instagram'], {});
  const blob = JSON.stringify(out);
  for (const bad of ['34200', '18450', '8910', '216250', '88.8', '79.6', 'Accra', 'Lagos', '89.2', '0.68', '0.32', '3.4% CTR']) if (blob.includes(bad)) throw new Error(`found ${bad}`);
  eq(out.facebook.followers, 0); eq(out.executiveSummary.overallReach, 10); eq(out.instagram.reach, 0);
});
test('18 untagged Meta CSV with BOTH FB+IG active is NOT split (appendix only)', () => {
  const base = generateSynthesizedAgencyReport({ clientName: 'T', reportPeriod: 'P', platforms: ['facebook', 'instagram'] });
  const { report } = applyMetaCsvFilesToReport(base, [{ name: 'Views.csv', textContent: 'Date,Primary\n2026-09-01,5000\n' }], ['facebook', 'instagram']);
  const out = reconcile(report, ['facebook', 'instagram'], {});
  eq(out.executiveSummary.overallReach, 0); if (!Array.isArray(out.appendixRawMetrics) || !out.appendixRawMetrics.some((a: any) => /Meta \(Facebook \+ Instagram combined\)/.test(a.metric))) throw new Error('no combined appendix line');
});
test('19 views used as reach are flagged in dataQuality', () => {
  const base = generateSynthesizedAgencyReport({ clientName: 'T', reportPeriod: 'P', platforms: ['facebook'] });
  const { report } = applyMetaCsvFilesToReport(base, [{ name: 'Views.csv', textContent: 'Date,Primary\n2026-09-01,5000\n', platform: 'facebook' }], ['facebook']);
  const out = reconcile(report, ['facebook'], {});
  if (!out.dataQuality.warnings.some((w: string) => /content views, not unique viewers/.test(w))) throw new Error('not flagged');
});
test('20 synthesizer: no invented appendix numbers, strict known-metric parsing', () => {
  const r = generateSynthesizedAgencyReport({ clientName: 'T', reportPeriod: 'P', platforms: ['instagram'], knownMetrics: { instagramFollowers: '12.5K', instagramReach: '45,000' } });
  eq(r.instagram.followers, 12500); eq(r.instagram.reach, 45000);
  const blob = JSON.stringify(r.appendixRawMetrics); if (/\d{2,}/.test(blob.replace(/Net Inbound.*/, ''))) throw new Error('numbers in appendix: ' + blob);
});
test('21 formatNumber(999999) = "1M"; others unchanged', () => {
  eq([formatNumber(999999), formatNumber(999949), formatNumber(12500), formatNumber(1500000), formatNumber(950)], ['1M', '999.9K', '12.5K', '1.5M', '950']);
});
test('22 MoM delta only compares a client with its own earlier report', () => {
  saveReportToHistory({ id: 'a1', clientName: 'A', reportPeriod: 'Aug', executiveSummary: { overallReach: 1000 } });
  saveReportToHistory({ id: 'b1', clientName: 'B', reportPeriod: 'Aug', executiveSummary: { overallReach: 9000 } });
  saveReportToHistory({ id: 'a2', clientName: 'A', reportPeriod: 'Sep', executiveSummary: { overallReach: 1500 } });
  eq(calculateMoMDelta(1500, 'A'), { deltaPercent: 50, hasHistory: true });
  eq(calculateMoMDelta(9000, 'B').hasHistory, false);
  saveReportToHistory({ id: 'a2', clientName: 'A', reportPeriod: 'Sep', executiveSummary: { overallReach: 1500 } }); // re-save
  eq(JSON.parse(store['latsky_audit_history']).length, 3, 'no duplicate on re-save');
});
test('23 filename platform detection uses whole words', () => {
  eq([detectPlatformFromFileName('Link clicks.csv'), detectPlatformFromFileName('Likes.csv'), detectPlatformFromFileName('Meta Business Suite views.csv'),
      detectPlatformFromFileName('fb_views.csv'), detectPlatformFromFileName('IG insights.png'), detectPlatformFromFileName('li analytics.png')],
     ['general', 'general', 'general', 'facebook', 'instagram', 'linkedin']);
});
test('24 escapeDeep neutralises HTML in nested strings', () => {
  const o: any = escapeDeep({ clientName: '<img src=x onerror=alert(1)>', list: ['a&b', "it's"], n: 5 });
  eq(o, { clientName: '&lt;img src=x onerror=alert(1)&gt;', list: ['a&amp;b', 'it&#39;s'], n: 5 });
});
test('25 end-to-end: known metrics + one CSV + reconcile give consistent totals', () => {
  const base = generateSynthesizedAgencyReport({ clientName: 'T', reportPeriod: 'P', platforms: ['instagram', 'youtube'], knownMetrics: { youtubeSubscribers: '2,000', youtubeReach: '30K', instagramFollowers: '1,500' } });
  const { report } = applyMetaCsvFilesToReport(base, [
    { name: 'Viewers.csv', textContent: 'Total viewers\n10,000\n', platform: 'instagram' },
    { name: 'Interactions.csv', textContent: 'Date,Primary\n2026-09-01,300\n2026-09-02,200\n', platform: 'instagram' }], ['instagram', 'youtube']);
  const out = reconcile(report, ['instagram', 'youtube'], { youtubeSubscribers: '2,000', youtubeReach: '30K', instagramFollowers: '1,500' });
  eq([out.instagram.followers, out.instagram.reach, out.instagram.engagementRate, out.youtube.subscribers, out.youtube.views], [1500, 10000, 5, 2000, 30000]);
  eq(out.executiveSummary.overallReach, 40000);
  eq(out.executiveSummary.overallEngagementRate, 5, 'weighted over platforms that reported engagement');
});

console.log(`\nSUMMARY: ${pass} PASSED, ${fail} FAILED out of ${pass + fail}`);
process.exit(fail ? 1 : 0);
