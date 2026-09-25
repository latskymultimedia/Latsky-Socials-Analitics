import { SocialReportData } from '../types/report';

export const verandertReport: SocialReportData = {
  id: 'latsky-client-sep-2026',
  clientName: 'Latsky Multimedia & Visuals',
  clientSubtitle: 'Commercial Cinema, Documentary & Social Growth Studio',
  clientLogoUrl: '',
  agencyName: 'Latsky Socials Intelligence',
  agencyLogoUrl: '',
  reportPeriod: 'September 2026',
  comparisonPeriod: 'vs. August 2026 & September 2025',
  preparedBy: 'Latsky Socials Lead Strategist',
  lastModified: new Date().toISOString(),

  // 1. Executive Summary
  executiveSummary: {
    headlineTakeaways: [
      'Total cross-platform audience reach expanded +24.8% MoM, propelled primarily by YouTube long-form documentary watch hours and viral Instagram cinematic Reels.',
      'Average video retention on YouTube rose to 54.2% (+6.8% over channel baseline), demonstrating strong audience appetite for 18–25 minute long-form deep dives.',
      'Instagram profile visits converted at 9.4% to website project inquiries (+3.2% vs previous quarter), tying social engagement directly to studio commercial bookings.',
      'Facebook link post reach declined -18%, confirming the algorithm penalizes external URLs unless framed natively with video previews.',
      'Next month\'s key directive: Double down on narrative audio Reels and launch YouTube Community Polls 48 hours prior to new doc releases.'
    ],
    overallReach: 486200,
    overallReachPrevDelta: 24.8,
    overallReachYoYDelta: 58.3,
    overallEngagementRate: 5.4,
    overallEngagementPrevDelta: 1.2,
    keyWins: [
      'Viral Behind-the-Lens Reel hit 214K plays with 18.6K saves and a 12.4% engagement rate, driving 780 net new qualified followers.',
      'YouTube documentary episode "The Art of Slow Cinema" generated 4,120 watch hours and 38 direct inbound studio inquiries via description link.'
    ],
    watchItem: 'Facebook organic page reach dropped below 3.5% for static photo carousels; all future Facebook distribution must be video-first or native community discussion.'
  },

  // 2. Goals & Context
  goalsAndContext: {
    strategyAim: 'Q3 Cinema Showcase & Commercial Client Acquisition: Establish authoritative brand positioning for commercial film commissions while growing YouTube subscriber monetization and Instagram community engagement.',
    campaignsAndBoosts: '$350 targeted ad boost on the 60s teaser trailer for "The Forgotten Craft", focusing on creative directors, CMOs, and film enthusiasts in London, New York, and Amsterdam.',
    externalFactors: 'Official selection announcement at the European Documentary Showcase on Sept 12 generated organic press citations and social tagging spikes across LinkedIn and Instagram.'
  },

  // 3. Cross-Platform Overview
  crossPlatformOverview: {
    highlightInsight: 'YouTube and Instagram drove 81% of net new community growth. LinkedIn achieved the highest inquiry-to-lead conversion rate (14.2% CTR on documentary case studies).',
    summaryTable: [
      {
        platform: 'youtube',
        platformLabel: 'YouTube',
        followers: 48600,
        followersDelta: 2450,
        reach: 198400,
        reachDelta: 31.2,
        engagementRate: 6.8,
        topContentType: 'Long-Form 4K Docs (18-24m)',
        totalPosts: 4
      },
      {
        platform: 'instagram',
        platformLabel: 'Instagram',
        followers: 32400,
        followersDelta: 1820,
        reach: 215600,
        reachDelta: 22.4,
        engagementRate: 5.6,
        topContentType: 'Cinematic Soundbite Reels',
        totalPosts: 16
      },
      {
        platform: 'linkedin',
        platformLabel: 'LinkedIn',
        followers: 14200,
        followersDelta: 680,
        reach: 48900,
        reachDelta: 18.7,
        engagementRate: 4.2,
        topContentType: 'Director Breakdown Carousels',
        totalPosts: 8
      },
      {
        platform: 'facebook',
        platformLabel: 'Facebook',
        followers: 19800,
        followersDelta: 140,
        reach: 23300,
        reachDelta: -4.5,
        engagementRate: 2.1,
        topContentType: 'Native Video Teasers',
        totalPosts: 7
      }
    ]
  },

  // 4. Platform-by-Platform Breakdown
  facebook: {
    followers: 19800,
    netGrowth: 140,
    reachOrganic: 18600,
    reachPaid: 4700,
    engagementRate: 2.1,
    postFormats: [
      { format: 'Native Video (Reels & Cutdowns)', count: 4, avgReach: 4200, avgEngagement: 3.4 },
      { format: 'Photo Behind-the-Scenes', count: 2, avgReach: 1400, avgEngagement: 1.8 },
      { format: 'Link to Website Article', count: 1, avgReach: 850, avgEngagement: 0.9 }
    ],
    videoMetrics: {
      views: 12400,
      avgWatchTimeSec: 24,
      retention3SecPercent: 58.4,
      retention1MinPercent: 19.2,
      commentary: 'Facebook viewers drop significantly after the 30-second mark. Captions and early audio hooks are essential for retention.'
    },
    topPosts: [
      {
        id: 'fb-1',
        title: 'Color Grading Breakdown: Transforming Raw Log to Kodak 5207',
        date: 'Sept 18',
        reach: 6400,
        engagementRate: 3.8,
        shares: 42,
        whyItWorked: 'Side-by-side visual transformation triggered comment debates among indie filmmakers and colorists.'
      },
      {
        id: 'fb-2',
        title: 'Festival Selection Announcement: European Documentary Showcase',
        date: 'Sept 12',
        reach: 4800,
        engagementRate: 3.2,
        shares: 31,
        whyItWorked: 'Strong social proof and community celebration; high comment volume with congratulatory messages.'
      }
    ],
    demographics: {
      topLocations: ['United Kingdom (38%)', 'United States (26%)', 'Netherlands (12%)', 'Germany (9%)'],
      topAgeGender: '62% Male / 38% Female · Peak bracket 28–44 years old',
      summary: 'Audience skews slightly older and more industry-rooted than Instagram, with high concentrations in film production hubs.'
    }
  },

  instagram: {
    followers: 32400,
    netGrowth: 1820,
    followUnfollowRatio: '4.8:1 (2,300 follows / 480 unfollows)',
    reach: 215600,
    impressions: 342000,
    profileVisits: 14800,
    websiteTaps: 1390,
    formatSplit: [
      { format: 'reels', formatLabel: 'Cinematic Reels', count: 8, reach: 174000, shares: 3820, avgWatchOrSave: '18.4s avg / 14.2K saves' },
      { format: 'carousels', formatLabel: 'Production Stills Carousels', count: 5, reach: 28400, shares: 620, avgWatchOrSave: '4.2s per slide' },
      { format: 'feed', formatLabel: 'Single Frame Photography', count: 3, reach: 13200, shares: 140, avgWatchOrSave: '1.2K likes' },
      { format: 'stories', formatLabel: 'Daily Set Stories', count: 34, reach: 6800, shares: 85, avgWatchOrSave: '78.2% completion' }
    ],
    storyCompletionRate: 78.2,
    nonFollowerDiscoveryRate: 67.4,
    topPosts: [
      {
        id: 'ig-1',
        title: 'Reel: Foley Design for Forest Winds (Sound Design Breakdown)',
        format: 'Reel (54s)',
        reach: 89400,
        engagementRate: 7.9,
        saves: 7200,
        shares: 1940,
        whyItWorked: 'High sensory audio trigger; viewers saved it for sound design reference and loop replay value.'
      },
      {
        id: 'ig-2',
        title: 'Reel: Lighting a Night Scene with One Pocket Lantern & Bounce',
        format: 'Reel (42s)',
        reach: 64200,
        engagementRate: 6.8,
        saves: 5400,
        shares: 1120,
        whyItWorked: 'Actionable micro-tutorial for indie DPs; concise 3-step overlay without rambling.'
      },
      {
        id: 'ig-3',
        title: 'Carousel: 10 Uncompressed Anamorphic Frame Grabs from "The Glade"',
        format: 'Carousel (8 slides)',
        reach: 18900,
        engagementRate: 5.1,
        saves: 1840,
        shares: 410,
        whyItWorked: 'Pure visual luxury; high aesthetic bookmarking by moodboard curators and directors.'
      }
    ]
  },

  youtube: {
    subscribers: 48600,
    netGrowth: 2450,
    subsGainedPerVideoAvg: 612,
    views: 198400,
    watchTimeHours: 14200,
    avgViewDuration: '4m 48s',
    avgPercentViewed: 54.2,
    ctr: 7.6,
    impressionsSuggestedBrowse: 1840000,
    trafficSources: [
      { source: 'Suggested Videos', percentage: 46.2 },
      { source: 'YouTube Search', percentage: 28.4 },
      { source: 'Browse Features / Home', percentage: 16.8 },
      { source: 'External / Direct Links', percentage: 8.6 }
    ],
    topVideos: [
      {
        id: 'yt-1',
        title: 'The Art of Slow Cinema: Why Stillness Grips Audiences in 2026',
        views: 84200,
        watchHours: 6480,
        ctr: 8.4,
        retentionInsight: '58% retention at 12m mark. Chapter markers on camera framing drove heavy rewatches.',
        screenshotUrl: ''
      },
      {
        id: 'yt-2',
        title: 'Documentary Masterclass: Interviewing Non-Actors to Reveal Genuine Emotion',
        views: 61400,
        watchHours: 4890,
        ctr: 7.2,
        retentionInsight: 'Opening cold-open case study kept 79% through minute 3; dropoff at 18m conclusion.',
        screenshotUrl: ''
      }
    ],
    retentionDropOffInsight: 'Viewer retention drops when studio gear lists run longer than 45 seconds. Keep gear context woven into the narrative rather than dedicated inventory segments.'
  },

  linkedin: {
    followers: 14200,
    netGrowth: 680,
    pageVisitors: 3450,
    impressions: 48900,
    engagementRate: 4.2,
    ctr: 2.8,
    contentTypes: [
      { type: 'PDF Document / Storyboard Decks', engagementRate: 6.4, reach: 21400, note: 'Highest comment depth and saves from Agency Heads' },
      { type: 'Commercial Case Study (Video + Text)', engagementRate: 4.8, reach: 16200, note: 'Directly generated 5 inbound brand RFP discussions' },
      { type: 'Founder / Director Perspective', engagementRate: 3.1, reach: 8400, note: 'Consistent engagement on production ethics and budget stewardship' },
      { type: 'External Press Link', engagementRate: 1.4, reach: 2900, note: 'Suppressed reach; always summarize in first comment' }
    ],
    seniorityDemographics: [
      { title: 'Founders & Managing Directors', percentage: 34 },
      { title: 'Chief Marketing Officers / Heads of Brand', percentage: 28 },
      { title: 'Creative Directors & Producers', percentage: 24 },
      { title: 'Senior Brand Managers', percentage: 14 }
    ],
    topPosts: [
      {
        id: 'li-1',
        title: 'Deck: How a £40k Branded Doc Outperformed a £250k TVC for a Heritage Brand',
        reach: 16800,
        engagementRate: 7.2,
        whyItWorked: 'Hard commercial numbers comparing ROI and completion rates; reshared by 14 CMOs.'
      },
      {
        id: 'li-2',
        title: 'Case Study: Filming in Extreme Weather with Minimal Crew Footprint',
        reach: 9400,
        engagementRate: 4.6,
        whyItWorked: 'Demonstrated operational resilience and lean production efficiency.'
      }
    ]
  },

  // 5. Content Performance Deep-Dive
  contentPerformance: {
    topPostsAllPlatforms: [
      {
        rank: 1,
        title: 'Foley Sound Design Breakdown (Instagram Reel)',
        platform: 'instagram',
        reach: 89400,
        engagementRate: 7.9,
        viralityScore: 94,
        whyItWorked: 'Sensory acoustic trigger + high loop value; 7.2K bookmarks from editors.'
      },
      {
        rank: 2,
        title: 'The Art of Slow Cinema (YouTube Video Essay)',
        platform: 'youtube',
        reach: 84200,
        engagementRate: 6.8,
        viralityScore: 89,
        whyItWorked: 'High search-intent title matched with evocative thumbnail and 54% view duration.'
      },
      {
        rank: 3,
        title: 'Lighting with One Pocket Lantern (Instagram Reel)',
        platform: 'instagram',
        reach: 64200,
        engagementRate: 6.8,
        viralityScore: 84,
        whyItWorked: 'Zero-filler cinematography hack; saves exceeded comments 8 to 1.'
      },
      {
        rank: 4,
        title: 'Documentary Masterclass (YouTube)',
        platform: 'youtube',
        reach: 61400,
        engagementRate: 5.9,
        viralityScore: 81,
        whyItWorked: 'Practical psychological framework for interviewing vulnerable subjects.'
      },
      {
        rank: 5,
        title: 'How a £40k Branded Doc Outperformed a £250k TVC (LinkedIn Slide Deck)',
        platform: 'linkedin',
        reach: 16800,
        engagementRate: 7.2,
        viralityScore: 78,
        whyItWorked: 'Challenged legacy agency spend with verifiable data metrics.'
      }
    ],
    contentPillars: [
      {
        pillarName: 'Craft & Behind-The-Scenes Secrets',
        shareOfVoicePercent: 40,
        performanceIndex: 'High',
        avgEngagement: 7.1,
        keyTakeaway: 'The undisputed reach engine across Instagram and YouTube. Audiences crave granular, non-condescending technical craft.'
      },
      {
        pillarName: 'Case Studies & Business Outcomes',
        shareOfVoicePercent: 25,
        performanceIndex: 'High',
        avgEngagement: 5.4,
        keyTakeaway: 'Drives high-ticket commercial inquiries on LinkedIn. Keeps creative work anchored in commercial viability.'
      },
      {
        pillarName: 'Philosophy & Director Perspectives',
        shareOfVoicePercent: 20,
        performanceIndex: 'Medium',
        avgEngagement: 4.2,
        keyTakeaway: 'Builds brand loyalty and prestige. Essential for brand differentiation, even if raw reach is more modest.'
      },
      {
        pillarName: 'Studio News & Announcements',
        shareOfVoicePercent: 15,
        performanceIndex: 'Low',
        avgEngagement: 2.8,
        keyTakeaway: 'Best delivered as secondary story frames or tied into larger educational angles rather than standalone announcements.'
      }
    ],
    bestPostingSchedule: {
      bestDays: ['Tuesday', 'Thursday', 'Sunday (YouTube)'],
      bestTimeWindow: '18:00 – 20:30 GMT (and 12:00 – 13:30 for LinkedIn)',
      insight: 'Evening posting captures focused leisure attention for 60s+ Reels, while Sunday afternoon releases maximize YouTube watch time.'
    }
  },

  // 6. Audience Insights
  audienceInsights: {
    growthQuality: 'Exceptionally high organic purity (92.4% organic follower acquisition). Churn rate remained under 0.8%, signaling high audience alignment with studio identity.',
    organicVsPaidRatio: '84% Organic / 16% Paid (Ad spend used strictly as an initial ignition fuse for high-value long-tail pieces)',
    demographicShifts: 'Growth in North American and Northern European tier-1 metros (+18% MoM). 68% of new followers self-identify in film, creative tech, brand marketing, or photography.'
  },

  // 7. Competitive / Benchmark Context
  competitiveBenchmark: {
    industryBenchmarkAvg: {
      engagementRate: '2.4% for Creative Agencies & Production Studios',
      reachGrowth: '+8.5% Quarterly Benchmark',
      summary: 'Verandert is outperforming industry benchmarks by 2.25x on engagement and 3x on video watch retention.'
    },
    competitors: [
      {
        competitor: 'Studio Horizon Films',
        followerCount: '42K IG / 28K YT',
        monthlyGrowthRate: '+1.4%',
        avgEngagementRate: '2.1%',
        qualitativeNote: 'Relies heavily on static stills; video cadence has stalled.'
      },
      {
        competitor: 'Auteur Collective',
        followerCount: '68K IG / 95K YT',
        monthlyGrowthRate: '+2.8%',
        avgEngagementRate: '3.6%',
        qualitativeNote: 'Strong YouTube presence, but Instagram engagement has declined due to erratic posting.'
      }
    ]
  },

  // 8. Recommendations & Next Month's Plan
  recommendations: {
    actionableItems: [
      {
        id: 'rec-1',
        priority: 'High',
        platform: 'YouTube',
        recommendation: 'Package the upcoming 3-part documentary with A/B thumbnail testing on release day and publish YouTube Community Polls 48h prior.',
        expectedOutcome: 'Targeting a 9.0%+ initial CTR and 25K+ organic views within the first 72 hours.'
      },
      {
        id: 'rec-2',
        priority: 'High',
        platform: 'Instagram',
        recommendation: 'Scale the "Sensory Audio / Foley" Reel series to 2x per week, adding downloadable sample sound packs in bio.',
        expectedOutcome: 'Accelerate saves and shares to break through the 100K view threshold on explore.'
      },
      {
        id: 'rec-3',
        priority: 'Medium',
        platform: 'LinkedIn',
        recommendation: 'Transition from single-image updates to 8–10 slide PDF "Production Budget Audits" detailing how to maximize production value.',
        expectedOutcome: 'Target 10+ direct commercial agency brief downloads per carousel.'
      },
      {
        id: 'rec-4',
        priority: 'Strategic',
        platform: 'Cross-Platform',
        recommendation: 'Repurpose the European Documentary Showcase panel recording into 6 micro-lessons for multi-platform drip release.',
        expectedOutcome: 'Maximizes content mileage with zero additional filming overhead.'
      }
    ],
    contentCalendarDirection: 'Focus on "The Anatomy of a Frame" visual breakdowns every Tuesday, Technical sound craft on Thursdays, and Deep-dive documentary releases on alternating Sunday evenings.',
    testingPriorities: [
      'Test 90-second narrative audio Reels with subtle subtitles vs standard 30-second clips',
      'Test pinned YouTube comments featuring direct timestamped questions to stimulate comment section dialogue',
      'Test LinkedIn interactive carousels with native lead magnets for commercial production inquiries'
    ]
  },

  uploadedScreenshots: []
};

export const artisanRetreatReport: SocialReportData = {
  id: 'retreat-sep-2026',
  clientName: 'The Highlands B&B & Artisan Retreat',
  clientSubtitle: 'Luxury Nature Escapes & Culinary Experiences',
  clientLogoUrl: '',
  agencyName: 'Verandert Hospitality Growth',
  agencyLogoUrl: '',
  reportPeriod: 'September 2026',
  comparisonPeriod: 'vs. August 2026 (Peak Summer Transition)',
  preparedBy: 'Senior Social Strategist',
  lastModified: new Date().toISOString(),

  executiveSummary: {
    headlineTakeaways: [
      'Autumn getaway promotion generated 142 direct website booking clicks (+38% vs August), filling mid-week retreat occupancy to 88%.',
      'Instagram Reels showcasing morning sourdough baking in the outdoor woodfire oven reached 164,000 accounts with 8.4K saves.',
      'Facebook Community local events group partnerships drove 42 ticket sales for the October Harvest & Wine Weekend.',
      'Audience demographic shifted noticeably toward 30–45 London & Edinburgh weekend travelers seeking regenerative wellness retreats.'
    ],
    overallReach: 312000,
    overallReachPrevDelta: 31.4,
    overallReachYoYDelta: 74.2,
    overallEngagementRate: 6.2,
    overallEngagementPrevDelta: 1.8,
    keyWins: [
      'Direct Instagram booking taps rose from 480 to 890 this month, resulting in £18,400 in direct reservation bookings tracked via promo code.',
      'TikTok & Reels "Sound of Rain on Tin Roof at Cabin 4" video crossed 120,000 views organically.'
    ],
    watchItem: 'Inquiries via Facebook Messenger experienced a 4-hour delay on weekends; need automated booking bot or automated FAQ response.'
  },

  goalsAndContext: {
    strategyAim: 'Shoulder Season Occupancy: Maintain high occupancy through October and November by romanticizing autumn escapes, artisan workshops, and seasonal foraging.',
    campaignsAndBoosts: '$200 hyper-local Instagram ad boost targeting couples within 2 hours driving distance from Edinburgh and Glasgow.',
    externalFactors: 'Feature in "Top 10 Secluded Autumn Stays" travel newsletter generated 3,200 sudden referral visits on Sept 8.'
  },

  crossPlatformOverview: {
    highlightInsight: 'Visual atmosphere and acoustic warmth on Instagram & TikTok directly drove stay bookings, while Facebook established strong repeat guest loyalty.',
    summaryTable: [
      {
        platform: 'instagram',
        platformLabel: 'Instagram',
        followers: 24800,
        followersDelta: 2150,
        reach: 194000,
        reachDelta: 38.6,
        engagementRate: 6.9,
        topContentType: 'Aesthetic Atmosphere Reels & Carousels',
        totalPosts: 18
      },
      {
        platform: 'facebook',
        platformLabel: 'Facebook',
        followers: 12600,
        followersDelta: 340,
        reach: 68400,
        reachDelta: 16.2,
        engagementRate: 4.8,
        topContentType: 'Guest Testimonials & Package Links',
        totalPosts: 12
      },
      {
        platform: 'tiktok',
        platformLabel: 'TikTok',
        followers: 18900,
        followersDelta: 3100,
        reach: 49600,
        reachDelta: 44.1,
        engagementRate: 7.4,
        topContentType: 'Sensory Cabin ASMR',
        totalPosts: 8
      }
    ]
  },

  facebook: {
    followers: 12600,
    netGrowth: 340,
    reachOrganic: 49800,
    reachPaid: 18600,
    engagementRate: 4.8,
    postFormats: [
      { format: 'Photo Albums (Cabin Tours)', count: 6, avgReach: 4800, avgEngagement: 5.2 },
      { format: 'Event Listings & Workshops', count: 3, avgReach: 6200, avgEngagement: 4.9 },
      { format: 'Video Walkthroughs', count: 3, avgReach: 5100, avgEngagement: 4.2 }
    ],
    videoMetrics: {
      views: 18200,
      avgWatchTimeSec: 28,
      retention3SecPercent: 62.1,
      retention1MinPercent: 24.6,
      commentary: 'High viewer engagement when showcasing crackling log fires and interior cabin coziness.'
    },
    topPosts: [
      {
        id: 'fb-ret-1',
        title: 'Autumn Harvest Weekend: 3 Nights of Foraging, Wine & Fireplace Dining',
        date: 'Sept 5',
        reach: 12400,
        engagementRate: 6.2,
        shares: 68,
        whyItWorked: 'Clear call-to-action with tag-your-partner comments driving organic amplification.'
      }
    ],
    demographics: {
      topLocations: ['Scotland (54%)', 'England (36%)', 'International (10%)'],
      topAgeGender: '68% Female / 32% Male · Peak bracket 32–54 years old',
      summary: 'High propensity for multi-night bookings and bespoke dining packages.'
    }
  },

  instagram: {
    followers: 24800,
    netGrowth: 2150,
    followUnfollowRatio: '5.2:1',
    reach: 194000,
    impressions: 284000,
    profileVisits: 18200,
    websiteTaps: 890,
    formatSplit: [
      { format: 'reels', formatLabel: 'Sensory Atmosphere Reels', count: 9, reach: 142000, shares: 4120, avgWatchOrSave: '21.2s avg / 8.4K saves' },
      { format: 'carousels', formatLabel: 'Room & Breakfast Stills', count: 6, reach: 36000, shares: 920, avgWatchOrSave: '5.8s per slide' },
      { format: 'feed', formatLabel: 'Single Scenery Shots', count: 3, reach: 16000, shares: 240, avgWatchOrSave: '1.4K likes' },
      { format: 'stories', formatLabel: 'Daily Mornings & Guest Views', count: 48, reach: 9400, shares: 120, avgWatchOrSave: '84.6% completion' }
    ],
    storyCompletionRate: 84.6,
    nonFollowerDiscoveryRate: 72.1,
    topPosts: [
      {
        id: 'ig-ret-1',
        title: 'Reel: Morning Coffee on the Deck Overlooking the Loch',
        format: 'Reel (38s)',
        reach: 78400,
        engagementRate: 8.4,
        saves: 6200,
        shares: 2400,
        whyItWorked: 'Captivated travel moodboarders looking for romantic autumn getaways.'
      },
      {
        id: 'ig-ret-2',
        title: 'Carousel: The Breakfast Basket (Warm Sourdough, Local Berries & Butter)',
        format: 'Carousel (6 slides)',
        reach: 34200,
        engagementRate: 6.7,
        saves: 2900,
        shares: 580,
        whyItWorked: 'Food photography with golden morning light created immense culinary desire.'
      }
    ]
  },

  youtube: {
    subscribers: 3400,
    netGrowth: 210,
    subsGainedPerVideoAvg: 105,
    views: 18400,
    watchTimeHours: 920,
    avgViewDuration: '3m 12s',
    avgPercentViewed: 48.6,
    ctr: 6.4,
    impressionsSuggestedBrowse: 142000,
    trafficSources: [
      { source: 'Search (Scottish Highlands B&B)', percentage: 52.4 },
      { source: 'Suggested Videos', percentage: 32.1 },
      { source: 'Direct / Website', percentage: 15.5 }
    ],
    topVideos: [
      {
        id: 'yt-ret-1',
        title: 'Full Cabin 4 Tour & Wood Stove Guide | Highland Retreat',
        views: 11200,
        watchHours: 580,
        ctr: 7.1,
        retentionInsight: 'High retention from travelers planning their stay.'
      }
    ],
    retentionDropOffInsight: 'Viewers skip forward to see bedroom and bathroom interiors; put cabin overview up front.'
  },

  linkedin: {
    followers: 1800,
    netGrowth: 85,
    pageVisitors: 420,
    impressions: 4800,
    engagementRate: 3.4,
    ctr: 1.8,
    contentTypes: [
      { type: 'Corporate Executive Offsites Decks', engagementRate: 4.8, reach: 2800, note: 'Generated 2 full-lodge buyout inquiries for Q1' }
    ],
    seniorityDemographics: [
      { title: 'HR Directors & Culture Leads', percentage: 42 },
      { title: 'Founders / Executives', percentage: 38 }
    ],
    topPosts: [
      {
        id: 'li-ret-1',
        title: 'Why Creative Teams Brainstorm Better Without Wi-Fi in the Scottish Mist',
        reach: 3100,
        engagementRate: 5.1,
        whyItWorked: 'Appealed to remote-first founders looking for mindful leadership retreats.'
      }
    ]
  },

  contentPerformance: {
    topPostsAllPlatforms: [
      {
        rank: 1,
        title: 'Morning Coffee on the Deck (Instagram Reel)',
        platform: 'instagram',
        reach: 78400,
        engagementRate: 8.4,
        viralityScore: 92,
        whyItWorked: 'High aspiration travel fantasy; shared among couples.'
      },
      {
        rank: 2,
        title: 'Breakfast Basket Tour (Instagram Carousel)',
        platform: 'instagram',
        reach: 34200,
        engagementRate: 6.7,
        viralityScore: 84,
        whyItWorked: 'High culinary engagement and save rate.'
      }
    ],
    contentPillars: [
      {
        pillarName: 'Atmosphere & Escapism ASMR',
        shareOfVoicePercent: 45,
        performanceIndex: 'High',
        avgEngagement: 7.8,
        keyTakeaway: 'The primary virality and booking trigger. Calm, quiet audio consistently beats noisy voiceovers.'
      },
      {
        pillarName: 'Food & Artisan Dining',
        shareOfVoicePercent: 30,
        performanceIndex: 'High',
        avgEngagement: 6.5,
        keyTakeaway: 'Demonstrates luxury hospitality value beyond just a place to sleep.'
      },
      {
        pillarName: 'Local Trails & Foraging',
        shareOfVoicePercent: 25,
        performanceIndex: 'Medium',
        avgEngagement: 4.4,
        keyTakeaway: 'Helps guests plan their itinerary and increases length of stay.'
      }
    ],
    bestPostingSchedule: {
      bestDays: ['Wednesday', 'Sunday Evening'],
      bestTimeWindow: '20:00 – 21:30 GMT',
      insight: 'Sunday evening is when travelers experience peak wanderlust and browse weekend getaways.'
    }
  },

  audienceInsights: {
    growthQuality: 'High organic engagement with strong comment intent ("saving this for our anniversary")',
    organicVsPaidRatio: '88% Organic / 12% Local Meta Boosts',
    demographicShifts: 'Increase in 28–42 age bracket with high disposable income seeking tranquil nature retreats.'
  },

  competitiveBenchmark: {
    industryBenchmarkAvg: {
      engagementRate: '1.8% for Boutique Hospitality',
      reachGrowth: '+6% Monthly',
      summary: 'Outperforming boutique hotels in Scotland by 3.5x engagement rate.'
    },
    competitors: [
      {
        competitor: 'Lochside Cabins & Spa',
        followerCount: '31K IG',
        monthlyGrowthRate: '+0.8%',
        avgEngagementRate: '1.9%',
        qualitativeNote: 'Generic stock photography; lacks human artisan warmth.'
      }
    ]
  },

  recommendations: {
    actionableItems: [
      {
        id: 'rec-ret-1',
        priority: 'High',
        platform: 'Instagram',
        recommendation: 'Launch "Winter Solstice & Stargazing" promo series with dedicated booking links in Bio by October 10.',
        expectedOutcome: 'Fill December mid-week cabin vacancy by 40% before November 1.'
      },
      {
        id: 'rec-ret-2',
        priority: 'Medium',
        platform: 'Facebook',
        recommendation: 'Implement instant automated Messenger reply for cabin availability questions with direct booking calendar link.',
        expectedOutcome: 'Eliminate booking inquiry dropoff caused by delayed weekend replies.'
      },
      {
        id: 'rec-ret-3',
        priority: 'Strategic',
        platform: 'LinkedIn',
        recommendation: 'Target tech companies in London & Edinburgh with a downloadable 8-page PDF "Executive Nature Retreats & Brainstorming Guide".',
        expectedOutcome: 'Secure 3 full-retreat corporate buyouts for Q1 2027.'
      }
    ],
    contentCalendarDirection: 'Focus on autumn foliage, misty mornings, indoor fireplace dining, and winter stargazing package announcements.',
    testingPriorities: [
      'Test sound-only ASMR Reels (fire crackle, rain, coffee pour) vs gentle acoustic music backing',
      'Test carousel covers featuring cabin interiors vs dramatic outdoor drone landscapes'
    ]
  },

  uploadedScreenshots: []
};
