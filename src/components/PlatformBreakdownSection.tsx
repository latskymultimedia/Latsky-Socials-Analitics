import React, { useState } from 'react';
import { 
  Instagram, 
  Youtube, 
  Linkedin, 
  Facebook, 
  TrendingUp, 
  Users, 
  Play, 
  Compass, 
  Share2, 
  Bookmark, 
  Clock, 
  Eye, 
  MousePointerClick, 
  Sparkles,
  BarChart,
  PieChart,
  Upload,
  CheckCircle2
} from 'lucide-react';
import { TikTokIcon } from './icons/TikTokIcon';
import { PlatformType, SocialReportData, PlatformGrowthPlaybook } from '../types/report';
import { formatNumber, formatPercent, getPlatformColor } from '../utils/formatters';

interface PlatformBreakdownSectionProps {
  report: SocialReportData;
  isEditing?: boolean;
  onUpdateReport?: (updated: Partial<SocialReportData>) => void;
}

const PlaybookView: React.FC<{
  platformLabel: string;
  playbook?: PlatformGrowthPlaybook;
}> = ({ platformLabel, playbook }) => {
  if (!playbook) return null;
  return (
    <div className="space-y-4 pt-5 border-t border-stone-200">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{platformLabel} Tactical Growth Playbook & Field Suggestions</span>
          </h4>
          <p className="text-[11px] text-stone-500">
            Granular action items for subscriber conversion, watch-time views, comments, and algorithm optimization
          </p>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-700 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded">
          Detailed Playbook
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Subs Strategy */}
        <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/60 space-y-2">
          <div className="flex items-center justify-between pb-1.5 border-b border-stone-200">
            <span className="text-xs font-bold text-stone-900 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-emerald-600" />
              <span>How to Get More Subs & Follower Conversion</span>
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
              Subs Funnel
            </span>
          </div>
          <div className="text-xs space-y-1.5 text-stone-700">
            <div>
              <span className="font-semibold text-stone-900">Conversion Hook: </span>
              {playbook.subsStrategy.conversionHook}
            </div>
            <div>
              <span className="font-semibold text-stone-900">Profile Bio Tweak: </span>
              {playbook.subsStrategy.profileBioTweak}
            </div>
            <div>
              <span className="font-semibold text-stone-900">Lead Magnet / Series: </span>
              {playbook.subsStrategy.leadMagnetOrSeries}
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
            <span className="font-bold">Immediate Key Action: </span>
            {playbook.subsStrategy.keyAction}
          </div>
        </div>

        {/* 2. Views Strategy */}
        <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/60 space-y-2">
          <div className="flex items-center justify-between pb-1.5 border-b border-stone-200">
            <span className="text-xs font-bold text-stone-900 flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-blue-600" />
              <span>How to Get More Views & Viral Reach</span>
            </span>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
              Views & Reach
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
            <span className="font-bold">Immediate Key Action: </span>
            {playbook.viewsStrategy.keyAction}
          </div>
        </div>

        {/* 3. Comments Strategy */}
        <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/60 space-y-2">
          <div className="flex items-center justify-between pb-1.5 border-b border-stone-200">
            <span className="text-xs font-bold text-stone-900 flex items-center gap-1">
              <Share2 className="w-3.5 h-3.5 text-purple-600" />
              <span>How to Spark Comments & Community Discussion</span>
            </span>
            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200">
              Comments
            </span>
          </div>
          <div className="text-xs space-y-1.5 text-stone-700">
            <div>
              <span className="font-semibold text-stone-900">Discussion Prompt: </span>
              {playbook.commentsStrategy.discussionPrompt}
            </div>
            <div>
              <span className="font-semibold text-stone-900">Pinned Comment Strategy: </span>
              {playbook.commentsStrategy.pinnedCommentPlay}
            </div>
            <div>
              <span className="font-semibold text-stone-900">Response Speed: </span>
              {playbook.commentsStrategy.engagementVelocityTactic}
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-purple-50 border border-purple-200 text-xs text-purple-900">
            <span className="font-bold">Immediate Key Action: </span>
            {playbook.commentsStrategy.keyAction}
          </div>
        </div>

        {/* 4. Algorithm News */}
        <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/60 space-y-2">
          <div className="flex items-center justify-between pb-1.5 border-b border-amber-200">
            <span className="text-xs font-bold text-stone-900 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>2026 Platform Algorithm News & Shifts</span>
            </span>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded border border-amber-300">
              Algorithm News
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

      {/* 5. Specific Field Suggestions & Experiments */}
      {playbook.suggestions && playbook.suggestions.length > 0 && (
        <div className="space-y-2 pt-2">
          <h5 className="text-[11px] font-bold uppercase tracking-wider text-stone-700">
            Specific Suggested Field Experiments:
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {playbook.suggestions.map((s) => (
              <div key={s.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-200 text-stone-800">
                    [{s.field.toUpperCase()}] · {s.label}
                  </span>
                </div>
                <div className="text-stone-800 font-medium">
                  {s.tactic}
                </div>
                <div className="text-[11px] font-semibold text-emerald-700">
                  Expected Impact: {s.expectedImpact}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const PlatformBreakdownSection: React.FC<PlatformBreakdownSectionProps> = ({
  report,
  isEditing = false,
  onUpdateReport,
}) => {
  const [activeTab, setActiveTab] = useState<PlatformType>('instagram');

  const { facebook, instagram, youtube, linkedin, tiktok } = report;

  const effectiveTiktok = tiktok || {
    followers: 18900,
    netGrowth: 3100,
    videoViews: 142000,
    profileViews: 12400,
    likes: 21800,
    shares: 5400,
    comments: 1820,
    engagementRate: 7.4,
    postFormats: [
      { format: 'Sensory Micro-Hooks (<15s)', count: 5, avgViews: 38400, avgEngagement: 9.6 },
      { format: 'Narrative Craft Masterclasses (60s)', count: 3, avgViews: 24100, avgEngagement: 7.8 },
      { format: 'Behind-the-Scenes & Sound Wipes', count: 2, avgViews: 18900, avgEngagement: 6.2 }
    ],
    videoMetrics: {
      avgWatchTimeSec: 21.4,
      completionRatePercent: 49.2,
      fypTrafficPercent: 88.5,
      retentionInsight: 'Acoustic pattern interrupts in first 1.5 seconds drove 2.4 average replays per viewer. FYP distribution waves triggered by high completion rates.'
    },
    topPosts: [
      {
        id: 'tt-eff-1',
        title: 'Sensory Foley Sound & Cinematic Tone Breakdown',
        views: 89400,
        likes: 14800,
        shares: 3800,
        comments: 940,
        engagementRate: 11.4,
        whyItWorked: 'High sensory audio loop; viewers looped repeatedly and bookmarked for creative reference.'
      },
      {
        id: 'tt-eff-2',
        title: 'Why Most Visual Projects Fail the FYP Algorithm',
        views: 52600,
        likes: 7000,
        shares: 1600,
        comments: 880,
        engagementRate: 8.2,
        whyItWorked: 'Contrarian industry thesis sparked active debate in comments.'
      }
    ],
    demographics: {
      topLocations: ['United States (42%)', 'United Kingdom (28%)', 'Canada (16%)'],
      topAgeGender: '58% Female / 42% Male · Peak 20–38 years old',
      summary: 'High engagement creator and professional demographic with strong save velocity.'
    },
    growthPlaybook: {
      subsStrategy: {
        conversionHook: 'Follow for weekly creative masterclasses, lighting setups, and sound design stems.',
        profileBioTweak: 'Director & Creative Studio | Commercial Film Teardowns | New breakdowns in bio ↘',
        leadMagnetOrSeries: 'Launch "60-Second Film School": Weekly 3-part micro-lessons ending with an open question.',
        keyAction: 'Pin 3 signature masterclasses to top of profile that showcase the studio high-end reel.'
      },
      viewsStrategy: {
        viralHookTemplate: 'Immediate high-contrast visual pattern interrupt in frame 1 without voiceover interruptions.',
        retentionTrigger: 'Visual countdown of key details with continuous ambient audio bed to eliminate drop-off.',
        algorithmDistributionHack: '12-second seamless audio loops that loop imperceptibly on TikTok FYP.',
        keyAction: 'Test 3 seamless sound design loops this month to maximize loop multiplier metric on FYP.'
      },
      commentsStrategy: {
        discussionPrompt: 'Which creative choice fits this scene better? Tell us why in the comments.',
        pinnedCommentPlay: 'Pin a technical question highlighting a subtle flaw or choice in the craft to provoke comments.',
        engagementVelocityTactic: 'Reply to the first 25 comments within 45 minutes of publishing using video replies when possible.',
        keyAction: 'Create one dedicated video-reply answering a technical question from last week top comment.'
      },
      algorithmUpdatesNews: {
        latestUpdate: 'TikTok 2026 algorithm rewards search-optimized video SEO descriptions and long-tail query matches over generic trending hashtags.',
        impactOnBrand: 'Keyword-rich spoken audio and on-screen text now drive 35% of post discoverability through TikTok Search.',
        tacticalPivot: 'Include precise search keywords in spoken voiceover, text overlays, and the first 2 lines of caption.'
      },
      suggestions: [
        {
          id: 'tt-s1',
          field: 'subs',
          label: 'Series Playlist Architecture',
          tactic: 'Group micro-breakdowns into a TikTok Creator Playlist.',
          expectedImpact: '+55% viewer-to-follower conversion rate'
        },
        {
          id: 'tt-s2',
          field: 'views',
          label: 'Seamless Audio Loop Craft',
          tactic: 'Compose audio beds where the final snare hit resolves on the first frame of the repeat loop.',
          expectedImpact: 'Average watch time increases from 17s to 23s'
        }
      ]
    }
  };

  return (
    <section className="bg-white rounded-xl border border-stone-200 shadow-xs p-6 sm:p-8 space-y-6">
      
      {/* Header & Platform Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-100 pb-4 gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-wider font-bold text-stone-500">
            Section 04
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            Platform-by-Platform Deep Dive
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Channel-specific mechanics, format splits, watch-time retention & top posts (All 5 Channels)
          </p>
        </div>

        {/* Clean interactive platform selector (hidden in print) */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg shrink-0 flex-wrap print:hidden">
          <button
            type="button"
            onClick={() => setActiveTab('instagram')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition ${
              activeTab === 'instagram'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Instagram className="w-3.5 h-3.5 text-rose-600" />
            <span>Instagram</span>
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab('youtube')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition ${
              activeTab === 'youtube'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Youtube className="w-3.5 h-3.5 text-red-600" />
            <span>YouTube</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('linkedin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition ${
              activeTab === 'linkedin'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Linkedin className="w-3.5 h-3.5 text-sky-700" />
            <span>LinkedIn</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('facebook')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition ${
              activeTab === 'facebook'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Facebook className="w-3.5 h-3.5 text-blue-600" />
            <span>Facebook</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tiktok')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition ${
              activeTab === 'tiktok'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <TikTokIcon className="w-3.5 h-3.5 text-stone-900" />
            <span>TikTok</span>
          </button>
        </div>
      </div>

      {/* 1. INSTAGRAM DEEP DIVE */}
      <div className={`space-y-6 ${activeTab === 'instagram' ? 'block' : 'hidden print:block print:pt-6 print:border-t print:border-stone-300'}`}>
        <div className="hidden print:flex items-center gap-2 pb-2 mb-2 border-b border-stone-200 text-rose-700 font-bold text-sm uppercase tracking-wider">
          <Instagram className="w-4 h-4 text-rose-600" />
          <span>• 04-A. Instagram Channel Breakdown & Mechanics</span>
        </div>
          
          {/* Top KPI row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200">
              <span className="text-[10px] uppercase font-bold text-stone-500">Followers & Net</span>
              <div className="text-xl font-bold text-stone-900 mt-0.5 flex items-baseline gap-1.5">
                <span>{instagram.followers.toLocaleString()}</span>
                {instagram.followers >= 10000 && (
                  <span className="text-xs font-mono text-stone-400 font-normal">({formatNumber(instagram.followers)})</span>
                )}
              </div>
              <div className="text-[11px] text-emerald-700 font-semibold mt-1">
                {instagram.netGrowth >= 0 ? '+' : ''}{instagram.netGrowth.toLocaleString()} ({instagram.followUnfollowRatio})
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200">
              <span className="text-[10px] uppercase font-bold text-stone-500">Reach vs Impressions</span>
              <div className="text-xl font-bold text-stone-900 mt-0.5">
                {formatNumber(instagram.reach)}
              </div>
              <div className="text-[11px] text-stone-500 mt-1">
                {formatNumber(instagram.impressions)} impressions (1.6x frequency)
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200">
              <span className="text-[10px] uppercase font-bold text-stone-500">Profile & Link Actions</span>
              <div className="text-xl font-bold text-stone-900 mt-0.5">
                {formatNumber(instagram.websiteTaps)}
              </div>
              <div className="text-[11px] text-stone-500 mt-1">
                {formatNumber(instagram.profileVisits)} profile visits ({((instagram.websiteTaps / (instagram.profileVisits || 1)) * 100).toFixed(1)}% tap-thru)
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200">
              <span className="text-[10px] uppercase font-bold text-stone-500">Discovery & Retention</span>
              <div className="text-xl font-bold text-rose-700 mt-0.5">
                {instagram.nonFollowerDiscoveryRate}%
              </div>
              <div className="text-[11px] text-stone-500 mt-1">
                Reach from non-followers · Story {instagram.storyCompletionRate}% comp.
              </div>
            </div>
          </div>

          {/* Format Split Table (Reels vs Feed vs Stories vs Carousels) */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
              <Play className="w-3.5 h-3.5 text-rose-600" />
              <span>Format Split Performance</span>
            </h4>
            <div className="overflow-x-auto border border-stone-200 rounded-lg">
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-50 text-stone-600 uppercase tracking-wider text-[10px] font-semibold">
                  <tr>
                    <th className="px-4 py-2.5">Format</th>
                    <th className="px-4 py-2.5">Published</th>
                    <th className="px-4 py-2.5">Total Reach</th>
                    <th className="px-4 py-2.5">Shares / Saves</th>
                    <th className="px-4 py-2.5">Avg Watch / Retention</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {instagram.formatSplit.map((formatRow) => (
                    <tr key={formatRow.format} className="hover:bg-stone-50/50">
                      <td className="px-4 py-2.5 font-semibold text-stone-900">
                        {formatRow.formatLabel}
                      </td>
                      <td className="px-4 py-2.5 text-stone-700">{formatRow.count}</td>
                      <td className="px-4 py-2.5 font-bold text-stone-900">{formatNumber(formatRow.reach)}</td>
                      <td className="px-4 py-2.5 text-stone-700 font-medium">{formatNumber(formatRow.shares)}</td>
                      <td className="px-4 py-2.5 text-stone-600">{formatRow.avgWatchOrSave}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Posts Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Top Performing Posts & Why They Worked
            </h4>
            {instagram.topPosts.length === 0 ? (
              <div className="p-4 rounded-lg border border-dashed border-stone-200 bg-stone-50/50 text-center text-xs text-stone-500">
                No individual Instagram posts indexed for this period yet. Upload screengrabs or add via Edit Client.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {instagram.topPosts.map((post, idx) => (
                  <div key={post.id || idx} className="p-4 rounded-lg border border-stone-200 bg-stone-50/40 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                        {post.format}
                      </span>
                      <span className="text-xs font-bold text-stone-900">{post.engagementRate}% ER</span>
                    </div>
                    <h5 className="text-xs font-semibold text-stone-900 leading-snug line-clamp-2">
                      {post.title}
                    </h5>
                    <div className="flex items-center gap-3 text-[11px] text-stone-500 font-medium">
                      <span>{formatNumber(post.reach)} reach</span>
                      <span>·</span>
                      <span>{formatNumber(post.saves)} saves</span>
                      <span>·</span>
                      <span>{formatNumber(post.shares)} shares</span>
                    </div>
                    <div className="p-2.5 rounded bg-white border border-stone-200/80 text-[11px] text-stone-700 leading-relaxed">
                      <span className="font-semibold text-stone-900">Why it worked: </span>
                      {post.whyItWorked}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Instagram Growth Playbook & Suggestions */}
          <PlaybookView platformLabel="Instagram" playbook={instagram.growthPlaybook} />

        </div>

      {/* 2. YOUTUBE DEEP DIVE */}
      <div className={`space-y-6 ${activeTab === 'youtube' ? 'block' : 'hidden print:block print:pt-6 print:border-t print:border-stone-300'}`}>
        <div className="hidden print:flex items-center gap-2 pb-2 mb-2 border-b border-stone-200 text-red-700 font-bold text-sm uppercase tracking-wider">
          <Youtube className="w-4 h-4 text-red-600" />
          <span>• 04-B. YouTube Channel Breakdown & Retention</span>
        </div>
          
          {/* Top KPI row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200">
              <span className="text-[10px] uppercase font-bold text-stone-500">Subscribers & Delta</span>
              <div className="text-xl font-bold text-stone-900 mt-0.5 flex items-baseline gap-1.5">
                <span>{youtube.subscribers.toLocaleString()}</span>
                {youtube.subscribers >= 10000 && (
                  <span className="text-xs font-mono text-stone-400 font-normal">({formatNumber(youtube.subscribers)})</span>
                )}
              </div>
              <div className="text-[11px] text-emerald-700 font-semibold mt-1">
                {youtube.netGrowth >= 0 ? '+' : ''}{youtube.netGrowth.toLocaleString()} (~{youtube.subsGainedPerVideoAvg}/video)
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200">
              <span className="text-[10px] uppercase font-bold text-stone-500">Watch Time (Hours)</span>
              <div className="text-xl font-bold text-stone-900 mt-0.5">
                {formatNumber(youtube.watchTimeHours)} hrs
              </div>
              <div className="text-[11px] text-stone-500 mt-1">
                {formatNumber(youtube.views)} total video views
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200">
              <span className="text-[10px] uppercase font-bold text-stone-500">Retention & Duration</span>
              <div className="text-xl font-bold text-red-600 mt-0.5">
                {youtube.avgPercentViewed}%
              </div>
              <div className="text-[11px] text-stone-500 mt-1">
                {youtube.avgViewDuration} average view duration
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200">
              <span className="text-[10px] uppercase font-bold text-stone-500">Click-Through Rate</span>
              <div className="text-xl font-bold text-stone-900 mt-0.5">
                {youtube.ctr}%
              </div>
              <div className="text-[11px] text-stone-500 mt-1">
                {formatNumber(youtube.impressionsSuggestedBrowse)} impressions
              </div>
            </div>
          </div>

          {/* Traffic Sources & Retention Insight */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Traffic Sources */}
            <div className="p-4 rounded-lg bg-stone-50/70 border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                  Traffic Source Breakdown
                </h4>
                <span className="text-[11px] text-stone-500">Browse & Algorithm</span>
              </div>
              <div className="space-y-2">
                {youtube.trafficSources.map((source) => (
                  <div key={source.source} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-stone-700">{source.source}</span>
                      <span className="font-bold text-stone-900">{source.percentage}%</span>
                    </div>
                    <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-red-600 h-1.5 rounded-full"
                        style={{ width: `${source.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Audience Retention Insight */}
            <div className="p-4 rounded-lg bg-stone-50/70 border border-stone-200 space-y-3">
              <div className="flex items-center gap-2 text-stone-900">
                <Clock className="w-4 h-4 text-red-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider">
                  Audience Retention Guidance
                </h4>
              </div>
              <p className="text-xs text-stone-700 leading-relaxed">
                {youtube.retentionDropOffInsight}
              </p>
              <div className="p-2.5 rounded bg-white border border-stone-200 text-[11px] text-stone-600">
                <span className="font-semibold text-stone-900">Retention Strategy: </span>
                Place cold-open narrative hooks in the first 15 seconds; avoid long title sequences.
              </div>
            </div>

          </div>

          {/* Top Videos */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Top Videos & Watch Retention Graph Callout
            </h4>
            {youtube.topVideos.length === 0 ? (
              <div className="p-4 rounded-lg border border-dashed border-stone-200 bg-stone-50/50 text-center text-xs text-stone-500">
                No YouTube videos indexed for this period yet. Upload screengrabs or add via Edit Client.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {youtube.topVideos.map((video, idx) => (
                  <div key={video.id || idx} className="p-4 rounded-lg border border-stone-200 bg-stone-50/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-red-700 uppercase bg-red-50 px-2 py-0.5 rounded">
                        {formatNumber(video.views)} Views
                      </span>
                      <span className="text-xs font-semibold text-stone-700">{formatNumber(video.watchHours)} Watch Hrs · {video.ctr}% CTR</span>
                    </div>
                    <h5 className="text-xs font-bold text-stone-900 leading-snug">
                      {video.title}
                    </h5>
                    <div className="p-2.5 rounded bg-white border border-stone-200/80 text-[11px] text-stone-700 leading-relaxed">
                      <span className="font-semibold text-stone-900">Retention Insight: </span>
                      {video.retentionInsight}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* YouTube Growth Playbook & Suggestions */}
          <PlaybookView platformLabel="YouTube" playbook={youtube.growthPlaybook} />

        </div>

      {/* 3. LINKEDIN DEEP DIVE */}
      <div className={`space-y-6 ${activeTab === 'linkedin' ? 'block' : 'hidden print:block print:pt-6 print:border-t print:border-stone-300'}`}>
        <div className="hidden print:flex items-center gap-2 pb-2 mb-2 border-b border-stone-200 text-sky-800 font-bold text-sm uppercase tracking-wider">
          <Linkedin className="w-4 h-4 text-sky-700" />
          <span>• 04-C. LinkedIn B2B Presence & Case Studies</span>
        </div>
          
          {/* Top KPI row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200">
              <span className="text-[10px] uppercase font-bold text-stone-500">Followers & Net</span>
              <div className="text-xl font-bold text-stone-900 mt-0.5">
                {formatNumber(linkedin.followers)}
              </div>
              <div className="text-[11px] text-emerald-700 font-semibold mt-1">
                +{formatNumber(linkedin.netGrowth)} B2B contacts
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200">
              <span className="text-[10px] uppercase font-bold text-stone-500">Impressions & Reach</span>
              <div className="text-xl font-bold text-stone-900 mt-0.5">
                {formatNumber(linkedin.impressions)}
              </div>
              <div className="text-[11px] text-stone-500 mt-1">
                {formatNumber(linkedin.pageVisitors)} unique page visitors
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200">
              <span className="text-[10px] uppercase font-bold text-stone-500">Engagement & CTR</span>
              <div className="text-xl font-bold text-sky-700 mt-0.5">
                {linkedin.engagementRate}%
              </div>
              <div className="text-[11px] text-stone-500 mt-1">
                {linkedin.ctr}% click-through rate on links/decks
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200">
              <span className="text-[10px] uppercase font-bold text-stone-500">Top Format Driver</span>
              <div className="text-xl font-bold text-stone-900 mt-0.5">
                Carousels / Decks
              </div>
              <div className="text-[11px] text-stone-500 mt-1">
                Document posts generated 6.4% avg engagement
              </div>
            </div>
          </div>

          {/* Performance by Content Type & Seniority Demographics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Format breakdown */}
            <div className="p-4 rounded-lg bg-stone-50/70 border border-stone-200 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                Performance by Content Type
              </h4>
              <div className="space-y-2">
                {linkedin.contentTypes.map((item) => (
                  <div key={item.type} className="p-2 bg-white rounded border border-stone-200 text-xs">
                    <div className="flex justify-between font-semibold text-stone-900">
                      <span>{item.type}</span>
                      <span className="text-sky-700">{item.engagementRate}% ER</span>
                    </div>
                    <div className="text-[11px] text-stone-500 mt-0.5 flex justify-between">
                      <span>{item.note}</span>
                      <span>{formatNumber(item.reach)} reach</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Seniority Demographics */}
            <div className="p-4 rounded-lg bg-stone-50/70 border border-stone-200 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                Audience Seniority Breakdown
              </h4>
              <div className="space-y-2">
                {linkedin.seniorityDemographics.map((item) => (
                  <div key={item.title} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-stone-700">{item.title}</span>
                      <span className="font-bold text-stone-900">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-sky-700 h-1.5 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Top Posts */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Top LinkedIn Posts
            </h4>
            {linkedin.topPosts.length === 0 ? (
              <div className="p-4 rounded-lg border border-dashed border-stone-200 bg-stone-50/50 text-center text-xs text-stone-500">
                No individual LinkedIn posts indexed for this period yet. Upload screengrabs or add via Edit Client.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {linkedin.topPosts.map((post, idx) => (
                  <div key={post.id || idx} className="p-4 rounded-lg border border-stone-200 bg-stone-50/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-sky-700 uppercase bg-sky-50 px-2 py-0.5 rounded">
                        {formatNumber(post.reach)} Reach
                      </span>
                      <span className="text-xs font-semibold text-stone-700">{post.engagementRate}% ER</span>
                    </div>
                    <h5 className="text-xs font-bold text-stone-900 leading-snug">
                      {post.title}
                    </h5>
                    <div className="p-2.5 rounded bg-white border border-stone-200/80 text-[11px] text-stone-700 leading-relaxed">
                      <span className="font-semibold text-stone-900">Why it worked: </span>
                      {post.whyItWorked}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* LinkedIn Growth Playbook & Suggestions */}
          <PlaybookView platformLabel="LinkedIn" playbook={linkedin.growthPlaybook} />

        </div>

      {/* 4. FACEBOOK DEEP DIVE */}
      <div className={`space-y-6 ${activeTab === 'facebook' ? 'block' : 'hidden print:block print:pt-6 print:border-t print:border-stone-300'}`}>
        <div className="hidden print:flex items-center gap-2 pb-2 mb-2 border-b border-stone-200 text-blue-700 font-bold text-sm uppercase tracking-wider">
          <Facebook className="w-4 h-4 text-blue-600" />
          <span>• 04-D. Facebook Page Community & Video Feed</span>
        </div>
          
          {/* Top KPI row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200">
              <span className="text-[10px] uppercase font-bold text-stone-500">Page Likes & Delta</span>
              <div className="text-xl font-bold text-stone-900 mt-0.5">
                {formatNumber(facebook.followers)}
              </div>
              <div className="text-[11px] text-emerald-700 font-semibold mt-1">
                +{formatNumber(facebook.netGrowth)} net followers
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200">
              <span className="text-[10px] uppercase font-bold text-stone-500">Reach: Organic vs Paid</span>
              <div className="text-xl font-bold text-stone-900 mt-0.5">
                {formatNumber(facebook.reachOrganic + facebook.reachPaid)}
              </div>
              <div className="text-[11px] text-stone-500 mt-1">
                {formatNumber(facebook.reachOrganic)} organic · {formatNumber(facebook.reachPaid)} paid
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200">
              <span className="text-[10px] uppercase font-bold text-stone-500">Engagement Rate</span>
              <div className="text-xl font-bold text-blue-600 mt-0.5">
                {facebook.engagementRate}%
              </div>
              <div className="text-[11px] text-stone-500 mt-1">
                Above Meta sector average (1.5%)
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200">
              <span className="text-[10px] uppercase font-bold text-stone-500">Video Watch Retention</span>
              <div className="text-xl font-bold text-stone-900 mt-0.5">
                {facebook.videoMetrics.retention3SecPercent}% / {facebook.videoMetrics.retention1MinPercent}%
              </div>
              <div className="text-[11px] text-stone-500 mt-1">
                3-sec vs 1-min retention
              </div>
            </div>
          </div>

          {/* Formats split & Video Retention Commentary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Format Performance */}
            <div className="p-4 rounded-lg bg-stone-50/70 border border-stone-200 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                Format Performance Split
              </h4>
              <div className="space-y-2">
                {facebook.postFormats.map((f) => (
                  <div key={f.format} className="p-2.5 bg-white rounded border border-stone-200 text-xs flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-stone-900">{f.format} ({f.count} posts)</div>
                      <div className="text-[11px] text-stone-500">{formatNumber(f.avgReach)} avg reach</div>
                    </div>
                    <div className="font-bold text-blue-600">{f.avgEngagement}% ER</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Video Retention & Demographics */}
            <div className="p-4 rounded-lg bg-stone-50/70 border border-stone-200 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                Video Retention & Audience Demographics
              </h4>
              <p className="text-xs text-stone-700 leading-relaxed">
                {facebook.videoMetrics.commentary}
              </p>
              <div className="p-2.5 rounded bg-white border border-stone-200 text-[11px] space-y-1">
                <div className="font-semibold text-stone-900">{facebook.demographics.topAgeGender}</div>
                <div className="text-stone-500">Locations: {facebook.demographics.topLocations.join(' · ')}</div>
              </div>
            </div>

          </div>

          {/* Top Facebook Posts */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Top Facebook Posts & Community Amplification
            </h4>
            {facebook.topPosts.length === 0 ? (
              <div className="p-4 rounded-lg border border-dashed border-stone-200 bg-stone-50/50 text-center text-xs text-stone-500">
                No individual Facebook posts indexed for this period yet. Upload screengrabs or add via Edit Client.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {facebook.topPosts.map((post, idx) => (
                  <div key={post.id || idx} className="p-4 rounded-lg border border-stone-200 bg-stone-50/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-blue-700 uppercase bg-blue-50 px-2 py-0.5 rounded">
                        {formatNumber(post.reach)} Reach
                      </span>
                      <span className="text-xs font-semibold text-stone-700">{post.shares} shares · {post.engagementRate}% ER</span>
                    </div>
                    <h5 className="text-xs font-bold text-stone-900 leading-snug">
                      {post.title}
                    </h5>
                    <div className="p-2.5 rounded bg-white border border-stone-200/80 text-[11px] text-stone-700 leading-relaxed">
                      <span className="font-semibold text-stone-900">Why it worked: </span>
                      {post.whyItWorked}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Facebook Growth Playbook & Suggestions */}
          <PlaybookView platformLabel="Facebook" playbook={facebook.growthPlaybook} />

        </div>

      {/* 5. TIKTOK DEEP DIVE */}
      <div className={`space-y-6 ${activeTab === 'tiktok' ? 'block' : 'hidden print:block print:pt-6 print:border-t print:border-stone-300'}`}>
        <div className="hidden print:flex items-center gap-2 pb-2 mb-2 border-b border-stone-200 text-stone-900 font-bold text-sm uppercase tracking-wider">
          <TikTokIcon className="w-4 h-4 text-stone-900" />
          <span>• 04-E. TikTok Viral Pacing & Creator Playbook</span>
        </div>
            
            {/* Top KPI row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200">
                <span className="text-[10px] uppercase font-bold text-stone-500">Followers & Net</span>
                <div className="text-xl font-bold text-stone-900 mt-0.5 flex items-baseline gap-1.5">
                  <span>{effectiveTiktok.followers.toLocaleString()}</span>
                  {effectiveTiktok.followers >= 10000 && (
                    <span className="text-xs font-mono text-stone-400 font-normal">({formatNumber(effectiveTiktok.followers)})</span>
                  )}
                </div>
                <div className="text-[11px] text-emerald-700 font-semibold mt-1">
                  {effectiveTiktok.netGrowth >= 0 ? '+' : ''}{effectiveTiktok.netGrowth.toLocaleString()} net followers
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200">
                <span className="text-[10px] uppercase font-bold text-stone-500">Video Views (30D)</span>
                <div className="text-xl font-bold text-stone-900 mt-0.5">
                  {formatNumber(effectiveTiktok.videoViews)}
                </div>
                <div className="text-[11px] text-stone-500 mt-1">
                  {formatNumber(effectiveTiktok.profileViews)} profile visits
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200">
                <span className="text-[10px] uppercase font-bold text-stone-500">Engagement & Shares</span>
                <div className="text-xl font-bold text-stone-900 mt-0.5">
                  {effectiveTiktok.engagementRate}% ER
                </div>
                <div className="text-[11px] text-stone-500 mt-1">
                  {formatNumber(effectiveTiktok.likes)} likes · {formatNumber(effectiveTiktok.shares)} shares
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200">
                <span className="text-[10px] uppercase font-bold text-stone-500">Watch Retention & FYP</span>
                <div className="text-xl font-bold text-stone-900 mt-0.5">
                  {effectiveTiktok.videoMetrics.completionRatePercent}% Full
                </div>
                <div className="text-[11px] text-stone-500 mt-1">
                  {effectiveTiktok.videoMetrics.avgWatchTimeSec}s avg · {effectiveTiktok.videoMetrics.fypTrafficPercent}% FYP
                </div>
              </div>
            </div>

            {/* Formats split & Video Retention Commentary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Format Performance */}
              <div className="p-4 rounded-lg bg-stone-50/70 border border-stone-200 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                  TikTok Video Format Split
                </h4>
                <div className="space-y-2">
                  {effectiveTiktok.postFormats.map((f) => (
                    <div key={f.format} className="p-2.5 bg-white rounded border border-stone-200 text-xs flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-stone-900">{f.format} ({f.count} clips)</div>
                        <div className="text-[11px] text-stone-500">{formatNumber(f.avgViews)} avg views</div>
                      </div>
                      <div className="font-bold text-stone-900">{f.avgEngagement}% ER</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Video Retention & Demographics */}
              <div className="p-4 rounded-lg bg-stone-50/70 border border-stone-200 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                  Algorithm Distribution & Demographics
                </h4>
                <p className="text-xs text-stone-700 leading-relaxed">
                  {effectiveTiktok.videoMetrics.retentionInsight}
                </p>
                <div className="p-2.5 rounded bg-white border border-stone-200 text-[11px] space-y-1">
                  <div className="font-semibold text-stone-900">{effectiveTiktok.demographics.topAgeGender}</div>
                  <div className="text-stone-500">Key Geographies: {effectiveTiktok.demographics.topLocations.join(' · ')}</div>
                </div>
              </div>

            </div>

            {/* Top TikTok Posts */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                Top TikTok Videos & Viral Pacing
              </h4>
              {effectiveTiktok.topPosts.length === 0 ? (
                <div className="p-4 rounded-lg border border-dashed border-stone-200 bg-stone-50/50 text-center text-xs text-stone-500">
                  No individual TikTok videos indexed for this period yet. Upload screengrabs or add via Edit Client.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {effectiveTiktok.topPosts.map((post, idx) => (
                    <div key={post.id || idx} className="p-4 rounded-lg border border-stone-200 bg-stone-50/40 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-stone-900 uppercase bg-stone-200 px-2 py-0.5 rounded">
                          {formatNumber(post.views)} Views
                        </span>
                        <span className="text-xs font-semibold text-stone-700">{post.likes} likes · {post.shares} shares</span>
                      </div>
                      <h5 className="text-xs font-bold text-stone-900 leading-snug">
                        {post.title}
                      </h5>
                      <div className="p-2.5 rounded bg-white border border-stone-200/80 text-[11px] text-stone-700 leading-relaxed">
                        <span className="font-semibold text-stone-900">Why it worked: </span>
                        {post.whyItWorked}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* TikTok Growth Playbook & Suggestions */}
            <PlaybookView platformLabel="TikTok" playbook={effectiveTiktok.growthPlaybook} />

      </div>

    </section>
  );
};
