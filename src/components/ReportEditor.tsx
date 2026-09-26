import React from 'react';
import { SocialReportData } from '../types/report';
import { Save, RefreshCw, Upload, Image as ImageIcon } from 'lucide-react';
import { fileToBase64 } from '../utils/formatters';

interface ReportEditorProps {
  report: SocialReportData;
  onUpdateReport: (updated: Partial<SocialReportData>) => void;
  onCloseEditor: () => void;
}

export const ReportEditor: React.FC<ReportEditorProps> = ({
  report,
  onUpdateReport,
  onCloseEditor,
}) => {
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file);
      onUpdateReport({ clientLogoUrl: base64 });
    }
  };

  return (
    <div className="bg-stone-900 text-stone-100 rounded-xl p-6 shadow-xl space-y-6 print:hidden border border-stone-800">
      <div className="flex items-center justify-between border-b border-stone-800 pb-4">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase">
            Workspace Mode Active
          </span>
          <h3 className="text-lg font-bold text-white">
            Client Profile & Report Parameters
          </h3>
        </div>
        <button
          type="button"
          onClick={onCloseEditor}
          className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs font-semibold text-stone-200 transition"
        >
          Done Editing
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Client Name */}
        <div>
          <label className="block text-xs font-semibold text-stone-400 mb-1">
            Client Name
          </label>
          <input
            type="text"
            value={report.clientName}
            onChange={(e) => onUpdateReport({ clientName: e.target.value })}
            className="w-full text-xs px-3 py-2 rounded-lg bg-stone-800 border border-stone-700 text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
          />
        </div>

        {/* Client Subtitle */}
        <div>
          <label className="block text-xs font-semibold text-stone-400 mb-1">
            Client Subtitle / Tagline
          </label>
          <input
            type="text"
            value={report.clientSubtitle}
            onChange={(e) => onUpdateReport({ clientSubtitle: e.target.value })}
            className="w-full text-xs px-3 py-2 rounded-lg bg-stone-800 border border-stone-700 text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
          />
        </div>

        {/* Industry / Vertical */}
        <div>
          <label className="block text-xs font-semibold text-stone-400 mb-1">
            Industry / Vertical (Firecrawl Radar)
          </label>
          <input
            type="text"
            value={report.industryIntel?.industryName || ''}
            onChange={(e) => {
              const val = e.target.value;
              onUpdateReport({
                industryIntel: report.industryIntel
                  ? { ...report.industryIntel, industryName: val }
                  : {
                      industryName: val,
                      scrapedAt: new Date().toISOString(),
                      source: 'ai_grounded',
                      sourcesScraped: [],
                      industryOverview: '',
                      subGrowthPlaybook: '',
                      viewsAndReachPlaybook: '',
                      commentsAndDebatesPlaybook: '',
                      socialAlgorithmNews2026: [],
                      trendingHooksAndFormats: [],
                    }
              });
            }}
            placeholder="e.g. Commercial Cinema, B2B SaaS"
            className="w-full text-xs px-3 py-2 rounded-lg bg-stone-800 border border-stone-700 text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
          />
        </div>

        {/* Report Period */}
        <div>
          <label className="block text-xs font-semibold text-stone-400 mb-1">
            Reporting Period
          </label>
          <input
            type="text"
            value={report.reportPeriod}
            onChange={(e) => onUpdateReport({ reportPeriod: e.target.value })}
            className="w-full text-xs px-3 py-2 rounded-lg bg-stone-800 border border-stone-700 text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
          />
        </div>

        {/* Comparison Period */}
        <div>
          <label className="block text-xs font-semibold text-stone-400 mb-1">
            Comparison Baseline
          </label>
          <input
            type="text"
            value={report.comparisonPeriod}
            onChange={(e) => onUpdateReport({ comparisonPeriod: e.target.value })}
            className="w-full text-xs px-3 py-2 rounded-lg bg-stone-800 border border-stone-700 text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
          />
        </div>

        {/* Agency Name */}
        <div>
          <label className="block text-xs font-semibold text-stone-400 mb-1">
            Prepared By (Agency / Team)
          </label>
          <input
            type="text"
            value={report.agencyName}
            onChange={(e) => onUpdateReport({ agencyName: e.target.value })}
            className="w-full text-xs px-3 py-2 rounded-lg bg-stone-800 border border-stone-700 text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
          />
        </div>

        {/* Client Logo Upload */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-stone-400 mb-1">
            Client Logo Image
          </label>
          <div className="flex items-center gap-3">
            {report.clientLogoUrl ? (
              <img
                src={report.clientLogoUrl}
                alt="Client Logo"
                className="w-10 h-10 object-contain rounded bg-white p-1"
              />
            ) : (
              <div className="w-10 h-10 rounded bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-500">
                <ImageIcon className="w-5 h-5" />
              </div>
            )}
            <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-700 text-xs font-medium text-stone-200 transition">
              <span>{report.clientLogoUrl ? 'Replace Logo' : 'Upload Client Logo'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </label>
            {report.clientLogoUrl && (
              <button
                type="button"
                onClick={() => onUpdateReport({ clientLogoUrl: '' })}
                className="text-xs text-rose-400 hover:underline"
              >
                Remove
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
