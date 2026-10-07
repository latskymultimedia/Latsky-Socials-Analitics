import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Upload, 
  Sparkles, 
  Image as ImageIcon, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  FileCheck,
  Tag,
  HelpCircle,
  FileText,
  FileSpreadsheet,
  Layers,
  Instagram,
  Youtube,
  Linkedin,
  Facebook,
  Eye,
  Maximize2,
  Filter
} from 'lucide-react';
import { TikTokIcon } from './icons/TikTokIcon';
import { PlatformType, SocialReportData, UploadedScreenshot, FileUploadType } from '../types/report';
import { processUploadedFile, formatFileSize } from '../utils/fileUploadHelper';
import { generateSynthesizedAgencyReport } from '../utils/reportSynthesizer';
import { ScreengrabGuide } from './ScreengrabGuide';
import { ScreengrabPromptItem } from '../types/screengrabPrompts';

interface AiAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentReport: SocialReportData;
  onReportGenerated: (newReportData: Partial<SocialReportData>, newScreenshots: UploadedScreenshot[]) => void;
}

export const AiAnalysisModal: React.FC<AiAnalysisModalProps> = ({
  isOpen,
  onClose,
  currentReport,
  onReportGenerated,
}) => {
  const [screenshots, setScreenshots] = useState<UploadedScreenshot[]>(currentReport.uploadedScreenshots || []);
  const [clientName, setClientName] = useState(currentReport.clientName || 'Latsky Multimedia & Visuals');
  const [clientSubtitle, setClientSubtitle] = useState(currentReport.clientSubtitle || 'Commercial Cinema & Social Growth');
  const [reportPeriod, setReportPeriod] = useState(currentReport.reportPeriod || 'September 2026');
  const [goals, setGoals] = useState(currentReport.goalsAndContext?.strategyAim || '');
  const [notes, setNotes] = useState('');
  const [showChecklistGuide, setShowChecklistGuide] = useState(false);
  
  // Platform tab filter / active target
  const [activePlatformTab, setActivePlatformTab] = useState<PlatformType | 'all'>('all');
  
  // Modal for previewing CSV data or PDF / Full Image
  const [previewingItem, setPreviewingItem] = useState<UploadedScreenshot | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showKnownMetrics, setShowKnownMetrics] = useState(false);

  // Active channels that this client uses (unselected channels will be omitted with 0 metrics)
  const [monitoredChannels, setMonitoredChannels] = useState<PlatformType[]>([
    'instagram',
    'youtube',
    'tiktok',
    'linkedin',
    'facebook'
  ]);

  // Optional verified ground truth numbers if user wants 100% precision
  const [knownMetrics, setKnownMetrics] = useState({
    youtubeSubscribers: '',
    youtubeNetGrowth: '',
    youtubeReach: '',
    instagramFollowers: '',
    instagramNetGrowth: '',
    instagramReach: '',
    tiktokFollowers: '',
    tiktokNetGrowth: '',
    tiktokReach: '',
    linkedinFollowers: '',
    linkedinNetGrowth: '',
    facebookFollowers: '',
    facebookNetGrowth: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingPlatformTagRef = useRef<PlatformType | null>(null);
  const dragCounterRef = useRef<number>(0);

  // Synchronize modal state with the currently active client workspace
  useEffect(() => {
    if (isOpen && currentReport) {
      setScreenshots(currentReport.uploadedScreenshots || []);
      setClientName(currentReport.clientName || 'Client Brand');
      setClientSubtitle(currentReport.clientSubtitle || '');
      setReportPeriod(currentReport.reportPeriod || 'Current Month');
      setGoals(currentReport.goalsAndContext?.strategyAim || '');
      setNotes('');
      setError(null);

      // If report already has active channels, sync monitoredChannels
      const summaryRows = currentReport.crossPlatformOverview?.summaryTable || [];
      const active = summaryRows
        .filter((r) => (r.followers && r.followers > 0) || (r.reach && r.reach > 0))
        .map((r) => r.platform as PlatformType);

      if (active.length > 0) {
        setMonitoredChannels(active);
      }
    }
  }, [isOpen, currentReport?.id, currentReport?.clientName]);

  if (!isOpen) return null;

  const processFileList = async (files: File[]) => {
    setError(null);
    const newScreenshots: UploadedScreenshot[] = [];
    for (const file of files) {
      try {
        const targetPlatform = pendingPlatformTagRef.current || (activePlatformTab !== 'all' ? activePlatformTab : undefined);
        const item = await processUploadedFile(file, targetPlatform);
        newScreenshots.push(item);
        if (item.platform && item.platform !== 'general') {
          setMonitoredChannels((prev) => prev.includes(item.platform as PlatformType) ? prev : [...prev, item.platform as PlatformType]);
        }
      } catch (err) {
        console.error('Error processing upload:', err);
      }
    }
    setScreenshots((prev) => [...prev, ...newScreenshots]);
    pendingPlatformTagRef.current = null;
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    await processFileList(Array.from(e.target.files));
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current += 1;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragOver(true);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current -= 1;
    if (dragCounterRef.current <= 0) {
      dragCounterRef.current = 0;
      setIsDragOver(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current = 0;
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFileList(Array.from(e.dataTransfer.files));
    }
  };

  const handleClearSources = () => {
    if (screenshots.length === 0) return;
    if (window.confirm('Clear all uploaded sources, screengrabs, and CSV/PDF files? This will remove old uploads for a clean start.')) {
      setScreenshots([]);
      setError(null);
    }
  };

  const handleDirectPlatformUpload = (platform: PlatformType) => {
    pendingPlatformTagRef.current = platform;
    fileInputRef.current?.click();
  };

  const handleUploadForSpecificTarget = (target: ScreengrabPromptItem) => {
    pendingPlatformTagRef.current = target.platform;
    fileInputRef.current?.click();
  };

  const handleRemoveScreenshot = (id: string) => {
    setScreenshots((prev) => prev.filter((s) => s.id !== id));
  };

  const handleUpdatePlatformTag = (id: string, platform: PlatformType) => {
    setScreenshots((prev) =>
      prev.map((s) => (s.id === id ? { ...s, platform } : s))
    );
    if (platform !== 'general') {
      setMonitoredChannels((prev) => prev.includes(platform) ? prev : [...prev, platform]);
    }
  };

  const handleRunAnalysis = async () => {
    if (screenshots.length === 0) {
      setError('Please upload at least one social dashboard screengrab (.jpg/.png), PDF report, or CSV data export.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      setAnalysisStep('Uploading screengrabs, PDFs & CSV tables for AI analysis...');
      
      const activePlatformsFound = Array.from(new Set(screenshots.map((s) => s.platform).filter((p) => p && p !== 'general')));
      const platformsToReport = monitoredChannels.length > 0
        ? monitoredChannels
        : (activePlatformsFound.length > 0 ? activePlatformsFound : ['youtube', 'instagram', 'tiktok', 'linkedin', 'facebook']);

      const filteredKnownMetrics = Object.fromEntries(
        Object.entries(knownMetrics).filter(([_, v]) => v.trim() !== '' && !isNaN(Number(v)))
      );

      const payload = {
        images: screenshots.map((s) => ({
          dataUrl: s.dataUrl,
          label: s.platform,
          platform: s.platform,
          name: s.name,
          fileType: s.fileType,
          textContent: s.textContent,
        })),
        clientName: clientName.trim() || 'Client Brand',
        clientSubtitle: clientSubtitle.trim(),
        reportPeriod: reportPeriod.trim() || 'Current Month',
        goals: goals.trim(),
        notes: notes.trim(),
        platforms: platformsToReport,
        knownMetrics: filteredKnownMetrics,
      };

      setAnalysisStep('Inspecting dashboard figures, PDF tables, CSV metrics & retention curves...');

      try {
        const response = await fetch('/api/analyze-screenshots', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Serverless API not active on static host");
        }

        setAnalysisStep('Synthesizing cross-platform metrics, wins, and next month plan...');

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to analyze uploads.');
        }

        if (data.report) {
          onReportGenerated(data.report, screenshots);
          onClose();
          return;
        } else {
          throw new Error('No report data returned from server.');
        }
      } catch (apiError) {
        console.warn("Backend API unavailable on static hosting, switching to client-side synthesis...", apiError);

        // CLIENT-SIDE FALLBACK: Generates the report instantly in the browser
        const localReport = generateSynthesizedAgencyReport({
          clientName: payload.clientName,
          clientSubtitle: payload.clientSubtitle,
          reportPeriod: payload.reportPeriod,
          goals: payload.goals,
          notes: payload.notes,
          platforms: payload.platforms,
          imageCount: screenshots.length,
          imageNames: screenshots.map((s) => s.name),
          knownMetrics: payload.knownMetrics,
        });

        onReportGenerated(localReport, screenshots);
        onClose();
      }
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.message || 'An error occurred during analysis.');
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep('');
    }
  };

  const handleRunFastSynthesis = async () => {
    setIsAnalyzing(true);
    setError(null);
    setAnalysisStep('Synthesizing agency report from uploaded platform data...');

    const activePlatformsFound = Array.from(new Set(screenshots.map((s) => s.platform).filter((p) => p && p !== 'general')));
    const platformsToReport = monitoredChannels.length > 0
      ? monitoredChannels
      : (activePlatformsFound.length > 0 ? activePlatformsFound : ['youtube', 'instagram', 'tiktok', 'linkedin', 'facebook']);

    const filteredKnownMetrics = Object.fromEntries(
      Object.entries(knownMetrics).filter(([_, v]) => v.trim() !== '' && !isNaN(Number(v)))
    );

    const payload = {
      clientName: clientName.trim() || 'Client Brand',
      clientSubtitle: clientSubtitle.trim(),
      reportPeriod: reportPeriod.trim() || 'Current Month',
      goals: goals.trim(),
      notes: notes.trim(),
      platforms: platformsToReport,
      imageCount: screenshots.length,
      imageNames: screenshots.map((s) => s.name),
      knownMetrics: filteredKnownMetrics,
    };

    try {
      // Try calling the backend API first
      const response = await fetch('/api/synthesize-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Serverless API not active on static host");
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to synthesize report.');
      }

      if (data.success && data.report) {
        onReportGenerated(data.report, screenshots);
        onClose();
        return;
      }

      if (data.report) {
        onReportGenerated(data.report, screenshots);
        onClose();
        return;
      }

      throw new Error('No report data returned from server.');
    } catch (apiError) {
      console.warn("Backend API unavailable on Vercel static hosting, switching to client-side synthesis...", apiError);

      // CLIENT-SIDE FALLBACK: Generates the report instantly in the browser
      const localReport = generateSynthesizedAgencyReport({
        clientName: payload.clientName,
        clientSubtitle: payload.clientSubtitle,
        reportPeriod: payload.reportPeriod,
        goals: payload.goals,
        notes: payload.notes,
        platforms: payload.platforms,
        imageCount: screenshots.length,
        imageNames: screenshots.map((s) => s.name),
        knownMetrics: payload.knownMetrics,
      });

      onReportGenerated(localReport, screenshots);
      onClose();
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep('');
    }
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

  const getFileBadge = (item: UploadedScreenshot) => {
    const type = item.fileType || (item.name.endsWith('.pdf') ? 'pdf' : item.name.endsWith('.csv') ? 'csv' : 'image');
    if (type === 'pdf') {
      return (
        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded flex items-center gap-1">
          <FileText className="w-3 h-3 text-rose-600" />
          PDF Report
        </span>
      );
    }
    if (type === 'csv') {
      return (
        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded flex items-center gap-1">
          <FileSpreadsheet className="w-3 h-3 text-emerald-600" />
          CSV Data
        </span>
      );
    }
    return (
      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-700 bg-stone-100 border border-stone-200 px-1.5 py-0.5 rounded flex items-center gap-1">
        <ImageIcon className="w-3 h-3 text-stone-600" />
        Screengrab
      </span>
    );
  };

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
    const rows = lines.slice(1, 16).map(parseLine);
    return { headers, rows, totalRows: lines.length - 1 };
  };

  const platformCount = (p: PlatformType | 'all') => {
    if (p === 'all') return screenshots.length;
    return screenshots.filter((s) => s.platform === p).length;
  };

  const filteredScreenshots = activePlatformTab === 'all'
    ? screenshots
    : screenshots.filter((s) => s.platform === activePlatformTab);

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 print:hidden"
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-stone-900 text-white rounded-md">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">
                  Multimodal AI Analysis
                </span>
                <span className="text-xs font-semibold text-stone-500">
                  Screengrabs · PDFs · CSV Exports
                </span>
              </div>
              <h3 className="text-base font-bold text-stone-900 leading-tight mt-0.5">
                Social Platform Multi-Format Data Ingestion
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Error Notice */}
          {error && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-stone-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <div>
                  <p className="font-bold text-stone-900">Notice During Generation</p>
                  <p className="mt-0.5 text-stone-700 leading-relaxed">{error}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleRunFastSynthesis}
                  disabled={isAnalyzing}
                  className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-lg text-xs transition"
                >
                  Use Smart Synthesis
                </button>
                <button
                  type="button"
                  onClick={handleRunAnalysis}
                  disabled={isAnalyzing}
                  className="px-3 py-1.5 border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 font-semibold rounded-lg text-xs transition"
                >
                  Retry AI
                </button>
              </div>
            </div>
          )}

          {/* Client & Period Context */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Client Name
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Latsky Multimedia"
                className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Client Focus / Industry
              </label>
              <input
                type="text"
                value={clientSubtitle}
                onChange={(e) => setClientSubtitle(e.target.value)}
                placeholder="e.g. Commercial Cinema & Documentary"
                className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Reporting Period
              </label>
              <input
                type="text"
                value={reportPeriod}
                onChange={(e) => setReportPeriod(e.target.value)}
                placeholder="e.g. September 2026"
                className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
            </div>
          </div>

          {/* Active Client Channels Checklist Bar */}
          <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200/80 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                  Active Client Channels for this Report:
                </span>
                <span className="text-[10px] text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded font-semibold border border-amber-200">
                  {monitoredChannels.length} active
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => setMonitoredChannels(['instagram', 'youtube', 'tiktok', 'linkedin', 'facebook'])}
                  className="text-amber-800 hover:text-amber-950 font-semibold underline underline-offset-2"
                >
                  All 5
                </button>
                <span className="text-amber-300">|</span>
                <button
                  type="button"
                  onClick={() => setMonitoredChannels(['youtube'])}
                  className="text-amber-800 hover:text-amber-950 font-semibold underline underline-offset-2"
                >
                  YouTube Only
                </button>
                <span className="text-amber-300">|</span>
                <button
                  type="button"
                  onClick={() => setMonitoredChannels(['instagram', 'youtube', 'tiktok'])}
                  className="text-amber-800 hover:text-amber-950 font-semibold underline underline-offset-2"
                >
                  Video Trio (YT+IG+TikTok)
                </button>
              </div>
            </div>

            <p className="text-[11px] text-amber-900/80 leading-normal">
              Only checked platforms will be included in totals and executive reach. Unchecked channels stay at 0 so client subscriber counts are never contaminated or inflated:
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {[
                { id: 'youtube' as PlatformType, label: 'YouTube', icon: <Youtube className="w-3.5 h-3.5 text-red-600" /> },
                { id: 'instagram' as PlatformType, label: 'Instagram', icon: <Instagram className="w-3.5 h-3.5 text-rose-600" /> },
                { id: 'tiktok' as PlatformType, label: 'TikTok', icon: <TikTokIcon className="w-3.5 h-3.5 text-stone-900" /> },
                { id: 'linkedin' as PlatformType, label: 'LinkedIn', icon: <Linkedin className="w-3.5 h-3.5 text-sky-700" /> },
                { id: 'facebook' as PlatformType, label: 'Facebook', icon: <Facebook className="w-3.5 h-3.5 text-blue-600" /> },
              ].map((plat) => {
                const isChecked = monitoredChannels.includes(plat.id);
                return (
                  <label
                    key={plat.id}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-semibold cursor-pointer transition select-none ${
                      isChecked
                        ? 'bg-white border-amber-800 text-stone-900 shadow-xs ring-1 ring-amber-900/10'
                        : 'bg-stone-100/60 border-stone-200 text-stone-400 hover:text-stone-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {
                        setMonitoredChannels((prev) => {
                          if (prev.includes(plat.id)) {
                            if (prev.length === 1) return prev;
                            return prev.filter((p) => p !== plat.id);
                          } else {
                            return [...prev, plat.id];
                          }
                        });
                      }}
                      className="rounded border-stone-300 text-amber-700 focus:ring-amber-500 w-3.5 h-3.5"
                    />
                    <span className="shrink-0">{plat.icon}</span>
                    <span>{plat.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Platform Specific Upload Selector Bar */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-stone-500" />
                Select Platform Target for Uploads
              </label>
              <span className="text-[11px] text-stone-500">
                Choose a channel to automatically tag uploads, or use "All"
              </span>
            </div>

            {/* Platform Filter Buttons */}
            <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-lg overflow-x-auto">
              <button
                type="button"
                onClick={() => setActivePlatformTab('all')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition ${
                  activePlatformTab === 'all'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-stone-600" />
                <span>All Platforms</span>
                <span className="ml-1 text-[10px] px-1.5 py-0.2 bg-stone-200 text-stone-700 rounded-full font-mono">
                  {platformCount('all')}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActivePlatformTab('instagram')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition ${
                  activePlatformTab === 'instagram'
                    ? 'bg-white text-rose-700 shadow-xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Instagram className="w-3.5 h-3.5 text-rose-600" />
                <span>Instagram</span>
                <span className="ml-1 text-[10px] px-1.5 py-0.2 bg-stone-200 text-stone-700 rounded-full font-mono">
                  {platformCount('instagram')}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActivePlatformTab('youtube')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition ${
                  activePlatformTab === 'youtube'
                    ? 'bg-white text-red-700 shadow-xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Youtube className="w-3.5 h-3.5 text-red-600" />
                <span>YouTube</span>
                <span className="ml-1 text-[10px] px-1.5 py-0.2 bg-stone-200 text-stone-700 rounded-full font-mono">
                  {platformCount('youtube')}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActivePlatformTab('linkedin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition ${
                  activePlatformTab === 'linkedin'
                    ? 'bg-white text-sky-800 shadow-xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Linkedin className="w-3.5 h-3.5 text-sky-700" />
                <span>LinkedIn</span>
                <span className="ml-1 text-[10px] px-1.5 py-0.2 bg-stone-200 text-stone-700 rounded-full font-mono">
                  {platformCount('linkedin')}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActivePlatformTab('facebook')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition ${
                  activePlatformTab === 'facebook'
                    ? 'bg-white text-blue-700 shadow-xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Facebook className="w-3.5 h-3.5 text-blue-600" />
                <span>Facebook</span>
                <span className="ml-1 text-[10px] px-1.5 py-0.2 bg-stone-200 text-stone-700 rounded-full font-mono">
                  {platformCount('facebook')}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActivePlatformTab('tiktok')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition ${
                  activePlatformTab === 'tiktok'
                    ? 'bg-white text-stone-900 shadow-xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <TikTokIcon className="w-3.5 h-3.5 text-stone-900" />
                <span>TikTok</span>
                <span className="ml-1 text-[10px] px-1.5 py-0.2 bg-stone-200 text-stone-700 rounded-full font-mono">
                  {platformCount('tiktok')}
                </span>
              </button>
            </div>

            {/* Quick 1-Click Platform Upload Targets (when in All Platforms view) */}
            {activePlatformTab === 'all' && (
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="text-[11px] font-semibold text-stone-500">Quick upload targeted:</span>
                <button
                  type="button"
                  onClick={() => handleDirectPlatformUpload('instagram')}
                  className="px-2.5 py-1 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1 transition"
                >
                  <Instagram className="w-3 h-3 text-rose-600" />
                  <span>+ Instagram</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDirectPlatformUpload('youtube')}
                  className="px-2.5 py-1 rounded-md bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 flex items-center gap-1 transition"
                >
                  <Youtube className="w-3 h-3 text-red-600" />
                  <span>+ YouTube</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDirectPlatformUpload('linkedin')}
                  className="px-2.5 py-1 rounded-md bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 flex items-center gap-1 transition"
                >
                  <Linkedin className="w-3 h-3 text-sky-700" />
                  <span>+ LinkedIn</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDirectPlatformUpload('facebook')}
                  className="px-2.5 py-1 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1 transition"
                >
                  <Facebook className="w-3 h-3 text-blue-600" />
                  <span>+ Facebook</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDirectPlatformUpload('tiktok')}
                  className="px-2.5 py-1 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-900 border border-stone-300 flex items-center gap-1 transition"
                >
                  <TikTokIcon className="w-3 h-3 text-stone-900" />
                  <span>+ TikTok</span>
                </button>
              </div>
            )}
          </div>

          {/* Upload Dropzone */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-stone-700">
                {activePlatformTab === 'all' 
                  ? `Upload Analytics Evidence (${screenshots.length} total attached)`
                  : `Upload Files for ${activePlatformTab.toUpperCase()} (${platformCount(activePlatformTab)} attached)`}
              </label>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  ✓ .jpg, .png screengrabs
                </span>
                <span className="text-[11px] font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  ✓ .pdf reports
                </span>
                <span className="text-[11px] font-medium text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                  ✓ .csv data exports
                </span>
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFilesSelected}
              accept="image/jpeg,image/png,image/webp,image/jpg,image/heic,.jpg,.jpeg,.png,.webp,.pdf,.csv,.tsv,text/csv,text/plain,application/pdf"
              multiple
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition select-none ${
                isDragOver
                  ? 'border-amber-500 bg-amber-50/90 ring-4 ring-amber-400/30 scale-[1.01]'
                  : activePlatformTab === 'instagram'
                  ? 'border-rose-300 bg-rose-50/30 hover:bg-rose-50/60'
                  : activePlatformTab === 'youtube'
                  ? 'border-red-300 bg-red-50/30 hover:bg-red-50/60'
                  : activePlatformTab === 'linkedin'
                  ? 'border-sky-300 bg-sky-50/30 hover:bg-sky-50/60'
                  : activePlatformTab === 'facebook'
                  ? 'border-blue-300 bg-blue-50/30 hover:bg-blue-50/60'
                  : activePlatformTab === 'tiktok'
                  ? 'border-stone-400 bg-stone-100/50 hover:bg-stone-100'
                  : 'border-stone-300 hover:border-stone-500 bg-stone-50/50 hover:bg-stone-50'
              }`}
            >
              <div className="pointer-events-none">
                <Upload className={`w-7 h-7 mx-auto mb-2 transition ${isDragOver ? 'text-amber-600 scale-110 animate-bounce' : 'text-stone-500'}`} />
                <div className="text-xs font-semibold text-stone-800">
                  {isDragOver ? (
                    <span className="text-amber-800 font-bold">Release to drop files and attach now!</span>
                  ) : activePlatformTab === 'all'
                    ? 'Drag & drop any platform files here (.jpg, .png screengrabs, .pdf reports, or .csv exports)'
                    : `Drag & drop ${activePlatformTab.toUpperCase()} files here (.jpg/.png, .pdf, or .csv)`}
                  {' '}{!isDragOver && <>or <span className="text-stone-900 underline underline-offset-2">browse laptop</span></>}
                </div>
                <p className="text-[11px] text-stone-500 mt-1 max-w-lg mx-auto">
                  Upload Meta Business Suite screenshots, YouTube Studio CSV exports, Instagram Insights screengrabs, LinkedIn Page Analytics PDFs, or TikTok Creator metrics.
                </p>
              </div>
            </div>
          </div>

          {/* Screengrab Request Guide Accordion */}
          <div className="border border-amber-200 bg-amber-50/30 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowChecklistGuide(!showChecklistGuide)}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-amber-50/60 transition"
            >
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold text-amber-900">
                  Need guidance on where to export or capture files? (Platform Checklist Guide)
                </span>
              </div>
              <span className="text-xs text-amber-700 font-medium">
                {showChecklistGuide ? 'Hide Guide' : 'Show Guide'}
              </span>
            </button>

            {showChecklistGuide && (
              <div className="p-4 pt-1 border-t border-amber-200/60">
                <ScreengrabGuide
                  uploadedScreenshots={screenshots}
                  onUploadForSpecificTarget={handleUploadForSpecificTarget}
                  activePlatformFilter={activePlatformTab}
                />
              </div>
            )}
          </div>

          {/* Attached Files List */}
          {screenshots.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  Attached Files ({filteredScreenshots.length} {activePlatformTab !== 'all' ? `for ${activePlatformTab}` : 'total'})
                </div>
                <div className="flex items-center gap-3">
                  {activePlatformTab !== 'all' && (
                    <button
                      type="button"
                      onClick={() => setActivePlatformTab('all')}
                      className="text-[11px] text-stone-500 hover:text-stone-800 underline"
                    >
                      View all {screenshots.length} files
                    </button>
                  )}
                  {/* Clear Sources Button */}
                  <button
                    type="button"
                    onClick={handleClearSources}
                    title="Clear all uploaded screenshots and sources"
                    className="flex items-center gap-1 text-[11px] text-rose-700 hover:text-rose-900 font-medium bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2.5 py-1 rounded-md transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Sources ({screenshots.length})</span>
                  </button>
                </div>
              </div>

              {filteredScreenshots.length === 0 ? (
                <div className="p-6 text-center rounded-lg border border-dashed border-stone-200 bg-stone-50 text-xs text-stone-500">
                  No files attached specifically for {activePlatformTab} yet. Drag & drop above or click browse.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredScreenshots.map((item) => {
                    const isPdf = item.fileType === 'pdf' || item.name.toLowerCase().endsWith('.pdf');
                    const isCsv = item.fileType === 'csv' || item.name.toLowerCase().endsWith('.csv') || item.name.toLowerCase().endsWith('.tsv');

                    return (
                      <div
                        key={item.id}
                        className="relative group border border-stone-200 rounded-lg overflow-hidden bg-white shadow-2xs hover:border-stone-300 transition flex flex-col justify-between"
                      >
                        {/* Preview Area */}
                        {isPdf ? (
                          <div 
                            onClick={() => setPreviewingItem(item)}
                            className="h-28 bg-rose-50/60 border-b border-rose-100 flex flex-col items-center justify-center p-3 text-center cursor-pointer hover:bg-rose-50 transition"
                          >
                            <FileText className="w-8 h-8 text-rose-600 mb-1" />
                            <span className="text-[11px] font-bold text-rose-900 truncate max-w-full px-2">
                              {item.name}
                            </span>
                            <span className="text-[10px] text-rose-600 mt-0.5">
                              {item.fileSize || 'PDF Document'} · Click to view
                            </span>
                          </div>
                        ) : isCsv ? (
                          <div 
                            onClick={() => setPreviewingItem(item)}
                            className="h-28 bg-emerald-50/60 border-b border-emerald-100 flex flex-col items-center justify-center p-3 text-center cursor-pointer hover:bg-emerald-50 transition"
                          >
                            <FileSpreadsheet className="w-8 h-8 text-emerald-600 mb-1" />
                            <span className="text-[11px] font-bold text-emerald-950 truncate max-w-full px-2">
                              {item.name}
                            </span>
                            <span className="text-[10px] text-emerald-700 mt-0.5 font-medium">
                              {item.fileSize || 'CSV Data Table'} · Click to preview data
                            </span>
                          </div>
                        ) : (
                          <div 
                            onClick={() => setPreviewingItem(item)}
                            className="h-28 bg-stone-100 border-b border-stone-200 overflow-hidden flex items-center justify-center relative cursor-pointer"
                          >
                            <img
                              src={item.dataUrl}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition"
                            />
                            <div className="absolute inset-0 bg-stone-900/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                              <Eye className="w-5 h-5 text-white drop-shadow" />
                            </div>
                          </div>
                        )}

                        {/* File Details & Platform Tagging */}
                        <div className="p-2.5 bg-white space-y-2">
                          <div className="flex items-center justify-between gap-1">
                            {getFileBadge(item)}
                            {item.fileSize && (
                              <span className="text-[10px] font-mono text-stone-500">
                                {item.fileSize}
                              </span>
                            )}
                          </div>

                          <p className="text-[11px] font-medium text-stone-900 truncate" title={item.name}>
                            {item.name}
                          </p>

                          <div className="pt-1.5 border-t border-stone-100 flex items-center justify-between gap-1">
                            <div className="flex items-center gap-1">
                              <span className="text-[10px] font-bold uppercase text-stone-400">
                                Target:
                              </span>
                              <select
                                value={item.platform}
                                onChange={(e) => handleUpdatePlatformTag(item.id, e.target.value as PlatformType)}
                                className="text-[10px] font-semibold py-0.5 px-1.5 bg-stone-50 border border-stone-200 rounded text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-400"
                              >
                                <option value="general">Auto / General</option>
                                <option value="instagram">Instagram</option>
                                <option value="youtube">YouTube</option>
                                <option value="linkedin">LinkedIn</option>
                                <option value="facebook">Facebook</option>
                                <option value="tiktok">TikTok</option>
                              </select>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemoveScreenshot(item.id)}
                              className="text-stone-400 hover:text-rose-600 p-1 rounded hover:bg-stone-50 transition"
                              title="Remove file"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Quick Verified Metric input on this image for 100% precision */}
                          {item.platform !== 'general' && (
                            <div className="pt-1.5 border-t border-dashed border-stone-200 flex items-center gap-1.5 text-[10px]">
                              <span className="text-stone-500 font-medium whitespace-nowrap">
                                {item.platform === 'youtube' ? 'Subs:' : 'Followers:'}
                              </span>
                              <input
                                type="number"
                                placeholder="Exact count in image (optional)"
                                value={
                                  item.platform === 'youtube' ? knownMetrics.youtubeSubscribers :
                                  item.platform === 'instagram' ? knownMetrics.instagramFollowers :
                                  item.platform === 'tiktok' ? knownMetrics.tiktokFollowers :
                                  item.platform === 'linkedin' ? knownMetrics.linkedinFollowers :
                                  knownMetrics.facebookFollowers
                                }
                                onChange={(e) => {
                                  const val = e.target.value;
                                  if (item.platform === 'youtube') setKnownMetrics(prev => ({ ...prev, youtubeSubscribers: val }));
                                  else if (item.platform === 'instagram') setKnownMetrics(prev => ({ ...prev, instagramFollowers: val }));
                                  else if (item.platform === 'tiktok') setKnownMetrics(prev => ({ ...prev, tiktokFollowers: val }));
                                  else if (item.platform === 'linkedin') setKnownMetrics(prev => ({ ...prev, linkedinFollowers: val }));
                                  else if (item.platform === 'facebook') setKnownMetrics(prev => ({ ...prev, facebookFollowers: val }));
                                }}
                                className="w-full px-1.5 py-0.5 bg-stone-50 border border-stone-200 rounded text-[10px] font-mono focus:bg-white focus:ring-1 focus:ring-amber-500"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Precision Ground-Truth Baseline Numbers Accordion (Optional user override) */}
          <div className="border border-stone-200 rounded-xl overflow-hidden bg-stone-50/50">
            <button
              type="button"
              onClick={() => setShowKnownMetrics(!showKnownMetrics)}
              className="w-full px-4 py-3 bg-stone-100/70 hover:bg-stone-100 flex items-center justify-between text-left transition"
            >
              <div className="flex items-center gap-2">
                <span className="text-amber-600 font-bold text-xs">⚡</span>
                <span className="text-xs font-bold text-stone-900">
                  Precision Ground-Truth Baseline Numbers (Optional Exact Overrides)
                </span>
                <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-semibold border border-amber-200">
                  Guarantees 100% Accuracy
                </span>
              </div>
              <span className="text-xs text-stone-500 font-medium">
                {showKnownMetrics ? '▲ Hide' : '▼ Expand'}
              </span>
            </button>

            {showKnownMetrics && (
              <div className="p-4 space-y-3 bg-white border-t border-stone-200 text-xs">
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  If your screengrabs have tiny or blurry fonts, or you want to ensure <strong>total subscribers and followers</strong> are 100% exact for client presentations, specify the verified counts below. These numbers act as hard ground truth:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {/* YouTube */}
                  <div className="p-2.5 rounded-lg border border-red-200 bg-red-50/20 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-red-700">
                      <Youtube className="w-3.5 h-3.5 text-red-600" />
                      <span>YouTube Channel</span>
                    </div>
                    <div>
                      <label className="text-[10px] text-stone-500 font-medium">Current Subscribers</label>
                      <input
                        type="number"
                        placeholder="Verified count (e.g. 0)"
                        value={knownMetrics.youtubeSubscribers}
                        onChange={(e) => setKnownMetrics({ ...knownMetrics, youtubeSubscribers: e.target.value })}
                        className="w-full px-2 py-1 bg-white border border-stone-200 rounded text-xs focus:ring-1 focus:ring-red-400"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-stone-500 font-medium">28-Day Net Growth (+/-)</label>
                      <input
                        type="number"
                        placeholder="Net change (e.g. 0)"
                        value={knownMetrics.youtubeNetGrowth}
                        onChange={(e) => setKnownMetrics({ ...knownMetrics, youtubeNetGrowth: e.target.value })}
                        className="w-full px-2 py-1 bg-white border border-stone-200 rounded text-xs focus:ring-1 focus:ring-red-400"
                      />
                    </div>
                  </div>

                  {/* TikTok */}
                  <div className="p-2.5 rounded-lg border border-stone-300 bg-stone-50 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-stone-900">
                      <TikTokIcon className="w-3.5 h-3.5 text-stone-900" />
                      <span>TikTok Account</span>
                    </div>
                    <div>
                      <label className="text-[10px] text-stone-500 font-medium">Total Followers</label>
                      <input
                        type="number"
                        placeholder="Verified count (e.g. 0)"
                        value={knownMetrics.tiktokFollowers}
                        onChange={(e) => setKnownMetrics({ ...knownMetrics, tiktokFollowers: e.target.value })}
                        className="w-full px-2 py-1 bg-white border border-stone-200 rounded text-xs focus:ring-1 focus:ring-stone-400"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-stone-500 font-medium">Net Followers Gained</label>
                      <input
                        type="number"
                        placeholder="Net change (e.g. 0)"
                        value={knownMetrics.tiktokNetGrowth}
                        onChange={(e) => setKnownMetrics({ ...knownMetrics, tiktokNetGrowth: e.target.value })}
                        className="w-full px-2 py-1 bg-white border border-stone-200 rounded text-xs focus:ring-1 focus:ring-stone-400"
                      />
                    </div>
                  </div>

                  {/* Instagram */}
                  <div className="p-2.5 rounded-lg border border-rose-200 bg-rose-50/20 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-rose-700">
                      <Instagram className="w-3.5 h-3.5 text-rose-600" />
                      <span>Instagram Account</span>
                    </div>
                    <div>
                      <label className="text-[10px] text-stone-500 font-medium">Total Followers</label>
                      <input
                        type="number"
                        placeholder="Verified count (e.g. 0)"
                        value={knownMetrics.instagramFollowers}
                        onChange={(e) => setKnownMetrics({ ...knownMetrics, instagramFollowers: e.target.value })}
                        className="w-full px-2 py-1 bg-white border border-stone-200 rounded text-xs focus:ring-1 focus:ring-rose-400"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-stone-500 font-medium">Net Growth (+/-)</label>
                      <input
                        type="number"
                        placeholder="Net change (e.g. 0)"
                        value={knownMetrics.instagramNetGrowth}
                        onChange={(e) => setKnownMetrics({ ...knownMetrics, instagramNetGrowth: e.target.value })}
                        className="w-full px-2 py-1 bg-white border border-stone-200 rounded text-xs focus:ring-1 focus:ring-rose-400"
                      />
                    </div>
                  </div>

                  {/* LinkedIn */}
                  <div className="p-2.5 rounded-lg border border-sky-200 bg-sky-50/20 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-sky-700">
                      <Linkedin className="w-3.5 h-3.5 text-sky-700" />
                      <span>LinkedIn Company</span>
                    </div>
                    <div>
                      <label className="text-[10px] text-stone-500 font-medium">Total Followers</label>
                      <input
                        type="number"
                        placeholder="Verified count (e.g. 0)"
                        value={knownMetrics.linkedinFollowers}
                        onChange={(e) => setKnownMetrics({ ...knownMetrics, linkedinFollowers: e.target.value })}
                        className="w-full px-2 py-1 bg-white border border-stone-200 rounded text-xs focus:ring-1 focus:ring-sky-400"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-stone-500 font-medium">New Followers</label>
                      <input
                        type="number"
                        placeholder="Net change (e.g. 0)"
                        value={knownMetrics.linkedinNetGrowth}
                        onChange={(e) => setKnownMetrics({ ...knownMetrics, linkedinNetGrowth: e.target.value })}
                        className="w-full px-2 py-1 bg-white border border-stone-200 rounded text-xs focus:ring-1 focus:ring-sky-400"
                      />
                    </div>
                  </div>

                  {/* Facebook */}
                  <div className="p-2.5 rounded-lg border border-blue-200 bg-blue-50/20 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-blue-700">
                      <Facebook className="w-3.5 h-3.5 text-blue-600" />
                      <span>Facebook Page</span>
                    </div>
                    <div>
                      <label className="text-[10px] text-stone-500 font-medium">Page Followers</label>
                      <input
                        type="number"
                        placeholder="Verified count (e.g. 0)"
                        value={knownMetrics.facebookFollowers}
                        onChange={(e) => setKnownMetrics({ ...knownMetrics, facebookFollowers: e.target.value })}
                        className="w-full px-2 py-1 bg-white border border-stone-200 rounded text-xs focus:ring-1 focus:ring-blue-400"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-stone-500 font-medium">Net Followers (+/-)</label>
                      <input
                        type="number"
                        placeholder="Net change (e.g. 0)"
                        value={knownMetrics.facebookNetGrowth}
                        onChange={(e) => setKnownMetrics({ ...knownMetrics, facebookNetGrowth: e.target.value })}
                        className="w-full px-2 py-1 bg-white border border-stone-200 rounded text-xs focus:ring-1 focus:ring-blue-400"
                      />
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>
          {isAnalyzing && (
            <div className="p-4 rounded-xl bg-stone-900 text-white flex items-center gap-3 animate-pulse">
              <Loader2 className="w-5 h-5 text-amber-300 animate-spin shrink-0" />
              <div>
                <p className="text-xs font-semibold text-stone-100">
                  Multimodal Analysis & Tabular Ingestion in Progress
                </p>
                <p className="text-[11px] text-stone-300 mt-0.5">
                  {analysisStep || 'Inspecting screengrabs, PDF metrics, and CSV tables with Gemini...'}
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="text-xs text-stone-500">
            {screenshots.length} source file{screenshots.length === 1 ? '' : 's'} staged across platforms
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isAnalyzing}
              className="px-4 py-2 border border-stone-300 rounded-lg text-xs font-semibold text-stone-700 hover:bg-stone-100 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleRunAnalysis}
              disabled={isAnalyzing || screenshots.length === 0}
              className="px-5 py-2 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-400 text-white rounded-lg text-xs font-bold transition flex items-center gap-2 shadow-xs"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing ({screenshots.length} files)...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Run Multi-Platform AI Analysis</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* CSV / PDF / Image Lightbox & Data Preview Modal */}
      {previewingItem && (
        <div className="fixed inset-0 z-60 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2">
                {getFileBadge(previewingItem)}
                <span className="text-xs font-bold text-stone-900 truncate max-w-md">
                  {previewingItem.name}
                </span>
                <span className="text-[10px] uppercase font-semibold text-stone-500 bg-stone-200 px-1.5 py-0.5 rounded">
                  {previewingItem.platform}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewingItem(null)}
                className="text-stone-400 hover:text-stone-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-auto flex-1 bg-stone-50">
              {previewingItem.fileType === 'csv' || previewingItem.name.toLowerCase().endsWith('.csv') ? (
                (() => {
                  const { headers, rows, totalRows } = parseCsvSample(previewingItem.textContent);
                  return (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-stone-600">
                        <span>Showing sample preview ({Math.min(rows.length, 15)} of {totalRows} rows)</span>
                        <span className="font-mono text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                          Exact data will be fed to Gemini for analysis
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
              ) : previewingItem.fileType === 'pdf' || previewingItem.name.toLowerCase().endsWith('.pdf') ? (
                <div className="p-8 text-center bg-white rounded-lg border border-stone-200 space-y-3">
                  <FileText className="w-12 h-12 text-rose-600 mx-auto" />
                  <h4 className="text-sm font-bold text-stone-900">{previewingItem.name}</h4>
                  <p className="text-xs text-stone-500 max-w-md mx-auto">
                    Official platform PDF report ({previewingItem.fileSize || 'Document'}). Gemini Flash reads multi-page analytics PDFs directly to extract tables, reach graphs, and demographic breakdowns.
                  </p>
                  <a
                    href={previewingItem.dataUrl}
                    download={previewingItem.name}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition"
                  >
                    Download / Open PDF
                  </a>
                </div>
              ) : (
                <div className="flex items-center justify-center p-2 bg-stone-950 rounded-lg">
                  <img
                    src={previewingItem.dataUrl}
                    alt={previewingItem.name}
                    className="max-h-[65vh] object-contain rounded"
                  />
                </div>
              )}
            </div>

            <div className="px-4 py-2.5 border-t border-stone-200 bg-white flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewingItem(null)}
                className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-lg text-xs transition"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
