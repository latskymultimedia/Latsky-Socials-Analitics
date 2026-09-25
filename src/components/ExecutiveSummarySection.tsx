import React from 'react';
import { ArrowUpRight, ArrowDownRight, Award, AlertTriangle, TrendingUp } from 'lucide-react';
import { SocialReportData } from '../types/report';
import { formatNumber, formatPercent } from '../utils/formatters';

interface ExecutiveSummarySectionProps {
  report: SocialReportData;
  isEditing?: boolean;
  onUpdate?: (data: Partial<SocialReportData['executiveSummary']>) => void;
}

export const ExecutiveSummarySection: React.FC<ExecutiveSummarySectionProps> = ({
  report,
  isEditing = false,
  onUpdate,
}) => {
  const summary = report.executiveSummary;

  const handleTakeawayChange = (index: number, value: string) => {
    if (!onUpdate) return;
    const updated = [...summary.headlineTakeaways];
    updated[index] = value;
    onUpdate({ headlineTakeaways: updated });
  };

  const handleAddTakeaway = () => {
    if (!onUpdate) return;
    onUpdate({
      headlineTakeaways: [...summary.headlineTakeaways, 'New executive takeaway...'],
    });
  };

  const handleRemoveTakeaway = (index: number) => {
    if (!onUpdate) return;
    onUpdate({
      headlineTakeaways: summary.headlineTakeaways.filter((_, i) => i !== index),
    });
  };

  const handleWinChange = (index: number, value: string) => {
    if (!onUpdate) return;
    const updated = [...summary.keyWins];
    updated[index] = value;
    onUpdate({ keyWins: updated });
  };

  return (
    <section className="bg-white rounded-xl border border-stone-200 shadow-xs p-6 sm:p-8 space-y-8 page-break-after">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-stone-100 pb-4 gap-2">
        <div>
          <div className="text-[11px] uppercase tracking-wider font-bold text-stone-500">
            Section 01
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            Executive Summary
          </h2>
        </div>
        <div className="text-xs text-stone-500 font-medium">
          {report.reportPeriod} · High-Level Performance Takeaways
        </div>
      </div>

      {/* High-Impact Stat Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Cross-Platform Reach */}
        <div className="p-4 rounded-lg bg-stone-50 border border-stone-200">
          <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
            Total Audience Reach
          </div>
          <div className="mt-1 text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            {formatNumber(summary.overallReach)}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className={`inline-flex items-center font-semibold ${summary.overallReachPrevDelta >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
              {summary.overallReachPrevDelta >= 0 ? (
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
              )}
              {formatPercent(summary.overallReachPrevDelta, true)} MoM
            </span>
            <span className="text-stone-300">·</span>
            <span className="text-stone-500">
              {formatPercent(summary.overallReachYoYDelta, true)} YoY
            </span>
          </div>
        </div>

        {/* Average Engagement Rate */}
        <div className="p-4 rounded-lg bg-stone-50 border border-stone-200">
          <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
            Avg. Engagement Rate
          </div>
          <div className="mt-1 text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            {summary.overallEngagementRate}%
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className={`inline-flex items-center font-semibold ${summary.overallEngagementPrevDelta >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
              {summary.overallEngagementPrevDelta >= 0 ? (
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
              )}
              {formatPercent(summary.overallEngagementPrevDelta, true)} MoM
            </span>
            <span className="text-stone-300">·</span>
            <span className="text-stone-500">Industry avg ~2.4%</span>
          </div>
        </div>

        {/* Net Community Growth */}
        <div className="p-4 rounded-lg bg-stone-50 border border-stone-200">
          <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
            Net Community Growth
          </div>
          <div className="mt-1 text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            +{formatNumber(
              report.crossPlatformOverview.summaryTable.reduce((acc, row) => acc + (row.followersDelta || 0), 0)
            )}
          </div>
          <div className="mt-2 text-xs text-stone-500 truncate">
            Across {report.crossPlatformOverview.summaryTable.length} tracked channels
          </div>
        </div>

        {/* Top Growth Driver */}
        <div className="p-4 rounded-lg bg-stone-50 border border-stone-200">
          <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
            Primary Growth Engine
          </div>
          <div className="mt-1 text-base sm:text-lg font-bold text-stone-900 tracking-tight truncate">
            {report.crossPlatformOverview.summaryTable.find(p => p.reach === Math.max(...report.crossPlatformOverview.summaryTable.map(r => r.reach)))?.platformLabel || 'Instagram & YouTube'}
          </div>
          <div className="mt-2 text-xs text-stone-500 truncate">
            Highest net subscriber & video reach
          </div>
        </div>

      </div>

      {/* 3-5 Headline Takeaways (Plain Language) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
            Headline Takeaways
          </h3>
          <span className="text-xs text-stone-500">
            What grew · What stalled · What to do next month
          </span>
        </div>

        <div className="space-y-2.5">
          {summary.headlineTakeaways.map((takeaway, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3.5 rounded-lg bg-stone-50/70 border border-stone-100 hover:border-stone-200 transition"
            >
              <span className="shrink-0 w-5 h-5 rounded-full bg-stone-900 text-white flex items-center justify-center text-[10px] font-bold mt-0.5">
                {idx + 1}
              </span>
              {isEditing ? (
                <div className="flex-1 flex gap-2">
                  <textarea
                    rows={2}
                    value={takeaway}
                    onChange={(e) => handleTakeawayChange(idx, e.target.value)}
                    className="w-full text-xs p-2 bg-white rounded border border-stone-300 focus:ring-1 focus:ring-stone-400"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveTakeaway(idx)}
                    className="text-stone-400 hover:text-red-500 text-xs px-1"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <p className="text-sm text-stone-800 leading-relaxed font-normal">
                  {takeaway}
                </p>
              )}
            </div>
          ))}

          {isEditing && (
            <button
              type="button"
              onClick={handleAddTakeaway}
              className="text-xs font-semibold text-stone-700 hover:text-stone-900 border border-dashed border-stone-300 rounded-lg p-2 w-full text-center hover:bg-stone-50"
            >
              + Add Takeaway Point
            </button>
          )}
        </div>
      </div>

      {/* Wins & Watch Items Grid (The Part Clients Actually Read) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        
        {/* Key Wins Card */}
        <div className="p-5 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-3">
          <div className="flex items-center gap-2 text-emerald-800">
            <Award className="w-5 h-5 text-emerald-600" />
            <h4 className="text-sm font-bold uppercase tracking-wider">
              Monthly Key Wins
            </h4>
          </div>

          <div className="space-y-2">
            {summary.keyWins.map((win, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-emerald-950 leading-relaxed">
                <span className="text-emerald-600 font-bold shrink-0">✓</span>
                {isEditing ? (
                  <textarea
                    rows={2}
                    value={win}
                    onChange={(e) => handleWinChange(idx, e.target.value)}
                    className="w-full text-xs p-1.5 bg-white rounded border border-emerald-200"
                  />
                ) : (
                  <span>{win}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Watch Item Card */}
        <div className="p-5 rounded-xl border border-amber-200 bg-amber-50/40 space-y-3">
          <div className="flex items-center gap-2 text-amber-800">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h4 className="text-sm font-bold uppercase tracking-wider">
              Watch Item / Bottleneck
            </h4>
          </div>

          <div className="text-xs text-amber-950 leading-relaxed">
            {isEditing ? (
              <textarea
                rows={3}
                value={summary.watchItem}
                onChange={(e) => onUpdate && onUpdate({ watchItem: e.target.value })}
                className="w-full text-xs p-1.5 bg-white rounded border border-amber-200"
              />
            ) : (
              <p>{summary.watchItem}</p>
            )}
          </div>
          <div className="text-[11px] text-amber-700/80 font-medium pt-1">
            Prioritized for strategic course-correction in the month ahead plan.
          </div>
        </div>

      </div>

    </section>
  );
};
