import React from 'react';
import { Compass, CheckCircle2, FlaskConical, Calendar, ArrowRight } from 'lucide-react';
import { ActionRecommendation, SocialReportData } from '../types/report';

interface RecommendationsSectionProps {
  report: SocialReportData;
  isEditing?: boolean;
  onUpdate?: (updated: Partial<SocialReportData['recommendations']>) => void;
}

export const RecommendationsSection: React.FC<RecommendationsSectionProps> = ({
  report,
  isEditing = false,
  onUpdate,
}) => {
  const { actionableItems, contentCalendarDirection, testingPriorities } = report.recommendations;

  return (
    <section className="bg-white rounded-xl border border-stone-200 shadow-xs p-6 sm:p-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-stone-100 pb-4 gap-2">
        <div>
          <div className="text-[11px] uppercase tracking-wider font-bold text-stone-500">
            Section 08
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            Strategic Recommendations & Way Forward
          </h2>
        </div>
        <div className="text-xs text-stone-500 font-medium">
          Concrete roadmap tied directly to analytical findings
        </div>
      </div>

      {/* 3-5 Concrete Actionable Recommendations */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
            Action Items for Next Month
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {actionableItems.map((item, idx) => (
            <div
              key={item.id || idx}
              className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        item.priority === 'High'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : item.priority === 'Medium'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                      }`}
                    >
                      {item.priority} Priority
                    </span>
                    <span className="text-xs font-semibold text-stone-700">
                      {item.platform}
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-400 font-mono">
                    #0{idx + 1}
                  </span>
                </div>

                <p className="text-xs text-stone-900 font-medium leading-relaxed">
                  {item.recommendation}
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-white border border-stone-200/80 text-[11px] text-stone-700 flex items-start gap-1.5">
                <ArrowRight className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-stone-900">Expected Outcome: </span>
                  {item.expectedOutcome}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content Calendar & Testing Priorities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        
        {/* Content Calendar Direction */}
        <div className="p-5 rounded-xl border border-stone-200 bg-stone-50/70 space-y-3">
          <div className="flex items-center gap-2 text-stone-900">
            <Calendar className="w-4 h-4 text-stone-700" />
            <h4 className="text-xs font-bold uppercase tracking-wider">
              Editorial Calendar Cadence
            </h4>
          </div>
          <p className="text-xs text-stone-700 leading-relaxed">
            {contentCalendarDirection}
          </p>
        </div>

        {/* Testing Priorities */}
        <div className="p-5 rounded-xl border border-stone-200 bg-stone-50/70 space-y-3">
          <div className="flex items-center gap-2 text-stone-900">
            <FlaskConical className="w-4 h-4 text-purple-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider">
              Testing & Experimentation Priorities
            </h4>
          </div>
          <ul className="space-y-2 text-xs text-stone-700">
            {testingPriorities.map((tp, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-purple-600 font-bold shrink-0">·</span>
                <span>{tp}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

    </section>
  );
};
