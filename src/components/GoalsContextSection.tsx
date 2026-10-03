import React from 'react';
import { Target, Zap, Globe2 } from 'lucide-react';
import { SocialReportData } from '../types/report';

interface GoalsContextSectionProps {
  report: SocialReportData;
  isEditing?: boolean;
  onUpdate?: (data: Partial<SocialReportData['goalsAndContext']>) => void;
}

export const GoalsContextSection: React.FC<GoalsContextSectionProps> = ({
  report,
  isEditing = false,
  onUpdate,
}) => {
  const context = report.goalsAndContext;

  return (
    <section className="bg-white rounded-xl border border-stone-200 shadow-xs p-6 sm:p-8 space-y-6">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-stone-100 pb-4 gap-2">
        <div>
          <div className="text-[11px] uppercase tracking-wider font-bold text-stone-500">
            Section 02
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            Strategic Goals & Context
          </h2>
        </div>
        <div className="text-xs text-stone-500 font-medium">
          Contextualizing performance dips, spikes, and campaign drivers
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Strategy Aim */}
        <div className="space-y-2 p-4 rounded-lg bg-stone-50/70 border border-stone-200/80">
          <div className="flex items-center gap-2 text-stone-900">
            <Target className="w-4 h-4 text-stone-700" />
            <h3 className="text-xs font-bold uppercase tracking-wider">
              Strategic Target
            </h3>
          </div>
          {isEditing ? (
            <textarea
              rows={4}
              value={context.strategyAim}
              onChange={(e) => onUpdate && onUpdate({ strategyAim: e.target.value })}
              className="w-full text-xs p-2 bg-white rounded border border-stone-300"
            />
          ) : (
            <p className="text-xs text-stone-700 leading-relaxed font-normal">
              {context.strategyAim}
            </p>
          )}
        </div>

        {/* Campaigns & Paid Boosts */}
        <div className="space-y-2 p-4 rounded-lg bg-stone-50/70 border border-stone-200/80">
          <div className="flex items-center gap-2 text-stone-900">
            <Zap className="w-4 h-4 text-amber-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider">
              Campaigns & Paid Boosts
            </h3>
          </div>
          {isEditing ? (
            <textarea
              rows={4}
              value={context.campaignsAndBoosts}
              onChange={(e) => onUpdate && onUpdate({ campaignsAndBoosts: e.target.value })}
              className="w-full text-xs p-2 bg-white rounded border border-stone-300"
            />
          ) : (
            <p className="text-xs text-stone-700 leading-relaxed font-normal">
              {context.campaignsAndBoosts}
            </p>
          )}
        </div>

        {/* External Events / Algorithm Factors */}
        <div className="space-y-2 p-4 rounded-lg bg-stone-50/70 border border-stone-200/80">
          <div className="flex items-center gap-2 text-stone-900">
            <Globe2 className="w-4 h-4 text-sky-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider">
              External & Platform Factors
            </h3>
          </div>
          {isEditing ? (
            <textarea
              rows={4}
              value={context.externalFactors}
              onChange={(e) => onUpdate && onUpdate({ externalFactors: e.target.value })}
              className="w-full text-xs p-2 bg-white rounded border border-stone-300"
            />
          ) : (
            <p className="text-xs text-stone-700 leading-relaxed font-normal">
              {context.externalFactors}
            </p>
          )}
        </div>

      </div>

    </section>
  );
};
