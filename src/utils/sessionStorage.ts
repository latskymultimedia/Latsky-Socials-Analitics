import { SocialReportData } from '../types/report';

const STORAGE_KEY = 'pulse_social_report_current';

export function saveSessionToLaptop(report: SocialReportData): boolean {
  try {
    const sanitizedClient = (report.clientName || 'Client').replace(/[^a-z0-9_-]/gi, '_');
    const sanitizedPeriod = (report.reportPeriod || 'Report').replace(/[^a-z0-9_-]/gi, '_');
    const filename = `${sanitizedClient}_Social_Report_${sanitizedPeriod}.json`;

    const jsonStr = JSON.stringify(report, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    setTimeout(() => {
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    }, 200);
    return true;
  } catch (err) {
    console.error('Failed to trigger file download:', err);
    return false;
  }
}

export async function parseSessionFile(file: File): Promise<SocialReportData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        if (!parsed.clientName && !parsed.executiveSummary) {
          throw new Error('Invalid report structure: missing client data');
        }
        resolve(parsed as SocialReportData);
      } catch (err: any) {
        reject(new Error('Failed to parse session file: ' + err.message));
      }
    };
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsText(file);
  });
}

export function saveCurrentReportToStorage(report: SocialReportData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(report));
  } catch (e) {
    console.warn('Could not save to localStorage (quota or disabled):', e);
  }
}

export function loadCurrentReportFromStorage(): SocialReportData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Could not load from localStorage:', e);
  }
  return null;
}

export function generateExecutiveMarkdown(report: SocialReportData): string {
  const summary = report.executiveSummary || {
    headlineTakeaways: [],
    overallReach: 0,
    overallReachPrevDelta: 0,
    overallReachYoYDelta: 0,
    overallEngagementRate: 0,
    overallEngagementPrevDelta: 0,
    keyWins: [],
    watchItem: '',
  };

  const rows = report.crossPlatformOverview?.summaryTable || [];
  const recs = report.recommendations?.actionableItems || [];
  const tests = report.recommendations?.testingPriorities || [];

  return `# Monthly Social Performance Report: ${report.clientName}
**Period:** ${report.reportPeriod} (${report.comparisonPeriod})
**Prepared by:** ${report.preparedBy || report.agencyName}

## 1. Executive Summary
${summary.headlineTakeaways?.map((t) => `* ${t}`).join('\n') || 'No takeaways provided.'}

**Key Metrics:**
* Cross-Platform Reach: ${summary.overallReach?.toLocaleString() || 0} (${summary.overallReachPrevDelta > 0 ? '+' : ''}${summary.overallReachPrevDelta}% MoM / ${summary.overallReachYoYDelta > 0 ? '+' : ''}${summary.overallReachYoYDelta}% YoY)
* Average Engagement Rate: ${summary.overallEngagementRate || 0}% (${summary.overallEngagementPrevDelta > 0 ? '+' : ''}${summary.overallEngagementPrevDelta}% MoM)

**Key Wins:**
${summary.keyWins?.map((w) => `* ${w}`).join('\n') || 'None recorded.'}

**Watch Item:**
* ${summary.watchItem || 'None recorded.'}

## 2. Platform Overview
| Platform | Followers (Δ) | Reach | Engagement Rate | Top Content Type |
|---|---|---|---|---|
${rows.map((row) => `| ${row.platformLabel} | ${row.followers?.toLocaleString()} (${row.followersDelta > 0 ? '+' : ''}${row.followersDelta?.toLocaleString()}) | ${row.reach?.toLocaleString()} | ${row.engagementRate}% | ${row.topContentType} |`).join('\n')}

## 3. Actionable Recommendations for Next Month
${recs.map((rec) => `* **[${rec.priority}] (${rec.platform})**: ${rec.recommendation} _(Expected outcome: ${rec.expectedOutcome})_`).join('\n')}

**Testing Priorities:**
${tests.map((tp) => `* ${tp}`).join('\n')}
`;
}

/**
 * Universal clipboard copy with robust fallback for iframes without permission
 */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  // Try modern navigator.clipboard first
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn('navigator.clipboard.writeText blocked by iframe permissions, falling back to textarea execCommand:', err);
    }
  }

  // Fallback: create temporary textarea
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    textArea.setAttribute('readonly', '');
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (fallbackErr) {
    console.error('All copy methods failed:', fallbackErr);
    return false;
  }
}

/**
 * Safe print function that handles iframe printing constraints
 */
export function triggerPrintDialog(): boolean {
  try {
    window.print();
    return true;
  } catch (err) {
    console.error('window.print error:', err);
    return false;
  }
}
