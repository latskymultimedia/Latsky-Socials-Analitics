import React, { useRef, useState } from 'react';
import { 
  BarChart3, 
  Upload, 
  Save, 
  FolderDown, 
  Printer, 
  FileText, 
  Sparkles, 
  Edit3, 
  Eye, 
  Check, 
  Image as ImageIcon,
  ChevronDown,
  Globe,
  HelpCircle,
  Lightbulb,
  Youtube,
  Instagram,
  Linkedin,
  Facebook,
  Layers
} from 'lucide-react';
import { TikTokIcon } from './icons/TikTokIcon';
import { PlatformType, SocialReportData } from '../types/report';
import { fileToBase64 } from '../utils/formatters';
import { exportHtmlReport } from '../utils/exportUtils';
import { copyTextToClipboard } from '../utils/sessionStorage';

interface HeaderProps {
  report: SocialReportData;
  onUpdateReport: (updated: Partial<SocialReportData>) => void;
  onOpenAiModal: () => void;
  onOpenFirecrawlModal: () => void;
  onOpenCaptureGuide: () => void;
  onOpenGrowthRoadmap: () => void;
  onOpenExportModal: () => void;
  onSaveToLaptop: () => void;
  onLoadFromLaptop: (file: File) => void;
  onLoadPreset: (presetKey: 'verandert' | 'retreat') => void;
  onExportMarkdown: () => void;
  isEditing: boolean;
  onToggleEditMode: () => void;
  activeReportView: 'overall' | PlatformType;
  onSelectReportView: (view: 'overall' | PlatformType) => void;
}

export const Header: React.FC<HeaderProps> = ({
  report,
  onUpdateReport,
  onOpenAiModal,
  onOpenFirecrawlModal,
  onOpenCaptureGuide,
  onOpenGrowthRoadmap,
  onOpenExportModal,
  onSaveToLaptop,
  onLoadFromLaptop,
  onLoadPreset,
  onExportMarkdown,
  isEditing,
  onToggleEditMode,
  activeReportView,
  onSelectReportView,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);
  const [showPresetsMenu, setShowPresetsMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showViewsMenu, setShowViewsMenu] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onLoadFromLaptop(file);
      e.target.value = '';
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        onUpdateReport({ clientLogoUrl: base64 });
      } catch (err) {
        console.error('Failed to convert logo', err);
      }
      e.target.value = '';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyMarkdown = () => {
    onExportMarkdown();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="border-b border-stone-200 bg-white/95 backdrop-blur-sm sticky top-0 z-40 transition-colors print:hidden">
      {/* Top Banner / Client Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Client Branding Block */}
          <div className="flex items-center gap-3.5">
            {/* Logo Avatar / Upload Trigger */}
            <div className="relative group shrink-0">
              <input
                type="file"
                ref={logoInputRef}
                onChange={handleLogoUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                title="Click to upload client logo"
                className="w-12 h-12 rounded-lg border border-stone-300 bg-stone-100 flex items-center justify-center overflow-hidden hover:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-400 transition"
              >
                {report.clientLogoUrl ? (
                  <img
                    src={report.clientLogoUrl}
                    alt={`${report.clientName} logo`}
                    className="w-full h-full object-contain p-1"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-stone-500 group-hover:text-stone-800">
                    <ImageIcon className="w-5 h-5" />
                    <span className="text-[9px] uppercase tracking-wider font-medium mt-0.5">Logo</span>
                  </div>
                )}
              </button>
            </div>

            {/* Client Name & Agency Brand */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono uppercase tracking-widest font-bold text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                  LATSKY SOCIALS
                </span>
                <span className="text-stone-300">/</span>
                <span className="text-xs text-stone-600 font-medium truncate">
                  {report.reportPeriod}
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight truncate leading-snug">
                {report.clientName}
              </h1>
              <p className="text-xs text-stone-600 truncate">
                {report.clientSubtitle || 'Executive Monthly Performance'} · <span className="text-stone-500">{report.agencyName || 'Latsky Socials'}</span>
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center flex-wrap gap-2">
            
            {/* View Selector: Overall Socials vs Standalone Platform Reports */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowViewsMenu(!showViewsMenu)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-stone-300 bg-stone-100 text-stone-800 hover:bg-stone-200 transition"
              >
                <Layers className="w-3.5 h-3.5 text-stone-600" />
                <span className="capitalize">
                  {activeReportView === 'overall' ? 'Overall Socials Report' : `${activeReportView} Standalone Report`}
                </span>
                <ChevronDown className="w-3 h-3 text-stone-500" />
              </button>

              {showViewsMenu && (
                <div
                  className="absolute right-0 mt-1.5 w-60 rounded-xl bg-white border border-stone-200 shadow-xl py-2 z-50 text-left text-xs"
                  onMouseLeave={() => setShowViewsMenu(false)}
                >
                  <div className="px-3 py-1 font-semibold text-stone-500 uppercase tracking-wider text-[10px]">
                    Report Scope
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectReportView('overall');
                      setShowViewsMenu(false);
                    }}
                    className={`w-full px-3 py-2 flex items-center justify-between text-left hover:bg-stone-50 transition ${
                      activeReportView === 'overall' ? 'font-bold text-stone-900 bg-stone-50' : 'text-stone-700'
                    }`}
                  >
                    <span>Overall Cross-Platform Report</span>
                    {activeReportView === 'overall' && <Check className="w-3.5 h-3.5 text-stone-900" />}
                  </button>

                  <div className="border-t border-stone-100 my-1" />
                  <div className="px-3 py-1 font-semibold text-stone-500 uppercase tracking-wider text-[10px]">
                    Standalone Single-Platform Reports
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectReportView('instagram');
                      setShowViewsMenu(false);
                    }}
                    className={`w-full px-3 py-2 flex items-center gap-2 hover:bg-stone-50 transition ${
                      activeReportView === 'instagram' ? 'font-bold text-rose-700 bg-rose-50' : 'text-stone-700'
                    }`}
                  >
                    <Instagram className="w-3.5 h-3.5 text-rose-600" />
                    <span>Instagram Standalone</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectReportView('youtube');
                      setShowViewsMenu(false);
                    }}
                    className={`w-full px-3 py-2 flex items-center gap-2 hover:bg-stone-50 transition ${
                      activeReportView === 'youtube' ? 'font-bold text-red-700 bg-red-50' : 'text-stone-700'
                    }`}
                  >
                    <Youtube className="w-3.5 h-3.5 text-red-600" />
                    <span>YouTube Standalone</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectReportView('linkedin');
                      setShowViewsMenu(false);
                    }}
                    className={`w-full px-3 py-2 flex items-center gap-2 hover:bg-stone-50 transition ${
                      activeReportView === 'linkedin' ? 'font-bold text-sky-700 bg-sky-50' : 'text-stone-700'
                    }`}
                  >
                    <Linkedin className="w-3.5 h-3.5 text-sky-700" />
                    <span>LinkedIn Standalone</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectReportView('facebook');
                      setShowViewsMenu(false);
                    }}
                    className={`w-full px-3 py-2 flex items-center gap-2 hover:bg-stone-50 transition ${
                      activeReportView === 'facebook' ? 'font-bold text-blue-700 bg-blue-50' : 'text-stone-700'
                    }`}
                  >
                    <Facebook className="w-3.5 h-3.5 text-blue-600" />
                    <span>Facebook Standalone</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectReportView('tiktok');
                      setShowViewsMenu(false);
                    }}
                    className={`w-full px-3 py-2 flex items-center gap-2 hover:bg-stone-50 transition ${
                      activeReportView === 'tiktok' ? 'font-bold text-stone-900 bg-stone-100' : 'text-stone-700'
                    }`}
                  >
                    <TikTokIcon className="w-3.5 h-3.5 text-stone-900" />
                    <span>TikTok Standalone</span>
                  </button>
                </div>
              )}
            </div>

            {/* Screengrab Capture Guide Button */}
            <button
              type="button"
              onClick={onOpenCaptureGuide}
              title="Show required screenshot checklist"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 transition"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Screengrab Guide</span>
            </button>

            {/* Firecrawl Scraper Button */}
            <button
              type="button"
              onClick={onOpenFirecrawlModal}
              title="Scrape competitor web profiles with Firecrawl"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-orange-200 bg-orange-50 text-orange-900 hover:bg-orange-100 transition"
            >
              <Globe className="w-3.5 h-3.5 text-orange-600" />
              <span>Firecrawl Web</span>
            </button>

            {/* AI Screengrab Analysis Button */}
            <button
              type="button"
              onClick={onOpenAiModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-stone-900 text-white hover:bg-stone-800 transition shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Analyze Screengrabs</span>
              {report.uploadedScreenshots.length > 0 && (
                <span className="ml-1 text-[10px] bg-stone-700 text-stone-200 px-1.5 py-0.2 rounded">
                  {report.uploadedScreenshots.length}
                </span>
              )}
            </button>

            {/* Hidden JSON file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />

            {/* Load from Laptop Folder */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Load session from saved folder on laptop"
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 transition"
            >
              <FolderDown className="w-3.5 h-3.5 text-stone-500" />
              <span className="hidden sm:inline">Load</span>
            </button>

            {/* Save Session to Laptop Folder */}
            <button
              type="button"
              onClick={onSaveToLaptop}
              title="Save current report session to laptop folder"
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 transition"
            >
              <Save className="w-3.5 h-3.5 text-stone-500" />
              <span className="hidden sm:inline">Save</span>
            </button>

            {/* Edit Mode Switcher */}
            <button
              type="button"
              onClick={onToggleEditMode}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition ${
                isEditing
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Editing Client' : 'Edit Client'}</span>
            </button>

            {/* Growth Roadmap Button */}
            <button
              type="button"
              onClick={onOpenGrowthRoadmap}
              title="Ideas to grow this app even further"
              className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50"
            >
              <Lightbulb className="w-4 h-4 text-amber-500" />
            </button>

            {/* Export Menu & Studio Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-stone-900 bg-stone-900 text-white hover:bg-stone-800 transition shadow-xs"
              >
                <span>Export</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {showExportMenu && (
                <div
                  className="absolute right-0 mt-1.5 w-60 rounded-xl bg-white border border-stone-200 shadow-xl py-1.5 z-50 text-left text-xs"
                  onMouseLeave={() => setShowExportMenu(false)}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setShowExportMenu(false);
                      onOpenExportModal();
                    }}
                    className="w-full px-3.5 py-2.5 flex items-center gap-2 text-stone-900 bg-amber-50/60 hover:bg-amber-100/60 transition"
                  >
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <div className="font-bold text-stone-900">Export Studio & PDF</div>
                      <div className="text-[10px] text-amber-800">All export choices & downloads</div>
                    </div>
                  </button>

                  <div className="border-t border-stone-100 my-1" />

                  <button
                    type="button"
                    onClick={() => {
                      setShowExportMenu(false);
                      exportHtmlReport(report);
                    }}
                    className="w-full px-3.5 py-2 flex items-center gap-2 text-stone-800 hover:bg-stone-50 transition"
                  >
                    <Printer className="w-4 h-4 text-stone-500 shrink-0" />
                    <div>
                      <div className="font-medium">Download HTML / PDF</div>
                      <div className="text-[10px] text-stone-500">Standalone report ready to print</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowExportMenu(false);
                      onSaveToLaptop();
                    }}
                    className="w-full px-3.5 py-2 flex items-center gap-2 text-stone-800 hover:bg-stone-50 transition border-t border-stone-100"
                  >
                    <Save className="w-4 h-4 text-stone-500 shrink-0" />
                    <div>
                      <div className="font-medium">Download Session (.json)</div>
                      <div className="text-[10px] text-stone-500">Save to your laptop</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowExportMenu(false);
                      handleCopyMarkdown();
                    }}
                    className="w-full px-3.5 py-2 flex items-center gap-2 text-stone-800 hover:bg-stone-50 transition border-t border-stone-100"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600 shrink-0" /> : <FileText className="w-4 h-4 text-stone-500 shrink-0" />}
                    <div>
                      <div className="font-medium">{copied ? 'Copied to Clipboard!' : 'Copy Summary (Markdown)'}</div>
                      <div className="text-[10px] text-stone-500">For client email updates</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowExportMenu(false);
                      handlePrint();
                    }}
                    className="w-full px-3.5 py-2 flex items-center gap-2 text-stone-800 hover:bg-stone-50 transition border-t border-stone-100"
                  >
                    <Printer className="w-4 h-4 text-stone-400 shrink-0" />
                    <div className="text-[11px] text-stone-600">Direct Browser Print</div>
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};
