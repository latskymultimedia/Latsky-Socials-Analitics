import React from 'react';
import { Users, BarChart3, ShieldCheck, TrendingUp } from 'lucide-react';
import { SocialReportData } from '../types/report';

interface AudienceAndBenchmarkSectionProps {
  report: SocialReportData;
  isEditing?: boolean;
}

export const AudienceAndBenchmarkSection: React.FC<AudienceAndBenchmarkSectionProps> = ({
  report,
}) => {
  const { audienceInsights, competitiveBenchmark } = report;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      {/* SECTION 06: AUDIENCE INSIGHTS */}
      <section className="bg-white rounded-xl border border-stone-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="border-b border-stone-100 pb-3">
          <div className="text-[11px] uppercase tracking-wider font-bold text-stone-500">
            Section 06
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight">
            Audience Quality & Demographic Shifts
          </h2>
        </div>

        <div className="space-y-4 text-xs">
          
          {/* Organic vs Paid Quality */}
          <div className="p-4 rounded-lg bg-stone-50/80 border border-stone-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-stone-500">
                Growth Integrity & Churn
              </span>
              <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                {audienceInsights.organicVsPaidRatio}
              </span>
            </div>
            <p className="text-stone-700 leading-relaxed font-normal">
              {audienceInsights.growthQuality}
            </p>
          </div>

          {/* Demographic & Geographic Shifts */}
          <div className="p-4 rounded-lg bg-stone-50/80 border border-stone-200 space-y-2">
            <span className="text-[10px] uppercase font-bold text-stone-500">
              Demographic & Regional Shifts
            </span>
            <p className="text-stone-700 leading-relaxed font-normal">
              {audienceInsights.demographicShifts}
            </p>
          </div>

        </div>
      </section>

      {/* SECTION 07: COMPETITIVE & BENCHMARK CONTEXT */}
      <section className="bg-white rounded-xl border border-stone-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="border-b border-stone-100 pb-3">
          <div className="text-[11px] uppercase tracking-wider font-bold text-stone-500">
            Section 07
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight">
            Competitive & Sector Benchmarking
          </h2>
        </div>

        <div className="space-y-4 text-xs">
          
          {/* Industry Baseline */}
          <div className="p-4 rounded-lg bg-stone-50/80 border border-stone-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-stone-500">
                Sector Baseline: {competitiveBenchmark.industryBenchmarkAvg.engagementRate}
              </span>
              <span className="font-bold text-stone-900 text-[11px]">
                {competitiveBenchmark.industryBenchmarkAvg.reachGrowth}
              </span>
            </div>
            <p className="text-stone-700 leading-relaxed font-normal">
              {competitiveBenchmark.industryBenchmarkAvg.summary}
            </p>
          </div>

          {/* Competitor comparison cards */}
          <div className="space-y-2.5">
            <span className="text-[10px] uppercase font-bold text-stone-500 block">
              Tracked Competitors
            </span>
            {competitiveBenchmark.competitors.map((comp) => (
              <div
                key={comp.competitor}
                className="p-3 bg-white rounded-lg border border-stone-200 flex flex-col justify-between space-y-1"
              >
                <div className="flex items-center justify-between font-semibold text-stone-900">
                  <span>{comp.competitor}</span>
                  <span className="text-[11px] text-stone-500">{comp.followerCount} · {comp.avgEngagementRate} ER</span>
                </div>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  {comp.qualitativeNote}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
};
