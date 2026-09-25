import React from 'react';
import { 
  Trophy, 
  Layers, 
  Clock, 
  Calendar, 
  TrendingUp, 
  ExternalLink, 
  Flame,
  Image as ImageIcon 
} from 'lucide-react';
import { CrossPlatformTopPost, ContentPillar, SocialReportData } from '../types/report';
import { formatNumber, getPlatformColor } from '../utils/formatters';

interface ContentPerformanceSectionProps {
  report: SocialReportData;
  isEditing?: boolean;
  onUpdateTopPosts?: (posts: CrossPlatformTopPost[]) => void;
  onUpdatePillars?: (pillars: ContentPillar[]) => void;
}

export const ContentPerformanceSection: React.FC<ContentPerformanceSectionProps> = ({
  report,
  isEditing = false,
  onUpdateTopPosts,
  onUpdatePillars,
}) => {
  const { topPostsAllPlatforms, contentPillars, bestPostingSchedule } = report.contentPerformance;

  return (
    <section className="bg-white rounded-xl border border-stone-200 shadow-xs p-6 sm:p-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-stone-100 pb-4 gap-2">
        <div>
          <div className="text-[11px] uppercase tracking-wider font-bold text-stone-500">
            Section 05
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            Content Performance Deep-Dive
          </h2>
        </div>
        <div className="text-xs text-stone-500 font-medium">
          Top-ranked assets across all platforms · Thematic pillars · Timing cadence
        </div>
      </div>

      {/* Top 5-10 Posts Across All Platforms */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
              Cross-Platform Top Ranked Posts
            </h3>
          </div>
          <span className="text-xs text-stone-500">
            Ranked by engagement rate & virality impact
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topPostsAllPlatforms.map((post) => {
            const colors = getPlatformColor(post.platform);
            return (
              <div
                key={post.rank}
                className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-stone-50 transition flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-stone-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                        #{post.rank}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${colors.bg} ${colors.text} border ${colors.border}`}
                      >
                        {post.platform}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="font-bold text-stone-900">{post.engagementRate}% ER</span>
                      <span className="text-stone-300">·</span>
                      <span className="text-stone-500 font-medium">{formatNumber(post.reach)} reach</span>
                    </div>
                  </div>

                  <h4 className="text-xs font-bold text-stone-900 leading-snug">
                    {post.title}
                  </h4>
                </div>

                {/* Analytical breakdown */}
                <div className="p-3 rounded-lg bg-white border border-stone-200 text-xs text-stone-700 leading-relaxed">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-stone-900 mb-0.5">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    <span>Why It Outperformed:</span>
                  </div>
                  {post.whyItWorked}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Content Pillars & Best Posting Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        
        {/* Content Pillars (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-stone-700" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
              Content Pillar / Theme Analysis
            </h3>
          </div>

          <div className="space-y-3">
            {contentPillars.map((pillar) => (
              <div
                key={pillar.pillarName}
                className="p-3.5 rounded-lg border border-stone-200 bg-stone-50/60 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="font-bold text-stone-900 flex items-center gap-2">
                    <span>{pillar.pillarName}</span>
                    <span
                      className={`text-[10px] font-bold uppercase px-1.5 py-0.2 rounded ${
                        pillar.performanceIndex === 'High'
                          ? 'bg-emerald-100 text-emerald-800'
                          : pillar.performanceIndex === 'Medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      {pillar.performanceIndex} Tier
                    </span>
                  </div>
                  <div className="text-stone-600 font-semibold">
                    {pillar.shareOfVoicePercent}% Share of Voice · {pillar.avgEngagement}% Avg ER
                  </div>
                </div>

                <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full ${
                      pillar.performanceIndex === 'High'
                        ? 'bg-emerald-600'
                        : pillar.performanceIndex === 'Medium'
                        ? 'bg-amber-600'
                        : 'bg-stone-500'
                    }`}
                    style={{ width: `${pillar.shareOfVoicePercent}%` }}
                  />
                </div>

                <p className="text-[11px] text-stone-600 leading-relaxed">
                  {pillar.keyTakeaway}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Best Posting Schedule (1 Col) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-stone-700" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
              Optimal Posting Windows
            </h3>
          </div>

          <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/70 space-y-3 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                Top Performing Days
              </span>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {bestPostingSchedule.bestDays.map((day) => (
                  <span
                    key={day}
                    className="px-2 py-1 rounded bg-stone-900 text-white font-semibold text-xs"
                  >
                    {day}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-stone-200/80 pt-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                Prime Time Window
              </span>
              <div className="text-sm font-bold text-stone-900 mt-0.5">
                {bestPostingSchedule.bestTimeWindow}
              </div>
            </div>

            <div className="border-t border-stone-200/80 pt-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                Audience Behavioral Habit
              </span>
              <p className="text-[11px] text-stone-700 leading-relaxed">
                {bestPostingSchedule.insight}
              </p>
            </div>
          </div>
        </div>

      </div>

    </section>
  );
};
