import React, { useRef, useState, useEffect } from 'react';
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
  Layers,
  Plus,
  Trash2,
  UserPlus,
  Users,
  X,
  FileDown
} from 'lucide-react';
import { TikTokIcon } from './icons/TikTokIcon';
import { PlatformType, SocialReportData } from '../types/report';
import { fileToBase64 } from '../utils/formatters';
import { exportHtmlReport } from '../utils/exportUtils';
import { exportWhiteLabelPDF, saveReportToHistory } from '../utils/auditTools';
import { copyTextToClipboard, getSavedClientsList, ClientIndexEntry } from '../utils/sessionStorage';
import { NewClientModal } from './NewClientModal';

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
  onCreateNewClient?: (clientName: string, clientSubtitle?: string, reportPeriod?: string, mode?: 'clean' | 'sample') => void;
  onOpenNewClientModal?: () => void;
  onClearSources?: () => void;
  onSelectSavedClient?: (clientId: string) => void;
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
  onCreateNewClient,
  onOpenNewClientModal,
  onClearSources,
  onSelectSavedClient,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);
  const [showPresetsMenu, setShowPresetsMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showViewsMenu, setShowViewsMenu] = useState(false);
  
  // Local fallback state if not using App-level modal
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [savedClients, setSavedClients] = useState<ClientIndexEntry[]>([]);

  useEffect(() => {
    setSavedClients(getSavedClientsList());
  }, [report.id, report.clientName]);

  const handleOpenNewClient = () => {
    if (onOpenNewClientModal) {
      onOpenNewClientModal();
    } else {
      setIsNewClientModalOpen(true);
    }
  };

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-3">
        
        {/* Tier 1: Client Brand Identity & Primary Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Left: Client Branding Block - Generous, unconstrained, NEVER cut off */}
          <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
            {/* Logo Avatar / Upload Trigger */}
            <div className="relative group shrink-0 mt-0.5 sm:mt-0">
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
                className="w-13 h-13 rounded-xl border border-stone-300 bg-stone-100 flex items-center justify-center overflow-hidden hover:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-400 transition shadow-2xs group"
              >
                {report.clientLogoUrl ? (
                  <img
                    src={report.clientLogoUrl}
                    alt={`${report.clientName} logo`}
                    className="w-full h-full object-contain p-1"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-stone-500 group-hover:text-stone-800">
                    <ImageIcon className="w-5 h-5 text-stone-400 group-hover:text-stone-600 transition" />
                    <span className="text-[9px] uppercase tracking-wider font-semibold mt-0.5">Logo</span>
                  </div>
                )}
              </button>
            </div>

            {/* Client Identity details */}
            <div className="min-w-0 flex-1 space-y-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  LATSKY SOCIALS
                </span>
                <span className="text-stone-300">/</span>
                <span className="text-xs text-stone-600 font-semibold">
                  {report.reportPeriod}
                </span>

                {/* Client / Presets Selector Trigger */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowPresetsMenu(!showPresetsMenu)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-2 py-0.5 rounded-md transition border border-stone-200"
                  >
                    <Users className="w-3 h-3 text-stone-500" />
                    <span>Switch Client</span>
                    {savedClients.length > 0 && (
                      <span className="text-[10px] px-1 bg-stone-200 text-stone-700 rounded-full font-mono">
                        {savedClients.length}
                      </span>
                    )}
                    <ChevronDown className="w-2.5 h-2.5 text-stone-400" />
                  </button>

                  {showPresetsMenu && (
                    <div 
                      className="absolute left-0 mt-1.5 w-68 rounded-xl bg-white border border-stone-200 shadow-2xl py-2 z-50 text-left text-xs"
                      onMouseLeave={() => setShowPresetsMenu(false)}
                    >
                      <div className="px-3 py-1 font-bold text-stone-400 uppercase tracking-wider text-[10px]">
                        Client Workspaces
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setShowPresetsMenu(false);
                          handleOpenNewClient();
                        }}
                        className="w-full px-3 py-2 flex items-center gap-2 font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 transition"
                      >
                        <UserPlus className="w-3.5 h-3.5 text-amber-600" />
                        <span>+ Create New Client Workspace</span>
                      </button>

                      <div className="border-t border-stone-100 my-1.5" />
                      <div className="px-3 py-1 font-bold text-stone-400 uppercase tracking-wider text-[10px]">
                        Template Presets
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          onLoadPreset('verandert');
                          setShowPresetsMenu(false);
                        }}
                        className="w-full px-3 py-1.5 text-left text-stone-700 hover:bg-stone-50 flex items-center justify-between"
                      >
                        <span>Latsky Multimedia & Visuals</span>
                        {report.clientName.includes('Latsky') && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onLoadPreset('retreat');
                          setShowPresetsMenu(false);
                        }}
                        className="w-full px-3 py-1.5 text-left text-stone-700 hover:bg-stone-50 flex items-center justify-between"
                      >
                        <span>The Highlands B&B & Retreat</span>
                        {report.clientName.includes('Highlands') && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                      </button>

                      {savedClients.length > 0 && (
                        <>
                          <div className="border-t border-stone-100 my-1.5" />
                          <div className="px-3 py-1 font-bold text-stone-400 uppercase tracking-wider text-[10px]">
                            Saved Clients ({savedClients.length})
                          </div>
                          {savedClients.map((c) => (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => {
                                if (onSelectSavedClient) onSelectSavedClient(c.id);
                                setShowPresetsMenu(false);
                              }}
                              className="w-full px-3 py-1.5 text-left text-stone-700 hover:bg-stone-50 flex items-center justify-between truncate"
                            >
                              <div className="truncate pr-2">
                                <div className="font-semibold text-stone-900 truncate">{c.clientName}</div>
                                {c.clientSubtitle && <div className="text-[10px] text-stone-400 truncate">{c.clientSubtitle}</div>}
                              </div>
                              {report.id === c.id && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                            </button>
                          ))}
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Quick New Client Button beside switch client */}
                <button
                  type="button"
                  onClick={handleOpenNewClient}
                  title="Start a new client report workspace"
                  className="flex items-center gap-1.5 text-[11px] font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-md transition border border-amber-300 shadow-2xs"
                >
                  <UserPlus className="w-3.5 h-3.5 text-amber-700" />
                  <span>+ New Client</span>
                </button>
              </div>

              {/* The Client Name: Never cut off, spacious, leading-normal, py-0.5 for ascender headroom */}
              <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight leading-normal py-0.5 whitespace-normal break-words">
                {report.clientName || 'Client Workspace'}
              </h1>

              {/* Client Tagline & Agency */}
              <p className="text-xs text-stone-600 font-normal leading-relaxed">
                <span className="font-medium text-stone-700">{report.clientSubtitle || 'Executive Monthly Performance'}</span>
                <span className="mx-1.5 text-stone-300">·</span>
                <span className="text-stone-500">{report.agencyName || 'Latsky Socials Intelligence'}</span>
              </p>
            </div>
          </div>

          {/* Right: Primary Workspace Controls */}
          <div className="flex items-center flex-wrap gap-2.5 shrink-0">
            {/* View Selector: Overall Socials vs Standalone Platform Reports */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowViewsMenu(!showViewsMenu)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-stone-300 bg-stone-100 text-stone-800 hover:bg-stone-200 transition shadow-2xs"
              >
                <Layers className="w-3.5 h-3.5 text-stone-600" />
                <span className="capitalize font-medium">
                  {activeReportView === 'overall' ? 'Overall Report' : `${activeReportView} Standalone`}
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

            {/* AI Screengrab Analysis Button (Hero Primary Button) */}
            <button
              type="button"
              onClick={onOpenAiModal}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg bg-stone-900 text-white hover:bg-stone-800 transition shadow-sm ring-2 ring-amber-400/25"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Analyze Screengrabs</span>
              {report.uploadedScreenshots && report.uploadedScreenshots.length > 0 && (
                <span className="text-[10px] bg-stone-700 text-amber-300 px-1.5 py-0.5 rounded-full font-mono">
                  {report.uploadedScreenshots.length}
                </span>
              )}
            </button>

            {/* Export Menu Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border border-stone-800 bg-white text-stone-900 hover:bg-stone-50 transition shadow-2xs"
              >
                <span>Export</span>
                <ChevronDown className="w-3 h-3 text-stone-500" />
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
                      <div className="font-medium">Download Full Dossier (HTML)</div>
                      <div className="text-[10px] text-stone-500">Standalone report ready to print</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowExportMenu(false);
                      saveReportToHistory(report);
                      exportWhiteLabelPDF(report);
                    }}
                    className="w-full px-3.5 py-2 flex items-center gap-2 text-stone-900 bg-emerald-50/70 hover:bg-emerald-100/70 transition"
                  >
                    <FileDown className="w-4 h-4 text-emerald-700 shrink-0" />
                    <div>
                      <div className="font-semibold text-emerald-950">One-Click White-Label PDF</div>
                      <div className="text-[10px] text-emerald-800">Print dialog with takeaways & hooks</div>
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

        {/* Tier 2: Utility Command Strip */}
        <div className="border-t border-stone-200/70 pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          {/* Left tools: Research & Evidence */}
          <div className="flex items-center flex-wrap gap-2">
            {report.uploadedScreenshots && report.uploadedScreenshots.length > 0 && onClearSources && (
              <button
                type="button"
                onClick={onClearSources}
                title="Clear old uploaded screenshots & sources for a clean start"
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>Clear Sources</span>
                <span className="text-[10px] px-1 bg-rose-200/80 rounded font-mono">({report.uploadedScreenshots.length})</span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenCaptureGuide}
              title="Show required screenshot checklist"
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border border-amber-200 bg-amber-50/70 text-amber-900 hover:bg-amber-100 transition"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Screengrab Guide</span>
            </button>

            <button
              type="button"
              onClick={onOpenFirecrawlModal}
              title="Scrape competitor web profiles with Firecrawl"
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border border-orange-200 bg-orange-50/70 text-orange-900 hover:bg-orange-100 transition"
            >
              <Globe className="w-3.5 h-3.5 text-orange-600" />
              <span>Firecrawl Web Radar</span>
            </button>

            <button
              type="button"
              onClick={onOpenGrowthRoadmap}
              title="View strategic growth roadmap"
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100 transition"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>Growth Roadmap</span>
            </button>
          </div>

          {/* Right utilities: Management, Save, Load, Print */}
          <div className="flex items-center flex-wrap gap-2">
            <button
              type="button"
              onClick={onToggleEditMode}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border transition ${
                isEditing
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Close Editor' : 'Edit Client Profile'}</span>
            </button>

            {/* Hidden JSON file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Load session from saved folder on laptop"
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 transition"
            >
              <FolderDown className="w-3.5 h-3.5 text-stone-500" />
              <span>Load (.json)</span>
            </button>

            <button
              type="button"
              onClick={onSaveToLaptop}
              title="Save current report session to laptop folder"
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 transition"
            >
              <Save className="w-3.5 h-3.5 text-stone-500" />
              <span>Save (.json)</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              title="Print or save as PDF"
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 transition"
            >
              <Printer className="w-3.5 h-3.5 text-stone-500" />
              <span>Print</span>
            </button>
          </div>
        </div>
      </div>

      {/* New Client Modal (rendered via React Portal directly onto document.body) */}
      <NewClientModal
        isOpen={isNewClientModalOpen}
        onClose={() => setIsNewClientModalOpen(false)}
        onCreateClient={(name, subtitle, period, mode) => {
          if (onCreateNewClient) {
            onCreateNewClient(name, subtitle, period, mode);
          }
        }}
      />
    </header>
  );
};
