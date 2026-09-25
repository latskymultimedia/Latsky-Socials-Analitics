import React, { useState } from 'react';
import { 
  Globe, 
  Search, 
  Sparkles, 
  ExternalLink, 
  CheckCircle2, 
  Loader2, 
  AlertCircle,
  Key,
  ShieldCheck,
  TrendingUp,
  FileText
} from 'lucide-react';
import { CompetitorBenchmark } from '../types/report';

interface FirecrawlScraperModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientName: string;
  onAddCompetitor: (benchmark: CompetitorBenchmark) => void;
}

export const FirecrawlScraperModal: React.FC<FirecrawlScraperModalProps> = ({
  isOpen,
  onClose,
  clientName,
  onAddCompetitor,
}) => {
  const [targetUrl, setTargetUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    benchmark: CompetitorBenchmark;
    source: string;
    rawMarkdown?: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleScrape = async () => {
    if (!targetUrl) {
      setError('Please provide a competitor URL or profile link.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/firecrawl-scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: targetUrl.trim(),
          clientName,
          apiKey: apiKey.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to scrape and analyze URL.');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Scraping failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyToReport = () => {
    if (result?.benchmark) {
      onAddCompetitor(result.benchmark);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 print:hidden">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-orange-600 text-white rounded-md">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">
                Firecrawl Web Intelligence & Competitor Scraping
              </h2>
              <p className="text-xs text-stone-500">
                Scrape live competitor sites, social handles, or agency case studies for deep benchmarking.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 p-1"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto">
          
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-stone-700">
              Competitor Website or Public Social Page URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="e.g. https://www.acmefilms.com or https://youtube.com/@competitor"
                className="flex-1 text-xs px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
              <button
                type="button"
                onClick={handleScrape}
                disabled={isLoading || !targetUrl}
                className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 disabled:opacity-50 flex items-center gap-1.5 transition"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Scraping...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Analyze</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-stone-500">
              Firecrawl extracts the clean markdown from the page; our AI models then distill metrics, tone, and strategic gaps.
            </p>
          </div>

          {/* Optional Firecrawl API Key toggle */}
          <div className="pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setShowKeyInput(!showKeyInput)}
              className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1"
            >
              <Key className="w-3.5 h-3.5" />
              <span>{showKeyInput ? 'Hide Firecrawl API Key' : 'Configure Custom Firecrawl API Key (optional)'}</span>
            </button>

            {showKeyInput && (
              <div className="mt-2 p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-1.5">
                <label className="block text-[11px] font-semibold text-stone-700">
                  Custom Firecrawl API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="fc-..."
                  className="w-full text-xs px-3 py-1.5 rounded border border-stone-300 bg-white"
                />
                <p className="text-[10px] text-stone-500">
                  If left blank, the app will use server environment variables or AI fallback synthesis.
                </p>
              </div>
            )}
          </div>

          {/* Result Preview */}
          {result && (
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  Extracted via {result.source === 'firecrawl' ? 'Firecrawl API' : 'Deep Intelligence'}
                </span>
                <span className="text-xs text-stone-500 font-medium">Ready to inject</span>
              </div>

              <div className="bg-white p-3 rounded-lg border border-stone-200 space-y-2">
                <div className="flex justify-between items-baseline font-bold text-stone-900 text-sm">
                  <span>{result.benchmark.competitor}</span>
                  <span className="text-xs text-stone-500">{result.benchmark.followerCount} · {result.benchmark.avgEngagementRate}</span>
                </div>
                <div className="text-xs text-stone-700 leading-relaxed">
                  <span className="font-semibold text-stone-900">Strategic Takeaway: </span>
                  {result.benchmark.qualitativeNote}
                </div>
              </div>

              <button
                type="button"
                onClick={handleApplyToReport}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Add to Section 07 (Competitive Benchmarks)</span>
              </button>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-200 bg-stone-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
