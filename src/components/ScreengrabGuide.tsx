import React, { useState } from 'react';
import { 
  CheckCircle2, 
  HelpCircle, 
  Upload, 
  ChevronRight, 
  ExternalLink, 
  Sparkles,
  Info,
  Layers,
  Facebook,
  Instagram,
  Youtube,
  Linkedin
} from 'lucide-react';
import { REQUIRED_SCREENGRAB_CHECKLIST, ScreengrabPromptItem } from '../types/screengrabPrompts';
import { PlatformType, UploadedScreenshot } from '../types/report';

interface ScreengrabGuideProps {
  uploadedScreenshots: UploadedScreenshot[];
  onUploadForSpecificTarget: (target: ScreengrabPromptItem) => void;
  activePlatformFilter?: PlatformType | 'all';
}

export const ScreengrabGuide: React.FC<ScreengrabGuideProps> = ({
  uploadedScreenshots,
  onUploadForSpecificTarget,
  activePlatformFilter = 'all',
}) => {
  const [selectedPrompt, setSelectedPrompt] = useState<ScreengrabPromptItem | null>(null);

  const getPlatformIcon = (platform: PlatformType) => {
    switch (platform) {
      case 'youtube':
        return <Youtube className="w-4 h-4 text-red-600" />;
      case 'instagram':
        return <Instagram className="w-4 h-4 text-rose-600" />;
      case 'linkedin':
        return <Linkedin className="w-4 h-4 text-sky-700" />;
      case 'facebook':
        return <Facebook className="w-4 h-4 text-blue-600" />;
      default:
        return <Layers className="w-4 h-4 text-stone-600" />;
    }
  };

  const filteredItems = REQUIRED_SCREENGRAB_CHECKLIST.filter((item) => {
    if (activePlatformFilter === 'all') return true;
    return item.platform === activePlatformFilter;
  });

  return (
    <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-stone-900 text-white px-2 py-0.5 rounded">
              Guided Capture Checklist
            </span>
            <span className="text-xs text-stone-500 font-medium">
              Screengrabs requested for an agency-grade report
            </span>
          </div>
          <h3 className="text-sm font-bold text-stone-900 mt-1">
            Exact Dashboard Screens Needed
          </h3>
        </div>
        <div className="text-xs text-stone-500 font-medium">
          {uploadedScreenshots.length} screengrabs attached
        </div>
      </div>

      <p className="text-xs text-stone-600 leading-relaxed">
        To build the most accurate monthly report with genuine watch-time curves, conversion rates, and format splits, upload these specific dashboard views:
      </p>

      {/* Grid of requested views */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredItems.map((item, idx) => {
          // Check if user has uploaded a screenshot tagged with this platform
          const matchingUploads = uploadedScreenshots.filter((s) => s.platform === item.platform);
          const hasUpload = matchingUploads.length > 0;

          return (
            <div
              key={item.id}
              className={`p-3.5 rounded-lg border transition text-left flex flex-col justify-between ${
                hasUpload
                  ? 'bg-emerald-50/40 border-emerald-200'
                  : 'bg-white border-stone-200 hover:border-stone-400'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded bg-stone-100 border border-stone-200">
                      {getPlatformIcon(item.platform)}
                    </span>
                    <span className="text-[10px] font-bold uppercase text-stone-500">
                      #{idx + 1} {item.platform}
                    </span>
                  </div>

                  {hasUpload ? (
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{matchingUploads.length} Attached</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                      Required
                    </span>
                  )}
                </div>

                <h4 className="text-xs font-bold text-stone-900 leading-snug">
                  {item.title}
                </h4>

                <p className="text-[11px] text-stone-600 mt-1 leading-normal">
                  {item.description}
                </p>

                {/* Target metrics */}
                <div className="mt-2.5 pt-2 border-t border-stone-100 flex flex-wrap gap-1">
                  {item.requiredMetricTargets.map((m) => (
                    <span
                      key={m}
                      className="text-[9.5px] bg-stone-100 text-stone-700 px-1.5 py-0.5 rounded"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action bar */}
              <div className="mt-3 pt-2 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedPrompt(item)}
                  className="text-[11px] text-stone-500 hover:text-stone-800 underline underline-offset-2"
                >
                  Where to find this?
                </button>
                <button
                  type="button"
                  onClick={() => onUploadForSpecificTarget(item)}
                  className="px-2.5 py-1 rounded-md bg-stone-900 text-white text-[11px] font-medium hover:bg-stone-800 flex items-center gap-1"
                >
                  <Upload className="w-3 h-3" />
                  <span>Upload Screengrab</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Dialog */}
      {selectedPrompt && (
        <div className="p-4 rounded-lg bg-stone-900 text-white text-xs space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="font-bold uppercase tracking-wider text-amber-300 text-[10px]">
              How to Grab: {selectedPrompt.title}
            </span>
            <button
              type="button"
              onClick={() => setSelectedPrompt(null)}
              className="text-stone-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          <p className="text-stone-200 leading-relaxed font-mono text-[11px]">
            {selectedPrompt.exampleInstruction}
          </p>
          <div className="text-[10px] text-stone-400">
            Tip: Press <kbd className="px-1 py-0.5 bg-stone-800 rounded">Shift + Cmd + 4</kbd> (Mac) or <kbd className="px-1 py-0.5 bg-stone-800 rounded">Win + Shift + S</kbd> (Windows) to crop the analytics cards directly.
          </div>
        </div>
      )}
    </div>
  );
};
