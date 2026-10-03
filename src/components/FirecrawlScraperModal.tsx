import React, { useState, useEffect } from 'react';
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
  FileText,
  Users,
  Eye,
  Share2,
  Bookmark,
  Check
} from 'lucide-react';
import { CompetitorBenchmark, IndustryWebIntel, PlatformGrowthPlaybook, PlatformType } from '../types/report';

interface FirecrawlScraperModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientName: string;
  defaultIndustry?: string;
  onAddCompetitor: (benchmark: CompetitorBenchmark) => void;
  onApplyIndustryIntel?: (intel: IndustryWebIntel, playbooks?: { [k in PlatformType]?: PlatformGrowthPlaybook }) => void;
}

export const FirecrawlScraperModal: React.FC<FirecrawlScraperModalProps> = ({
  isOpen,
  onClose,
  clientName,
  defaultIndustry = 'Commercial Film Production & Documentary Cinema',
  onAddCompetitor,
  onApplyIndustryIntel,
}) => {
  const [activeTab, setActiveTab] = useState<'industry' | 'competitor'>('industry');

  // Industry scraping state
  const [industryName, setIndustryName] = useState(defaultIndustry);
  const [customUrls, setCustomUrls] = useState('');
  
  // Competitor URL state
  const [targetUrl, setTargetUrl] = useState('');

  // API Key state with localStorage persistence
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('latsky_firecrawl_key') || '';
  });
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [savedKeyNotice, setSavedKeyNotice] = useState(false);

  // Loading & error
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Results
  const [industryResult, setIndustryResult] = useState<{
    industryIntel: IndustryWebIntel;
    platformPlaybooks: { [k in PlatformType]?: PlatformGrowthPlaybook };
    source: string;
    sourcesScraped?: string[];
  } | null>(null);

  const [competitorResult, setCompetitorResult] = useState<{
    benchmark: CompetitorBenchmark;
    source: string;
    rawMarkdown?: string;
  } | null>(null);

  // Sync default industry if changed
  useEffect(() => {
    if (defaultIndustry) {
      setIndustryName(defaultIndustry);
    }
  }, [defaultIndustry]);

  if (!isOpen) return null;

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('latsky_firecrawl_key', key.trim());
    setSavedKeyNotice(true);
    setTimeout(() => setSavedKeyNotice(false), 2500);
  };

  // Run industry-wide live web scraping via Firecrawl + Gemini
  const handleScrapeIndustry = async () => {
    if (!industryName.trim()) {
      setError('Please provide the customer industry or vertical.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setIndustryResult(null);

    const urls = customUrls
      .split('\n')
      .map((u) => u.trim())
      .filter((u) => u.startsWith('http'));

    try {
      const response = await fetch('/api/industry-web-intel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          industry: industryName.trim(),
          clientName,
          apiKey: apiKey.trim(),
          targetUrls: urls,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to scrape and synthesize industry web data.');
      }

      setIndustryResult(data);
    } catch (err: any) {
      setError(err.message || 'Industry scraping failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Run competitor URL scraping
  const handleScrapeCompetitor = async () => {
    if (!targetUrl.trim()) {
      setError('Please provide a competitor URL or profile link.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setCompetitorResult(null);

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

      setCompetitorResult(data);
    } catch (err: any) {
      setError(err.message || 'Scraping failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyIndustryToReport = () => {
    if (industryResult?.industryIntel && onApplyIndustryIntel) {
      onApplyIndustryIntel(industryResult.industryIntel, industryResult.platformPlaybooks);
      onClose();
    }
  };

  const handleApplyCompetitorToReport = () => {
    if (competitorResult?.benchmark) {
      onAddCompetitor(competitorResult.benchmark);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 print:hidden">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-orange-600 text-white rounded-lg">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-orange-800 bg-orange-100 px-1.5 py-0.2 rounded">
                  FIRECRAWL LIVE WEB INTEL
                </span>
                <h2 className="text-base font-bold text-stone-900">
                  Live Web Scraping & Trend Radar
                </h2>
              </div>
              <p className="text-xs text-stone-500">
                Scrape live web data for the client's industry to inform subs, views, comments & algorithm news.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 p-1.5 rounded-lg transition"
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-stone-200 bg-stone-100/70 px-6 pt-2">
          <button
            type="button"
            onClick={() => {
              setActiveTab('industry');
              setError(null);
            }}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'industry'
                ? 'border-orange-600 text-orange-950 bg-white rounded-t-lg'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span>Customer Industry Scraping & Strategy Radar</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('competitor');
              setError(null);
            }}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'competitor'
                ? 'border-orange-600 text-orange-950 bg-white rounded-t-lg'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-stone-500" />
            <span>Single Competitor URL Scraping</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* TAB 1: INDUSTRY SCRAPING */}
          {activeTab === 'industry' && (
            <div className="space-y-4">
              
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-800">
                  Customer Industry / Niche / Vertical
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={industryName}
                    onChange={(e) => setIndustryName(e.target.value)}
                    placeholder="e.g. Commercial Film Production & Cinema, B2B SaaS, E-commerce Beauty..."
                    className="flex-1 text-xs px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-400 font-medium"
                  />
                  <button
                    type="button"
                    onClick={handleScrapeIndustry}
                    disabled={isLoading || !industryName}
                    className="px-4 py-2 bg-stone-900 text-white text-xs font-bold rounded-lg hover:bg-stone-800 disabled:opacity-50 flex items-center gap-1.5 transition shadow-xs"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Scraping Web...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>Scrape & Analyze Industry</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-stone-500">
                  Firecrawl crawls the web for trending hooks, viral video formats, sub acquisition funnels, and 2026 algorithm news in this vertical.
                </p>
              </div>

              {/* Optional reference URLs */}
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-stone-700">
                  Optional Target Industry Competitor URLs or Blogs to Scrape (one per line)
                </label>
                <textarea
                  rows={2}
                  value={customUrls}
                  onChange={(e) => setCustomUrls(e.target.value)}
                  placeholder="https://example-competitor.com&#10;https://industry-news.com/trends"
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 font-mono text-[11px]"
                />
              </div>

              {/* Live Industry Results Preview */}
              {industryResult && (
                <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      Scraped via {industryResult.source === 'firecrawl_live' ? 'Firecrawl API' : 'Deep Industry Intelligence'}
                    </span>
                    <span className="text-xs text-stone-500">
                      Industry: <strong>{industryResult.industryIntel.industryName}</strong>
                    </span>
                  </div>

                  {/* Overview */}
                  <div className="text-xs text-stone-800 leading-relaxed bg-white p-3 rounded-lg border border-stone-200">
                    <strong>Industry Social Overview: </strong>
                    {industryResult.industryIntel.industryOverview}
                  </div>

                  {/* 3 Playbook Pillars */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-white rounded-lg border border-stone-200 space-y-1">
                      <div className="font-bold text-emerald-800 flex items-center gap-1 text-[11px] uppercase">
                        <Users className="w-3.5 h-3.5" />
                        <span>How to Get More Subs</span>
                      </div>
                      <p className="text-stone-700 text-[11px] leading-relaxed">
                        {industryResult.industryIntel.subGrowthPlaybook}
                      </p>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-stone-200 space-y-1">
                      <div className="font-bold text-blue-800 flex items-center gap-1 text-[11px] uppercase">
                        <Eye className="w-3.5 h-3.5" />
                        <span>How to Get More Views</span>
                      </div>
                      <p className="text-stone-700 text-[11px] leading-relaxed">
                        {industryResult.industryIntel.viewsAndReachPlaybook}
                      </p>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-stone-200 space-y-1">
                      <div className="font-bold text-purple-800 flex items-center gap-1 text-[11px] uppercase">
                        <Share2 className="w-3.5 h-3.5" />
                        <span>How to Spark Comments</span>
                      </div>
                      <p className="text-stone-700 text-[11px] leading-relaxed">
                        {industryResult.industryIntel.commentsAndDebatesPlaybook}
                      </p>
                    </div>
                  </div>

                  {/* 2026 Algorithm News */}
                  <div className="space-y-1.5">
                    <div className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Social Platform Algorithm News to Watch in 2026</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      {industryResult.industryIntel.socialAlgorithmNews2026.map((item, idx) => (
                        <div key={idx} className="p-2.5 bg-white rounded-lg border border-stone-200 space-y-0.5">
                          <div className="flex justify-between font-bold text-stone-900 text-[11px]">
                            <span className="text-amber-700">{item.platform}</span>
                          </div>
                          <div className="font-semibold text-stone-800 text-[11px]">{item.newsHeadline}</div>
                          <div className="text-stone-500 text-[10px]">{item.strategicTakeaway}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Apply Button */}
                  <button
                    type="button"
                    onClick={handleApplyIndustryToReport}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Apply Industry Intel & Update All Platform Breakdown Suggestions</span>
                  </button>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: COMPETITOR URL SCRAPING */}
          {activeTab === 'competitor' && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-800">
                  Competitor Website or Public Social Page URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    placeholder="e.g. https://www.acmefilms.com or https://youtube.com/@competitor"
                    className="flex-1 text-xs px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-400 font-medium"
                  />
                  <button
                    type="button"
                    onClick={handleScrapeCompetitor}
                    disabled={isLoading || !targetUrl}
                    className="px-4 py-2 bg-stone-900 text-white text-xs font-bold rounded-lg hover:bg-stone-800 disabled:opacity-50 flex items-center gap-1.5 transition shadow-xs"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Scraping...</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-3.5 h-3.5 text-stone-300" />
                        <span>Scrape Competitor</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-stone-500">
                  Scrapes the competitor's profile, follower metrics, and strategic positioning into Section 07 (Competitive Benchmarks).
                </p>
              </div>

              {/* Competitor Result Preview */}
              {competitorResult && (
                <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      Extracted via {competitorResult.source === 'firecrawl' ? 'Firecrawl API' : 'Deep Intelligence'}
                    </span>
                    <span className="text-xs text-stone-500 font-medium">Ready to inject</span>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-stone-200 space-y-2">
                    <div className="flex justify-between items-baseline font-bold text-stone-900 text-sm">
                      <span>{competitorResult.benchmark.competitor}</span>
                      <span className="text-xs text-stone-500">{competitorResult.benchmark.followerCount} · {competitorResult.benchmark.avgEngagementRate}</span>
                    </div>
                    <div className="text-xs text-stone-700 leading-relaxed">
                      <span className="font-semibold text-stone-900">Strategic Takeaway: </span>
                      {competitorResult.benchmark.qualitativeNote}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleApplyCompetitorToReport}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Add to Section 07 (Competitive Benchmarks)</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Firecrawl API Key Configuration Box */}
          <div className="pt-3 border-t border-stone-200">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowKeyInput(!showKeyInput)}
                className="text-xs font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-1.5"
              >
                <Key className="w-3.5 h-3.5 text-orange-600" />
                <span>
                  {apiKey ? 'Firecrawl API Key Configured (Click to change)' : 'Enter your free Firecrawl API Key'}
                </span>
              </button>
              {apiKey && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  Free Key Saved ✓
                </span>
              )}
            </div>

            {showKeyInput && (
              <div className="mt-2.5 p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold text-stone-800">
                    Your Firecrawl API Key (e.g. fc-...)
                  </label>
                  {savedKeyNotice && (
                    <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Saved to browser session!
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="fc-..."
                    className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-stone-300 bg-white font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => handleSaveApiKey(apiKey)}
                    className="px-3 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800"
                  >
                    Save Key
                  </button>
                </div>
                <p className="text-[10px] text-stone-500">
                  Your free Firecrawl API key is stored safely in your browser's localStorage and passed to the backend server proxy to scrape live web articles and search results.
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Real-time live web extraction powered by Firecrawl & Gemini</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 border border-stone-300 rounded-lg bg-white hover:bg-stone-50 transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
