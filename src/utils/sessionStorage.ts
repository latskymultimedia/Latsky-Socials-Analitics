import { SocialReportData } from '../types/report';

const CURRENT_CLIENT_ID_KEY = 'pulse_social_report_active_client';
const CLIENTS_STORAGE_PREFIX = 'pulse_social_client_';
const CLIENTS_INDEX_KEY = 'pulse_social_clients_index';
const LEGACY_STORAGE_KEY = 'pulse_social_report_current';

/**
 * Interface for lightweight client index item
 */
export interface ClientIndexEntry {
  id: string;
  clientName: string;
  clientSubtitle?: string;
  reportPeriod?: string;
  lastModified: string;
}

/**
 * Returns list of remembered clients
 */
export function getSavedClientsList(): ClientIndexEntry[] {
  try {
    const raw = localStorage.getItem(CLIENTS_INDEX_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Error reading clients index:', e);
  }
  return [];
}

/**
 * Saves current report into localStorage both under its client-specific key and active pointer
 */
export function saveCurrentReportToStorage(report: SocialReportData) {
  try {
    if (!report || !report.clientName) return;
    const clientId = report.id || report.clientName.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
    const storageKey = `${CLIENTS_STORAGE_PREFIX}${clientId}`;

    // Store report
    localStorage.setItem(storageKey, JSON.stringify(report));
    localStorage.setItem(CURRENT_CLIENT_ID_KEY, clientId);
    // Also keep legacy key updated for backwards compatibility
    localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(report));

    // Update clients index
    const index = getSavedClientsList().filter((c) => c.id !== clientId);
    index.unshift({
      id: clientId,
      clientName: report.clientName,
      clientSubtitle: report.clientSubtitle || '',
      reportPeriod: report.reportPeriod || '',
      lastModified: report.lastModified || new Date().toISOString()
    });
    localStorage.setItem(CLIENTS_INDEX_KEY, JSON.stringify(index.slice(0, 50)));
  } catch (e) {
    console.warn('Could not save to localStorage (quota or disabled):', e);
  }
}

/**
 * Loads specific client report from localStorage by client id
 */
export function loadClientReportFromStorage(clientId: string): SocialReportData | null {
  try {
    const key = `${CLIENTS_STORAGE_PREFIX}${clientId}`;
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      localStorage.setItem(CURRENT_CLIENT_ID_KEY, clientId);
      return parsed;
    }
  } catch (e) {
    console.warn('Error loading client report:', e);
  }
  return null;
}

/**
 * Loads active client report from localStorage
 */
export function loadCurrentReportFromStorage(): SocialReportData | null {
  try {
    const activeClientId = localStorage.getItem(CURRENT_CLIENT_ID_KEY);
    if (activeClientId) {
      const clientReport = loadClientReportFromStorage(activeClientId);
      if (clientReport) return clientReport;
    }
    // Fallback to legacy key
    const raw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Could not load from localStorage:', e);
  }
  return null;
}

/**
 * Deletes a remembered client's data
 */
export function deleteClientFromStorage(clientId: string) {
  try {
    localStorage.removeItem(`${CLIENTS_STORAGE_PREFIX}${clientId}`);
    const index = getSavedClientsList().filter((c) => c.id !== clientId);
    localStorage.setItem(CLIENTS_INDEX_KEY, JSON.stringify(index));
  } catch (e) {
    console.warn('Failed to delete client from storage:', e);
  }
}

/**
 * Creates a pristine new client report with all 5 platforms ready
 */
export function createNewClientReport(
  clientName: string,
  clientSubtitle = 'Social Growth & Digital Performance',
  reportPeriod = 'Current Reporting Period',
  mode: 'clean' | 'sample' = 'clean'
): SocialReportData {
  const safeName = clientName.trim() || 'New Client';
  const clientId = `client_${Date.now()}_${safeName.toLowerCase().replace(/[^a-z0-9_-]/g, '_')}`;

  if (mode === 'clean') {
    const cleanReport: SocialReportData = {
      id: clientId,
      clientName: safeName,
      clientSubtitle: clientSubtitle.trim(),
      clientLogoUrl: '',
      agencyName: 'Latsky Socials Intelligence',
      agencyLogoUrl: '',
      reportPeriod: reportPeriod.trim(),
      comparisonPeriod: 'vs. Previous Month & Prior Year',
      preparedBy: 'Latsky Socials Lead Strategist',
      lastModified: new Date().toISOString(),
      executiveSummary: {
        headlineTakeaways: [
          `New client workspace initialized for ${safeName}.`,
          'Upload this period\'s platform dashboard screengrabs, PDF analytics, or CSV exports to populate verified monthly numbers.',
          'AI will transcribe exact subscribers, compute true cross-platform reach, and draft executive takeaways.'
        ],
        overallReach: 0,
        overallReachPrevDelta: 0,
        overallReachYoYDelta: 0,
        overallEngagementRate: 0,
        overallEngagementPrevDelta: 0,
        keyWins: [
          `Clean workspace established for ${safeName}. Ready for initial analytics ingestion.`
        ],
        watchItem: 'Upload this month\'s dashboard screengrabs or CSV exports to establish baseline monthly tracking.'
      },
      goalsAndContext: {
        strategyAim: `Expand digital market presence and grow engaged audience across active social channels for ${safeName}.`,
        campaignsAndBoosts: 'Baseline organic distribution focus paired with targeted creator partnerships.',
        externalFactors: 'Initial monthly benchmarking and cross-platform growth setup.'
      },
      crossPlatformOverview: {
        highlightInsight: `Awaiting source dashboard uploads to synthesize cross-platform performance dynamics for ${safeName}.`,
        summaryTable: [
          {
            platform: 'youtube',
            platformLabel: 'YouTube',
            followers: 0,
            followersDelta: 0,
            reach: 0,
            reachDelta: 0,
            engagementRate: 0,
            topContentType: 'Awaiting Upload',
            totalPosts: 0
          },
          {
            platform: 'instagram',
            platformLabel: 'Instagram',
            followers: 0,
            followersDelta: 0,
            reach: 0,
            reachDelta: 0,
            engagementRate: 0,
            topContentType: 'Awaiting Upload',
            totalPosts: 0
          },
          {
            platform: 'tiktok',
            platformLabel: 'TikTok',
            followers: 0,
            followersDelta: 0,
            reach: 0,
            reachDelta: 0,
            engagementRate: 0,
            topContentType: 'Awaiting Upload',
            totalPosts: 0
          },
          {
            platform: 'linkedin',
            platformLabel: 'LinkedIn',
            followers: 0,
            followersDelta: 0,
            reach: 0,
            reachDelta: 0,
            engagementRate: 0,
            topContentType: 'Awaiting Upload',
            totalPosts: 0
          },
          {
            platform: 'facebook',
            platformLabel: 'Facebook',
            followers: 0,
            followersDelta: 0,
            reach: 0,
            reachDelta: 0,
            engagementRate: 0,
            topContentType: 'Awaiting Upload',
            totalPosts: 0
          }
        ]
      },
      facebook: {
        followers: 0,
        netGrowth: 0,
        reachOrganic: 0,
        reachPaid: 0,
        engagementRate: 0,
        postFormats: [
          { format: 'Native Video / Reels', count: 0, avgReach: 0, avgEngagement: 0 },
          { format: 'Photo Behind-the-Scenes', count: 0, avgReach: 0, avgEngagement: 0 },
          { format: 'Links / Articles', count: 0, avgReach: 0, avgEngagement: 0 }
        ],
        videoMetrics: {
          views: 0,
          avgWatchTimeSec: 0,
          retention3SecPercent: 0,
          retention1MinPercent: 0,
          commentary: 'Awaiting dashboard screengrab uploads to analyze video retention curve.'
        },
        topPosts: [],
        demographics: {
          topLocations: [],
          topAgeGender: 'N/A',
          summary: 'Awaiting uploads'
        }
      },
      instagram: {
        followers: 0,
        netGrowth: 0,
        followUnfollowRatio: 'N/A',
        reach: 0,
        impressions: 0,
        profileVisits: 0,
        websiteTaps: 0,
        formatSplit: [
          { format: 'reels', formatLabel: 'Reels', count: 0, reach: 0, shares: 0, avgWatchOrSave: '0s' },
          { format: 'carousels', formatLabel: 'Carousels', count: 0, reach: 0, shares: 0, avgWatchOrSave: '0s' },
          { format: 'feed', formatLabel: 'Single Images', count: 0, reach: 0, shares: 0, avgWatchOrSave: '0' },
          { format: 'stories', formatLabel: 'Stories', count: 0, reach: 0, shares: 0, avgWatchOrSave: '0%' }
        ],
        storyCompletionRate: 0,
        nonFollowerDiscoveryRate: 0,
        topPosts: []
      },
      youtube: {
        subscribers: 0,
        netGrowth: 0,
        subsGainedPerVideoAvg: 0,
        views: 0,
        watchTimeHours: 0,
        avgViewDuration: '0s',
        avgPercentViewed: 0,
        ctr: 0,
        impressionsSuggestedBrowse: 0,
        trafficSources: [],
        topVideos: [],
        retentionDropOffInsight: 'Awaiting YouTube Studio analytics upload.'
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
        topPosts: []
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
          retentionInsight: 'Awaiting TikTok analytics upload.'
        },
        topPosts: [],
        demographics: {
          topLocations: [],
          topAgeGender: 'N/A',
          summary: 'Awaiting uploads'
        }
      },
      contentPerformance: {
        topPostsAllPlatforms: [],
        contentPillars: [
          { pillarName: 'Core Brand Pillar 1', shareOfVoicePercent: 40, performanceIndex: 'High', avgEngagement: 0, keyTakeaway: 'Awaiting uploads' },
          { pillarName: 'Core Brand Pillar 2', shareOfVoicePercent: 35, performanceIndex: 'Medium', avgEngagement: 0, keyTakeaway: 'Awaiting uploads' },
          { pillarName: 'Core Brand Pillar 3', shareOfVoicePercent: 25, performanceIndex: 'Low', avgEngagement: 0, keyTakeaway: 'Awaiting uploads' }
        ],
        bestPostingSchedule: {
          bestDays: ['Tuesday', 'Thursday'],
          bestTimeWindow: '18:00 – 20:30 GMT',
          insight: 'Standard high-engagement window.'
        }
      },
      audienceInsights: {
        growthQuality: 'Awaiting uploads to analyze audience acquisition sources and community alignment.',
        organicVsPaidRatio: '100% Organic Baseline',
        demographicShifts: 'Awaiting data.'
      },
      competitiveBenchmark: {
        industryBenchmarkAvg: {
          engagementRate: '2.5% Baseline',
          reachGrowth: '+8% Baseline',
          summary: 'Benchmark standards'
        },
        competitors: []
      },
      recommendations: {
        actionableItems: [
          {
            id: 'rec-1',
            priority: 'High',
            platform: 'General',
            recommendation: `Upload initial dashboard screenshots to generate tailor-made recommendations for ${safeName}.`,
            expectedOutcome: 'Establish baseline growth roadmap.'
          }
        ],
        contentCalendarDirection: `Awaiting upload data to generate tailored calendar direction for ${safeName}.`,
        testingPriorities: [
          'Establish initial content pillars',
          'Test short-form video vs photo formats',
          'Benchmark initial audience retention'
        ]
      },
      uploadedScreenshots: []
    };

    saveCurrentReportToStorage(cleanReport);
    return cleanReport;
  }

  // Sample template mode (prefilled with sample metrics)
  const report: SocialReportData = {
    id: clientId,
    clientName: safeName,
    clientSubtitle: `SAMPLE DATA · ${clientSubtitle.trim()}`,
    clientLogoUrl: '',
    agencyName: 'Latsky Socials Intelligence',
    agencyLogoUrl: '',
    reportPeriod: reportPeriod.trim(),
    comparisonPeriod: 'vs. Previous Month & Prior Year',
    preparedBy: 'Latsky Socials Lead Strategist',
    lastModified: new Date().toISOString(),
    executiveSummary: {
      headlineTakeaways: [
        'Initial baseline audit and performance tracking established across all primary channels.',
        'Short-form vertical video (Reels, TikTok, Shorts) prioritized as the primary discovery engine.',
        'High-value content pillars and conversion touchpoints identified for upcoming sprint.'
      ],
      overallReach: 155000, // = sum of the five platform rows below (48,000 + 42,000 + 16,500 + 12,500 + 36,000)
      overallReachPrevDelta: 15.2,
      overallReachYoYDelta: 32.4,
      overallEngagementRate: 5.4, // reach-weighted average of the five platform rows below
      overallEngagementPrevDelta: 0.6,
      keyWins: [
        'Channel baseline analytics and cross-platform tracking successfully consolidated.',
        'Initial content calendar roadmap drafted to target core vertical audiences.'
      ],
      watchItem: 'Maintain consistent weekly publishing cadence across all 5 channels to establish algorithmic velocity.'
    },
    goalsAndContext: {
      strategyAim: `Expand digital market presence, grow engaged audience across Instagram, YouTube, LinkedIn, Facebook, and TikTok, and generate inbound project inquiries.`,
      campaignsAndBoosts: 'Baseline organic distribution focus paired with targeted creator partnerships.',
      externalFactors: 'Initial quarterly benchmarking and cross-platform growth setup.'
    },
    crossPlatformOverview: {
      highlightInsight: 'Multi-platform presence gives the client balanced coverage across visual discovery, long-form education, and B2B partnerships.',
      summaryTable: [
        {
          platform: 'youtube',
          platformLabel: 'YouTube',
          followers: 12500,
          followersDelta: 650,
          reach: 48000,
          reachDelta: 14.5,
          engagementRate: 5.6,
          topContentType: 'Narrative Case Studies & Tutorials',
          totalPosts: 4
        },
        {
          platform: 'instagram',
          platformLabel: 'Instagram',
          followers: 18200,
          followersDelta: 1120,
          reach: 42000,
          reachDelta: 18.2,
          engagementRate: 5.2,
          topContentType: 'Cinematic Reels & Carousel Breakdowns',
          totalPosts: 14
        },
        {
          platform: 'linkedin',
          platformLabel: 'LinkedIn',
          followers: 6400,
          followersDelta: 380,
          reach: 16500,
          reachDelta: 12.0,
          engagementRate: 4.1,
          topContentType: 'Strategic PDF Slide Decks',
          totalPosts: 8
        },
        {
          platform: 'facebook',
          platformLabel: 'Facebook',
          followers: 8900,
          followersDelta: 110,
          reach: 12500,
          reachDelta: 4.2,
          engagementRate: 2.6,
          topContentType: 'Native Video Teasers & Community Posts',
          totalPosts: 6
        },
        {
          platform: 'tiktok',
          platformLabel: 'TikTok',
          followers: 9800,
          followersDelta: 1450,
          reach: 36000,
          reachDelta: 24.8,
          engagementRate: 6.8,
          topContentType: 'Tactile Sensory Clips & Sound Hooks',
          totalPosts: 10
        }
      ]
    },
    facebook: {
      followers: 8900,
      netGrowth: 110,
      reachOrganic: 10200,
      reachPaid: 2300,
      engagementRate: 2.6,
      postFormats: [
        { format: 'Native Video / Reels', count: 3, avgReach: 3200, avgEngagement: 3.2 },
        { format: 'Photo Behind-the-Scenes', count: 2, avgReach: 1400, avgEngagement: 2.2 },
        { format: 'Links / Articles', count: 1, avgReach: 850, avgEngagement: 1.1 }
      ],
      videoMetrics: {
        views: 8400,
        avgWatchTimeSec: 22,
        retention3SecPercent: 52.4,
        retention1MinPercent: 21.0,
        commentary: 'Native video formats outperform static links by 3.8x in reach.'
      },
      topPosts: [
        {
          id: 'fb-post-1',
          title: 'Behind the Scenes: Production Spotlight',
          date: 'Day 12',
          reach: 4200,
          engagementRate: 3.4,
          shares: 28,
          whyItWorked: 'Authentic craft documentation generated strong local shares.'
        }
      ],
      demographics: {
        topLocations: ['United Kingdom', 'United States', 'South Africa'],
        topAgeGender: '52% Female / 48% Male · Peak 25–44',
        summary: 'Solid core of loyal returning community members.'
      }
    },
    instagram: {
      followers: 18200,
      netGrowth: 1120,
      followUnfollowRatio: '3.8:1',
      reach: 42000,
      impressions: 68000,
      profileVisits: 3400,
      websiteTaps: 410,
      formatSplit: [
        { format: 'reels', formatLabel: 'Reels', count: 8, reach: 28000, shares: 940, avgWatchOrSave: '18s avg watch / 620 saves' },
        { format: 'carousels', formatLabel: 'Carousels', count: 4, reach: 11000, shares: 320, avgWatchOrSave: '4.2s per slide' },
        { format: 'feed', formatLabel: 'Single Images', count: 2, reach: 3000, shares: 80, avgWatchOrSave: 'Likes & comments' },
        { format: 'stories', formatLabel: 'Stories', count: 24, reach: 2400, shares: 45, avgWatchOrSave: '78% completion' }
      ],
      storyCompletionRate: 78.4,
      nonFollowerDiscoveryRate: 58.6,
      topPosts: [
        {
          id: 'ig-post-1',
          title: 'Craft & Atmosphere Spotlight Reel',
          format: 'Reel',
          reach: 18400,
          engagementRate: 6.8,
          saves: 840,
          shares: 410,
          whyItWorked: 'Strong acoustic hook and visual rhythm in first 2 seconds.'
        }
      ]
    },
    youtube: {
      subscribers: 12500,
      netGrowth: 650,
      subsGainedPerVideoAvg: 162,
      views: 48000,
      watchTimeHours: 1840,
      avgViewDuration: '4m 12s',
      avgPercentViewed: 48.6,
      ctr: 7.2,
      impressionsSuggestedBrowse: 184000,
      trafficSources: [
        { source: 'Suggested Videos', percentage: 44.2 },
        { source: 'YouTube Search', percentage: 28.6 },
        { source: 'Browse features', percentage: 21.4 },
        { source: 'Other', percentage: 5.8 }
      ],
      topVideos: [
        {
          id: 'yt-vid-1',
          title: 'Comprehensive Masterclass: Behind the Craft',
          views: 22400,
          watchHours: 920,
          ctr: 8.4,
          retentionInsight: '56% retention through minute 5, indicating high audience investment.'
        }
      ],
      retentionDropOffInsight: 'Viewer retention drops when intro titles run longer than 15 seconds. Jump directly into the hook.'
    },
    linkedin: {
      followers: 6400,
      netGrowth: 380,
      pageVisitors: 1920,
      impressions: 24500,
      engagementRate: 4.1,
      ctr: 3.4,
      contentTypes: [
        { type: 'Document / PDF Decks', engagementRate: 5.4, reach: 9800, note: 'Highest save and download rate' },
        { type: 'Native Video Teasers', engagementRate: 4.2, reach: 5200, note: 'Strong comment velocity' },
        { type: 'Text & Visual Lessons', engagementRate: 3.1, reach: 1500, note: 'Steady professional engagement' }
      ],
      seniorityDemographics: [
        { title: 'Founders & Directors', percentage: 38 },
        { title: 'Senior Managers & Leads', percentage: 42 },
        { title: 'Specialists & Producers', percentage: 20 }
      ],
      topPosts: [
        {
          id: 'li-post-1',
          title: 'Project Audit: Key Lessons from Our Commercial Commission',
          reach: 8400,
          engagementRate: 5.8,
          whyItWorked: 'Actionable financial and creative transparency appealed directly to decision makers.'
        }
      ]
    },
    tiktok: {
      followers: 9800,
      netGrowth: 1450,
      videoViews: 36000,
      profileViews: 4100,
      likes: 6200,
      shares: 1100,
      comments: 420,
      engagementRate: 6.8,
      postFormats: [
        { format: 'Sensory Clips & Hooks (<15s)', count: 5, avgViews: 12400, avgEngagement: 8.4 },
        { format: 'Behind the Scenes Breakdown (60s)', count: 3, avgViews: 6800, avgEngagement: 6.2 },
        { format: 'Sound Design & ASMR', count: 2, avgViews: 5200, avgEngagement: 5.8 }
      ],
      videoMetrics: {
        avgWatchTimeSec: 16.8,
        completionRatePercent: 44.2,
        fypTrafficPercent: 82.5,
        retentionInsight: 'Acoustic pattern interrupts in the first 1.5 seconds drove repeat loops on FYP.'
      },
      topPosts: [
        {
          id: 'tt-post-1',
          title: 'Sensory Craft & Sound Design Hook',
          views: 18400,
          likes: 3200,
          shares: 740,
          comments: 210,
          engagementRate: 8.8,
          whyItWorked: 'Instant acoustic hook paired with seamless looping visuals.'
        }
      ],
      demographics: {
        topLocations: ['United States', 'United Kingdom', 'Canada'],
        topAgeGender: '50% Female / 50% Male · Peak 18–34',
        summary: 'Audience skews young, craft-obsessed, and creator-oriented.'
      }
    },
    contentPerformance: {
      topPostsAllPlatforms: [
        {
          rank: 1,
          title: 'Craft & Atmosphere Spotlight Reel',
          platform: 'instagram',
          reach: 18400,
          engagementRate: 6.8,
          viralityScore: 88,
          whyItWorked: 'High save utility and rapid first-hour share velocity.'
        },
        {
          rank: 2,
          title: 'Behind the Craft: Full Masterclass',
          platform: 'youtube',
          reach: 22400,
          engagementRate: 5.6,
          viralityScore: 85,
          whyItWorked: 'Exceptional retention and suggested-algorithm pickup.'
        },
        {
          rank: 3,
          title: 'Sensory Sound Design Hook',
          platform: 'tiktok',
          reach: 18400,
          engagementRate: 8.8,
          viralityScore: 82,
          whyItWorked: 'Instant acoustic novelty that prompted repeat loops.'
        }
      ],
      contentPillars: [
        {
          pillarName: 'Educational Craft & Technical Deconstructions',
          shareOfVoicePercent: 40,
          performanceIndex: 'High',
          avgEngagement: 6.2,
          keyTakeaway: 'The primary reach engine across Instagram, YouTube, and TikTok.'
        },
        {
          pillarName: 'Behind-the-Scenes & Real-time Studio Life',
          shareOfVoicePercent: 35,
          performanceIndex: 'High',
          avgEngagement: 4.8,
          keyTakeaway: 'Builds deep brand warmth and human connection with repeat viewers.'
        },
        {
          pillarName: 'Client Case Studies & Commercial Outcomes',
          shareOfVoicePercent: 25,
          performanceIndex: 'Medium',
          avgEngagement: 3.9,
          keyTakeaway: 'Drives high-ticket commercial inquiries on LinkedIn.'
        }
      ],
      bestPostingSchedule: {
        bestDays: ['Tuesday', 'Thursday', 'Sunday (YouTube)'],
        bestTimeWindow: '18:00 – 20:30 GMT (and 12:00 – 13:30 for LinkedIn)',
        insight: 'Evening posting captures focused mobile leisure attention.'
      }
    },
    audienceInsights: {
      growthQuality: '89% organic audience acquisition with high community alignment.',
      organicVsPaidRatio: '90% Organic / 10% Targeted Boosts',
      demographicShifts: 'Growth is expanding into target metropolitan creative and business hubs.'
    },
    competitiveBenchmark: {
      industryBenchmarkAvg: {
        engagementRate: '2.5% Industry Baseline',
        reachGrowth: '+8.0% Monthly Baseline',
        summary: 'Client is outperforming category benchmarks across engagement rate and video retention.'
      },
      competitors: [
        {
          competitor: 'Peer Studio Vertical',
          followerCount: '24.5K',
          monthlyGrowthRate: '+3.2%',
          avgEngagementRate: '3.8%',
          qualitativeNote: 'Relies heavily on static image posts with lower save velocity.'
        },
        {
          competitor: 'Apex Creative Lab',
          followerCount: '19.2K',
          monthlyGrowthRate: '+4.5%',
          avgEngagementRate: '4.2%',
          qualitativeNote: 'Active on YouTube Shorts with moderate viewer retention.'
        }
      ]
    },
    recommendations: {
      actionableItems: [
        {
          id: 'rec-1',
          priority: 'High',
          platform: 'Instagram',
          recommendation: 'Scale the winning 20-30s Reels format with audio hooks to 3x per week.',
          expectedOutcome: 'Targeting +25% increase in saves and sustained non-follower reach over 60%.'
        },
        {
          id: 'rec-2',
          priority: 'High',
          platform: 'YouTube',
          recommendation: 'Tighten video intros to jump straight into the hook within the first 10 seconds.',
          expectedOutcome: 'Target 55%+ retention through minute 3 to trigger browse features.'
        },
        {
          id: 'rec-3',
          priority: 'Medium',
          platform: 'TikTok',
          recommendation: 'Incorporate spoken keywords in the first 5 seconds to maximize TikTok SEO discoverability.',
          expectedOutcome: 'Increase search-driven traffic from FYP by 30%.'
        }
      ],
      contentCalendarDirection: 'Focus upcoming sprint around 3 core educational series backed by behind-the-scenes Stories.',
      testingPriorities: [
        'Test native vertical video across Reels, Shorts, and TikTok.',
        'A/B test thumbnail hooks to push CTR above 8%.',
        'Test 8-slide PDF carousels on LinkedIn with links in the first comment.'
      ]
    },
    uploadedScreenshots: []
  };

  saveCurrentReportToStorage(report);
  return report;
}

/**
 * Clears all uploaded screenshots / sources from the active report
 */
export function clearAllArchivedScreenshots(report: SocialReportData): SocialReportData {
  const updated: SocialReportData = {
    ...report,
    uploadedScreenshots: [],
    lastModified: new Date().toISOString(),
  };
  saveCurrentReportToStorage(updated);
  return updated;
}

export function saveSessionToLaptop(report: SocialReportData): boolean {
  try {
    const sanitizedClient = (report.clientName || 'Client').replace(/[^a-z0-9_-]/gi, '_');
    const sanitizedPeriod = (report.reportPeriod || 'Report').replace(/[^a-z0-9_-]/gi, '_');
    const filename = `${sanitizedClient}_Social_Report_${sanitizedPeriod}.json`;

    const jsonStr = JSON.stringify(report, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    setTimeout(() => {
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    }, 200);
    return true;
  } catch (err) {
    console.error('Failed to trigger file download:', err);
    return false;
  }
}

export async function parseSessionFile(file: File): Promise<SocialReportData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        if (!parsed.clientName && !parsed.executiveSummary) {
          throw new Error('Invalid report structure: missing client data');
        }
        resolve(parsed as SocialReportData);
      } catch (err: any) {
        reject(new Error('Failed to parse session file: ' + err.message));
      }
    };
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsText(file);
  });
}

export function generateExecutiveMarkdown(report: SocialReportData): string {
  const summary = report.executiveSummary || {
    headlineTakeaways: [],
    overallReach: 0,
    overallReachPrevDelta: 0,
    overallReachYoYDelta: 0,
    overallEngagementRate: 0,
    overallEngagementPrevDelta: 0,
    keyWins: [],
    watchItem: '',
  };

  const rows = report.crossPlatformOverview?.summaryTable || [];
  const recs = report.recommendations?.actionableItems || [];
  const tests = report.recommendations?.testingPriorities || [];
  const topPosts = report.contentPerformance?.topPostsAllPlatforms || [];
  const pillars = report.contentPerformance?.contentPillars || [];
  const audience = report.audienceInsights;
  const benchmark = report.competitiveBenchmark;

  return `# Monthly Social Performance Report: ${report.clientName}
**Subtitle:** ${report.clientSubtitle || 'Executive Monthly Performance'}
**Period:** ${report.reportPeriod} (${report.comparisonPeriod})
**Agency:** ${report.agencyName || 'Latsky Socials'}
**Prepared by:** ${report.preparedBy || 'Social Strategist'}
**Generated:** ${new Date().toLocaleDateString()}

---

## 01. Executive Summary
${summary.headlineTakeaways?.map((t) => `* ${t}`).join('\n') || 'No takeaways provided.'}

**Key Metrics:**
* Cross-Platform Reach: ${summary.overallReach?.toLocaleString() || 0} (${summary.overallReachPrevDelta > 0 ? '+' : ''}${summary.overallReachPrevDelta}% MoM / ${summary.overallReachYoYDelta > 0 ? '+' : ''}${summary.overallReachYoYDelta}% YoY)
* Average Engagement Rate: ${summary.overallEngagementRate || 0}% (${summary.overallEngagementPrevDelta > 0 ? '+' : ''}${summary.overallEngagementPrevDelta}% MoM)

**Key Wins:**
${summary.keyWins?.map((w) => `* ${w}`).join('\n') || 'None recorded.'}

**Watch Item:**
* ${summary.watchItem || 'None recorded.'}

---

## 02. Goals & Strategic Context
* **Strategy Aim:** ${report.goalsAndContext?.strategyAim || 'Audience expansion & community engagement'}
* **Campaigns & Boosts:** ${report.goalsAndContext?.campaignsAndBoosts || 'Organic distribution focus'}
* **External Factors & Context:** ${report.goalsAndContext?.externalFactors || 'Standard seasonal baseline'}

---

## 03. Cross-Platform Performance Overview
${report.crossPlatformOverview?.highlightInsight ? `_${report.crossPlatformOverview.highlightInsight}_\n` : ''}
| Platform | Followers (Δ) | Reach | Engagement Rate | Top Content Type | Total Posts |
|---|---|---|---|---|---|
${rows.map((row) => `| ${row.platformLabel} | ${row.followers?.toLocaleString()} (${row.followersDelta > 0 ? '+' : ''}${row.followersDelta?.toLocaleString()}) | ${row.reach?.toLocaleString()} | ${row.engagementRate}% | ${row.topContentType} | ${row.totalPosts || '-'} |`).join('\n')}

---

## 04. Platform-by-Platform Deep Dive

### Instagram
* **Followers & Growth:** ${report.instagram?.followers?.toLocaleString()} (+${report.instagram?.netGrowth?.toLocaleString()})
* **Monthly Reach & Impressions:** ${report.instagram?.reach?.toLocaleString()} reach (${report.instagram?.impressions?.toLocaleString()} impressions)
* **Non-Follower Discovery Rate:** ${report.instagram?.nonFollowerDiscoveryRate}% | **Story Completion:** ${report.instagram?.storyCompletionRate}%
* **Website Clicks:** ${report.instagram?.websiteTaps?.toLocaleString()} (from ${report.instagram?.profileVisits?.toLocaleString()} profile visits)
${report.instagram?.formatSplit ? `
**Format Split:**
${report.instagram.formatSplit.map((f) => `* **${f.formatLabel}:** ${f.count} posts · ${f.reach?.toLocaleString()} reach · ${f.avgWatchOrSave}`).join('\n')}` : ''}
${report.instagram?.topPosts ? `
**Top Posts:**
${report.instagram.topPosts.map((p) => `* **${p.title}** (${p.format}): ${p.engagementRate}% ER · ${p.saves} saves · _Why:_ ${p.whyItWorked}`).join('\n')}` : ''}

### YouTube
* **Subscribers:** ${report.youtube?.subscribers?.toLocaleString()} (+${report.youtube?.netGrowth?.toLocaleString()})
* **Channel Views & Watch Hours:** ${report.youtube?.views?.toLocaleString()} views · ${report.youtube?.watchTimeHours?.toLocaleString()}h watch time
* **CTR & Retention:** ${report.youtube?.ctr}% CTR · ${report.youtube?.avgPercentViewed}% avg viewed (${report.youtube?.avgViewDuration} avg duration)
${report.youtube?.topVideos ? `
**Top Videos:**
${report.youtube.topVideos.map((v) => `* **${v.title}**: ${v.views?.toLocaleString()} views · ${v.ctr}% CTR · ${v.watchHours}h watch · _Insight:_ ${v.retentionInsight}`).join('\n')}` : ''}

### LinkedIn
* **Followers:** ${report.linkedin?.followers?.toLocaleString()} (+${report.linkedin?.netGrowth?.toLocaleString()})
* **Impressions & Visitors:** ${report.linkedin?.impressions?.toLocaleString()} impressions · ${report.linkedin?.pageVisitors?.toLocaleString()} page visitors
* **Engagement Rate:** ${report.linkedin?.engagementRate}% (CTR: ${report.linkedin?.ctr}%)
${report.linkedin?.topPosts ? `
**Top Posts:**
${report.linkedin.topPosts.map((p) => `* **${p.title}**: ${p.reach?.toLocaleString()} reach · ${p.engagementRate}% ER · _Why:_ ${p.whyItWorked}`).join('\n')}` : ''}

### Facebook
* **Followers / Likes:** ${report.facebook?.followers?.toLocaleString()} (+${report.facebook?.netGrowth?.toLocaleString()})
* **Reach:** ${(report.facebook?.reachOrganic + report.facebook?.reachPaid)?.toLocaleString()} (${report.facebook?.reachOrganic?.toLocaleString()} organic / ${report.facebook?.reachPaid?.toLocaleString()} paid)
* **Engagement Rate:** ${report.facebook?.engagementRate}%
${report.facebook?.topPosts ? `
**Top Posts:**
${report.facebook.topPosts.map((p) => `* **${p.title}**: ${p.reach?.toLocaleString()} reach · ${p.shares} shares · _Why:_ ${p.whyItWorked}`).join('\n')}` : ''}

${report.tiktok ? `### TikTok
* **Followers & Net:** ${report.tiktok.followers?.toLocaleString()} (+${report.tiktok.netGrowth?.toLocaleString()})
* **Video Views:** ${report.tiktok.videoViews?.toLocaleString()} (${report.tiktok.profileViews?.toLocaleString()} profile visits)
* **Engagement:** ${report.tiktok.engagementRate}% ER · ${report.tiktok.likes?.toLocaleString()} likes · ${report.tiktok.shares?.toLocaleString()} shares
* **Watch Retention & FYP:** ${report.tiktok.videoMetrics?.avgWatchTimeSec}s avg · ${report.tiktok.videoMetrics?.completionRatePercent}% full watch · ${report.tiktok.videoMetrics?.fypTrafficPercent}% FYP traffic
${report.tiktok.topPosts ? `
**Top TikTok Videos:**
${report.tiktok.topPosts.map((p) => `* **${p.title}**: ${p.views?.toLocaleString()} views · ${p.likes} likes · ${p.shares} shares · _Why:_ ${p.whyItWorked}`).join('\n')}` : ''}
` : ''}

---

## 05. Content Performance Deep-Dive
${topPosts.length > 0 ? `
**Cross-Platform Ranked Assets:**
${topPosts.map((p) => `* **#${p.rank} [${p.platform.toUpperCase()}] ${p.title}** - ${p.reach?.toLocaleString()} reach · ${p.engagementRate}% ER (Virality Score: ${p.viralityScore})\n  _Why:_ ${p.whyItWorked}`).join('\n')}
` : ''}
${pillars.length > 0 ? `
**Content Pillars & Share of Voice:**
${pillars.map((pl) => `* **${pl.pillarName}** (${pl.shareOfVoicePercent}% SOV · ${pl.performanceIndex} Index · ${pl.avgEngagement}% ER): ${pl.keyTakeaway}`).join('\n')}
` : ''}
${report.contentPerformance?.bestPostingSchedule ? `
**Best Posting Schedule:**
* Days: ${report.contentPerformance.bestPostingSchedule.bestDays?.join(', ')}
* Time Window: ${report.contentPerformance.bestPostingSchedule.bestTimeWindow}
* Insight: ${report.contentPerformance.bestPostingSchedule.insight}
` : ''}

---

## 06. Audience Quality & Demographic Shifts
* **Growth Integrity & Churn:** ${audience?.organicVsPaidRatio || '85% Organic / 15% Paid'} · ${audience?.growthQuality || 'High organic engagement with active community retention.'}
* **Demographic & Geographic Shifts:** ${audience?.demographicShifts || 'Consistent with core audience.'}

---

## 07. Competitive & Sector Benchmarking
* **Sector Baseline:** ${benchmark?.industryBenchmarkAvg?.engagementRate || 'Standard'} (Reach Growth: ${benchmark?.industryBenchmarkAvg?.reachGrowth || 'Standard'})
* **Context:** ${benchmark?.industryBenchmarkAvg?.summary || 'Benchmarked against industry norms.'}
${benchmark?.competitors && benchmark.competitors.length > 0 ? `
**Tracked Competitors:**
${benchmark.competitors.map((c) => `* **${c.competitor}** (${c.followerCount} · ${c.avgEngagementRate} ER): ${c.qualitativeNote}`).join('\n')}
` : ''}

---

## 08. Actionable Recommendations & Next Month's Plan
${recs.map((rec) => `* **[${rec.priority} Priority] (${rec.platform})**: ${rec.recommendation} _(Expected outcome: ${rec.expectedOutcome})_`).join('\n')}

**Content Calendar Direction:**
${report.recommendations?.contentCalendarDirection || 'Continue scaling winning short-form and carousel pillars.'}

**Testing Priorities:**
${tests.map((tp) => `* ${tp}`).join('\n')}
`;
}

/**
 * Universal clipboard copy with robust fallback for iframes without permission
 */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  // Try modern navigator.clipboard first
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn('navigator.clipboard.writeText blocked by iframe permissions, falling back to textarea execCommand:', err);
    }
  }

  // Fallback: create temporary textarea
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    textArea.setAttribute('readonly', '');
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (fallbackErr) {
    console.error('All copy methods failed:', fallbackErr);
    return false;
  }
}

/**
 * Safe print function that handles iframe printing constraints
 */
export function triggerPrintDialog(): boolean {
  try {
    window.print();
    return true;
  } catch (err) {
    console.error('window.print error:', err);
    return false;
  }
}
