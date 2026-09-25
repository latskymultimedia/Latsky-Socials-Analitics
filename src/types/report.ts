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
  };

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

  // Uploaded raw screengrabs
  uploadedScreenshots: UploadedScreenshot[];
}
