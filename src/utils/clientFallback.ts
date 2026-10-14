import { generateSynthesizedAgencyReport } from './reportSynthesizer';
import { applyMetaCsvFilesToReport } from './metaCsvParser';
import { reconcileAndHarmonizeReport } from './reconcile';
import { normalizePlatforms } from './platforms';

/**
 * Browser-side report builder, used when the API is unreachable (GitHub Pages / static hosting) or fails.
 * Same pipeline as the server (synthesize -> apply CSVs -> reconcile), so the numbers follow the same rules.
 * No AI runs here, and the report says so via dataQuality.
 */
export function buildClientSideReport(
  payload: {
    clientName: string; clientSubtitle?: string; reportPeriod: string; goals?: string; notes?: string;
    platforms: string[]; knownMetrics: Record<string, any>;
  },
  uploads: any[],
  reason?: string
) {
  const platforms = normalizePlatforms(payload.platforms);
  const base: any = generateSynthesizedAgencyReport({
    clientName: payload.clientName,
    clientSubtitle: payload.clientSubtitle,
    reportPeriod: payload.reportPeriod,
    goals: payload.goals,
    notes: payload.notes,
    platforms,
    imageCount: uploads.length,
    imageNames: uploads.map((u) => u.name),
    knownMetrics: payload.knownMetrics,
  });
  const csvUploads = uploads.filter((u) => u?.fileType === 'csv' || /\.(csv|tsv)$/i.test(u?.name || ''));
  const { report } = applyMetaCsvFilesToReport(base, csvUploads, platforms);
  report.dataQuality = report.dataQuality || { isFallback: true, warnings: [], sources: [] };
  report.dataQuality.isFallback = true;
  report.dataQuality.warnings.unshift(
    `AI analysis was not available${reason ? ` (${reason})` : ''}. Screenshots and PDFs were NOT read. This report contains only CSV data and figures you entered.`
  );
  return reconcileAndHarmonizeReport(report, platforms, payload.knownMetrics);
}
