import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { UserPlus, X, Check, Building2, Sparkles, Layers } from 'lucide-react';

interface NewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateClient: (
    clientName: string,
    clientSubtitle?: string,
    reportPeriod?: string,
    mode?: 'clean' | 'sample'
  ) => void;
}

export const NewClientModal: React.FC<NewClientModalProps> = ({
  isOpen,
  onClose,
  onCreateClient,
}) => {
  const [clientName, setClientName] = useState('');
  const [clientSubtitle, setClientSubtitle] = useState('');
  const [reportPeriod, setReportPeriod] = useState('October 2026');
  const [mode, setMode] = useState<'clean' | 'sample'>('clean');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the client name input automatically when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = clientName.trim();
    if (!trimmed) return;
    onCreateClient(trimmed, clientSubtitle.trim(), reportPeriod.trim(), mode);
    onClose();
    setClientName('');
    setClientSubtitle('');
    setMode('clean');
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] overflow-y-auto bg-stone-950/80 backdrop-blur-sm p-3 sm:p-6 flex items-center justify-center animate-in fade-in duration-200"
      style={{ minHeight: '100vh', minWidth: '100vw' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col my-auto max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-client-modal-title"
      >
        {/* Fixed Header - Pinned at top */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-stone-900 text-white rounded-xl shadow-xs">
              <UserPlus className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 id="new-client-modal-title" className="text-base font-bold text-stone-900 leading-snug">
                New Client Workspace
              </h2>
              <p className="text-xs text-stone-500 leading-normal">
                Set up a fresh executive monthly report
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="text-stone-400 hover:text-stone-700 p-2 rounded-xl hover:bg-stone-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="p-6 space-y-4 overflow-y-auto flex-1">
            
            {/* Primary Client / Brand Name Input */}
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-300/80 space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="new-client-name" className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-amber-700" />
                  <span>Client or Brand Name</span>
                  <span className="text-red-500">*</span>
                </label>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-800 bg-amber-200/70 px-2 py-0.5 rounded">
                  Required
                </span>
              </div>
              <input
                id="new-client-name"
                ref={inputRef}
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Lumina Studios, Apex Retail, Artisan Retreat"
                className="w-full text-sm font-semibold text-stone-900 bg-white px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-600 shadow-2xs placeholder:text-stone-400"
              />
              <p className="text-[11px] text-stone-600 leading-relaxed">
                This client brand name appears at the top header of the report and on all client exports.
              </p>
            </div>

            {/* Live Header Preview */}
            <div className="p-3 bg-stone-100/70 rounded-xl border border-stone-200/80 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                Workspace Header Preview
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold text-amber-800 bg-amber-100/80 px-1.5 py-0.5 rounded">
                  LATSKY SOCIALS
                </span>
                <span className="text-stone-300">/</span>
                <span className="text-[11px] text-stone-600 font-semibold">{reportPeriod || 'October 2026'}</span>
              </div>
              <div className="font-bold text-stone-900 text-sm mt-1 truncate">
                {clientName.trim() || 'Your Client Name'}
              </div>
              <div className="text-[11px] text-stone-500 truncate">
                {clientSubtitle.trim() || 'Executive Monthly Performance'} · Latsky Socials Intelligence
              </div>
            </div>

            {/* Client Focus / Subtitle */}
            <div className="space-y-1">
              <label htmlFor="new-client-subtitle" className="block text-xs font-semibold text-stone-700">
                Client Focus / Industry Subtitle <span className="font-normal text-stone-400">(Optional)</span>
              </label>
              <input
                id="new-client-subtitle"
                type="text"
                value={clientSubtitle}
                onChange={(e) => setClientSubtitle(e.target.value)}
                placeholder="e.g. Commercial Cinema, Hospitality & Culinary Retreats"
                className="w-full text-xs font-medium text-stone-900 bg-white px-3.5 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-400 placeholder:text-stone-400"
              />
            </div>

            {/* Reporting Period */}
            <div className="space-y-1">
              <label htmlFor="new-client-period" className="block text-xs font-semibold text-stone-700">
                Reporting Period
              </label>
              <input
                id="new-client-period"
                type="text"
                value={reportPeriod}
                onChange={(e) => setReportPeriod(e.target.value)}
                placeholder="e.g. October 2026"
                className="w-full text-xs font-medium text-stone-900 bg-white px-3.5 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-400 placeholder:text-stone-400"
              />
            </div>

            {/* Workspace Setup Mode */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-stone-700">
                Workspace Initial Data
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setMode('clean')}
                  className={`p-3 rounded-xl border text-left text-xs transition flex flex-col justify-between ${
                    mode === 'clean'
                      ? 'border-amber-600 bg-amber-50/70 ring-2 ring-amber-500/30 text-stone-900 font-semibold'
                      : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${mode === 'clean' ? 'bg-amber-600' : 'bg-stone-300'}`} />
                    <span className="font-bold text-stone-900">Clean Slate</span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1.5 leading-normal font-normal">
                    Starts at 0 across channels. Ready for JSON uploads, manual editing, or AI screenshots.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('sample')}
                  className={`p-3 rounded-xl border text-left text-xs transition flex flex-col justify-between ${
                    mode === 'sample'
                      ? 'border-amber-600 bg-amber-50/70 ring-2 ring-amber-500/30 text-stone-900 font-semibold'
                      : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${mode === 'sample' ? 'bg-amber-600' : 'bg-stone-300'}`} />
                    <span className="font-bold text-stone-900">Pre-Filled Sample</span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1.5 leading-normal font-normal">
                    Preloaded with realistic multi-platform metrics, posts, and benchmark competitors.
                  </p>
                </button>
              </div>
            </div>

            {/* Channels included notice */}
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-[11px] text-stone-600 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Initializes all 5 channels: <strong>Instagram</strong>, <strong>YouTube</strong>, <strong>LinkedIn</strong>, <strong>Facebook</strong>, and <strong>TikTok</strong>.
              </span>
            </div>
          </div>

          {/* Pinned Footer - Always Visible */}
          <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-200/60 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!clientName.trim()}
              className="px-5 py-2.5 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg shadow-sm transition flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4 text-amber-300" />
              <span>Create Client Workspace</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : modalContent;
};
