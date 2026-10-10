/**
 * Meta CSV Parser & Aggregator
 *
 * Reads Meta Business Suite exports (Views, Viewers/Reach, Follows, Interactions, Link clicks, Content formats, Audience).
 * Rules: header-based columns only, never sums unique-viewer time series, never invents a number.
 * A metric that cannot be read is left at 0 and a warning is recorded instead.
 */
import { parseMetric } from './parseMetric';
import { PLATFORM_LABELS, isPlatformActive, normalizePlatforms } from './platforms';

export interface ParsedFormatSplit {
  format: string;
  viewsOrReach: number;
  percentage?: number;
  count?: number;
  engagementRate?: number;
}

export interface ParsedDemographics {
  genderWomenPct: number;
  genderMenPct: number;
  topAgeBrackets: { bracket: string; percentage: number }[];
  topCities: { city: string; percentage?: number }[];
  topCountries: { country: string; percentage?: number }[];
}

export interface MetaAggregatedMetrics {
  totalViews: number;
  totalUniqueViewers: number;
  organicReach: number;
  paidReach: number;
  netFollowers: number;
  totalInteractions: number;
  totalLinkClicks: number;
  calculatedEngagementRate: number;
  formatSplits: ParsedFormatSplit[];
  demographics: ParsedDemographics;
  filesProcessed: string[];
  warnings?: string[];
}

export type MetaCsvType = 'views' | 'viewers' | 'follows' | 'interactions' | 'link_clicks' | 'formats' | 'audience' | 'unknown';

/** Kept for backwards compatibility. Unknown / unparseable -> 0. */
export function parseCleanNumber(val: any): number {
  return parseMetric(val) ?? 0;
}

function emptyMetrics(): MetaAggregatedMetrics {
  return {
    totalViews: 0, totalUniqueViewers: 0, organicReach: 0, paidReach: 0, netFollowers: 0,
    totalInteractions: 0, totalLinkClicks: 0, calculatedEngagementRate: 0, formatSplits: [],
    demographics: { genderWomenPct: 0, genderMenPct: 0, topAgeBrackets: [], topCities: [], topCountries: [] },
    filesProcessed: [], warnings: []
  };
}

/** A line that is just one number with thousands separators ("10,000" / "1,234,567.5") is a single cell, not a CSV row. */
const isThousandsOnly = (line: string) => /^\s*[+-]?\d{1,3}(,\d{3})+(\.\d+)?\s*%?\s*$/.test(line);

/** CSV/TSV -> rows. Detects the delimiter once per file, handles quotes, "" escapes and a leading "sep=" line. */
export function parseCsvToRows(rawText: string): string[][] {
  if (!rawText) return [];
  const lines = rawText.replace(/^\uFEFF/, '').split(/\r?\n/).filter((l) => l.trim() !== '');
  if (lines.length === 0) return [];

  let delimiter: string | null = null;
  const sepMatch = lines[0].match(/^sep=(.)$/i);
  if (sepMatch) { delimiter = sepMatch[1]; lines.shift(); }

  if (!delimiter) {
    const sample = lines.slice(0, 10).join('\n');
    const count = (ch: string) => {
      let inQ = false, n = 0;
      for (const l of sample.split('\n')) {
        if (ch === ',' && isThousandsOnly(l)) continue;
        for (const c of l) { if (c === '"') inQ = !inQ; else if (c === ch && !inQ) n++; }
      }
      return n;
    };
    const candidates = [',', '\t', ';'].map((d) => [d, count(d)] as const).sort((a, b) => b[1] - a[1]);
    delimiter = candidates[0][1] > 0 ? candidates[0][0] : ',';
  }

  const rows: string[][] = [];
  for (const line of lines) {
    if (delimiter === ',' && isThousandsOnly(line)) { rows.push([line.trim()]); continue; }
    const row: string[] = [];
    let cell = '';
    let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQ && line[i + 1] === '"') { cell += '"'; i++; } else inQ = !inQ;
      } else if (ch === delimiter && !inQ) {
        row.push(cell.trim()); cell = '';
      } else cell += ch;
    }
    row.push(cell.trim());
    rows.push(row);
  }
  return rows;
}

/** Classifies a Meta export from its file name first, then from whole-word header matches. */
export function classifyMetaCsvType(fileName: string, firstFewLines: string): MetaCsvType {
  const name = (fileName || '').toLowerCase().replace(/[_\-.]+/g, ' ');
  const head = (firstFewLines || '').toLowerCase();

  if (/format/.test(name)) return 'formats';
  if (/audience|demographic/.test(name)) return 'audience';
  if (/link click|outbound|website tap|clicks/.test(name)) return 'link_clicks';
  if (/viewer|reach/.test(name)) return 'viewers';
  if (/\bviews?\b|impression/.test(name)) return 'views';
  if (/follow/.test(name)) return 'follows';
  if (/interaction|engagement/.test(name)) return 'interactions';

  if (/\b(content|post) formats?\b/.test(head)) return 'formats';
  if (/\b(women|men|female|male|cities|city|countries|country|age)\b/.test(head)) return 'audience';
  if (/\b(link clicks?|outbound clicks?|website taps?)\b/.test(head)) return 'link_clicks';
  if (/\b(unique viewers|viewers|accounts reached|reach)\b/.test(head)) return 'viewers';
  if (/\b(views|impressions)\b/.test(head)) return 'views';
  if (/\b(follows|unfollows|followers)\b/.test(head)) return 'follows';
  if (/\b(interactions|likes|comments|shares|reactions|engagement)\b/.test(head)) return 'interactions';
  return 'unknown';
}

// ---------------------------------------------------------------- table helpers

interface Table { headers: string[]; data: string[][]; totals: string[] | null; }

function readTable(rows: string[][]): Table {
  // header = first row with 2+ non-empty cells whose second cell is not numeric (skips "Views" style title rows)
  let h = rows.findIndex((r) => r.filter((c) => c !== '').length >= 2 && parseMetric(r[1]) === null);
  if (h === -1) h = 0;
  const headers = (rows[h] || []).map((c) => c.toLowerCase());
  const data: string[][] = [];
  let totals: string[] | null = null;
  for (const r of rows.slice(h + 1)) {
    if (/^total\b/i.test(r[0] || '')) totals = r;
    else data.push(r);
  }
  return { headers, data, totals };
}

const notDate = (hd: string) => !/^(date|day|time|week|month)$/.test(hd);

function colIndexes(t: Table, pattern: RegExp): number[] {
  return t.headers.map((hd, i) => (notDate(hd) && pattern.test(hd) ? i : -1)).filter((i) => i >= 0);
}

function sumCol(t: Table, i: number): number {
  return t.data.reduce((s, r) => s + (parseMetric(r[i]) ?? 0), 0);
}

/** Preferred columns: exact "primary"/"total"/metric-name columns; otherwise all matching columns. 2-column files use column 1. */
function pickColumns(t: Table, pattern: RegExp, exact: RegExp): number[] {
  const matches = colIndexes(t, pattern);
  const exacts = matches.filter((i) => exact.test(t.headers[i]));
  if (exacts.length > 0) return exacts;
  if (matches.length > 0) return matches;
  if (t.headers.length === 2) return [1];
  return [];
}

function metricFromTable(t: Table, pattern: RegExp, exact: RegExp): number {
  const cols = pickColumns(t, pattern, exact);
  if (cols.length === 0) return 0;
  if (t.totals) {
    const fromTotals = cols.reduce((s, i) => s + (parseMetric(t.totals![i]) ?? 0), 0);
    if (fromTotals !== 0) return fromTotals;
  }
  return cols.reduce((s, i) => s + sumCol(t, i), 0);
}

// ---------------------------------------------------------------- main ingestion

export function parseMetaCsvExports(
  files: Array<{ name: string; textContent?: string; dataUrl?: string; platform?: string }>
): MetaAggregatedMetrics {
  const result = emptyMetrics();
  const warnings = result.warnings!;

  for (const file of files || []) {
    let text = file.textContent || '';
    if (!text && file.dataUrl && file.dataUrl.includes(',')) {
      const [meta, payload] = [file.dataUrl.slice(0, file.dataUrl.indexOf(',')), file.dataUrl.slice(file.dataUrl.indexOf(',') + 1)];
      try {
        if (/;base64/i.test(meta)) {
          text = typeof Buffer !== 'undefined'
            ? Buffer.from(payload, 'base64').toString('utf-8')
            : decodeURIComponent(escape(atob(payload)));
        } else {
          text = decodeURIComponent(payload); // percent-encoded text/csv data URL
        }
      } catch { text = ''; }
    }
    if (!text) continue;

    const rows = parseCsvToRows(text);
    if (rows.length === 0) continue;

    const fileType = classifyMetaCsvType(file.name, rows.slice(0, 5).map((r) => r.join(' ')).join(' '));
    result.filesProcessed.push(`${file.name} (${fileType})`);
    if (fileType === 'unknown') { warnings.push(`${file.name}: file type not recognised, skipped.`); continue; }

    const t = readTable(rows);

    if (fileType === 'views') {
      const v = metricFromTable(t, /view|impression/, /^(total )?(content )?(views|impressions)$|^primary$|^total$/);
      if (v > 0) result.totalViews = Math.max(result.totalViews, v);
      else warnings.push(`${file.name}: no readable views column.`);
    }

    if (fileType === 'viewers') {
      // Unique viewers are NOT additive across days. Use a period total if the file has one; otherwise do not sum.
      const cols = pickColumns(t, /viewer|reach|accounts/, /^(unique )?(viewers|reach)$|^primary$|^total$/);
      let total = 0;
      if (t.totals && cols.length) total = parseMetric(t.totals[cols[0]]) ?? 0;
      else if (cols.length && t.data.length === 1) total = parseMetric(t.data[0][cols[0]]) ?? 0;
      if (total > 0) result.totalUniqueViewers = Math.max(result.totalUniqueViewers, total);
      else if (cols.length) warnings.push(`${file.name}: contains daily unique viewers, which cannot be summed into a period total. Enter period reach manually or upload the period-total export.`);

      // organic / paid split (used as a ratio only)
      const oc = colIndexes(t, /organic/);
      const pc = colIndexes(t, /paid/);
      if (oc.length && pc.length) {
        result.organicReach = oc.reduce((s, i) => s + sumCol(t, i), 0);
        result.paidReach = pc.reduce((s, i) => s + sumCol(t, i), 0);
      } else {
        for (const r of t.data.concat(t.totals ? [t.totals] : [])) {
          const label = (r[0] || '').toLowerCase();
          const nums = r.slice(1).map((c) => parseMetric(c) ?? 0);
          if (/organic/.test(label)) result.organicReach = Math.max(result.organicReach, ...nums);
          else if (/paid/.test(label)) result.paidReach = Math.max(result.paidReach, ...nums);
        }
      }
    }

    if (fileType === 'follows') {
      const net = colIndexes(t, /^net\b|net follow/);
      if (net.length) {
        result.netFollowers = metricFromTable(t, /^net\b|net follow/, /^net follows?$|^net followers$/);
      } else {
        const gained = pickColumns(t, /(^|\s)follows?$|gained|new follow/, /(^|\s)follows?$/);
        const lost = colIndexes(t, /unfollow|lost/);
        if (gained.length === 1 && gained[0] === 1 && t.headers.length === 2) {
          result.netFollowers = sumCol(t, 1);
        } else if (gained.length) {
          const g = gained.reduce((s, i) => s + sumCol(t, i), 0);
          const l = lost.reduce((s, i) => s + sumCol(t, i), 0);
          result.netFollowers = g - l;
        } else warnings.push(`${file.name}: no readable follows column.`);
      }
    }

    if (fileType === 'interactions') {
      const v = metricFromTable(t, /interaction|like|comment|share|save|reaction|engagement/, /^(total )?interactions$|^primary$|^total$/);
      if (v > 0) result.totalInteractions = v; else warnings.push(`${file.name}: no readable interactions column.`);
    }

    if (fileType === 'link_clicks') {
      const v = metricFromTable(t, /click|tap/, /^(total )?(link |outbound )?clicks$|^primary$|^total$/);
      if (v > 0) result.totalLinkClicks = v; else warnings.push(`${file.name}: no readable clicks column.`);
    }

    if (fileType === 'formats') {
      const valCol = (() => { const c = colIndexes(t, /view|reach|impression/); return c.length ? c[0] : -1; })();
      const cntCol = (() => { const c = colIndexes(t, /count|posts|number/); return c.length ? c[0] : -1; })();
      for (const r of t.data) {
        const name = (r[0] || '').trim();
        if (!name || /^total\b/i.test(name)) continue;
        const views = valCol >= 0 ? (parseMetric(r[valCol]) ?? 0)
          : Math.max(0, ...r.slice(1).map((c) => parseMetric(c) ?? 0));
        const count = cntCol >= 0 ? Math.round(parseMetric(r[cntCol]) ?? 0) : 0;
        if (views > 0) result.formatSplits.push({ format: name, viewsOrReach: views, count: count > 0 ? count : undefined });
      }
    }

    if (fileType === 'audience') {
      type Section = 'none' | 'gender_age' | 'cities' | 'countries';
      let section: Section = 'none';
      for (const r of rows) {
        const label = (r[0] || '').toLowerCase().trim();
        if (/^(top )?(cities|city|towns?)$/.test(label)) { section = 'cities'; continue; }
        if (/^(top )?(countries|country)$/.test(label)) { section = 'countries'; continue; }
        if (/^(age|gender|age (&|and) gender)$/.test(label)) { section = 'gender_age'; continue; }

        const firstNum = (cells: string[]) => { for (const c of cells) { const n = parseMetric(c); if (n !== null) return n; } return null; };

        if (/^(women|female)$/.test(label)) {
          const n = firstNum(r.slice(1));
          if (n !== null && n >= 0 && n <= 100) result.demographics.genderWomenPct = n;
          continue;
        }
        if (/^(men|male)$/.test(label)) {
          const n = firstNum(r.slice(1));
          if (n !== null && n >= 0 && n <= 100) result.demographics.genderMenPct = n;
          continue;
        }
        if (/^\d{2}\s*[-–]\s*\d{2}$|^\d{2}\+$/.test(label)) {
          const n = firstNum(r.slice(1));
          if (n !== null && n > 0) result.demographics.topAgeBrackets.push({ bracket: r[0].replace(/\s+/g, ''), percentage: n });
          continue;
        }
        if (section === 'cities' && r[0]) {
          const n = firstNum(r.slice(1));
          result.demographics.topCities.push({ city: r[0], percentage: n !== null && n > 0 ? n : undefined });
        } else if (section === 'countries' && r[0]) {
          const n = firstNum(r.slice(1));
          result.demographics.topCountries.push({ country: r[0], percentage: n !== null && n > 0 ? n : undefined });
        }
      }
      const d = result.demographics;
      if (d.genderWomenPct > 0 && d.genderMenPct === 0) d.genderMenPct = Number((100 - d.genderWomenPct).toFixed(1));
      if (d.genderMenPct > 0 && d.genderWomenPct === 0) d.genderWomenPct = Number((100 - d.genderMenPct).toFixed(1));
    }
  }

  // Engagement rate: interactions / reach if reach exists, otherwise interactions / views (flagged).
  if (result.totalInteractions > 0 && result.totalUniqueViewers > 0) {
    result.calculatedEngagementRate = Number(((result.totalInteractions / result.totalUniqueViewers) * 100).toFixed(1));
  } else if (result.totalInteractions > 0 && result.totalViews > 0) {
    result.calculatedEngagementRate = Number(((result.totalInteractions / result.totalViews) * 100).toFixed(1));
    warnings.push('Engagement rate is interactions divided by views, because no unique-viewer total was available.');
  }
  return result;
}

/** Groups CSV uploads by their platform tag: 'facebook' | 'instagram' | 'untagged'. */
export function groupMetaFilesByTag(files: any[]): Record<string, any[]> {
  const groups: Record<string, any[]> = {};
  for (const f of files || []) {
    const tag = String(f?.platform || f?.label || '').toLowerCase();
    const key = tag === 'facebook' || tag === 'instagram' ? tag : 'untagged';
    (groups[key] = groups[key] || []).push(f);
  }
  return groups;
}

// ---------------------------------------------------------------- applying to a report

function toAppendixArray(report: any): { metric: string; value: string; notes: string }[] {
  const a = report.appendixRawMetrics;
  if (Array.isArray(a)) return a;
  if (a && typeof a === 'object') {
    return Object.entries(a).map(([metric, value]) => ({ metric, value: String(value), notes: 'Carried over' }));
  }
  return [];
}

/**
 * Writes verified CSV values into the report. Only values that exist in the CSV are written.
 * target: 'facebook' | 'instagram' | 'meta'. 'meta' means the file could not be attributed to one platform:
 * its figures go to the appendix only and are NOT counted in platform totals.
 */
export function applyMetaCsvToReport(
  baseReport: any,
  csvMetrics: MetaAggregatedMetrics,
  requestedPlatforms?: string[],
  targetPlatform?: 'facebook' | 'instagram' | 'meta'
): any {
  const report = JSON.parse(JSON.stringify(baseReport));
  const active = normalizePlatforms(requestedPlatforms);
  const dq = (report.dataQuality = report.dataQuality || { isFallback: false, warnings: [], sources: [] });
  dq.warnings = dq.warnings || []; dq.sources = dq.sources || [];
  const warn = (m: string) => { if (!dq.warnings.includes(m)) dq.warnings.push(m); };
  (csvMetrics.warnings || []).forEach(warn);
  if (!dq.sources.includes('csv')) dq.sources.push('csv');

  let target = targetPlatform;
  if (!target) {
    const metaActive = ['facebook', 'instagram'].filter((p) => isPlatformActive(p, active));
    target = metaActive.length === 1 ? (metaActive[0] as 'facebook' | 'instagram') : 'meta';
  }

  const m = csvMetrics;
  const label = target === 'meta' ? 'Meta (Facebook + Instagram combined)' : PLATFORM_LABELS[target];
  const d = m.demographics;
  const citiesStr = d.topCities.slice(0, 3).map((c) => (c.percentage ? `${c.city} (${c.percentage}%)` : c.city)).join(', ');
  const genderStr = d.genderWomenPct > 0 || d.genderMenPct > 0 ? `${d.genderWomenPct}% women / ${d.genderMenPct}% men` : '';
  const ageStr = d.topAgeBrackets.slice(0, 2).map((a) => `${a.bracket} (${a.percentage}%)`).join(', ');

  // Reach: unique viewers if the CSV has them, otherwise content views (flagged as such).
  const reachValue = m.totalUniqueViewers > 0 ? m.totalUniqueViewers : m.totalViews;
  const reachIsViews = !(m.totalUniqueViewers > 0) && m.totalViews > 0;

  // ---- appendix (always an array of {metric,value,notes})
  const appendix = toAppendixArray(report);
  const addAppx = (metric: string, value: string, notes = 'From uploaded CSV') => {
    const name = `${metric} (${label})`;
    const i = appendix.findIndex((x) => x.metric === name);
    if (i >= 0) appendix[i] = { metric: name, value, notes }; else appendix.push({ metric: name, value, notes });
  };
  if (m.totalViews > 0) addAppx('Content views', m.totalViews.toLocaleString());
  if (m.totalUniqueViewers > 0) addAppx('Unique viewers', m.totalUniqueViewers.toLocaleString());
  if (m.totalLinkClicks > 0) addAppx('Link clicks', m.totalLinkClicks.toLocaleString());
  if (m.netFollowers !== 0) addAppx('Net follower change', `${m.netFollowers > 0 ? '+' : ''}${m.netFollowers.toLocaleString()}`);
  if (m.totalInteractions > 0) addAppx('Interactions', m.totalInteractions.toLocaleString());
  if (genderStr) addAppx('Gender split', genderStr);
  if (ageStr) addAppx('Top age brackets', ageStr);
  if (citiesStr) addAppx('Top cities', citiesStr);
  if (m.filesProcessed.length) addAppx('CSV files ingested', m.filesProcessed.join(', '));
  report.appendixRawMetrics = appendix;

  if (target === 'meta') {
    warn(`CSV data could not be attributed to one platform and is shown in the appendix only. Tag the upload as Facebook or Instagram to include it in platform totals.`);
    return report;
  }
  if (!isPlatformActive(target, active)) {
    warn(`${PLATFORM_LABELS[target]} CSV uploaded but ${PLATFORM_LABELS[target]} is not a selected platform. Ignored.`);
    return report;
  }

  // ---- platform detail object + summary row
  const obj = report[target];
  const row = report.crossPlatformOverview?.summaryTable?.find((r: any) => String(r?.platform).toLowerCase() === target);

  if (reachValue > 0) {
    if (obj) {
      if (target === 'facebook') { obj.reachOrganic = reachValue; obj.reachPaid = 0; }
      else obj.reach = reachValue;
    }
    if (row) row.reach = reachValue;
    if (reachIsViews) warn(`${label} reach is based on content views, not unique viewers (no unique-viewer total in the CSV).`);
  }
  if (target === 'instagram' && obj && m.totalViews > 0) obj.impressions = m.totalViews;
  if (m.netFollowers !== 0) {
    if (obj) obj.netGrowth = m.netFollowers;
    if (row) row.followersDelta = m.netFollowers;
  }
  if (m.calculatedEngagementRate > 0) {
    if (obj) obj.engagementRate = m.calculatedEngagementRate;
    if (row) row.engagementRate = m.calculatedEngagementRate;
  }
  if (target === 'instagram' && obj && m.totalLinkClicks > 0) obj.websiteTaps = m.totalLinkClicks;

  if (m.formatSplits.length > 0 && obj) {
    if (target === 'facebook') {
      obj.postFormats = m.formatSplits.map((f) => ({
        format: f.format, count: f.count || 0,
        avgReach: f.count ? Math.round(f.viewsOrReach / f.count) : 0, avgEngagement: 0
      }));
    } else {
      obj.formatSplit = m.formatSplits.map((f) => ({
        format: f.format.toLowerCase(), formatLabel: f.format, count: f.count || 0,
        reach: f.viewsOrReach, shares: 0, avgWatchOrSave: 'Not provided'
      }));
    }
  }

  if (obj && target === 'facebook' && (citiesStr || genderStr || ageStr)) {
    obj.demographics = {
      topLocations: d.topCities.slice(0, 5).map((c) => (c.percentage ? `${c.city} (${c.percentage}%)` : c.city)),
      topAgeGender: [genderStr, ageStr].filter(Boolean).join(' · ') || 'Not provided',
      summary: citiesStr ? `Top cities: ${citiesStr}.` : 'Not provided'
    };
  }

  // ---- report-level audience insights: only facts that exist
  report.audienceInsights = report.audienceInsights || {};
  const tot = m.organicReach + m.paidReach;
  if (m.organicReach > 0 && m.paidReach > 0) {
    report.audienceInsights.organicVsPaidRatio =
      `${Math.round((m.organicReach / tot) * 100)}% Organic / ${Math.round((m.paidReach / tot) * 100)}% Paid`;
  }
  const quality: string[] = [];
  if (m.netFollowers !== 0) quality.push(`${m.netFollowers > 0 ? '+' : ''}${m.netFollowers.toLocaleString()} net followers`);
  if (m.totalLinkClicks > 0) quality.push(`${m.totalLinkClicks.toLocaleString()} link clicks`);
  if (quality.length) report.audienceInsights.growthQuality = `${label}: ${quality.join(', ')} this period.`;
  const demo: string[] = [];
  if (genderStr) demo.push(genderStr);
  if (ageStr) demo.push(`top age brackets ${ageStr}`);
  if (citiesStr) demo.push(`top cities ${citiesStr}`);
  if (demo.length) report.audienceInsights.demographicShifts = `${label}: ${demo.join('; ')}.`;

  // ---- takeaways: verified facts only, ahead of any existing non-placeholder ones
  const facts: string[] = [];
  if (reachValue > 0) facts.push(`${label} ${reachIsViews ? 'content views' : 'unique viewers'}: ${reachValue.toLocaleString()}.`);
  if (m.netFollowers !== 0) facts.push(`${label} net follower change: ${m.netFollowers > 0 ? '+' : ''}${m.netFollowers.toLocaleString()}.`);
  if (m.totalLinkClicks > 0) facts.push(`${label} link clicks: ${m.totalLinkClicks.toLocaleString()}.`);
  if (facts.length) {
    report.executiveSummary = report.executiveSummary || {};
    const existing: string[] = (report.executiveSummary.headlineTakeaways || [])
      .filter((t: string) => typeof t === 'string' && !/^Awaiting|^Active cross-platform reach|^Combined platform reach/i.test(t));
    report.executiveSummary.headlineTakeaways = [...facts, ...existing].slice(0, 6);
  }
  return report;
}

/** Convenience for routes: groups CSVs by platform tag, parses each group, applies each to the right platform. */
export function applyMetaCsvFilesToReport(
  baseReport: any,
  files: any[],
  requestedPlatforms?: string[]
): { report: any; filesProcessed: string[] } {
  let report = baseReport;
  const filesProcessed: string[] = [];
  const groups = groupMetaFilesByTag(files);
  for (const [tag, group] of Object.entries(groups)) {
    const metrics = parseMetaCsvExports(group);
    if (metrics.filesProcessed.length === 0) continue;
    filesProcessed.push(...metrics.filesProcessed);
    report = applyMetaCsvToReport(report, metrics, requestedPlatforms, tag === 'untagged' ? undefined : (tag as 'facebook' | 'instagram'));
  }
  return { report, filesProcessed };
}
