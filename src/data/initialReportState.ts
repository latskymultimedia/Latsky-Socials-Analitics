import { SocialReportData } from '../types/report';

// Initial empty state for your report data (NO hardcoded placeholder numbers)
export const initialReportState: SocialReportData = {
  id: 'clean-initial-report',
  clientName: '',
  clientSubtitle: '',
  clientLogoUrl: '',
  agencyName: 'Latsky Multimedia',
  agencyLogoUrl: '',
  reportPeriod: '',
  comparisonPeriod: 'Prior Period',
  preparedBy: 'Latsky Analytics Engine',
  lastModified: new Date().toISOString(),
  uploadedScreenshots: [],
  executiveSummary: {
    headlineTakeaways: [
      'Awaiting dashboard screenshots or data exports to calculate live cross-platform metrics.'
    ],
    overallReach: 0,
    overallReachPrevDelta: 0,
    overallReachYoYDelta: 0,
    overallEngagementRate: 0,
    overallEngagementPrevDelta: 0,
    keyWins: [],
    watchItem: 'Upload dashboard screengrabs or CSV exports to populate live diagnostic findings.'
  },
  goalsAndContext: {
    strategyAim: 'Audience expansion and community engagement',
    campaignsAndBoosts: 'Awaiting verified data exports.',
    externalFactors: 'Metrics reflect incoming live data exports and visual uploads.'
  },
  crossPlatformOverview: {
    highlightInsight: 'Showing verified incoming data only.',
    summaryTable: [
      { platform: 'youtube', platformLabel: 'YouTube', followers: 0, followersDelta: 0, reach: 0, reachDelta: 0, engagementRate: 0, topContentType: 'Not Monitored', totalPosts: 0 },
      { platform: 'instagram', platformLabel: 'Instagram', followers: 0, followersDelta: 0, reach: 0, reachDelta: 0, engagementRate: 0, topContentType: 'Not Monitored', totalPosts: 0 },
      { platform: 'linkedin', platformLabel: 'LinkedIn', followers: 0, followersDelta: 0, reach: 0, reachDelta: 0, engagementRate: 0, topContentType: 'Not Monitored', totalPosts: 0 },
      { platform: 'facebook', platformLabel: 'Facebook', followers: 0, followersDelta: 0, reach: 0, reachDelta: 0, engagementRate: 0, topContentType: 'Not Monitored', totalPosts: 0 },
      { platform: 'tiktok', platformLabel: 'TikTok', followers: 0, followersDelta: 0, reach: 0, reachDelta: 0, engagementRate: 0, topContentType: 'Not Monitored', totalPosts: 0 },
    ]
  },
  facebook: {
    followers: 0,
    netGrowth: 0,
    reachOrganic: 0,
    reachPaid: 0,
    engagementRate: 0,
    postFormats: [],
    videoMetrics: {
      views: 0,
      avgWatchTimeSec: 0,
      retention3SecPercent: 0,
      retention1MinPercent: 0,
      commentary: 'Awaiting video metrics upload'
    },
    topPosts: [],
    demographics: {
      topLocations: [],
      topAgeGender: 'N/A',
      summary: 'Awaiting demographic data'
    },
    growthPlaybook: null
  },
  instagram: {
    followers: 0,
    netGrowth: 0,
    followUnfollowRatio: 'N/A',
    reach: 0,
    impressions: 0,
    profileVisits: 0,
    websiteTaps: 0,
    formatSplit: [],
    storyCompletionRate: 0,
    nonFollowerDiscoveryRate: 0,
    topPosts: [],
    growthPlaybook: null
  },
  youtube: {
    subscribers: 0,
    netGrowth: 0,
    subsGainedPerVideoAvg: 0,
    views: 0,
    watchTimeHours: 0,
    avgViewDuration: '0:00',
    avgPercentViewed: 0,
    ctr: 0,
    impressionsSuggestedBrowse: 0,
    trafficSources: [],
    topVideos: [],
    retentionDropOffInsight: 'Awaiting YouTube Studio upload',
    growthPlaybook: null
  },
  linkedin: {
    followers: 0,
    netGrowth: 0,
    pageVisitors: 0,
    impressions: 0,
    engagementRate: 0,
    ctr: 0,
    contentTypes: [],
    seniorityDemographics: [],
    topPosts: [],
    growthPlaybook: null
  },
  tiktok: {
    followers: 0,
    netGrowth: 0,
    videoViews: 0,
    profileViews: 0,
    likes: 0,
    shares: 0,
    comments: 0,
    engagementRate: 0,
    postFormats: [],
    videoMetrics: {
      avgWatchTimeSec: 0,
      completionRatePercent: 0,
      fypTrafficPercent: 0,
      retentionInsight: 'Awaiting TikTok analytics upload'
    },
    topPosts: [],
    demographics: {
      topLocations: [],
      topAgeGender: 'N/A',
      summary: 'Awaiting demographic data'
    },
    growthPlaybook: null
  },
  contentPerformance: {
    topPostsAllPlatforms: [],
    contentPillars: [],
    bestPostingSchedule: {
      bestDays: [],
      bestTimeWindow: 'Awaiting data',
      insight: 'Upload post history to compute optimal timing'
    }
  },
  audienceInsights: {
    growthQuality: 'Upload audience screenshots to analyze organic vs paid acquisition.',
    organicVsPaidRatio: 'N/A',
    demographicShifts: 'Awaiting data'
  },
  competitiveBenchmark: {
    industryBenchmarkAvg: {
      engagementRate: 'N/A',
      reachGrowth: 'N/A',
      summary: 'Add competitor links in Section 07 to generate benchmark radar.'
    },
    competitors: []
  },
  recommendations: {
    actionableItems: [],
    contentCalendarDirection: 'Upload screenshots to generate customized channel recommendations.',
    testingPriorities: []
  },
  appendixRawMetrics: []
};
