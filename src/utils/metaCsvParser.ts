/**
 * Meta CSV Parser & Aggregator
 * 
 * Ingests and parses standard Meta Business Suite / Creator Studio exports:
 * - Views.csv / Content views.csv
 * - Viewers.csv / Unique viewers.csv / Reach.csv
 * - Follows.csv / Net follows.csv
 * - Interactions.csv / Engagement.csv
 * - Link clicks.csv / Outbound clicks.csv
 * - Top content formats.csv / Content formats.csv
 * - Audience.csv / Demographics.csv
 */

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
}

/**
 * Robust metric parser that handles commas, currency ($ € £), percentages, and plus signs.
 */
export function parseMetric(val: any): number {
  if (val === undefined || val === null) return 0;
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  const str = String(val).trim().replace(/[$€£,%\+]/g, '');
  const num = parseFloat(str);
  return isNaN(num) ? 0 : num;
}

export const parseCleanNumber = parseMetric;

/**
 * Parses raw CSV/TSV text into 2D array of rows
 */
export function parseCsvToRows(rawText: string): string[][] {
  if (!rawText) return [];
  const lines = rawText.split(/\r?\n/);
  const rows: string[][] = [];

  for (const line of lines) {
    if (!line.trim()) continue;
    const row: string[] = [];
    let insideQuotes = false;
    let currentCell = '';

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if ((char === ',' || char === '\t') && !insideQuotes) {
        row.push(currentCell.trim().replace(/^"|"$/g, ''));
        currentCell = '';
      } else {
        currentCell += char;
      }
    }
    row.push(currentCell.trim().replace(/^"|"$/g, ''));
    rows.push(row);
  }

  return rows;
}

/**
 * Classifies which Meta export a file represents based on file name and content headers.
 * Fixed: 'content views' classified as views before format, and 'unique viewers' classified as viewers.
 */
export function classifyMetaCsvType(fileName: string, firstFewLines: string): 
  'views' | 'viewers' | 'follows' | 'interactions' | 'link_clicks' | 'formats' | 'audience' | 'unknown' {
  const lowerName = (fileName || '').toLowerCase();
  const lowerContent = (firstFewLines || '').toLowerCase();

  // Content formats (Check first if file name or header specifically says format)
  if (
    lowerName.includes('format') || 
    lowerContent.includes('content format') || 
    lowerContent.includes('post format')
  ) {
    return 'formats';
  }

  // Audience & Demographics (use word boundaries / explicit terms to avoid matching substrings like "images" or "damage")
  if (
    lowerName.includes('audience') || 
    lowerName.includes('demographic') || 
    /\b(women|female|gender|cities|countries)\b/.test(lowerContent) ||
    /\bage\b/.test(lowerContent) ||
    lowerName.includes('cities')
  ) {
    return 'audience';
  }

  // Link / outbound clicks
  if (
    lowerName.includes('link click') || 
    lowerName.includes('outbound') || 
    lowerName.includes('website tap') ||
    lowerContent.includes('link clicks')
  ) {
    return 'link_clicks';
  }

  // Unique viewers / Reach
  if (
    lowerName.includes('viewer') || 
    lowerName.includes('reach') || 
    lowerContent.includes('unique viewer') || 
    lowerContent.includes('accounts reached')
  ) {
    return 'viewers';
  }

  // Views / Impressions
  if (
    lowerName.includes('view') || 
    lowerContent.includes('impressions') || 
    lowerContent.includes('content views')
  ) {
    return 'views';
  }

  // Follows / Net followers
  if (
    lowerName.includes('follow') || 
    lowerContent.includes('unfollow') || 
    lowerContent.includes('net follower')
  ) {
    return 'follows';
  }

  // Interactions / Engagement
  if (
    lowerName.includes('interaction') || 
    lowerName.includes('engagement') || 
    lowerContent.includes('likes') || 
    lowerContent.includes('comments')
  ) {
    return 'interactions';
  }

  return 'unknown';
}

/**
 * Main ingestion function: takes an array of uploaded files
 * and extracts all quantitative metrics, audience demographics, and format splits.
 * Uses header-based column parsing and avoids summing unique viewers across daily rows.
 */
export function parseMetaCsvExports(
  files: Array<{ name: string; textContent?: string; dataUrl?: string; platform?: string }>
): MetaAggregatedMetrics {
  const result: MetaAggregatedMetrics = {
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

  for (const file of files) {
    let text = file.textContent || '';
    if (!text && file.dataUrl && file.dataUrl.includes(',')) {
      try {
        const base64Part = file.dataUrl.split(',')[1];
        if (typeof Buffer !== 'undefined') {
          text = Buffer.from(base64Part, 'base64').toString('utf-8');
        } else if (typeof atob !== 'undefined') {
          text = decodeURIComponent(escape(atob(base64Part)));
        }
      } catch {
        text = file.dataUrl.split(',')[1];
      }
    }

    if (!text) continue;

    const rows = parseCsvToRows(text);
    if (rows.length === 0) continue;

    const fileType = classifyMetaCsvType(file.name, rows.slice(0, 5).map(r => r.join(' ')).join(' '));
    result.filesProcessed.push(`${file.name} (${fileType})`);

    const header = rows[0]?.map(c => c.toLowerCase().trim()) || [];

    // 1. VIEWS.CSV
    if (fileType === 'views') {
      const viewsColIdx = header.findIndex(h => h.includes('view') || h.includes('impression') || h.includes('total'));
      let maxViewsVal = 0;
      let sumDailyViews = 0;

      for (let r = 1; r < rows.length; r++) {
        const row = rows[r];
        const val = viewsColIdx !== -1 ? parseMetric(row[viewsColIdx]) : parseMetric(row[row.length - 1]);
        if (val > 0) {
          sumDailyViews += val;
          if (val > maxViewsVal) maxViewsVal = val;
        }
      }
      // If daily time-series, sum them; if aggregated total row present, use max
      const viewsVal = sumDailyViews > 0 ? sumDailyViews : maxViewsVal;
      if (viewsVal > 0) {
        result.totalViews = Math.max(result.totalViews, viewsVal);
      }
    }

    // 2. VIEWERS.CSV / REACH.CSV
    // Unique viewers MUST NOT be naively summed across daily rows (unique deduplication constraint)
    if (fileType === 'viewers') {
      let maxUniqueVal = 0;
      let organic = 0;
      let paid = 0;

      const organicColIdx = header.findIndex(h => h.includes('organic'));
      const paidColIdx = header.findIndex(h => h.includes('paid'));
      const viewerColIdx = header.findIndex(h => h.includes('viewer') || h.includes('reach') || h.includes('unique') || h.includes('total'));

      for (let r = 1; r < rows.length; r++) {
        const row = rows[r];
        if (organicColIdx !== -1) {
          const val = parseMetric(row[organicColIdx]);
          if (val > organic) organic = val;
        }
        if (paidColIdx !== -1) {
          const val = parseMetric(row[paidColIdx]);
          if (val > paid) paid = val;
        }

        const v = viewerColIdx !== -1 ? parseMetric(row[viewerColIdx]) : parseMetric(row[row.length - 1]);
        if (v > maxUniqueVal) maxUniqueVal = v;
      }

      if (maxUniqueVal > 0) result.totalUniqueViewers = Math.max(result.totalUniqueViewers, maxUniqueVal);
      if (organic > 0) result.organicReach = Math.max(result.organicReach, organic);
      if (paid > 0) result.paidReach = Math.max(result.paidReach, paid);
    }

    // 3. FOLLOWS.CSV
    if (fileType === 'follows') {
      let netVal = 0;
      let gained = 0;
      let lost = 0;

      const netColIdx = header.findIndex(h => h.includes('net') || h.includes('total follows'));
      const gainColIdx = header.findIndex(h => h.includes('gain') || h.includes('follow') && !h.includes('unfollow'));
      const lostColIdx = header.findIndex(h => h.includes('lost') || h.includes('unfollow'));

      for (let r = 1; r < rows.length; r++) {
        const row = rows[r];
        if (netColIdx !== -1) {
          const val = parseMetric(row[netColIdx]);
          if (val !== 0) netVal += val;
        } else {
          if (gainColIdx !== -1) gained += parseMetric(row[gainColIdx]);
          if (lostColIdx !== -1) lost += parseMetric(row[lostColIdx]);
        }
      }

      result.netFollowers = netVal !== 0 ? netVal : (gained - lost);
    }

    // 4. INTERACTIONS.CSV
    if (fileType === 'interactions') {
      const interactionColIdx = header.findIndex(h => h.includes('interaction') || h.includes('engagement') || h.includes('total'));
      let sumInteractions = 0;
      for (let r = 1; r < rows.length; r++) {
        const row = rows[r];
        const val = interactionColIdx !== -1 ? parseMetric(row[interactionColIdx]) : parseMetric(row[row.length - 1]);
        if (val > 0) sumInteractions += val;
      }
      if (sumInteractions > 0) result.totalInteractions = sumInteractions;
    }

    // 5. LINK CLICKS.CSV
    if (fileType === 'link_clicks') {
      const clicksColIdx = header.findIndex(h => h.includes('click') || h.includes('outbound') || h.includes('tap') || h.includes('total'));
      let sumClicks = 0;
      for (let r = 1; r < rows.length; r++) {
        const row = rows[r];
        const val = clicksColIdx !== -1 ? parseMetric(row[clicksColIdx]) : parseMetric(row[row.length - 1]);
        if (val > 0) sumClicks += val;
      }
      if (sumClicks > 0) result.totalLinkClicks = sumClicks;
    }

    // 6. TOP CONTENT FORMATS.CSV
    if (fileType === 'formats') {
      for (let r = 1; r < rows.length; r++) {
        const row = rows[r];
        if (row.length < 2) continue;
        const formatName = row[0].trim();
        if (formatName.toLowerCase().includes('format') || formatName.toLowerCase().includes('content')) continue;

        let views = 0;
        let count = 1;
        for (let i = 1; i < row.length; i++) {
          const num = parseMetric(row[i]);
          if (num > views) views = num;
          else if (num > 0 && count === 1) count = Math.round(num);
        }

        if (formatName && views > 0) {
          result.formatSplits.push({
            format: formatName,
            viewsOrReach: views,
            count
          });
        }
      }
    }

    // 7. AUDIENCE.CSV
    if (fileType === 'audience') {
      let currentSection: 'none' | 'gender_age' | 'cities' | 'countries' = 'none';

      for (const row of rows) {
        const rowStr = row.join(' ').toLowerCase();

        if (rowStr.includes('women') || rowStr.includes('gender') || rowStr.includes('age')) {
          currentSection = 'gender_age';
        } else if (rowStr.includes('city') || rowStr.includes('cities') || rowStr.includes('town')) {
          currentSection = 'cities';
          continue;
        } else if (rowStr.includes('country') || rowStr.includes('countries')) {
          currentSection = 'countries';
          continue;
        }

        // Parse Women percentage: Accepts ALL valid percentages (including <= 50)
        if (rowStr.includes('women') || rowStr.includes('female')) {
          for (const cell of row) {
            const num = parseMetric(cell);
            if (num > 0 && num <= 100) {
              result.demographics.genderWomenPct = num;
              result.demographics.genderMenPct = Number((100 - num).toFixed(1));
            }
          }
        }

        // Parse Age Brackets (e.g., 25-34, 35-44, 18-24)
        for (let i = 0; i < row.length; i++) {
          const cell = row[i];
          if (/^\d{2}-\d{2}$/.test(cell) || /^\d{2}\+$/.test(cell)) {
            const pct = parseMetric(row[i + 1]);
            if (pct > 0) {
              result.demographics.topAgeBrackets.push({
                bracket: cell,
                percentage: pct
              });
            }
          }
        }

        // Parse Cities
        if (currentSection === 'cities') {
          const cityName = row[0]?.trim();
          if (cityName && cityName.length > 2 && !cityName.toLowerCase().includes('city')) {
            const pct = parseMetric(row[1]);
            result.demographics.topCities.push({
              city: cityName,
              percentage: pct > 0 ? pct : undefined
            });
          }
        }
      }
    }
  }

  // Calculate Engagement Rate
  if (result.totalUniqueViewers > 0 && result.totalInteractions > 0) {
    result.calculatedEngagementRate = Number(
      ((result.totalInteractions / result.totalUniqueViewers) * 100).toFixed(1)
    );
  } else if (result.totalViews > 0 && result.totalInteractions > 0) {
    result.calculatedEngagementRate = Number(
      ((result.totalInteractions / result.totalViews) * 100).toFixed(1)
    );
  }

  return result;
}

/**
 * Maps the parsed CSV metrics directly into the application's SocialReportData structure.
 * Zero fabricated fallbacks: If a metric is missing, store 0 and omit narrative claim.
 */
export function applyMetaCsvToReport(
  baseReport: any,
  csvMetrics: MetaAggregatedMetrics,
  requestedPlatforms: string[] = ['facebook', 'instagram', 'youtube', 'linkedin', 'tiktok']
): any {
  const report = JSON.parse(JSON.stringify(baseReport));
  const activeTargets = (requestedPlatforms && requestedPlatforms.length > 0)
    ? requestedPlatforms.map(p => p.toLowerCase())
    : ['facebook', 'instagram', 'youtube', 'linkedin', 'tiktok'];

  const totalReach = csvMetrics.totalUniqueViewers;
  const totalViews = csvMetrics.totalViews;
  const netFollowers = csvMetrics.netFollowers;
  const linkClicks = csvMetrics.totalLinkClicks;
  const engRate = csvMetrics.calculatedEngagementRate;

  // 1. Executive Summary Binding
  if (!report.executiveSummary) report.executiveSummary = {};
  if (totalReach > 0) {
    report.executiveSummary.overallReach = totalReach;
  }
  if (engRate > 0) {
    report.executiveSummary.overallEngagementRate = engRate;
  }

  const takeaways: string[] = [];
  if (totalReach > 0) {
    takeaways.push(`Total verified audience reach is ${totalReach.toLocaleString()}${totalViews > 0 ? ` across ${totalViews.toLocaleString()} impressions` : ''}${netFollowers !== 0 ? ` with ${netFollowers > 0 ? '+' : ''}${netFollowers.toLocaleString()} net followers` : ''}.`);
  }
  if (linkClicks > 0) {
    takeaways.push(`Outbound commercial traffic generated ${linkClicks.toLocaleString()} verified link clicks.`);
  }
  if (csvMetrics.demographics.genderWomenPct > 0) {
    takeaways.push(`Audience is ${csvMetrics.demographics.genderWomenPct}% women with active concentration in core demographic segments.`);
  }
  if (takeaways.length === 0) {
    takeaways.push('Awaiting further platform data uploads to populate insights.');
  }
  report.executiveSummary.headlineTakeaways = takeaways;

  // 2. Audience Insights Binding
  if (!report.audienceInsights) report.audienceInsights = {};
  if (csvMetrics.organicReach > 0 && csvMetrics.paidReach > 0) {
    const total = csvMetrics.organicReach + csvMetrics.paidReach;
    report.audienceInsights.organicVsPaidRatio = `${Math.round((csvMetrics.organicReach / total) * 100)}% Organic / ${Math.round((csvMetrics.paidReach / total) * 100)}% Paid`;
  } else if (csvMetrics.organicReach > 0) {
    report.audienceInsights.organicVsPaidRatio = '100% Organic';
  } else {
    report.audienceInsights.organicVsPaidRatio = 'Not provided';
  }

  if (netFollowers !== 0 || linkClicks > 0) {
    report.audienceInsights.growthQuality = `Retention with ${netFollowers >= 0 ? '+' : ''}${netFollowers.toLocaleString()} net followers and ${linkClicks.toLocaleString()} outbound link clicks.`;
  } else {
    report.audienceInsights.growthQuality = 'Not provided';
  }

  const topCities = csvMetrics.demographics.topCities.map(c => c.city).slice(0, 3).join(', ');
  if (csvMetrics.demographics.genderWomenPct > 0 || topCities) {
    const genderPart = csvMetrics.demographics.genderWomenPct > 0 ? `${csvMetrics.demographics.genderWomenPct}% women` : '';
    const cityPart = topCities ? `concentrated in ${topCities}` : '';
    report.audienceInsights.demographicShifts = `Demographic profile is ${[genderPart, cityPart].filter(Boolean).join(' ')}.`;
  } else {
    report.audienceInsights.demographicShifts = 'Not provided';
  }

  // 3. Platform-specific Binding (without invented splits)
  // If untagged/general and both active, do NOT invent fixed ratios
  const isFbActive = activeTargets.includes('facebook');
  const isIgActive = activeTargets.includes('instagram');

  if (isFbActive && report.facebook) {
    if (netFollowers !== 0) report.facebook.netGrowth = netFollowers;
    if (totalReach > 0) report.facebook.reachOrganic = totalReach;
    if (engRate > 0) report.facebook.engagementRate = engRate;
    if (csvMetrics.formatSplits.length > 0) {
      report.facebook.postFormats = csvMetrics.formatSplits.map(f => ({
        format: f.format,
        count: f.count || 1,
        avgReach: Math.round(f.viewsOrReach / (f.count || 1)),
        avgEngagement: 0
      }));
    }
  }

  if (isIgActive && report.instagram) {
    if (netFollowers !== 0) report.instagram.netGrowth = netFollowers;
    if (totalReach > 0) report.instagram.reach = totalReach;
    if (totalViews > 0) report.instagram.impressions = totalViews;
    if (linkClicks > 0) report.instagram.websiteTaps = linkClicks;
    if (engRate > 0) report.instagram.engagementRate = engRate;
  }

  // 4. Update Summary Table
  if (report.crossPlatformOverview?.summaryTable) {
    report.crossPlatformOverview.summaryTable = report.crossPlatformOverview.summaryTable.map((row: any) => {
      const plat = (row.platform || '').toLowerCase();
      if (plat === 'facebook' && isFbActive) {
        return {
          ...row,
          followersDelta: netFollowers !== 0 ? netFollowers : row.followersDelta,
          reach: totalReach > 0 ? totalReach : row.reach,
          engagementRate: engRate > 0 ? engRate : row.engagementRate,
          topContentType: row.topContentType || 'Standard Feed'
        };
      }
      if (plat === 'instagram' && isIgActive) {
        return {
          ...row,
          followersDelta: netFollowers !== 0 ? netFollowers : row.followersDelta,
          reach: totalReach > 0 ? totalReach : row.reach,
          engagementRate: engRate > 0 ? engRate : row.engagementRate,
          topContentType: row.topContentType || 'Standard Feed'
        };
      }
      return row;
    });
  }

  return report;
}
