import React from 'react';
import { 
  Lightbulb, 
  Rocket, 
  Share2, 
  Database, 
  Bot, 
  Calendar, 
  FileSpreadsheet, 
  Bell, 
  ArrowUpRight,
  TrendingUp,
  Sliders,
  CheckCircle2
} from 'lucide-react';

interface GrowthRoadmapProps {
  onClose?: () => void;
}

export const GrowthRoadmap: React.FC<GrowthRoadmapProps> = ({ onClose }) => {
  const roadmapIdeas = [
    {
      category: 'Deep Platform Integrations',
      icon: <Database className="w-4 h-4 text-sky-600" />,
      title: 'Direct Read-Only OAuth Connectors',
      description: 'Supplement screengrabs with live Meta Graph API, YouTube Data API v3, and LinkedIn REST APIs for instant 1-click sync without taking manual screenshots.',
      impact: 'High',
      tag: 'Automation'
    },
    {
      category: 'Firecrawl Deep Crawling',
      icon: <Share2 className="w-4 h-4 text-orange-600" />,
      title: 'Automated Competitor Social Scraping Engine',
      description: 'Schedule weekly Firecrawl jobs across 5 key industry rivals to automatically chart follower trends, top viral hooks, and ad library campaigns.',
      impact: 'Strategic',
      tag: 'Firecrawl Powered'
    },
    {
      category: 'Client Presentation Portals',
      icon: <Rocket className="w-4 h-4 text-purple-600" />,
      title: 'Interactive Shareable Client Link (Live Dashboard)',
      description: 'Rather than static PDFs only, provide a password-protected live web URL per client with interactive filter tabs, video embeds, and client commenting.',
      impact: 'High',
      tag: 'Client Retention'
    },
    {
      category: 'Predictive Content Forecasting',
      icon: <Bot className="w-4 h-4 text-emerald-600" />,
      title: 'AI Video Hook & Thumbnail Simulator',
      description: 'Score client video concepts and thumbnail titles before publishing based on past month retention and virality data from the report.',
      impact: 'Strategic',
      tag: 'Revenue Driver'
    },
    {
      category: 'Automated Monthly Cadence',
      icon: <Calendar className="w-4 h-4 text-blue-600" />,
      title: 'Automated Monthly Report Generation & Email Dispatch',
      description: 'Automated 1st-of-the-month reminder prompts requesting the 4 core screengrabs, auto-synthesizing, and drafting client email briefing notes.',
      impact: 'Efficiency',
      tag: 'Time Saver'
    },
    {
      category: 'Multi-Client White-Labeling',
      icon: <Sliders className="w-4 h-4 text-amber-600" />,
      title: 'Client Theme Presets & Custom Color Palettes',
      description: 'Color-code reports according to each client’s brand book (fonts, primary hex colors, custom header styling) with 1 click.',
      impact: 'Aesthetic',
      tag: 'Agency Branding'
    }
  ];

  return (
    <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-stone-100 pb-4 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-stone-900 text-white px-2 py-0.5 rounded">
              Latsky Socials Strategic Vision
            </span>
            <span className="text-xs text-stone-500 font-medium">Product Expansion Plan</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight mt-1">
            How to Scale This App Further
          </h2>
        </div>
        <div className="text-xs text-stone-500">
          Agency-grade product roadmap & monetization paths
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roadmapIdeas.map((idea, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border border-stone-200 bg-stone-50/60 hover:bg-stone-50 transition flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="p-1.5 rounded-md bg-white border border-stone-200 shadow-2xs">
                  {idea.icon}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-200 text-stone-700">
                  {idea.tag}
                </span>
              </div>
              <h3 className="text-xs font-bold text-stone-900 leading-snug">
                {idea.title}
              </h3>
              <p className="text-[11px] text-stone-600 mt-1.5 leading-relaxed">
                {idea.description}
              </p>
            </div>
            <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-[11px]">
              <span className="text-stone-500">Business Impact:</span>
              <span className="font-semibold text-stone-900">{idea.impact}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
