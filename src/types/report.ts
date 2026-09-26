export type PlatformType = 'facebook' | 'instagram' | 'youtube' | 'linkedin' | 'tiktok' | 'x' | 'general';

export interface UploadedScreenshot {
  id: string;
  name: string;
  platform: PlatformType;
  dataUrl: string;
  uploadedAt: string;
  summary?: string;
}

export interface PlatformSummaryRow {
  platform: PlatformType;
  platformLabel: string;
  followers: number;
  followersDelta: number;
  reach: number;
  reachDelta: number;
  engagementRate: number; // percentage, e.g. 4.8
  topContentType: string;
  totalPosts: number;
}

export interface FacebookFormatMetric {
  format: string; // 'Reels', 'Video', 'Image', 'Link Post'
  count: number;
  avgReach: number;
  avgEngagement: number;
}

export interface FacebookTopPost {
  id: string;
  title: string;
  date: string;
  reach: number;
  engagementRate: number;
  shares: number;
  screenshotUrl?: string;
  whyItWorked: string;
}

export interface InstagramFormatSplit {
  format: 'reels' | 'feed' | 'stories' | 'carousels';
  formatLabel: string;
  count: number;
  reach: number;
  shares: number;
  avgWatchOrSave: string;
}

export interface InstagramTopPost {
  id: string;
  title: string;
  format: string;
  reach: number;
  engagementRate: number;
  saves: number;
  shares: number;
  screenshotUrl?: string;
  whyItWorked: string;
}

export interface YouTubeTrafficSource {
  source: string;
  percentage: number;
}

export interface YouTubeTopVideo {
  id: string;
  title: string;
  views: number;
  watchHours: number;
  ctr: number;
  retentionInsight: string;
  screenshotUrl?: string;
}

export interface LinkedInContentType {
  type: string; // 'Document / Carousel', 'Native Video', 'Thought Leadership Text', 'Link Post'
  engagementRate: number;
  reach: number;
  note: string;
}

export interface LinkedInTopPost {
  id: string;
  title: string;
  reach: number;
  engagementRate: number;
  screenshotUrl?: string;
  whyItWorked: string;
}

export interface TikTokFormatMetric {
  format: string; // 'Short Clips (<15s)', 'Mid-form Narrative (30-60s)', 'Sound-Driven Trends', 'Masterclasses'
  count: number;
  avgViews: number;
  avgEngagement: number;
}

export interface TikTokTopPost {
  id: string;
  title: string;
  views: number;
  likes: number;
  shares: number;
  comments: number;
  engagementRate: number;
  screenshotUrl?: string;
  whyItWorked: string;
}

export interface TikTokReport {
  followers: number;
  netGrowth: number;
  videoViews: number;
  profileViews: number;
  likes: number;
  shares: number;
  comments: number;
  engagementRate: number;
  postFormats: TikTokFormatMetric[];
  videoMetrics: {
    avgWatchTimeSec: number;
    completionRatePercent: number;
    fypTrafficPercent: number;
    retentionInsight: string;
  };
  topPosts: TikTokTopPost[];
  demographics: {
    topLocations: string[];
    topAgeGender: string;
    summary: string;
  };
  growthPlaybook?: PlatformGrowthPlaybook;
}

export interface CrossPlatformTopPost {
  rank: number;
  title: string;
  platform: PlatformType;
  reach: number;
  engagementRate: number;
  viralityScore: number;
  screenshotUrl?: string;
  whyItWorked: string;
}

export interface ContentPillar {
  pillarName: string; // e.g. 'Behind-the-Scenes & Craft', 'Educational / Insights', 'Client Stories / Testimonials'
  shareOfVoicePercent: number;
  performanceIndex: 'High' | 'Medium' | 'Low';
  avgEngagement: number;
  keyTakeaway: string;
}

export interface CompetitorBenchmark {
  competitor: string;
  followerCount: string;
  monthlyGrowthRate: string;
  avgEngagementRate: string;
  qualitativeNote: string;
}

export interface ActionRecommendation {
  id: string;
  priority: 'High' | 'Medium' | 'Strategic';
  recommendation: string;
  expectedOutcome: string;
  platform: string;
}

export interface TacticalSuggestion {
  id: string;
  field: 'subs' | 'views' | 'comments' | 'algorithm_news' | 'format';
  label: string;
  tactic: string;
  expectedImpact: string;
}

export interface PlatformGrowthPlaybook {
  // 1. How to get more subs / follower conversion
  subsStrategy: {
    conversionHook: string;
    profileBioTweak: string;
    leadMagnetOrSeries: string;
    keyAction: string;
  };
  // 2. How to get more views / reach acceleration
  viewsStrategy: {
    viralHookTemplate: string;
    retentionTrigger: string;
    algorithmDistributionHack: string;
    keyAction: string;
  };
  // 3. How to spark high-intent comments & conversations
  commentsStrategy: {
    discussionPrompt: string;
    pinnedCommentPlay: string;
    engagementVelocityTactic: string;
    keyAction: string;
  };
  // 4. Current Platform Updates & Algorithm News
  algorithmUpdatesNews: {
    latestUpdate: string;
    impactOnBrand: string;
    tacticalPivot: string;
  };
  // 5. Granular suggested actions added in specific fields
  suggestions: TacticalSuggestion[];
}

export interface IndustryWebIntel {
  industryName: string;
  scrapedAt: string;
  source: 'firecrawl' | 'firecrawl_live' | 'ai_grounded';
  sourcesScraped: string[];
  industryOverview: string;
  subGrowthPlaybook: string;
  viewsAndReachPlaybook: string;
  commentsAndDebatesPlaybook: string;
  socialAlgorithmNews2026: {
    platform: string;
    newsHeadline: string;
    strategicTakeaway: string;
  }[];
  trendingHooksAndFormats: {
    formatName: string;
    hookPattern: string;
    whyItWorksInThisIndustry: string;
  }[];
}

export interface SocialReportData {
  id: string;
  clientName: string;
  clientSubtitle: string;
  clientLogoUrl: string;
  agencyName: string;
  agencyLogoUrl: string;
  reportPeriod: string;
  comparisonPeriod: string;
  preparedBy: string;
  lastModified: string;
  
  // 1. Executive Summary
  executiveSummary: {
    headlineTakeaways: string[];
    overallReach: number;
    overallReachPrevDelta: number; // e.g. +18.4%
    overallReachYoYDelta: number;   // e.g. +42.1%
    overallEngagementRate: number;
    overallEngagementPrevDelta: number;
    keyWins: string[];
    watchItem: string;
  };

  // 2. Goals & Context
  goalsAndContext: {
    strategyAim: string;
    campaignsAndBoosts: string;
    externalFactors: string;
  };

  // 3. Cross-Platform Overview
  crossPlatformOverview: {
    summaryTable: PlatformSummaryRow[];
    highlightInsight: string;
  };

  // 4. Platform-by-Platform Breakdown
  facebook: {
    followers: number;
    netGrowth: number;
    reachOrganic: number;
    reachPaid: number;
    engagementRate: number;
    postFormats: FacebookFormatMetric[];
    videoMetrics: {
      views: number;
      avgWatchTimeSec: number;
      retention3SecPercent: number;
      retention1MinPercent: number;
      commentary: string;
    };
    topPosts: FacebookTopPost[];
    demographics: {
      topLocations: string[];
      topAgeGender: string;
      summary: string;
    };
    growthPlaybook?: PlatformGrowthPlaybook;
  };

  instagram: {
    followers: number;
    netGrowth: number;
    followUnfollowRatio: string;
    reach: number;
    impressions: number;
    profileVisits: number;
    websiteTaps: number;
    formatSplit: InstagramFormatSplit[];
    storyCompletionRate: number;
    nonFollowerDiscoveryRate: number;
    topPosts: InstagramTopPost[];
    growthPlaybook?: PlatformGrowthPlaybook;
  };

  youtube: {
    subscribers: number;
    netGrowth: number;
    subsGainedPerVideoAvg: number;
    views: number;
    watchTimeHours: number;
    avgViewDuration: string;
    avgPercentViewed: number;
    ctr: number;
    impressionsSuggestedBrowse: number;
    trafficSources: YouTubeTrafficSource[];
    topVideos: YouTubeTopVideo[];
    retentionDropOffInsight: string;
    growthPlaybook?: PlatformGrowthPlaybook;
  };

  linkedin: {
    followers: number;
    netGrowth: number;
    pageVisitors: number;
    impressions: number;
    engagementRate: number;
    ctr: number;
    contentTypes: LinkedInContentType[];
    seniorityDemographics: { title: string; percentage: number }[];
    topPosts: LinkedInTopPost[];
    growthPlaybook?: PlatformGrowthPlaybook;
  };

  tiktok?: TikTokReport;

  // 5. Content Performance Deep-Dive
  contentPerformance: {
    topPostsAllPlatforms: CrossPlatformTopPost[];
    contentPillars: ContentPillar[];
    bestPostingSchedule: {
      bestDays: string[];
      bestTimeWindow: string;
      insight: string;
    };
  };

  // 6. Audience Insights
  audienceInsights: {
    growthQuality: string;
    organicVsPaidRatio: string;
    demographicShifts: string;
  };

  // 7. Competitive / Benchmark Context
  competitiveBenchmark: {
    competitors: CompetitorBenchmark[];
    industryBenchmarkAvg: {
      engagementRate: string;
      reachGrowth: string;
      summary: string;
    };
  };

  // 8. Recommendations & Next Month's Plan
  recommendations: {
    actionableItems: ActionRecommendation[];
    contentCalendarDirection: string;
    testingPriorities: string[];
  };

  // Live Scraped Industry Intelligence & Trend Radar
  industryIntel?: IndustryWebIntel;

  // Uploaded raw screengrabs
  uploadedScreenshots: UploadedScreenshot[];
}
