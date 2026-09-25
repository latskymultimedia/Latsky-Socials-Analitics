import React from 'react';
import { 
  Instagram, 
  Youtube, 
  Linkedin, 
  Facebook, 
  Layers, 
  FileText, 
  Printer, 
  Download,
  Share2,
  Calendar,
  CheckCircle2,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { PlatformType, SocialReportData } from '../types/report';
import { formatNumber, formatPercent, getPlatformColor } from '../utils/formatters';

interface StandalonePlatformReportProps {
  report: SocialReportData;
  platform: PlatformType;
  onBackToOverall: () => void;
  onSaveToLaptop: () => void;
}

export const StandalonePlatformReport: React.FC<StandalonePlatformReportProps> = ({
  report,
  platform,
  onBackToOverall,
  onSaveToLaptop,
}) => {
  const colors = getPlatformColor(platform);
  const platformSummary = report.crossPlatformOverview.summaryTable.find((p) => p.platform === platform);

  const getPlatformIcon = () => {
    switch (platform) {
      case 'youtube':
        return <Youtube className="w-6 h-6 text-red-600" />;
      case 'instagram':
        return <Instagram className="w-6 h-6 text-rose-600" />;
      case 'linkedin':
        return <Linkedin className="w-6 h-6 text-sky-700" />;
      case 'facebook':
        return <Facebook className="w-6 h-6 text-blue-600" />;
      default:
        return <Layers className="w-6 h-6 text-stone-600" />;
    }
  };

  const getPlatformTitle = () => {
    switch (platform) {
      case 'youtube':
        return 'YouTube Channel Performance & Watch Retention Report';
      case 'instagram':
        return 'Instagram Community, Reels & Discovery Intelligence';
      case 'linkedin':
        return 'LinkedIn Executive Authority & B2B Lead Generation Report';
      case 'facebook':
        return 'Facebook Community Reach & Native Video Performance Report';
      default:
        return 'Channel Performance Report';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Sub-report Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-stone-200 print:hidden">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToOverall}
            className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition"
          >
            ← View Full Cross-Platform Report
          </button>
          <span className="text-stone-300">|</span>
          <span className="text-xs font-bold text-stone-800 uppercase tracking-wider">
            Standalone {platform.toUpperCase()} Client Briefing
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print {platform.toUpperCase()} Report</span>
          </button>
        </div>
      </div>

      {/* Standalone Report Document Container */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-6 sm:p-10 space-y-8">
        
        {/* Cover / Header Header */}
        <div className="border-b border-stone-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl ${colors.bg} border ${colors.border}`}>
              {getPlatformIcon()}
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                {report.agencyName} · Specialized Platform Audit
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-0.5">
                {getPlatformTitle()}
              </h1>
              <p className="text-xs text-stone-600 mt-1">
                Client: <span className="font-bold text-stone-900">{report.clientName}</span> · Period: <span className="font-semibold">{report.reportPeriod}</span> ({report.comparisonPeriod})
              </p>
            </div>
          </div>

          {report.clientLogoUrl && (
            <img
              src={report.clientLogoUrl}
              alt="Client Logo"
              className="w-14 h-14 object-contain rounded bg-stone-50 border p-1"
            />
          )}
        </div>

        {/* Core KPI metrics row for this platform */}
        {platformSummary && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] uppercase font-bold text-stone-500">Audience / Followers</span>
              <div className="text-2xl font-bold text-stone-900 mt-1">
                {formatNumber(platformSummary.followers)}
              </div>
              <div className="text-xs text-emerald-700 font-semibold mt-1">
                +{formatNumber(platformSummary.followersDelta)} net new this month
              </div>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] uppercase font-bold text-stone-500">Monthly Reach</span>
              <div className="text-2xl font-bold text-stone-900 mt-1">
                {formatNumber(platformSummary.reach)}
              </div>
              <div className="text-xs font-semibold text-stone-500 mt-1">
                {formatPercent(platformSummary.reachDelta, true)} MoM trajectory
              </div>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] uppercase font-bold text-stone-500">Engagement Rate</span>
              <div className="text-2xl font-bold text-stone-900 mt-1">
                {platformSummary.engagementRate}%
              </div>
              <div className="text-xs text-stone-500 mt-1">
                Benchmark vs 2.4% baseline
              </div>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] uppercase font-bold text-stone-500">Top Content Format</span>
              <div className="text-base font-bold text-stone-900 mt-1 truncate">
                {platformSummary.topContentType}
              </div>
              <div className="text-xs text-stone-500 mt-1">
                {platformSummary.totalPosts} total published posts
              </div>
            </div>
          </div>
        )}

        {/* Platform Specific Sections */}
        {platform === 'instagram' && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 border-b pb-2">
              Instagram Format Mechanics & Actionable Inquiries
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-stone-50 border border-stone-200">
                <span className="text-[11px] font-bold text-stone-500">Profile Visits & Web Clicks</span>
                <div className="text-xl font-bold text-stone-900 mt-1">
                  {formatNumber(report.instagram.websiteTaps)} Web Taps
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  From {formatNumber(report.instagram.profileVisits)} profile visits ({((report.instagram.websiteTaps / (report.instagram.profileVisits || 1)) * 100).toFixed(1)}% conversion)
                </p>
              </div>

              <div className="p-4 rounded-lg bg-stone-50 border border-stone-200">
                <span className="text-[11px] font-bold text-stone-500">Discovery Ratio</span>
                <div className="text-xl font-bold text-rose-700 mt-1">
                  {report.instagram.nonFollowerDiscoveryRate}% Non-Followers
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  Organic reach driven via Reels algorithm and explore page feeds.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-stone-50 border border-stone-200">
                <span className="text-[11px] font-bold text-stone-500">Story Completion</span>
                <div className="text-xl font-bold text-stone-900 mt-1">
                  {report.instagram.storyCompletionRate}% Completed
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  Indicates loyal core audience following daily behind-the-scenes stories.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto border border-stone-200 rounded-lg">
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-50 text-stone-600 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="px-4 py-2.5">Format Type</th>
                    <th className="px-4 py-2.5">Post Count</th>
                    <th className="px-4 py-2.5">Total Reach</th>
                    <th className="px-4 py-2.5">Shares & Saves</th>
                    <th className="px-4 py-2.5">Watch/Save Metric</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {report.instagram.formatSplit.map((f) => (
                    <tr key={f.format} className="hover:bg-stone-50/50">
                      <td className="px-4 py-2.5 font-bold text-stone-900">{f.formatLabel}</td>
                      <td className="px-4 py-2.5 text-stone-700">{f.count}</td>
                      <td className="px-4 py-2.5 font-semibold text-stone-900">{formatNumber(f.reach)}</td>
                      <td className="px-4 py-2.5 text-stone-700">{formatNumber(f.shares)}</td>
                      <td className="px-4 py-2.5 text-stone-600">{f.avgWatchOrSave}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                Top Instagram Posts
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {report.instagram.topPosts.map((post) => (
                  <div key={post.id} className="p-4 rounded-lg border border-stone-200 bg-stone-50 space-y-2 text-xs">
                    <div className="flex justify-between font-bold">
                      <span className="text-rose-700 uppercase text-[10px]">{post.format}</span>
                      <span className="text-stone-900">{post.engagementRate}% ER</span>
                    </div>
                    <div className="font-semibold text-stone-900">{post.title}</div>
                    <div className="p-2 bg-white rounded border text-[11px] text-stone-700">
                      <span className="font-bold">Why it worked: </span>{post.whyItWorked}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {platform === 'youtube' && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 border-b pb-2">
              YouTube Watch Time & Audience Retention
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-lg bg-stone-50 border border-stone-200 space-y-2">
                <span className="font-bold text-stone-900">Traffic Sources Breakdown</span>
                {report.youtube.trafficSources.map((s) => (
                  <div key={s.source} className="flex justify-between py-1 border-b border-stone-100 last:border-none">
                    <span className="text-stone-700">{s.source}</span>
                    <span className="font-bold text-stone-900">{s.percentage}%</span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-lg bg-stone-50 border border-stone-200 space-y-2">
                <span className="font-bold text-stone-900">Retention & Drop-Off Guidance</span>
                <p className="text-stone-700 leading-relaxed text-[11px]">
                  {report.youtube.retentionDropOffInsight}
                </p>
                <div className="p-2 bg-white rounded border text-[11px] font-medium text-stone-800">
                  Average View Duration: {report.youtube.avgViewDuration} ({report.youtube.avgPercentViewed}% viewed)
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                Top YouTube Videos & Retention Graph Callout
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {report.youtube.topVideos.map((video) => (
                  <div key={video.id} className="p-4 rounded-lg border border-stone-200 bg-stone-50 space-y-2 text-xs">
                    <div className="flex justify-between font-bold">
                      <span className="text-stone-900">{video.title}</span>
                      <span className="text-red-600">{formatNumber(video.views)} views</span>
                    </div>
                    <div className="text-[11px] text-stone-500">
                      {formatNumber(video.watchHours)} watch hours · {video.ctr}% CTR
                    </div>
                    <div className="p-2 bg-white rounded border text-[11px] text-stone-700">
                      <span className="font-bold">Retention Insight: </span>{video.retentionInsight}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {platform === 'linkedin' && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 border-b pb-2">
              LinkedIn Executive Demographics & Document Decks
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-lg bg-stone-50 border border-stone-200 space-y-2">
                <span className="font-bold text-stone-900">Audience Seniority Breakdown</span>
                {report.linkedin.seniorityDemographics.map((s) => (
                  <div key={s.title} className="flex justify-between py-1 border-b border-stone-100 last:border-none">
                    <span className="text-stone-700">{s.title}</span>
                    <span className="font-bold text-stone-900">{s.percentage}%</span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-lg bg-stone-50 border border-stone-200 space-y-2">
                <span className="font-bold text-stone-900">Content Format Efficacy</span>
                {report.linkedin.contentTypes.map((c) => (
                  <div key={c.type} className="p-2 bg-white rounded border text-[11px] space-y-0.5">
                    <div className="flex justify-between font-semibold text-stone-900">
                      <span>{c.type}</span>
                      <span className="text-sky-700">{c.engagementRate}% ER</span>
                    </div>
                    <div className="text-stone-500">{c.note}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {platform === 'facebook' && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 border-b pb-2">
              Facebook Community & Video Engagement
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-lg bg-stone-50 border border-stone-200 space-y-2">
                <span className="font-bold text-stone-900">Video Watch Retention Ratio</span>
                <div className="text-xl font-bold text-stone-900">
                  {report.facebook.videoMetrics.retention3SecPercent}% (3-sec) / {report.facebook.videoMetrics.retention1MinPercent}% (1-min)
                </div>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  {report.facebook.videoMetrics.commentary}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-stone-50 border border-stone-200 space-y-2">
                <span className="font-bold text-stone-900">Audience Geographic & Age Hubs</span>
                <p className="text-[11px] text-stone-700">
                  {report.facebook.demographics.topAgeGender}
                </p>
                <div className="text-[11px] text-stone-500">
                  Top Metros: {report.facebook.demographics.topLocations.join(', ')}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dedicated Platform Recommendations */}
        <div className="p-5 rounded-xl border border-stone-200 bg-stone-50/80 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
            {platform.toUpperCase()} Way Forward for Next Month
          </h4>
          <div className="space-y-2">
            {report.recommendations.actionableItems
              .filter((rec) => rec.platform.toLowerCase() === platform || rec.platform === 'Cross-Platform')
              .map((rec) => (
                <div key={rec.id} className="p-3 bg-white rounded-lg border border-stone-200 text-xs flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-stone-900">[{rec.priority} Priority]: </span>
                    <span className="text-stone-800">{rec.recommendation}</span>
                    <div className="text-[11px] text-stone-500 mt-0.5">
                      Expected outcome: {rec.expectedOutcome}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Sign-off */}
        <div className="pt-6 border-t border-stone-100 flex justify-between text-xs text-stone-500">
          <span>Prepared by {report.preparedBy || report.agencyName}</span>
          <span>Confidential · Generated exclusively for {report.clientName}</span>
        </div>

      </div>

    </div>
  );
};
