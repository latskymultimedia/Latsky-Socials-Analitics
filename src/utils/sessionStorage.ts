import { SocialReportData } from '../types/report';

const STORAGE_KEY = 'pulse_social_report_current';
const SAVED_SESSIONS_INDEX_KEY = 'pulse_social_saved_sessions_index';

export function saveSessionToLaptop(report: SocialReportData) {
  const sanitizedClient = (report.clientName || 'Client').replace(/[^a-z0-9_-]/gi, '_');
  const sanitizedPeriod = (report.reportPeriod || 'Report').replace(/[^a-z0-9_-]/gi, '_');
  const filename = `${sanitizedClient}_Social_Report_${sanitizedPeriod}.json`;

  const jsonStr = JSON.stringify(report, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export async function parseSessionFile(file: File): Promise<SocialReportData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        if (!parsed.clientName || !parsed.executiveSummary) {
          throw new Error('Invalid report structure: missing clientName or executiveSummary');
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
  return `# Monthly Social Performance Report: ${report.clientName}
**Period:** ${report.reportPeriod} (${report.comparisonPeriod})
**Prepared by:** ${report.preparedBy || report.agencyName}

## 1. Executive Summary
${report.executiveSummary.headlineTakeaways.map((t) => `* ${t}`).join('\n')}

**Key Metrics:**
* Cross-Platform Reach: ${report.executiveSummary.overallReach.toLocaleString()} (${report.executiveSummary.overallReachPrevDelta > 0 ? '+' : ''}${report.executiveSummary.overallReachPrevDelta}% MoM / ${report.executiveSummary.overallReachYoYDelta > 0 ? '+' : ''}${report.executiveSummary.overallReachYoYDelta}% YoY)
* Average Engagement Rate: ${report.executiveSummary.overallEngagementRate}% (${report.executiveSummary.overallEngagementPrevDelta > 0 ? '+' : ''}${report.executiveSummary.overallEngagementPrevDelta}% MoM)

**Key Wins:**
${report.executiveSummary.keyWins.map((w) => `* ${w}`).join('\n')}

**Watch Item:**
* ${report.executiveSummary.watchItem}

## 2. Platform Overview
| Platform | Followers (Δ) | Reach | Engagement Rate | Top Content Type |
|---|---|---|---|---|
${report.crossPlatformOverview.summaryTable.map((row) => `| ${row.platformLabel} | ${row.followers.toLocaleString()} (${row.followersDelta > 0 ? '+' : ''}${row.followersDelta.toLocaleString()}) | ${row.reach.toLocaleString()} | ${row.engagementRate}% | ${row.topContentType} |`).join('\n')}

## 3. Actionable Recommendations for Next Month
${report.recommendations.actionableItems.map((rec) => `* **[${rec.priority}] (${rec.platform})**: ${rec.recommendation} _(Expected outcome: ${rec.expectedOutcome})_`).join('\n')}

**Testing Priorities:**
${report.recommendations.testingPriorities.map((tp) => `* ${tp}`).join('\n')}
`;
}
