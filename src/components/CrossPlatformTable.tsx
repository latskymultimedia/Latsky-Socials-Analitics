import React from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  BarChart2, 
  Youtube, 
  Instagram, 
  Linkedin, 
  Facebook, 
  Share2 
} from 'lucide-react';
import { TikTokIcon } from './icons/TikTokIcon';
import { PlatformSummaryRow, PlatformType, SocialReportData } from '../types/report';
import { formatNumber, formatPercent, getPlatformColor } from '../utils/formatters';

interface CrossPlatformTableProps {
  report: SocialReportData;
  isEditing?: boolean;
  onUpdateTable?: (table: PlatformSummaryRow[]) => void;
  onUpdateInsight?: (insight: string) => void;
  selectedPlatforms?: PlatformType[];
  onTogglePlatform?: (platform: PlatformType) => void;
}

export const CrossPlatformTable: React.FC<CrossPlatformTableProps> = ({
  report,
  isEditing = false,
  onUpdateTable,
  onUpdateInsight,
  selectedPlatforms,
  onTogglePlatform,
}) => {
  const table = report.crossPlatformOverview.summaryTable;
  const highlight = report.crossPlatformOverview.highlightInsight;

  const maxReach = Math.max(...table.map((r) => r.reach), 1);
  const maxEng = Math.max(...table.map((r) => r.engagementRate), 1);

  const activeRows = selectedPlatforms && selectedPlatforms.length > 0
    ? table.filter((r) => selectedPlatforms.includes(r.platform))
    : table;

  const totalFollowers = activeRows.reduce((acc, r) => acc + (r.followers || 0), 0);
  const totalFollowersDelta = activeRows.reduce((acc, r) => acc + (r.followersDelta || 0), 0);
  const totalReach = activeRows.reduce((acc, r) => acc + (r.reach || 0), 0);
  const avgReachDelta = activeRows.length > 0
    ? Number((activeRows.reduce((acc, r) => acc + (r.reachDelta || 0), 0) / activeRows.length).toFixed(1))
    : 0;
  const weightedEngRate = totalReach > 0
    ? Number((activeRows.reduce((acc, r) => acc + ((r.reach || 0) * (r.engagementRate || 0)), 0) / totalReach).toFixed(1))
    : 0;
  const totalPostsCount = activeRows.reduce((acc, r) => acc + (r.totalPosts || 0), 0);

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
      case 'tiktok':
        return <TikTokIcon className="w-4 h-4 text-stone-900" />;
      default:
        return <Share2 className="w-4 h-4 text-stone-600" />;
    }
  };

  const handleRowChange = (index: number, field: keyof PlatformSummaryRow, value: any) => {
    if (!onUpdateTable) return;
    const updated = [...table];
    updated[index] = { ...updated[index], [field]: value };
    onUpdateTable(updated);
  };

  return (
    <section className="bg-white rounded-xl border border-stone-200 shadow-xs p-6 sm:p-8 space-y-6">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-stone-100 pb-4 gap-2">
        <div>
          <div className="text-[11px] uppercase tracking-wider font-bold text-stone-500">
            Section 03
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            Cross-Platform Overview
          </h2>
        </div>
        <div className="text-xs text-stone-500 font-medium">
          Unified channel performance matrix & content efficacy
        </div>
      </div>

      {/* Synthesis Insight Note */}
      <div className="p-4 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-700 leading-relaxed">
        <span className="font-bold text-stone-900 uppercase tracking-wider text-[11px] mr-2">
          Agency Synthesis:
        </span>
        {isEditing ? (
          <textarea
            rows={2}
            value={highlight}
            onChange={(e) => onUpdateInsight && onUpdateInsight(e.target.value)}
            className="w-full mt-2 text-xs p-2 bg-white rounded border border-stone-300"
          />
        ) : (
          <span>{highlight}</span>
        )}
      </div>

      {/* Single Comparison Table */}
      <div className="overflow-x-auto border border-stone-200 rounded-lg">
        <table className="w-full text-left text-xs divide-y divide-stone-200">
          <thead className="bg-stone-50 text-stone-600 uppercase tracking-wider font-semibold text-[10px]">
            <tr>
              <th scope="col" className="px-4 py-3.5">Platform</th>
              <th scope="col" className="px-4 py-3.5">Followers (Δ)</th>
              <th scope="col" className="px-4 py-3.5">Audience Reach</th>
              <th scope="col" className="px-4 py-3.5">Engagement Rate</th>
              <th scope="col" className="px-4 py-3.5">Top Content Format</th>
              <th scope="col" className="px-4 py-3.5 text-right">Cadence (Posts)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 bg-white">
            {table.map((row, idx) => {
              const colors = getPlatformColor(row.platform);
              return (
                <tr key={row.platform} className="hover:bg-stone-50/60 transition">
                  
                  {/* Platform column */}
                  <td className="px-4 py-3.5 whitespace-nowrap font-medium text-stone-900">
                    <div className="flex items-center gap-2.5">
                      {selectedPlatforms && onTogglePlatform && (
                        <input
                          type="checkbox"
                          title="Include in executive summary stats"
                          checked={selectedPlatforms.includes(row.platform)}
                          onChange={() => onTogglePlatform(row.platform)}
                          className="rounded border-stone-300 text-stone-900 focus:ring-stone-500 w-3.5 h-3.5 print:hidden cursor-pointer"
                        />
                      )}
                      <div className={`p-1.5 rounded-md ${colors.bg} border ${colors.border}`}>
                        {getPlatformIcon(row.platform)}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-stone-900">{row.platformLabel}</span>
                        {selectedPlatforms && !selectedPlatforms.includes(row.platform) && (
                          <span className="text-[9px] uppercase font-bold text-stone-400 bg-stone-100 px-1 py-0.2 rounded print:hidden">
                            Excluded from summary
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Followers & Delta */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {isEditing ? (
                      <div className="flex gap-1.5 items-center">
                        <input
                          type="number"
                          value={row.followers}
                          onChange={(e) => handleRowChange(idx, 'followers', parseInt(e.target.value) || 0)}
                          className="w-20 px-1.5 py-1 text-xs border rounded"
                        />
                        <input
                          type="number"
                          value={row.followersDelta}
                          onChange={(e) => handleRowChange(idx, 'followersDelta', parseInt(e.target.value) || 0)}
                          className="w-16 px-1.5 py-1 text-xs border rounded"
                        />
                      </div>
                    ) : (
                      <div className="flex items-baseline gap-1.5">
                        <span className={`font-bold ${row.followers === 0 && row.reach === 0 ? 'text-stone-400' : 'text-stone-900'}`}>
                          {row.followers.toLocaleString()}
                        </span>
                        {row.followers >= 10000 && (
                          <span className="text-[10px] text-stone-400 font-mono">({formatNumber(row.followers)})</span>
                        )}
                        {row.followers === 0 && row.followersDelta === 0 ? (
                          <span className="text-[11px] text-stone-400 font-normal">—</span>
                        ) : (
                          <span className={`text-[11px] font-medium flex items-center ${row.followersDelta >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {row.followersDelta >= 0 ? '+' : ''}{row.followersDelta.toLocaleString()}
                          </span>
                        )}
                      </div>
                    )}
                  </td>

                  {/* Reach */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {isEditing ? (
                      <input
                        type="number"
                        value={row.reach}
                        onChange={(e) => handleRowChange(idx, 'reach', parseInt(e.target.value) || 0)}
                        className="w-24 px-1.5 py-1 text-xs border rounded"
                      />
                    ) : (
                      <div>
                        <span className={`font-bold ${row.reach === 0 ? 'text-stone-400' : 'text-stone-900'}`}>
                          {formatNumber(row.reach)}
                        </span>
                        {row.reach === 0 && (row.reachDelta === 0 || !row.reachDelta) ? (
                          <span className="ml-2 text-[11px] text-stone-400 font-normal">—</span>
                        ) : (
                          <span className={`ml-2 text-[11px] font-medium ${row.reachDelta >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {formatPercent(row.reachDelta, true)}
                          </span>
                        )}
                      </div>
                    )}
                  </td>

                  {/* Engagement Rate */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {isEditing ? (
                      <input
                        type="number"
                        step="0.1"
                        value={row.engagementRate}
                        onChange={(e) => handleRowChange(idx, 'engagementRate', parseFloat(e.target.value) || 0)}
                        className="w-16 px-1.5 py-1 text-xs border rounded"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${row.engagementRate === 0 && row.reach === 0 ? 'text-stone-400' : 'text-stone-900'}`}>
                          {row.engagementRate}%
                        </span>
                        <div className="w-16 bg-stone-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-stone-900 h-1.5 rounded-full"
                            style={{ width: `${Math.min((row.engagementRate / 10) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </td>

                  {/* Top Content Type */}
                  <td className="px-4 py-3.5 text-stone-700 font-medium">
                    {isEditing ? (
                      <input
                        type="text"
                        value={row.topContentType}
                        onChange={(e) => handleRowChange(idx, 'topContentType', e.target.value)}
                        className="w-full px-1.5 py-1 text-xs border rounded"
                      />
                    ) : (
                      row.topContentType === 'Not Monitored' ? (
                        <span className="inline-flex items-center text-[10px] font-semibold uppercase tracking-wider text-stone-400 bg-stone-100 px-2 py-0.5 rounded">
                          Not Monitored
                        </span>
                      ) : row.topContentType === 'Awaiting Data Export' || row.topContentType === 'Awaiting Upload' ? (
                        <span className="inline-flex items-center text-[10px] font-semibold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Awaiting Upload
                        </span>
                      ) : (
                        <span>{row.topContentType}</span>
                      )
                    )}
                  </td>

                  {/* Total Posts */}
                  <td className="px-4 py-3.5 whitespace-nowrap text-right font-medium text-stone-800">
                    {isEditing ? (
                      <input
                        type="number"
                        value={row.totalPosts}
                        onChange={(e) => handleRowChange(idx, 'totalPosts', parseInt(e.target.value) || 0)}
                        className="w-14 px-1.5 py-1 text-xs border rounded text-right"
                      />
                    ) : (
                      <span>{row.totalPosts} posts</span>
                    )}
                  </td>

                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-stone-100/90 font-semibold border-t-2 border-stone-300 text-stone-900">
            <tr>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-stone-900 text-white px-1.5 py-0.5 rounded">
                    TOTAL
                  </span>
                  <span className="font-bold">Cross-Platform Sum</span>
                  {selectedPlatforms && selectedPlatforms.length < table.length && (
                    <span className="text-[10px] font-normal text-stone-500">
                      ({selectedPlatforms.length} of {table.length} active)
                    </span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-extrabold text-stone-900">{totalFollowers.toLocaleString()}</span>
                  {totalFollowers >= 10000 && (
                    <span className="text-[10px] text-stone-500 font-mono">({formatNumber(totalFollowers)})</span>
                  )}
                  <span className={`text-[11px] font-bold ${totalFollowersDelta >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {totalFollowersDelta >= 0 ? '+' : ''}{totalFollowersDelta.toLocaleString()}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-extrabold text-stone-900">{totalReach.toLocaleString()}</span>
                  {totalReach >= 10000 && (
                    <span className="text-[10px] text-stone-500 font-mono">({formatNumber(totalReach)})</span>
                  )}
                  <span className={`text-[11px] font-bold ${avgReachDelta >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {formatPercent(avgReachDelta, true)} avg
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-stone-900">{weightedEngRate}%</span>
                  <span className="text-[10px] text-stone-500 font-normal">(weighted)</span>
                </div>
              </td>
              <td className="px-4 py-3 text-stone-600 text-[11px] font-normal italic">
                All 5 core channels integrated
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-right font-extrabold text-stone-900">
                {totalPostsCount} posts
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Visual Platform Share & Engagement Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        
        {/* Reach Volume Distribution */}
        <div className="p-4 rounded-lg bg-stone-50/70 border border-stone-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">
              Reach Share by Platform
            </h4>
            <span className="text-[11px] text-stone-500">Audience impressions</span>
          </div>

          <div className="space-y-2.5">
            {table.map((row) => {
              const pct = ((row.reach / maxReach) * 100).toFixed(0);
              const colors = getPlatformColor(row.platform);
              return (
                <div key={row.platform} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-stone-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.hex }} />
                      {row.platformLabel}
                    </span>
                    <span className="text-stone-900 font-bold">{formatNumber(row.reach)}</span>
                  </div>
                  <div className="w-full bg-stone-200/80 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: colors.hex,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Engagement Rate Comparison */}
        <div className="p-4 rounded-lg bg-stone-50/70 border border-stone-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">
              Engagement Rate Comparison
            </h4>
            <span className="text-[11px] text-stone-500">Quality vs Industry baseline</span>
          </div>

          <div className="space-y-2.5">
            {table.map((row) => {
              const pct = ((row.engagementRate / maxEng) * 100).toFixed(0);
              const colors = getPlatformColor(row.platform);
              return (
                <div key={row.platform} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-stone-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.hex }} />
                      {row.platformLabel}
                    </span>
                    <span className="text-stone-900 font-bold">{row.engagementRate}%</span>
                  </div>
                  <div className="w-full bg-stone-200/80 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: colors.hex,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </section>
  );
};
