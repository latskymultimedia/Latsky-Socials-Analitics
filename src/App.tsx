import React, { useState, useEffect } from 'react';
import { verandertReport, artisanRetreatReport } from './data/mockReports';
import { PlatformType, SocialReportData, UploadedScreenshot, CompetitorBenchmark } from './types/report';
import { Header } from './components/Header';
import { ReportEditor } from './components/ReportEditor';
import { AiAnalysisModal } from './components/AiAnalysisModal';
import { FirecrawlScraperModal } from './components/FirecrawlScraperModal';
import { GrowthRoadmap } from './components/GrowthRoadmap';
import { ScreengrabGuide } from './components/ScreengrabGuide';
import { StandalonePlatformReport } from './components/StandalonePlatformReport';
import { ExecutiveSummarySection } from './components/ExecutiveSummarySection';
import { GoalsContextSection } from './components/GoalsContextSection';
import { CrossPlatformTable } from './components/CrossPlatformTable';
import { PlatformBreakdownSection } from './components/PlatformBreakdownSection';
import { ContentPerformanceSection } from './components/ContentPerformanceSection';
import { AudienceAndBenchmarkSection } from './components/AudienceAndBenchmarkSection';
import { RecommendationsSection } from './components/RecommendationsSection';
import { ScreengrabsAppendix } from './components/ScreengrabsAppendix';
import { 
  saveSessionToLaptop, 
  parseSessionFile, 
  saveCurrentReportToStorage, 
  loadCurrentReportFromStorage, 
  generateExecutiveMarkdown 
} from './utils/sessionStorage';
import { CheckCircle2, AlertCircle, X, Layers, Sparkles } from 'lucide-react';

export default function App() {
  const [report, setReport] = useState<SocialReportData>(() => {
    const saved = loadCurrentReportFromStorage();
    return saved || verandertReport;
  });

  const [activeReportView, setActiveReportView] = useState<'overall' | PlatformType>('overall');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [isFirecrawlModalOpen, setIsFirecrawlModalOpen] = useState<boolean>(false);
  const [isCaptureGuideOpen, setIsCaptureGuideOpen] = useState<boolean>(false);
  const [isGrowthRoadmapOpen, setIsGrowthRoadmapOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Auto-save to local storage on changes
  useEffect(() => {
    saveCurrentReportToStorage(report);
  }, [report]);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleUpdateReport = (updated: Partial<SocialReportData>) => {
    setReport((prev) => ({
      ...prev,
      ...updated,
      lastModified: new Date().toISOString(),
    }));
  };

  const handleSaveToLaptop = () => {
    saveSessionToLaptop(report);
    showToast(`Session file saved to your laptop folder as "${report.clientName}_Social_Report.json"`);
  };

  const handleLoadFromLaptop = async (file: File) => {
    try {
      const loadedReport = await parseSessionFile(file);
      setReport(loadedReport);
      showToast(`Successfully loaded session for "${loadedReport.clientName}"!`);
    } catch (err: any) {
      showToast(err.message || 'Failed to read session file', 'error');
    }
  };

  const handleLoadPreset = (presetKey: 'verandert' | 'retreat') => {
    const preset = presetKey === 'retreat' ? artisanRetreatReport : verandertReport;
    setReport(preset);
    showToast(`Loaded ${preset.clientName} template report.`);
  };

  const handleExportMarkdown = async () => {
    const md = generateExecutiveMarkdown(report);
    try {
      await navigator.clipboard.writeText(md);
      showToast('Executive summary copied to clipboard (Markdown / Email format)!');
    } catch (err) {
      showToast('Could not copy to clipboard automatically', 'error');
    }
  };

  const handleAiReportGenerated = (
    newReportData: Partial<SocialReportData>,
    newScreenshots: UploadedScreenshot[]
  ) => {
    setReport((prev) => ({
      ...prev,
      ...newReportData,
      uploadedScreenshots: [...(prev.uploadedScreenshots || []), ...newScreenshots],
      lastModified: new Date().toISOString(),
    }));
    showToast(`AI analysis complete! Report synthesized for ${newReportData.clientName || report.clientName}.`);
  };

  const handleAddFirecrawlCompetitor = (benchmark: CompetitorBenchmark) => {
    setReport((prev) => ({
      ...prev,
      competitiveBenchmark: {
        ...prev.competitiveBenchmark,
        competitors: [benchmark, ...prev.competitiveBenchmark.competitors],
      },
    }));
    showToast(`Added ${benchmark.competitor} to Section 07 (Competitive Benchmarks).`);
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-lg shadow-xl bg-stone-900 text-white text-xs border border-stone-700 animate-in fade-in slide-in-from-bottom-2">
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Main Header / Navigation */}
      <Header
        report={report}
        onUpdateReport={handleUpdateReport}
        onOpenAiModal={() => setIsAiModalOpen(true)}
        onOpenFirecrawlModal={() => setIsFirecrawlModalOpen(true)}
        onOpenCaptureGuide={() => setIsCaptureGuideOpen(true)}
        onOpenGrowthRoadmap={() => setIsGrowthRoadmapOpen(true)}
        onSaveToLaptop={handleSaveToLaptop}
        onLoadFromLaptop={handleLoadFromLaptop}
        onLoadPreset={handleLoadPreset}
        onExportMarkdown={handleExportMarkdown}
        isEditing={isEditing}
        onToggleEditMode={() => setIsEditing(!isEditing)}
        activeReportView={activeReportView}
        onSelectReportView={setActiveReportView}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        
        {/* Workspace Editing Drawer / Bar */}
        {isEditing && (
          <ReportEditor
            report={report}
            onUpdateReport={handleUpdateReport}
            onCloseEditor={() => setIsEditing(false)}
          />
        )}

        {/* Screengrab Checklist Guidance Modal / Banner */}
        {isCaptureGuideOpen && (
          <div className="bg-white rounded-xl border border-stone-300 p-6 shadow-sm space-y-4 print:hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                  Capture Protocol
                </span>
                <h3 className="text-sm font-bold text-stone-900">
                  Dashboard Screengrabs Requested for Full Monthly Report
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCaptureGuideOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <ScreengrabGuide
              uploadedScreenshots={report.uploadedScreenshots}
              onUploadForSpecificTarget={(target) => {
                setIsCaptureGuideOpen(false);
                setIsAiModalOpen(true);
              }}
            />
          </div>
        )}

        {/* Growth Roadmap View Drawer */}
        {isGrowthRoadmapOpen && (
          <div className="space-y-4 print:hidden">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsGrowthRoadmapOpen(false)}
                className="text-xs font-semibold text-stone-600 hover:text-stone-900 underline"
              >
                Close Growth Roadmap
              </button>
            </div>
            <GrowthRoadmap onClose={() => setIsGrowthRoadmapOpen(false)} />
          </div>
        )}

        {/* CONDITIONAL RENDERING: Standalone Single-Platform Report vs Overall Socials Report */}
        {activeReportView !== 'overall' ? (
          <StandalonePlatformReport
            report={report}
            platform={activeReportView}
            onBackToOverall={() => setActiveReportView('overall')}
            onSaveToLaptop={handleSaveToLaptop}
          />
        ) : (
          <>
            {/* Print & Presentation Cover Header */}
            <div className="hidden print:block border-b-2 border-stone-900 pb-6 mb-8">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-xs uppercase font-mono tracking-widest text-stone-500">
                    Latsky Socials Intelligence · {report.reportPeriod}
                  </span>
                  <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
                    {report.clientName}
                  </h1>
                  <p className="text-sm text-stone-600">
                    {report.clientSubtitle} · {report.comparisonPeriod}
                  </p>
                </div>
                {report.clientLogoUrl && (
                  <img
                    src={report.clientLogoUrl}
                    alt="Client Logo"
                    className="w-16 h-16 object-contain"
                  />
                )}
              </div>
              <div className="mt-4 pt-3 border-t border-stone-200 text-xs text-stone-500 flex justify-between">
                <span>Prepared by {report.preparedBy || report.agencyName}</span>
                <span>Generated {new Date().toLocaleDateString()}</span>
              </div>
            </div>

            {/* 1. Executive Summary */}
            <ExecutiveSummarySection
              report={report}
              isEditing={isEditing}
              onUpdate={(summaryUpdate) =>
                handleUpdateReport({
                  executiveSummary: { ...report.executiveSummary, ...summaryUpdate },
                })
              }
            />

            {/* 2. Goals & Context */}
            <GoalsContextSection
              report={report}
              isEditing={isEditing}
              onUpdate={(goalsUpdate) =>
                handleUpdateReport({
                  goalsAndContext: { ...report.goalsAndContext, ...goalsUpdate },
                })
              }
            />

            {/* 3. Cross-Platform Overview Table */}
            <CrossPlatformTable
              report={report}
              isEditing={isEditing}
              onUpdateTable={(table) =>
                handleUpdateReport({
                  crossPlatformOverview: {
                    ...report.crossPlatformOverview,
                    summaryTable: table,
                  },
                })
              }
              onUpdateInsight={(highlightInsight) =>
                handleUpdateReport({
                  crossPlatformOverview: {
                    ...report.crossPlatformOverview,
                    highlightInsight,
                  },
                })
              }
            />

            {/* 4. Platform-by-Platform Deep Dive */}
            <PlatformBreakdownSection
              report={report}
              isEditing={isEditing}
              onUpdateReport={handleUpdateReport}
            />

            {/* 5. Content Performance Deep-Dive */}
            <ContentPerformanceSection
              report={report}
              isEditing={isEditing}
              onUpdateTopPosts={(topPosts) =>
                handleUpdateReport({
                  contentPerformance: {
                    ...report.contentPerformance,
                    topPostsAllPlatforms: topPosts,
                  },
                })
              }
              onUpdatePillars={(pillars) =>
                handleUpdateReport({
                  contentPerformance: {
                    ...report.contentPerformance,
                    contentPillars: pillars,
                  },
                })
              }
            />

            {/* 6 & 7. Audience Insights & Competitive Benchmarks */}
            <AudienceAndBenchmarkSection
              report={report}
              isEditing={isEditing}
            />

            {/* 8. Recommendations & Next Month's Plan */}
            <RecommendationsSection
              report={report}
              isEditing={isEditing}
              onUpdate={(recUpdate) =>
                handleUpdateReport({
                  recommendations: { ...report.recommendations, ...recUpdate },
                })
              }
            />

            {/* Appendix: Source Screengrabs & Verification */}
            <ScreengrabsAppendix
              report={report}
              onOpenUploadModal={() => setIsAiModalOpen(true)}
            />
          </>
        )}

      </main>

      {/* AI Screengrab Analysis Modal */}
      <AiAnalysisModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        currentReport={report}
        onReportGenerated={handleAiReportGenerated}
      />

      {/* Firecrawl Scraper Modal */}
      <FirecrawlScraperModal
        isOpen={isFirecrawlModalOpen}
        onClose={() => setIsFirecrawlModalOpen(false)}
        clientName={report.clientName}
        onAddCompetitor={handleAddFirecrawlCompetitor}
      />

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-6 mt-12 text-center text-xs text-stone-500 print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="font-bold text-stone-800">Latsky Socials</span> · Agency-Grade Social Performance Analytics
          </div>
          <div className="flex items-center gap-4 text-stone-600">
            <button
              type="button"
              onClick={() => setIsCaptureGuideOpen(true)}
              className="hover:text-stone-900 underline underline-offset-2"
            >
              Screengrab Guide
            </button>
            <button
              type="button"
              onClick={() => setIsFirecrawlModalOpen(true)}
              className="hover:text-stone-900 underline underline-offset-2"
            >
              Firecrawl Competitor Web
            </button>
            <button
              type="button"
              onClick={() => setIsGrowthRoadmapOpen(true)}
              className="hover:text-stone-900 underline underline-offset-2"
            >
              Growth Roadmap
            </button>
            <button
              type="button"
              onClick={handleSaveToLaptop}
              className="hover:text-stone-900 underline underline-offset-2"
            >
              Save Session (.json)
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="hover:text-stone-900 underline underline-offset-2"
            >
              Export PDF
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
