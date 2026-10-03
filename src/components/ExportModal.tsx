import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Save, 
  FileText, 
  Download, 
  Check, 
  FileCode, 
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Layers
} from 'lucide-react';
import { SocialReportData, PlatformType } from '../types/report';
import { exportHtmlReport, exportMarkdownReport } from '../utils/exportUtils';
import { saveSessionToLaptop, generateExecutiveMarkdown, copyTextToClipboard } from '../utils/sessionStorage';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: SocialReportData;
  activePlatform?: PlatformType | 'overall';
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  report,
  activePlatform = 'overall'
}) => {
  const [selectedScope, setSelectedScope] = useState<'overall' | PlatformType>(activePlatform);
  const [copiedMd, setCopiedMd] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const isSinglePlatform = selectedScope !== 'overall';

  const handleDownloadHtml = () => {
    const ok = exportHtmlReport(report, selectedScope);
    if (ok) {
      setDownloadSuccess(isSinglePlatform ? `${selectedScope.toUpperCase()} HTML / PDF` : 'HTML');
      setTimeout(() => setDownloadSuccess(null), 3000);
    }
  };

  const handleDownloadJson = () => {
    const ok = saveSessionToLaptop(report);
    if (ok) {
      setDownloadSuccess('JSON');
      setTimeout(() => setDownloadSuccess(null), 3000);
    }
  };

  const handleDownloadMarkdown = () => {
    const md = generateExecutiveMarkdown(report);
    const ok = exportMarkdownReport(report, md);
    if (ok) {
      setDownloadSuccess('MD');
      setTimeout(() => setDownloadSuccess(null), 3000);
    }
  };

  const handleCopyMarkdown = async () => {
    const md = generateExecutiveMarkdown(report);
    const ok = await copyTextToClipboard(md);
    if (ok) {
      setCopiedMd(true);
      setTimeout(() => setCopiedMd(false), 2500);
    }
  };

  const handleBrowserPrint = () => {
    if (isSinglePlatform) {
      // In single platform mode, always download or pop out the dedicated isolated single-platform document
      // to guarantee zero multi-platform bleed into the printout!
      handleDownloadHtml();
      return;
    }
    try {
      window.print();
    } catch (e) {
      console.warn('Browser print blocked by iframe environment:', e);
      handleDownloadHtml();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 print:hidden">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-stone-200 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-stone-900 text-white rounded-lg">
              <Download className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">
                  LATSKY SOCIALS EXPORT
                </span>
                <h2 className="text-base font-bold text-stone-900">
                  Export Client Deliverables
                </h2>
              </div>
              <p className="text-xs text-stone-500">
                Generate high-resolution reports, laptop backups, and executive summaries.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 p-1.5 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scope Selector: Multi-Platform vs Single Platform */}
        <div className="px-6 pt-4 pb-2 bg-stone-50/80 border-b border-stone-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-600">
              Export Scope Selection:
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
              isSinglePlatform ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-stone-200 text-stone-800'
            }`}>
              {isSinglePlatform ? `Single Platform (${selectedScope.toUpperCase()} Only)` : 'Full Multi-Platform Report'}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedScope('overall')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedScope === 'overall'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-100'
              }`}
            >
              Overall Cross-Platform
            </button>
            <button
              type="button"
              onClick={() => setSelectedScope('instagram')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedScope === 'instagram'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-white border border-stone-300 text-rose-700 hover:bg-rose-50'
              }`}
            >
              Instagram Only
            </button>
            <button
              type="button"
              onClick={() => setSelectedScope('youtube')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedScope === 'youtube'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-white border border-stone-300 text-red-700 hover:bg-red-50'
              }`}
            >
              YouTube Only
            </button>
            <button
              type="button"
              onClick={() => setSelectedScope('linkedin')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedScope === 'linkedin'
                  ? 'bg-sky-700 text-white shadow-xs'
                  : 'bg-white border border-stone-300 text-sky-800 hover:bg-sky-50'
              }`}
            >
              LinkedIn Only
            </button>
            <button
              type="button"
              onClick={() => setSelectedScope('facebook')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedScope === 'facebook'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-stone-300 text-blue-700 hover:bg-blue-50'
              }`}
            >
              Facebook Only
            </button>
            <button
              type="button"
              onClick={() => setSelectedScope('tiktok')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedScope === 'tiktok'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white border border-stone-300 text-stone-900 hover:bg-stone-100'
              }`}
            >
              TikTok Only
            </button>
          </div>

          <div className="text-[11px] text-stone-500">
            {isSinglePlatform ? (
              <span className="text-amber-800 font-medium">
                ✓ Standalone report will contain <strong>strictly {selectedScope.toUpperCase()} metrics, format splits, top posts, and growth tactics</strong> (cross-platform summary and other platform sections are completely excluded).
              </span>
            ) : (
              <span>Includes cross-platform overview table and all 4 platform summaries in one unified agency document.</span>
            )}
          </div>
        </div>

        {/* Success Banner */}
        {downloadSuccess && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 text-xs text-emerald-800 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Successfully downloaded <strong>{downloadSuccess} deliverable</strong> to your laptop downloads folder!
            </span>
          </div>
        )}

        {/* Export Options Grid */}
        <div className="p-6 space-y-4">
          
          {/* 1. PDF / Printable Standalone HTML */}
          <div className="p-4 rounded-xl border border-stone-200 hover:border-stone-400 bg-stone-50/50 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-amber-500/10 text-amber-700 rounded-lg shrink-0 mt-0.5">
                <FileCode className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-stone-900">
                    Standalone Agency Report (.html / PDF Ready)
                  </h3>
                  <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                    Recommended
                  </span>
                </div>
                <p className="text-xs text-stone-600 mt-1">
                  Self-contained deliverable with embedded styling, charts, and clean branding. Open in any browser and print or save to PDF with zero iframe restrictions.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleDownloadHtml}
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-stone-900 text-white hover:bg-stone-800 text-xs font-semibold shrink-0 transition flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download HTML / PDF</span>
            </button>
          </div>

          {/* 2. Direct Browser Print */}
          <div className="p-4 rounded-xl border border-stone-200 hover:border-stone-400 bg-stone-50/50 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-blue-500/10 text-blue-700 rounded-lg shrink-0 mt-0.5">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900">
                  Direct Browser Print Dialog
                </h3>
                <p className="text-xs text-stone-600 mt-1">
                  Triggers standard browser printing. Note: In some preview windows, browser security blocks print dialogs; use the HTML/PDF download above if blocked.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleBrowserPrint}
              className="w-full sm:w-auto px-4 py-2 rounded-lg border border-stone-300 bg-white text-stone-800 hover:bg-stone-100 text-xs font-semibold shrink-0 transition flex items-center justify-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Open Print Dialog</span>
            </button>
          </div>

          {/* 3. Session File (.json) */}
          <div className="p-4 rounded-xl border border-stone-200 hover:border-stone-400 bg-stone-50/50 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-purple-500/10 text-purple-700 rounded-lg shrink-0 mt-0.5">
                <Save className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900">
                  Save Session to Laptop (.json)
                </h3>
                <p className="text-xs text-stone-600 mt-1">
                  Back up the complete client session file to your laptop. Load it anytime via the "Load" button to restore all data and screengrabs.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleDownloadJson}
              className="w-full sm:w-auto px-4 py-2 rounded-lg border border-stone-300 bg-white text-stone-800 hover:bg-stone-100 text-xs font-semibold shrink-0 transition flex items-center justify-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save .json File</span>
            </button>
          </div>

          {/* 4. Markdown Format (Copy & Download) */}
          <div className="p-4 rounded-xl border border-stone-200 hover:border-stone-400 bg-stone-50/50 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-emerald-500/10 text-emerald-700 rounded-lg shrink-0 mt-0.5">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900">
                  Executive Briefing (Markdown .md)
                </h3>
                <p className="text-xs text-stone-600 mt-1">
                  Formatted for quick client updates via email, Slack, or Notion documentation.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleCopyMarkdown}
                className="flex-1 sm:flex-none px-3.5 py-2 rounded-lg border border-stone-300 bg-white text-stone-800 hover:bg-stone-100 text-xs font-semibold transition flex items-center justify-center gap-1.5"
              >
                {copiedMd ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <FileText className="w-3.5 h-3.5" />}
                <span>{copiedMd ? 'Copied!' : 'Copy Markdown'}</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadMarkdown}
                title="Download .md file"
                className="px-3.5 py-2 rounded-lg border border-stone-300 bg-white text-stone-800 hover:bg-stone-100 text-xs font-semibold transition flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>.md</span>
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-stone-100/70 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-stone-600" />
            <span>Files are generated locally on your machine.</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg text-stone-700 hover:bg-stone-200 font-medium transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
