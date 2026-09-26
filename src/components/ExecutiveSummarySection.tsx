import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Award, 
  AlertTriangle, 
  TrendingUp,
  CheckSquare,
  Square,
  SlidersHorizontal,
  Instagram,
  Youtube,
  Linkedin,
  Facebook,
  Sparkles
} from 'lucide-react';
import { TikTokIcon } from './icons/TikTokIcon';
import { PlatformType, SocialReportData } from '../types/report';
import { formatNumber, formatPercent } from '../utils/formatters';

interface ExecutiveSummarySectionProps {
  report: SocialReportData;
  isEditing?: boolean;
  onUpdate?: (data: Partial<SocialReportData['executiveSummary']>) => void;
  selectedPlatforms?: PlatformType[];
  onSelectPlatforms?: (platforms: PlatformType[]) => void;
}

export const ExecutiveSummarySection: React.FC<ExecutiveSummarySectionProps> = ({
  report,
  isEditing = false,
  onUpdate,
  selectedPlatforms: controlledPlatforms,
  onSelectPlatforms,
}) => {
  const summary = report.executiveSummary;
  const summaryTable = report.crossPlatformOverview?.summaryTable || [];

  // Internal selection state if not controlled externally
  const [internalPlatforms, setInternalPlatforms] = useState<PlatformType[]>([
    'instagram',
    'youtube',
    'linkedin',
    'facebook',
    'tiktok',
  ]);

  const activePlatforms = controlledPlatforms || internalPlatforms;

  const platformDefinitions: { id: PlatformType; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'instagram', label: 'Instagram', icon: <Instagram className="w-3.5 h-3.5 text-rose-600" />, color: 'text-rose-700' },
    { id: 'youtube', label: 'YouTube', icon: <Youtube className="w-3.5 h-3.5 text-red-600" />, color: 'text-red-700' },
    { id: 'linkedin', label: 'LinkedIn', icon: <Linkedin className="w-3.5 h-3.5 text-sky-700" />, color: 'text-sky-800' },
    { id: 'facebook', label: 'Facebook', icon: <Facebook className="w-3.5 h-3.5 text-blue-600" />, color: 'text-blue-700' },
    { id: 'tiktok', label: 'TikTok', icon: <TikTokIcon className="w-3.5 h-3.5 text-stone-900" />, color: 'text-stone-900' },
  ];

  const handleTogglePlatform = (platformId: PlatformType) => {
    let next: PlatformType[];
    if (activePlatforms.includes(platformId)) {
      if (activePlatforms.length === 1) return; // Keep at least one platform selected
      next = activePlatforms.filter((p) => p !== platformId);
    } else {
      next = [...activePlatforms, platformId];
    }
    if (onSelectPlatforms) {
      onSelectPlatforms(next);
    } else {
      setInternalPlatforms(next);
    }
  };

  const handleSelectAll = () => {
    const all: PlatformType[] = ['instagram', 'youtube', 'linkedin', 'facebook', 'tiktok'];
    if (onSelectPlatforms) {
      onSelectPlatforms(all);
    } else {
      setInternalPlatforms(all);
    }
  };

  const handleSelectOnly = (platformId: PlatformType) => {
    const only: PlatformType[] = [platformId];
    if (onSelectPlatforms) {
      onSelectPlatforms(only);
    } else {
      setInternalPlatforms(only);
    }
  };

  const isAllSelected = activePlatforms.length === platformDefinitions.length;

  // Filtered rows for active platforms
  const filteredRows = summaryTable.filter((r) => activePlatforms.includes(r.platform));

  // Dynamic calculations based on selected platforms
  const calculatedReach = isAllSelected
    ? summary.overallReach
    : filteredRows.reduce((acc, r) => acc + (r.reach || 0), 0);

  const calculatedReachMoM = isAllSelected
    ? summary.overallReachPrevDelta
    : filteredRows.length > 0
    ? Number(
        (
          filteredRows.reduce((acc, r) => acc + (r.reachDelta || 0), 0) /
          filteredRows.length
        ).toFixed(1)
      )
    : 0;

  const calculatedEngagementRate = isAllSelected
    ? summary.overallEngagementRate
    : filteredRows.length > 0
    ? Number(
        (
          filteredRows.reduce((acc, r) => acc + (r.engagementRate || 0), 0) /
          filteredRows.length
        ).toFixed(1)
      )
    : 0;

  const calculatedNetGrowth = filteredRows.reduce(
    (acc, r) => acc + (r.followersDelta || 0),
    0
  );

  const primaryGrowthEngineRow = filteredRows.length > 0
    ? filteredRows.reduce((prev, curr) => (curr.reach > prev.reach ? curr : prev), filteredRows[0])
    : null;

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
    <section className="bg-white rounded-xl border border-stone-200 shadow-xs p-6 sm:p-8 space-y-6 page-break-after">
      
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

      {/* Interactive Platform Checkbox Setting Bar */}
      <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2.5 print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-stone-600" />
            <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              Choose Platform(s) for Executive Stats:
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <button
              type="button"
              onClick={handleSelectAll}
              className={`px-2 py-0.5 rounded font-semibold text-[11px] transition ${
                isAllSelected
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-600 hover:text-stone-900 bg-stone-200/70 hover:bg-stone-200'
              }`}
            >
              All Platforms
            </button>
            <span className="text-stone-300">|</span>
            <span className="text-[11px] text-stone-500">Quick isolate:</span>
            {platformDefinitions.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelectOnly(p.id)}
                className={`text-[11px] px-1.5 py-0.5 rounded transition ${
                  activePlatforms.length === 1 && activePlatforms[0] === p.id
                    ? 'font-bold bg-stone-300 text-stone-900'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Checkbox Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-stone-200/80">
          {platformDefinitions.map((plat) => {
            const isChecked = activePlatforms.includes(plat.id);
            return (
              <label
                key={plat.id}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition select-none ${
                  isChecked
                    ? 'bg-white border-stone-800 text-stone-900 shadow-xs ring-1 ring-stone-900/10'
                    : 'bg-stone-100/60 border-stone-200 text-stone-400 hover:text-stone-700 hover:bg-stone-100'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleTogglePlatform(plat.id)}
                  className="rounded border-stone-300 text-stone-900 focus:ring-stone-500 w-3.5 h-3.5"
                />
                <span className="shrink-0">{plat.icon}</span>
                <span>{plat.label}</span>
                {isChecked && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                )}
              </label>
            );
          })}

          <div className="ml-auto text-[11px] text-stone-500 font-medium">
            {isAllSelected ? (
              <span className="text-stone-600 font-semibold">
                ✓ Showing combined stats across all 4 platforms
              </span>
            ) : (
              <span className="text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-semibold">
                Filter active: {activePlatforms.length} platform{activePlatforms.length > 1 ? 's' : ''} ({activePlatforms.map(p => platformDefinitions.find(d => d.id === p)?.label).join(' + ')})
              </span>
            )}
          </div>
        </div>
      </div>

      {/* High-Impact Stat Metrics Grid (Dynamically recalculates based on chosen platforms) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Audience Reach */}
        <div className="p-4 rounded-lg bg-stone-50 border border-stone-200">
          <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
            {isAllSelected ? 'Total Audience Reach' : 'Selected Platforms Reach'}
          </div>
          <div className="mt-1 text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            {formatNumber(calculatedReach)}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className={`inline-flex items-center font-semibold ${calculatedReachMoM >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
              {calculatedReachMoM >= 0 ? (
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
              )}
              {formatPercent(calculatedReachMoM, true)} MoM
            </span>
            {isAllSelected && (
              <>
                <span className="text-stone-300">·</span>
                <span className="text-stone-500">
                  {formatPercent(summary.overallReachYoYDelta, true)} YoY
                </span>
              </>
            )}
          </div>
        </div>

        {/* Average Engagement Rate */}
        <div className="p-4 rounded-lg bg-stone-50 border border-stone-200">
          <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
            Avg. Engagement Rate
          </div>
          <div className="mt-1 text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            {calculatedEngagementRate}%
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
            <span className="text-stone-500">
              {isAllSelected ? 'Baseline ~2.4%' : `${activePlatforms.length} channel avg`}
            </span>
          </div>
        </div>

        {/* Net Community Growth */}
        <div className="p-4 rounded-lg bg-stone-50 border border-stone-200">
          <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
            Net Community Growth
          </div>
          <div className="mt-1 text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            +{formatNumber(calculatedNetGrowth)}
          </div>
          <div className="mt-2 text-xs text-stone-500 truncate">
            Across {activePlatforms.length} {activePlatforms.length === 1 ? 'channel' : 'selected channels'}
          </div>
        </div>

        {/* Top Growth Driver */}
        <div className="p-4 rounded-lg bg-stone-50 border border-stone-200">
          <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
            Primary Growth Engine
          </div>
          <div className="mt-1 text-base sm:text-lg font-bold text-stone-900 tracking-tight truncate">
            {primaryGrowthEngineRow ? primaryGrowthEngineRow.platformLabel : 'Selected Platforms'}
          </div>
          <div className="mt-2 text-xs text-stone-500 truncate">
            {primaryGrowthEngineRow ? `${formatNumber(primaryGrowthEngineRow.reach)} reach · ${primaryGrowthEngineRow.engagementRate}% ER` : 'Top performer'}
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

