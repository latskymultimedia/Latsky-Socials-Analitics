import { SocialReportData } from '../types/report';

export interface SynthesisOptions {
  clientName: string;
  clientSubtitle?: string;
  reportPeriod: string;
  goals?: string;
  notes?: string;
  platforms?: string[];
  imageCount?: number;
  imageNames?: string[];
  knownMetrics?: Record<string, any>;
}

export function generateSynthesizedAgencyReport(options: SynthesisOptions): SocialReportData {
  const client = options.clientName?.trim() || 'Client Brand';
  const subtitle = options.clientSubtitle?.trim() || 'Executive Monthly Review';
  const period = options.reportPeriod?.trim() || 'Current Reporting Period';
  const goals = options.goals?.trim() || 'Audience expansion and community engagement';
  const notes = options.notes?.trim() || '';
  const known = options.knownMetrics || {};

  const requestedPlatforms = (options.platforms && options.platforms.length > 0)
    ? options.platforms.map((p) => p.toLowerCase())
    : ['youtube', 'instagram', 'linkedin', 'facebook', 'tiktok'];

  const isPlatformActive = (plat: string) => requestedPlatforms.includes(plat.toLowerCase());

  // Use only verified knownMetrics or default to 0 for incoming live data
  const getMetric = (key: string, defaultVal = 0) => {
    if (known[key] !== undefined && known[key] !== '') {
      return Number(known[key]) || 0;
    }
    // Return 0 instead of fake template numbers if no data has been uploaded yet
    return defaultVal;
  };

  const summaryTable = [
    {
      platform: 'youtube' as const,
      platformLabel: 'YouTube',
      followers: getMetric('youtubeSubscribers', 0),
      followersDelta: getMetric('youtubeNetGrowth', 0),
      reach: getMetric('youtubeReach', 0),
      reachDelta: 0,
      engagementRate: 0,
      topContentType: isPlatformActive('youtube') ? 'Awaiting Data Export' : 'Not Monitored',
      totalPosts: 0
    },
    {
      platform: 'instagram' as const,
      platformLabel: 'Instagram',
      followers: getMetric('instagramFollowers', 0),
      followersDelta: getMetric('instagramNetGrowth', 0),
      reach: getMetric('instagramReach', 0),
      reachDelta: 0,
      engagementRate: 0,
      topContentType: isPlatformActive('instagram') ? 'Awaiting Data Export' : 'Not Monitored',
      totalPosts: 0
    },
    {
      platform: 'linkedin' as const,
      platformLabel: 'LinkedIn',
      followers: getMetric('linkedinFollowers', 0),
      followersDelta: getMetric('linkedinNetGrowth', 0),
      reach: getMetric('linkedinReach', 0),
      reachDelta: 0,
      engagementRate: 0,
      topContentType: isPlatformActive('linkedin') ? 'Awaiting Data Export' : 'Not Monitored',
      totalPosts: 0
    },
    {
      platform: 'facebook' as const,
      platformLabel: 'Facebook',
      followers: getMetric('facebookFollowers', 0),
      followersDelta: getMetric('facebookNetGrowth', 0),
      reach: getMetric('facebookReach', 0),
      reachDelta: 0,
      engagementRate: 0,
      topContentType: isPlatformActive('facebook') ? 'Awaiting Data Export' : 'Not Monitored',
      totalPosts: 0
    },
    {
      platform: 'tiktok' as const,
      platformLabel: 'TikTok',
      followers: getMetric('tiktokFollowers', 0),
      followersDelta: getMetric('tiktokNetGrowth', 0),
      reach: getMetric('tiktokReach', 0),
      reachDelta: 0,
      engagementRate: 0,
      topContentType: isPlatformActive('tiktok') ? 'Awaiting Data Export' : 'Not Monitored',
      totalPosts: 0
    }
  ];

  const activeRows = summaryTable.filter((r) => isPlatformActive(r.platform));
  const reach = activeRows.reduce((sum, r) => sum + r.reach, 0);
  const followers = activeRows.reduce((sum, r) => sum + r.followers, 0);
  const netGrowth = activeRows.reduce((sum, r) => sum + r.followersDelta, 0);

  return {
    id: `syn-${Date.now()}`,
    clientName: client,
    clientSubtitle: subtitle,
    clientLogoUrl: '',
    agencyName: 'Latsky Multimedia',
    agencyLogoUrl: '',
    reportPeriod: period,
    comparisonPeriod: 'Prior Month',
    preparedBy: 'Latsky Analytics Engine',
    lastModified: new Date().toISOString(),
    uploadedScreenshots: [],
    executiveSummary: {
      headlineTakeaways: [
        reach > 0 
          ? `Active cross-platform reach is tracking at ${reach.toLocaleString()} unique views across monitored channels.`
          : `Awaiting screenshot uploads or data exports to calculate live cross-platform metrics.`
      ],
      overallReach: reach,
      overallReachPrevDelta: 0,
      overallReachYoYDelta: 0,
      overallEngagementRate: 0,
      overallEngagementPrevDelta: 0,
      keyWins: [],
      watchItem: 'Upload dashboard screengrabs or CSV exports to populate live diagnostic findings.'
    },
    goalsAndContext: {
      strategyAim: goals,
      campaignsAndBoosts: notes || 'Live reporting mode: Populates from verified uploads.',
      externalFactors: 'Metrics reflect incoming live data exports and visual uploads.'
    },
    crossPlatformOverview: {
      highlightInsight: 'Metrics reflect incoming live data exports and visual uploads.',
      summaryTable
    },
    // Keep structured objects clean and ready to bind real extracted values
    facebook: {
      followers: getMetric('facebookFollowers', 0),
      netGrowth: getMetric('facebookNetGrowth', 0),
      reachOrganic: getMetric('facebookReach', 0),
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
      followers: getMetric('instagramFollowers', 0),
      netGrowth: getMetric('instagramNetGrowth', 0),
      followUnfollowRatio: 'N/A',
      reach: getMetric('instagramReach', 0),
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
      subscribers: getMetric('youtubeSubscribers', 0),
      netGrowth: getMetric('youtubeNetGrowth', 0),
      subsGainedPerVideoAvg: 0,
      views: getMetric('youtubeReach', 0),
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
      followers: getMetric('linkedinFollowers', 0),
      netGrowth: getMetric('linkedinNetGrowth', 0),
      pageVisitors: 0,
      impressions: getMetric('linkedinReach', 0),
      engagementRate: 0,
      ctr: 0,
      contentTypes: [],
      seniorityDemographics: [],
      topPosts: [],
      growthPlaybook: null
    },
    tiktok: {
      followers: getMetric('tiktokFollowers', 0),
      netGrowth: getMetric('tiktokNetGrowth', 0),
      videoViews: getMetric('tiktokReach', 0),
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
    appendixRawMetrics: [
      { metric: 'Total Cross-Platform Impressions', value: reach > 0 ? (reach * 1.5).toLocaleString() : '0', notes: 'Awaiting uploads' },
      { metric: 'Total Video Views (>3s)', value: reach > 0 ? Math.round(reach * 0.4).toLocaleString() : '0', notes: 'Awaiting uploads' },
      { metric: 'Net Inbound Inquiries via Social Bio Links', value: '0', notes: 'Awaiting uploads' }
    ]
  };
}
