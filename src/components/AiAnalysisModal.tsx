import React, { useState, useRef } from 'react';
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
  HelpCircle
} from 'lucide-react';
import { PlatformType, SocialReportData, UploadedScreenshot } from '../types/report';
import { fileToBase64 } from '../utils/formatters';
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
  const [showChecklistGuide, setShowChecklistGuide] = useState(true);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingPlatformTagRef = useRef<PlatformType | null>(null);

  if (!isOpen) return null;

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setError(null);

    const newScreenshots: UploadedScreenshot[] = [];
    for (const file of files) {
      try {
        const base64 = await fileToBase64(file);
        
        let guessedPlatform: PlatformType = pendingPlatformTagRef.current || 'general';
        
        if (!pendingPlatformTagRef.current) {
          const nameLower = file.name.toLowerCase();
          if (nameLower.includes('fb') || nameLower.includes('meta') || nameLower.includes('facebook')) {
            guessedPlatform = 'facebook';
          } else if (nameLower.includes('ig') || nameLower.includes('insta') || nameLower.includes('instagram')) {
            guessedPlatform = 'instagram';
          } else if (nameLower.includes('yt') || nameLower.includes('youtube') || nameLower.includes('studio')) {
            guessedPlatform = 'youtube';
          } else if (nameLower.includes('li') || nameLower.includes('linkedin')) {
            guessedPlatform = 'linkedin';
          } else if (nameLower.includes('tik') || nameLower.includes('tiktok')) {
            guessedPlatform = 'tiktok';
          }
        }

        newScreenshots.push({
          id: `screen-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          name: file.name,
          platform: guessedPlatform,
          dataUrl: base64,
          uploadedAt: new Date().toISOString(),
        });
      } catch (err) {
        console.error('Error processing screenshot:', err);
      }
    }

    setScreenshots((prev) => [...prev, ...newScreenshots]);
    pendingPlatformTagRef.current = null;
    if (fileInputRef.current) fileInputRef.current.value = '';
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
  };

  const handleRunAnalysis = async () => {
    if (screenshots.length === 0) {
      setError('Please upload at least one dashboard screenshot to analyze.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      setAnalysisStep('Uploading screengrabs & prepping vision model...');
      
      const payload = {
        images: screenshots.map((s) => ({
          dataUrl: s.dataUrl,
          label: s.platform,
          name: s.name,
        })),
        clientName: clientName.trim() || 'Client Brand',
        clientSubtitle: clientSubtitle.trim(),
        reportPeriod: reportPeriod.trim() || 'Current Month',
        goals: goals.trim(),
        notes: notes.trim(),
        platforms: Array.from(new Set(screenshots.map((s) => s.platform).filter((p) => p !== 'general'))),
      };

      setAnalysisStep('Inspecting dashboard figures, format breakdowns & watch time...');

      const response = await fetch('/api/analyze-screenshots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      setAnalysisStep('Synthesizing cross-platform metrics, wins, and next month plan...');

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze screenshots.');
      }

      if (data.report) {
        onReportGenerated(data.report, screenshots);
        onClose();
      } else {
        throw new Error('No report data returned from server.');
      }
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.message || 'An error occurred during analysis.');
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 print:hidden">
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
                  LATSKY SOCIALS AI
                </span>
                <h2 className="text-base font-bold text-stone-900">
                  Dashboard Screengrab Analyzer
                </h2>
              </div>
              <p className="text-xs text-stone-500">
                Upload Facebook, Instagram, YouTube Studio, or LinkedIn analytics screenshots.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isAnalyzing}
            className="text-stone-400 hover:text-stone-600 p-1 rounded-md transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Error Message */}
          {error && (
            <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Analysis Failed</p>
                <p className="mt-0.5">{error}</p>
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
                  What specific screengrabs should I upload? (Checklist Guide)
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
                />
              </div>
            )}
          </div>

          {/* Upload Dropzone */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-stone-700">
                Upload Any Dashboard Screengrabs ({screenshots.length} uploaded)
              </label>
              <span className="text-[11px] text-stone-500">
                Supports PNG, JPEG, WEBP screengrabs
              </span>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFilesSelected}
              accept="image/*"
              multiple
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-stone-300 hover:border-stone-500 rounded-xl p-6 text-center cursor-pointer transition bg-stone-50/50 hover:bg-stone-50"
            >
              <Upload className="w-7 h-7 mx-auto text-stone-400 mb-2" />
              <div className="text-xs font-medium text-stone-800">
                Drop screengrabs here, or <span className="text-stone-900 underline underline-offset-2">browse files</span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                Upload Meta Business Suite, Instagram Insights, YouTube Studio, LinkedIn Analytics screenshots
              </p>
            </div>
          </div>

          {/* Screengrab Thumbnails List */}
          {screenshots.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-semibold text-stone-700">
                Attached Screengrabs
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {screenshots.map((item) => (
                  <div
                    key={item.id}
                    className="relative group border border-stone-200 rounded-lg overflow-hidden bg-white shadow-2xs"
                  >
                    <div className="h-24 bg-stone-100 flex items-center justify-center overflow-hidden">
                      <img
                        src={item.dataUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                    </div>
                    <div className="p-2 bg-white">
                      <p className="text-[11px] font-medium text-stone-800 truncate" title={item.name}>
                        {item.name}
                      </p>
                      <div className="mt-1 flex items-center justify-between">
                        <select
                          value={item.platform}
                          onChange={(e) => handleUpdatePlatformTag(item.id, e.target.value as PlatformType)}
                          className="text-[10px] py-0.5 px-1 bg-stone-50 border border-stone-200 rounded text-stone-700 focus:outline-none"
                        >
                          <option value="general">Auto / General</option>
                          <option value="youtube">YouTube</option>
                          <option value="instagram">Instagram</option>
                          <option value="facebook">Facebook</option>
                          <option value="linkedin">LinkedIn</option>
                          <option value="tiktok">TikTok</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => handleRemoveScreenshot(item.id)}
                          className="text-stone-400 hover:text-red-500 p-0.5 transition"
                          title="Remove screenshot"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analyzing Progress State */}
          {isAnalyzing && (
            <div className="p-4 rounded-xl bg-stone-900 text-white flex items-center gap-3 animate-pulse">
              <Loader2 className="w-5 h-5 text-amber-300 animate-spin shrink-0" />
              <div>
                <p className="text-xs font-semibold text-stone-100">
                  Multimodal Analysis in Progress
                </p>
                <p className="text-[11px] text-stone-300 mt-0.5">
                  {analysisStep || 'Analyzing dashboard screengrabs with Gemini...'}
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="text-xs text-stone-500">
            {screenshots.length} screenshot{screenshots.length === 1 ? '' : 's'} ready for synthesis
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isAnalyzing}
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleRunAnalysis}
              disabled={isAnalyzing || screenshots.length === 0}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-stone-900 text-white hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-sm transition"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing Report...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Generate Agency Report</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
