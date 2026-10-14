import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { SocialReportData } from '../types/report';

/** Tells the reader which numbers are verified and which are missing or estimated. Hidden when there is nothing to say. */
export const DataQualityBanner: React.FC<{ report: SocialReportData }> = ({ report }) => {
  const dq = report.dataQuality;
  if (!dq || (!dq.isFallback && (!dq.warnings || dq.warnings.length === 0))) return null;

  return (
    <div className="print:hidden rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900" role="status">
      <div className="flex items-center gap-2 font-semibold">
        <AlertTriangle className="w-4 h-4 shrink-0" />
        {dq.isFallback ? 'AI analysis did not run: showing only uploaded CSV data and figures you entered' : 'Data notes for this report'}
      </div>
      {dq.warnings && dq.warnings.length > 0 && (
        <ul className="mt-2 list-disc pl-5 space-y-1 text-[13px]">
          {dq.warnings.map((w, i) => <li key={i}>{w}</li>)}
        </ul>
      )}
      {dq.sources && dq.sources.length > 0 && (
        <div className="mt-2 text-[11px] uppercase tracking-wider text-amber-700">Sources used: {dq.sources.join(', ')}</div>
      )}
    </div>
  );
};
