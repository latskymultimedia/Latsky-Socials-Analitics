import React, { useState } from 'react';
import { 
  Image as ImageIcon, 
  Maximize2, 
  X, 
  ExternalLink, 
  ShieldCheck, 
  FileText, 
  FileSpreadsheet, 
  Layers, 
  Instagram, 
  Youtube, 
  Linkedin, 
  Facebook,
  Download,
  Eye,
  Filter,
  Trash2,
  Upload,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { TikTokIcon } from './icons/TikTokIcon';
import { PlatformType, SocialReportData, UploadedScreenshot } from '../types/report';
import { processUploadedFile } from '../utils/fileUploadHelper';

interface ScreengrabsAppendixProps {
  report: SocialReportData;
  onOpenUploadModal: () => void;
  onClearArchive?: () => void;
  onAddScreenshots?: (newScreenshots: UploadedScreenshot[]) => void;
}

export const ScreengrabsAppendix: React.FC<ScreengrabsAppendixProps> = ({
  report,
  onOpenUploadModal,
  onClearArchive,
  onAddScreenshots,
}) => {
  const [selectedItem, setSelectedItem] = useState<UploadedScreenshot | null>(null);
  const [activePlatformFilter, setActivePlatformFilter] = useState<PlatformType | 'all'>('all');
  const [isDragOver, setIsDragOver] = useState(false);

  const screenshots = report.uploadedScreenshots || [];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0 && onAddScreenshots) {
      const files = Array.from(e.dataTransfer.files);
      const newItems: UploadedScreenshot[] = [];
      for (const file of files) {
        try {
          const item = await processUploadedFile(file, activePlatformFilter !== 'all' ? activePlatformFilter : undefined);
          newItems.push(item);
        } catch (err) {
          console.error('Failed to process dropped file in Appendix:', err);
        }
      }
      if (newItems.length > 0) {
        onAddScreenshots(newItems);
      }
    } else {
      onOpenUploadModal();
    }
  };

  const platformCount = (p: PlatformType | 'all') => {
    if (p === 'all') return screenshots.length;
    return screenshots.filter((s) => s.platform === p).length;
  };

  const filteredScreenshots = activePlatformFilter === 'all'
    ? screenshots
    : screenshots.filter((s) => s.platform === activePlatformFilter);

  // Helper to parse CSV sample for preview
  const parseCsvSample = (text?: string) => {
    if (!text) return { headers: [], rows: [], totalRows: 0 };
    const lines = text.trim().split('\n').filter(Boolean);
    if (lines.length === 0) return { headers: [], rows: [], totalRows: 0 };
    const parseLine = (line: string) => {
      const delimiter = line.includes('\t') ? '\t' : ',';
      return line.split(delimiter).map(cell => cell.replace(/^"(.*)"$/, '$1').trim());
    };
    const headers = parseLine(lines[0]);
    const rows = lines.slice(1, 20).map(parseLine);
    return { headers, rows, totalRows: lines.length - 1 };
  };

  const getPlatformIcon = (platform: PlatformType | 'all') => {
    switch (platform) {
      case 'instagram':
        return <Instagram className="w-3.5 h-3.5 text-rose-600" />;
      case 'youtube':
        return <Youtube className="w-3.5 h-3.5 text-red-600" />;
      case 'linkedin':
        return <Linkedin className="w-3.5 h-3.5 text-sky-700" />;
      case 'facebook':
        return <Facebook className="w-3.5 h-3.5 text-blue-600" />;
      case 'tiktok':
        return <TikTokIcon className="w-3.5 h-3.5 text-stone-900" />;
      default:
        return <Layers className="w-3.5 h-3.5 text-stone-600" />;
    }
  };

  return (
    <section 
      onDragOver={handleDragOver}
      onDragEnter={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`bg-white rounded-xl border shadow-xs p-6 sm:p-8 space-y-6 transition ${
        isDragOver ? 'border-amber-500 ring-4 ring-amber-400/30 bg-amber-50/30' : 'border-stone-200'
      }`}
    >
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-stone-100 pb-4 gap-2">
        <div>
          <div className="text-[11px] uppercase tracking-wider font-bold text-stone-500">
            Appendix
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            Source Evidence & Platform Verification
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Original dashboard screengrabs, PDF analytics dossiers, and raw CSV data exports logged for this report
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500 font-medium">
            {screenshots.length} analytical file{screenshots.length === 1 ? '' : 's'} archived
          </span>
          {screenshots.length > 0 && onClearArchive && (
            <button
              type="button"
              onClick={onClearArchive}
              title="Clear all archived screengrabs and files for this client"
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-lg transition"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              <span>Clear Archive</span>
            </button>
          )}
          <button
            type="button"
            onClick={onOpenUploadModal}
            className="px-2.5 py-1 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg transition"
          >
            + Add Files
          </button>
        </div>
      </div>

      {/* Auto-Classified Crisis-Fix Content Hooks (Detected from Screenshot Performance Dips) */}
      {report.crisisFixHooks && report.crisisFixHooks.length > 0 && (
        <div className="p-4 sm:p-5 rounded-xl bg-amber-50/70 border border-amber-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-900">
              <div className="p-1.5 bg-amber-600 text-white rounded-md shadow-2xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                  AI Auto-Detected Crisis-Fix Content Hooks
                </h3>
                <p className="text-[11px] text-amber-800">
                  Targeted script interventions engineered to recover detected drop-offs, retention dips, and distribution friction
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-full border border-amber-300">
              {report.crisisFixHooks.length} Fixes Ready
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
            {report.crisisFixHooks.map((fix, idx) => (
              <div key={idx} className="p-3 bg-white rounded-lg border border-amber-200 shadow-2xs space-y-1.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                      {fix.platform}
                    </span>
                    <span className="text-[9.5px] text-rose-600 font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-rose-500" />
                      <span>Bottleneck Detected</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 font-medium leading-tight">
                    {fix.weaknessFound}
                  </p>
                </div>
                <div className="p-2 rounded bg-amber-50/90 border border-amber-200/80">
                  <div className="text-[9.5px] font-bold text-amber-900 uppercase tracking-wide">
                    2-Second Hook Script:
                  </div>
                  <p className="text-[11px] text-stone-900 font-semibold mt-0.5 leading-snug">
                    "{fix.hookSolution}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Platform Filter Tabs (if multiple platforms present) */}
      {screenshots.length > 0 && (
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-lg overflow-x-auto">
          <button
            type="button"
            onClick={() => setActivePlatformFilter('all')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition ${
              activePlatformFilter === 'all'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-stone-600" />
            <span>All Channels ({platformCount('all')})</span>
          </button>

          {(['instagram', 'youtube', 'linkedin', 'facebook', 'tiktok'] as PlatformType[]).map((platform) => {
            const count = platformCount(platform);
            if (count === 0 && activePlatformFilter !== platform) return null;
            return (
              <button
                key={platform}
                type="button"
                onClick={() => setActivePlatformFilter(platform)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap capitalize transition ${
                  activePlatformFilter === platform
                    ? 'bg-white text-stone-900 shadow-xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {getPlatformIcon(platform)}
                <span>{platform} ({count})</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Gallery / Files Grid */}
      {screenshots.length === 0 ? (
        <div className="p-8 text-center rounded-xl border border-dashed border-stone-300 bg-stone-50/50 space-y-3">
          <ImageIcon className="w-8 h-8 text-stone-400 mx-auto" />
          <div className="text-xs font-semibold text-stone-700">
            No source files or screengrabs attached yet
          </div>
          <p className="text-[11px] text-stone-500 max-w-md mx-auto">
            You can upload Meta Business Suite screengrabs, YouTube Studio CSV exports, or LinkedIn analytics PDFs anytime.
          </p>
          <button
            type="button"
            onClick={onOpenUploadModal}
            className="px-3 py-1.5 text-xs font-medium bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition"
          >
            Upload Evidence Files
          </button>
        </div>
      ) : filteredScreenshots.length === 0 ? (
        <div className="p-6 text-center rounded-lg border border-dashed border-stone-200 bg-stone-50 text-xs text-stone-500">
          No files attached for {activePlatformFilter} yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredScreenshots.map((item) => {
            const isPdf = item.fileType === 'pdf' || item.name.toLowerCase().endsWith('.pdf');
            const isCsv = item.fileType === 'csv' || item.name.toLowerCase().endsWith('.csv') || item.name.toLowerCase().endsWith('.tsv');

            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="group relative rounded-lg border border-stone-200 overflow-hidden bg-white cursor-pointer shadow-2xs hover:shadow-md transition flex flex-col justify-between"
              >
                {/* Visual Area */}
                {isPdf ? (
                  <div className="h-32 bg-rose-50/70 border-b border-rose-100 flex flex-col items-center justify-center p-3 text-center group-hover:bg-rose-50 transition">
                    <FileText className="w-9 h-9 text-rose-600 mb-1" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800">
                      PDF Analytics Dossier
                    </span>
                    <span className="text-[10px] text-rose-600 mt-0.5">
                      {item.fileSize || 'Document'}
                    </span>
                  </div>
                ) : isCsv ? (
                  <div className="h-32 bg-emerald-50/70 border-b border-emerald-100 flex flex-col items-center justify-center p-3 text-center group-hover:bg-emerald-50 transition">
                    <FileSpreadsheet className="w-9 h-9 text-emerald-600 mb-1" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900">
                      Raw CSV Export
                    </span>
                    <span className="text-[10px] text-emerald-700 mt-0.5">
                      {item.fileSize || 'Tabular Data'}
                    </span>
                  </div>
                ) : (
                  <div className="h-32 w-full overflow-hidden bg-stone-200 flex items-center justify-center relative">
                    <img
                      src={item.dataUrl}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                    <div className="absolute inset-0 bg-stone-900/10 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <Maximize2 className="w-5 h-5 text-white drop-shadow" />
                    </div>
                  </div>
                )}

                {/* Info Footer */}
                <div className="p-2.5 bg-white space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1 shrink-0">
                      {getPlatformIcon(item.platform)}
                      <span>{item.platform}</span>
                    </span>
                    <span className="text-[9.5px] font-mono font-semibold text-stone-400 shrink-0">
                      {isPdf ? 'PDF' : isCsv ? 'CSV' : 'IMAGE'}
                    </span>
                  </div>

                  {(() => {
                    const classified = report.classifiedUploads?.find(
                      (c) => c.fileName === item.name || item.name.includes(c.fileName) || (c.fileName && c.fileName.includes(item.name))
                    );
                    if (classified?.screenType) {
                      return (
                        <div className="truncate">
                          <span className="inline-block text-[9px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-1.5 py-0.5 rounded truncate max-w-full">
                            {classified.screenType}
                          </span>
                        </div>
                      );
                    }
                    return null;
                  })()}

                  <p className="text-[11px] font-medium text-stone-800 truncate" title={item.name}>
                    {item.name}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox / Preview Modal for CSV, PDF, and Images */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-stone-500 bg-stone-200 px-2 py-0.5 rounded">
                  {selectedItem.platform}
                </span>
                <h3 className="text-xs font-bold text-stone-900 truncate max-w-md">
                  {selectedItem.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="text-stone-400 hover:text-stone-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-auto flex-1 bg-stone-50">
              {selectedItem.fileType === 'csv' || selectedItem.name.toLowerCase().endsWith('.csv') ? (
                (() => {
                  const { headers, rows, totalRows } = parseCsvSample(selectedItem.textContent);
                  return (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-stone-600">
                        <span>Showing sample preview ({Math.min(rows.length, 19)} of {totalRows} rows)</span>
                        <span className="font-mono text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                          Verified tabular data source
                        </span>
                      </div>
                      <div className="overflow-x-auto border border-stone-200 rounded-lg bg-white shadow-2xs">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-stone-100 text-stone-700 font-semibold border-b border-stone-200">
                              {headers.map((h, i) => (
                                <th key={i} className="p-2 border-r border-stone-200 whitespace-nowrap">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {rows.map((row, rIdx) => (
                              <tr key={rIdx} className="border-b border-stone-100 hover:bg-stone-50">
                                {row.map((cell, cIdx) => (
                                  <td key={cIdx} className="p-2 border-r border-stone-100 text-stone-800 whitespace-nowrap font-mono text-[11px]">
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })()
              ) : selectedItem.fileType === 'pdf' || selectedItem.name.toLowerCase().endsWith('.pdf') ? (
                <div className="p-8 text-center bg-white rounded-lg border border-stone-200 space-y-4">
                  <FileText className="w-14 h-14 text-rose-600 mx-auto" />
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">{selectedItem.name}</h4>
                    <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
                      Official PDF document archived for {selectedItem.platform.toUpperCase()} verification ({selectedItem.fileSize || 'Report'}).
                    </p>
                  </div>
                  <a
                    href={selectedItem.dataUrl}
                    download={selectedItem.name}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download / Open PDF</span>
                  </a>
                </div>
              ) : (
                <div className="flex items-center justify-center p-2 bg-stone-950 rounded-lg">
                  <img
                    src={selectedItem.dataUrl}
                    alt={selectedItem.name}
                    className="max-h-[75vh] object-contain rounded"
                  />
                </div>
              )}
            </div>

            <div className="px-4 py-2.5 border-t border-stone-200 bg-white flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-lg text-xs transition"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Agency Sign-off */}
      <div className="pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Verified & Prepared by {report.agencyName}</span>
        </div>
        <div className="text-[11px]">
          Confidential · Prepared exclusively for {report.clientName}
        </div>
      </div>

    </section>
  );
};
