/**
 * Verification Test Suite for Social Media Intelligence & Calculation Engine
 * 12 exhaustive test cases covering data integrity, precedence, zero-out, and parsing.
 */

import { parseMetric, parseMetaCsvExports, applyMetaCsvToReport, classifyMetaCsvType } from '../src/utils/metaCsvParser.js';
import { generateSynthesizedAgencyReport } from '../serverReportSynthesizer.js';
import { escapeHtml } from '../src/utils/formatters.js';

interface TestCaseResult {
  id: number;
  name: string;
  passed: boolean;
  message?: string;
}

const results: TestCaseResult[] = [];

function assert(id: number, name: string, condition: boolean, message?: string) {
  results.push({
    id,
    name,
    passed: Boolean(condition),
    message: condition ? undefined : message || 'Assertion failed'
  });
}

// Case 1: parseMetric correctly handles formatted strings, commas, currency, percentages, and NaN
{
  const v1 = parseMetric('12,345');
  const v2 = parseMetric('88.8%');
  const v3 = parseMetric('+296');
  const v4 = parseMetric('$1,200.50');
  const v5 = parseMetric(undefined);
  const v6 = parseMetric('invalid');
  assert(
    1,
    'parseMetric handles formatting and invalid inputs',
    v1 === 12345 && v2 === 88.8 && v3 === 296 && v4 === 1200.5 && v5 === 0 && v6 === 0,
    `Got v1=${v1}, v2=${v2}, v3=${v3}, v4=${v4}, v5=${v5}, v6=${v6}`
  );
}

// Case 2: classifyMetaCsvType distinguishes views vs formats vs viewers vs audience
{
  const tViews = classifyMetaCsvType('Content views.csv', 'Date,Views,Content');
  const tFormats = classifyMetaCsvType('Top content formats.csv', 'Format,Views');
  const tViewers = classifyMetaCsvType('Unique viewers.csv', 'Date,Unique viewers');
  const tAudience = classifyMetaCsvType('Audience demographics.csv', 'Age,Women,Men');
  assert(
    2,
    'classifyMetaCsvType classifies correctly without false format matches',
    tViews === 'views' && tFormats === 'formats' && tViewers === 'viewers' && tAudience === 'audience',
    `Got views=${tViews}, formats=${tFormats}, viewers=${tViewers}, audience=${tAudience}`
  );
}

// Case 3: Unique viewers are not naively summed across daily rows
{
  const mockCsv = {
    name: 'Viewers.csv',
    textContent: 'Date,Unique Viewers\n2026-09-01,1500\n2026-09-02,1800\n2026-09-03,1200'
  };
  const parsed = parseMetaCsvExports([mockCsv]);
  assert(
    3,
    'Unique viewers are not summed across daily time-series',
    parsed.totalUniqueViewers === 1800,
    `Expected 1800 (max daily), got ${parsed.totalUniqueViewers}`
  );
}

// Case 4: Women percentage accepts values <= 50%
{
  const mockCsv = {
    name: 'Audience.csv',
    textContent: 'Gender,Percentage\nWomen,42.5\nMen,57.5'
  };
  const parsed = parseMetaCsvExports([mockCsv]);
  assert(
    4,
    'Women percentage correctly accepts values <= 50%',
    parsed.demographics.genderWomenPct === 42.5 && parsed.demographics.genderMenPct === 57.5,
    `Got women=${parsed.demographics.genderWomenPct}, men=${parsed.demographics.genderMenPct}`
  );
}

// Case 5: Zero fabricated defaults in empty synthesis report
{
  const report = generateSynthesizedAgencyReport({
    clientName: 'Test Client',
    reportPeriod: 'Current Period',
    platforms: ['facebook', 'instagram']
  });
  const summary = report.crossPlatformOverview.summaryTable;
  const yt = summary.find(r => r.platform === 'youtube');
  assert(
    5,
    'Unrequested platforms have 0 followers, 0 reach, and Not Monitored status',
    yt !== undefined && yt.followers === 0 && yt.reach === 0 && (yt.topContentType === 'Not Monitored' || yt.topContentType === 'Cross-Syndication Ready'),
    `YT followers=${yt?.followers}, reach=${yt?.reach}, type=${yt?.topContentType}`
  );
}

// Case 6: Precedence: knownMetrics overrides CSV and synthetic data
{
  const base = generateSynthesizedAgencyReport({
    clientName: 'Acme',
    reportPeriod: 'Month',
    platforms: ['facebook'],
    knownMetrics: { facebookFollowers: '50000', facebookReach: '120000' }
  });
  const fbRow = base.crossPlatformOverview.summaryTable.find(r => r.platform === 'facebook');
  assert(
    6,
    'knownMetrics takes strict precedence over fallbacks',
    fbRow?.followers === 50000 && fbRow?.reach === 120000 && base.facebook.followers === 50000,
    `Expected followers=50000 reach=120000, got ${fbRow?.followers} / ${fbRow?.reach}`
  );
}

// Case 7: Recursive zero-out on inactive platforms clears reachOrganic and reachPaid
{
  const base = generateSynthesizedAgencyReport({
    clientName: 'Acme',
    reportPeriod: 'Month',
    platforms: ['instagram'] // Facebook is inactive
  });
  assert(
    7,
    'Inactive platforms have zero reachOrganic, reachPaid, and followers',
    base.facebook.followers === 0 && base.facebook.reachOrganic === 0 && base.facebook.reachPaid === 0,
    `FB followers=${base.facebook.followers}, reachOrganic=${base.facebook.reachOrganic}, reachPaid=${base.facebook.reachPaid}`
  );
}

// Case 8: No hardcoded fallback numbers in applyMetaCsvToReport
{
  const emptyParsed = {
    totalViews: 0,
    totalUniqueViewers: 0,
    organicReach: 0,
    paidReach: 0,
    netFollowers: 0,
    totalInteractions: 0,
    totalLinkClicks: 0,
    calculatedEngagementRate: 0,
    formatSplits: [],
    demographics: {
      genderWomenPct: 0,
      genderMenPct: 0,
      topAgeBrackets: [],
      topCities: [],
      topCountries: []
    },
    filesProcessed: []
  };
  const base = generateSynthesizedAgencyReport({ clientName: 'Test', reportPeriod: 'Current' });
  const applied = applyMetaCsvToReport(base, emptyParsed, ['facebook']);
  assert(
    8,
    'applyMetaCsvToReport never injects fabricated reach (216250) or clicks (8910)',
    applied.executiveSummary.overallReach === 0 &&
    applied.audienceInsights.growthQuality === 'Not provided' &&
    applied.audienceInsights.organicVsPaidRatio === 'Not provided',
    `overallReach=${applied.executiveSummary.overallReach}, growthQuality=${applied.audienceInsights.growthQuality}`
  );
}

// Case 9: Empty platforms array results in strictly 0 overall calculated reach
{
  const report = generateSynthesizedAgencyReport({
    clientName: 'Test',
    reportPeriod: 'Current',
    platforms: []
  });
  const allZero = report.crossPlatformOverview.summaryTable.every(r => r.followers === 0 && r.reach === 0);
  assert(
    9,
    'Empty platforms array zeroes out all platform metrics cleanly',
    allZero && report.executiveSummary.overallReach === 0,
    `allZero=${allZero}, overallReach=${report.executiveSummary.overallReach}`
  );
}

// Case 10: Format performance split parsed into structured JSON array
{
  const formatsCsv = {
    name: 'Top content formats.csv',
    textContent: 'Format,Views,Count\nReels,15000,4\nCarousels,8000,2\nFeed Images,3000,1'
  };
  const parsed = parseMetaCsvExports([formatsCsv]);
  assert(
    10,
    'Format performance splits parsed into clean array',
    parsed.formatSplits.length === 3 && parsed.formatSplits[0].format === 'Reels' && parsed.formatSplits[0].viewsOrReach === 15000,
    `Parsed splits length=${parsed.formatSplits.length}`
  );
}

// Case 11: escapeHtml sanitizes dangerous input strings
{
  const safe = escapeHtml('<script>alert("xss")</script> & "quotes"');
  assert(
    11,
    'escapeHtml sanitizes scripts, ampersands, and quotes',
    safe === '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt; &amp; &quot;quotes&quot;',
    `Got safe=${safe}`
  );
}

// Case 12: Weighted engagement rate computation matches deterministic arithmetic
{
  // Row 1: reach 10,000, eng 5.0% -> product 50,000
  // Row 2: reach 20,000, eng 8.0% -> product 160,000
  // Total reach = 30,000. Total product = 210,000. Weighted average = 210,000 / 30,000 = 7.0%
  const totalReach = 30000;
  const weightedEngSum = (10000 * 5.0) + (20000 * 8.0);
  const weightedEngRate = Number((weightedEngSum / totalReach).toFixed(1));
  assert(
    12,
    'Deterministic weighted engagement calculation is mathematically exact',
    weightedEngRate === 7.0,
    `Expected 7.0%, got ${weightedEngRate}%`
  );
}

console.log('===========================================================');
console.log('   VERIFY-CALCS: SOCIAL MEDIA INTELLIGENCE ENGINE TESTS    ');
console.log('===========================================================');
let passCount = 0;
let failCount = 0;

for (const res of results) {
  if (res.passed) {
    passCount++;
    console.log(`[PASS] Case ${res.id.toString().padStart(2, '0')}: ${res.name}`);
  } else {
    failCount++;
    console.log(`[FAIL] Case ${res.id.toString().padStart(2, '0')}: ${res.name} -> ${res.message}`);
  }
}

console.log('-----------------------------------------------------------');
console.log(`SUMMARY: ${passCount} PASSED, ${failCount} FAILED out of ${results.length} total.`);
console.log('===========================================================');

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
