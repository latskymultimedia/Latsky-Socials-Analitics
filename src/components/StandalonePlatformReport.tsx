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
import { TikTokIcon } from './icons/TikTokIcon';
import { PlatformType, SocialReportData } from '../types/report';
import { formatNumber, formatPercent, getPlatformColor } from '../utils/formatters';
import { exportHtmlReport } from '../utils/exportUtils';

interface StandalonePlatformReportProps {
  report: SocialReportData;
  platform: PlatformType;
  onBackToOverall: () => void;
  onSaveToLaptop: () => void;
  onOpenExportModal?: () => void;
}

export const StandalonePlatformReport: React.FC<StandalonePlatformReportProps> = ({
  report,
  platform,
  onBackToOverall,
  onSaveToLaptop,
  onOpenExportModal,
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
      case 'tiktok':
        return <TikTokIcon className="w-6 h-6 text-stone-900" />;
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
      case 'tiktok':
        return 'TikTok Viral Reach, Watch Retention & Creator Analytics Report';
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
            onClick={() => exportHtmlReport(report, platform)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download {platform.toUpperCase()} HTML / PDF</span>
          </button>
          <button
            type="button"
            onClick={() => {
              try {
                window.print();
              } catch {
                exportHtmlReport(report, platform);
              }
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 border border-stone-300 bg-white text-stone-700 rounded-lg text-xs font-medium hover:bg-stone-50 transition"
          >
            <Printer className="w-3.5 h-3.5 text-stone-500" />
            <span>Print</span>
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

        {/* TikTok Standalone Section */}
        {platform === 'tiktok' && report.tiktok && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 border-b pb-2">
              TikTok Format Split & Watch Retention Mechanics
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-stone-50 border border-stone-200">
                <span className="text-[11px] font-bold text-stone-500">Average Watch Time</span>
                <div className="text-xl font-bold text-stone-900 mt-1">
                  {report.tiktok.videoMetrics.avgWatchTimeSec}s Avg
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  {report.tiktok.videoMetrics.completionRatePercent}% of viewers watched the full video duration.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-stone-50 border border-stone-200">
                <span className="text-[11px] font-bold text-stone-500">For You Page (FYP) Pickup</span>
                <div className="text-xl font-bold text-stone-900 mt-1">
                  {report.tiktok.videoMetrics.fypTrafficPercent}% FYP
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  Organic traffic driven through TikTok's recommendation algorithm.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-stone-50 border border-stone-200">
                <span className="text-[11px] font-bold text-stone-500">Profile Conversion Rate</span>
                <div className="text-xl font-bold text-stone-900 mt-1">
                  {formatNumber(report.tiktok.profileViews)} Visits
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  Drove +{formatNumber(report.tiktok.netGrowth)} net followers ({((report.tiktok.netGrowth / (report.tiktok.profileViews || 1)) * 100).toFixed(1)}% follow conversion).
                </p>
              </div>
            </div>

            {/* Video Formats Breakdown */}
            <div className="overflow-x-auto border border-stone-200 rounded-lg">
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-50 text-stone-600 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="px-4 py-2.5">Clip Format Style</th>
                    <th className="px-4 py-2.5">Published Count</th>
                    <th className="px-4 py-2.5">Average Views</th>
                    <th className="px-4 py-2.5">Engagement Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {report.tiktok.postFormats.map((f) => (
                    <tr key={f.format} className="hover:bg-stone-50/50">
                      <td className="px-4 py-2.5 font-bold text-stone-900">{f.format}</td>
                      <td className="px-4 py-2.5 text-stone-700">{f.count} clips</td>
                      <td className="px-4 py-2.5 font-semibold text-stone-900">{formatNumber(f.avgViews)}</td>
                      <td className="px-4 py-2.5 font-bold text-stone-900">{f.avgEngagement}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Top TikTok Posts */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                Top TikTok Videos
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {report.tiktok.topPosts.map((post) => (
                  <div key={post.id} className="p-4 rounded-lg border border-stone-200 bg-stone-50/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-stone-900 bg-stone-200 px-2 py-0.5 rounded">
                        {formatNumber(post.views)} Views
                      </span>
                      <span className="text-xs font-semibold text-stone-700">{post.likes} likes · {post.shares} shares</span>
                    </div>
                    <h5 className="text-xs font-bold text-stone-900 leading-snug">
                      {post.title}
                    </h5>
                    <div className="p-2.5 rounded bg-white border border-stone-200 text-[11px] text-stone-700 leading-relaxed">
                      <span className="font-semibold text-stone-900">Why it worked: </span>
                      {post.whyItWorked}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Growth Playbook for this specific platform */}
        {(() => {
          const playbook = platform === 'instagram' ? report.instagram.growthPlaybook
            : platform === 'youtube' ? report.youtube.growthPlaybook
            : platform === 'linkedin' ? report.linkedin.growthPlaybook
            : platform === 'facebook' ? report.facebook.growthPlaybook
            : platform === 'tiktok' ? report.tiktok?.growthPlaybook
            : undefined;

          if (!playbook) return null;

          return (
            <div className="space-y-6 pt-4 border-t border-stone-200">
              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
                    {platform.toUpperCase()} In-Depth Growth Playbook
                  </h3>
                  <p className="text-xs text-stone-500">
                    Targeted strategies for subscribers, views, comments, and algorithm optimization
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  Agency Action Plan
                </span>
              </div>

              {/* 4 Pillars Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 1. Subs Strategy */}
                <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/60 space-y-2.5">
                  <div className="flex items-center justify-between pb-1.5 border-b border-stone-200">
                    <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                      👥 Follower & Sub Conversion Funnel
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                      Conversion
                    </span>
                  </div>
                  <div className="text-xs space-y-1.5 text-stone-700">
                    <div>
                      <span className="font-semibold text-stone-900">Conversion Hook: </span>
                      {playbook.subsStrategy.conversionHook}
                    </div>
                    <div>
                      <span className="font-semibold text-stone-900">Bio Optimization: </span>
                      {playbook.subsStrategy.profileBioTweak}
                    </div>
                    <div>
                      <span className="font-semibold text-stone-900">Series / Lead Magnet: </span>
                      {playbook.subsStrategy.leadMagnetOrSeries}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                    <span className="font-bold">Next Action: </span>
                    {playbook.subsStrategy.keyAction}
                  </div>
                </div>

                {/* 2. Views Strategy */}
                <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/60 space-y-2.5">
                  <div className="flex items-center justify-between pb-1.5 border-b border-stone-200">
                    <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                      🚀 Views & Watch Time Acceleration
                    </span>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                      Reach
                    </span>
                  </div>
                  <div className="text-xs space-y-1.5 text-stone-700">
                    <div>
                      <span className="font-semibold text-stone-900">Opening Hook Pattern: </span>
                      {playbook.viewsStrategy.viralHookTemplate}
                    </div>
                    <div>
                      <span className="font-semibold text-stone-900">Retention Trigger: </span>
                      {playbook.viewsStrategy.retentionTrigger}
                    </div>
                    <div>
                      <span className="font-semibold text-stone-900">Algorithm Hack: </span>
                      {playbook.viewsStrategy.algorithmDistributionHack}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-900">
                    <span className="font-bold">Next Action: </span>
                    {playbook.viewsStrategy.keyAction}
                  </div>
                </div>

                {/* 3. Comments Strategy */}
                <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/60 space-y-2.5">
                  <div className="flex items-center justify-between pb-1.5 border-b border-stone-200">
                    <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                      💬 Comments & Community Discussion
                    </span>
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200">
                      Discussion
                    </span>
                  </div>
                  <div className="text-xs space-y-1.5 text-stone-700">
                    <div>
                      <span className="font-semibold text-stone-900">Discussion Prompt: </span>
                      {playbook.commentsStrategy.discussionPrompt}
                    </div>
                    <div>
                      <span className="font-semibold text-stone-900">Pinned Comment: </span>
                      {playbook.commentsStrategy.pinnedCommentPlay}
                    </div>
                    <div>
                      <span className="font-semibold text-stone-900">Response Speed: </span>
                      {playbook.commentsStrategy.engagementVelocityTactic}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-purple-50 border border-purple-200 text-xs text-purple-900">
                    <span className="font-bold">Next Action: </span>
                    {playbook.commentsStrategy.keyAction}
                  </div>
                </div>

                {/* 4. Algorithm News */}
                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/60 space-y-2.5">
                  <div className="flex items-center justify-between pb-1.5 border-b border-amber-200">
                    <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                      ⚡ 2026 Platform Algorithm News
                    </span>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded border border-amber-300">
                      News & Shift
                    </span>
                  </div>
                  <div className="text-xs space-y-1.5 text-amber-950">
                    <div>
                      <span className="font-bold">Current Shift: </span>
                      {playbook.algorithmUpdatesNews.latestUpdate}
                    </div>
                    <div>
                      <span className="font-semibold">Brand Impact: </span>
                      {playbook.algorithmUpdatesNews.impactOnBrand}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-amber-300 text-xs text-amber-900">
                    <span className="font-bold">Tactical Counter-Measure: </span>
                    {playbook.algorithmUpdatesNews.tacticalPivot}
                  </div>
                </div>

              </div>

              {/* Granular Field Suggestions */}
              {playbook.suggestions && playbook.suggestions.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                    Specific Field Suggestions & Experiments Added
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {playbook.suggestions.map((s) => (
                      <div key={s.id} className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-200 text-stone-800">
                            [{s.field.toUpperCase()}] · {s.label}
                          </span>
                        </div>
                        <p className="text-stone-800 leading-relaxed font-medium">
                          {s.tactic}
                        </p>
                        <div className="text-[11px] font-semibold text-emerald-700 pt-1">
                          Expected Outcome: {s.expectedImpact}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          );
        })()}

        {/* Dedicated Platform Recommendations (Strictly for this platform only!) */}
        <div className="p-5 rounded-xl border border-stone-200 bg-stone-50/80 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
            {platform.toUpperCase()} Way Forward for Next Month
          </h4>
          <div className="space-y-2">
            {report.recommendations.actionableItems
              .filter((rec) => rec.platform.toLowerCase() === platform.toLowerCase())
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
            {report.recommendations.actionableItems.filter((rec) => rec.platform.toLowerCase() === platform.toLowerCase()).length === 0 && (
              <div className="text-xs text-stone-500 italic p-2">
                Refer to the tactical action steps highlighted in the {platform.toUpperCase()} Growth Playbook above.
              </div>
            )}
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
