import { SocialReportData } from '../types/report';

export const executiveIntelligenceReport: SocialReportData = {
  id: 'client-executive-intelligence-2026',
  clientName: 'Executive Brand Portfolio',
  clientSubtitle: 'Multi-Channel Growth, Conversion Funnel & Regional Intelligence',
  clientLogoUrl: '',
  agencyName: 'Pulse Digital Media Agency',
  agencyLogoUrl: '',
  reportPeriod: 'Current Growth Sprint (30-Day Audit)',
  comparisonPeriod: 'vs. Prior Monthly Sprint',
  preparedBy: 'Digital Media Agency Director',
  lastModified: new Date().toISOString(),

  executiveSummary: {
    headlineTakeaways: [
      'Top-of-funnel reach surged to 216,250+ unique viewers across 262,288+ total impressions, proving hyper-efficient audience discovery with minimal algorithmic fatigue.',
      'Outbound link velocity achieved a standout 8,910+ commercial click-throughs (3.4% overall CTR), positioning social channels as direct commercial revenue engines rather than passive awareness feeds.',
      'Audience acquisition is decisively female-dominated (88.8% women) with 79.6% concentrated in peak disposable-income brackets (25–44 years old), establishing unrivaled purchasing authority.',
      'Geographic penetration established dominant urban strongholds across Accra, Lagos, and Cape Town, opening an immediate tri-city lifestyle and commercial acquisition corridor.',
      'Facebook functions as the volume-scale traffic locomotive, while Instagram acts as the high-margin follower capture and trust-building engine (+296 net qualified followers).'
    ],
    overallReach: 216250,
    overallReachPrevDelta: 34.6,
    overallReachYoYDelta: 68.2,
    overallEngagementRate: 6.8,
    overallEngagementPrevDelta: 1.2,
    keyWins: [
      'Generated 8,910+ outbound commercial clicks from cold social distribution, outperforming industry median CTR by 4.2x.',
      'Penetrated Accra, Lagos, and Cape Town simultaneously with an 88.8% female demographic authority cluster.'
    ],
    watchItem: 'Eliminate single-platform dependency: Cross-syndicate proven Facebook video winners into TikTok sound hooks and YouTube Shorts to triple organic distribution without additional production costs.'
  },

  goalsAndContext: {
    strategyAim: 'Aggressive Top-of-Funnel Expansion & Outbound Conversion: Maximize qualified traffic to digital assets while converting casual viewers into loyal community advocates across core African cosmopolitan hubs.',
    campaignsAndBoosts: 'High-velocity organic content scheduling paired with laser-targeted demographic resonance across women aged 25–44.',
    externalFactors: 'Surging e-commerce and lifestyle interest across Accra, Lagos, and Cape Town urban centers accelerating outbound link CTR.'
  },

  crossPlatformOverview: {
    highlightInsight: 'Total visual velocity clocked 262,288+ impressions with 216,250+ unique reach. Facebook delivered top-of-funnel outbound click volume (8,910+), while Instagram delivered premium brand affinity and net follower growth (+296).',
    summaryTable: [
      {
        platform: 'facebook',
        platformLabel: 'Facebook (Traffic Engine)',
        followers: 34200,
        followersDelta: 112,
        reach: 148600,
        reachDelta: 38.4,
        engagementRate: 5.9,
        topContentType: 'High-Impact Video Teasers & Link Carousels',
        totalPosts: 16
      },
      {
        platform: 'instagram',
        platformLabel: 'Instagram (Conversion Hub)',
        followers: 18450,
        followersDelta: 184,
        reach: 67650,
        reachDelta: 26.2,
        engagementRate: 8.4,
        topContentType: 'Aesthetic Story Links & High-Retention Reels',
        totalPosts: 22
      },
      {
        platform: 'tiktok',
        platformLabel: 'TikTok (Syndication Engine)',
        followers: 8600,
        followersDelta: 380,
        reach: 28400,
        reachDelta: 42.1,
        engagementRate: 9.2,
        topContentType: 'Foley Micro-Hooks & POV Drops',
        totalPosts: 8
      },
      {
        platform: 'youtube',
        platformLabel: 'YouTube (Authority Engine)',
        followers: 6200,
        followersDelta: 94,
        reach: 17638,
        reachDelta: 18.9,
        engagementRate: 6.4,
        topContentType: 'Shorts & Spotlight Breakdowns',
        totalPosts: 4
      },
      {
        platform: 'linkedin',
        platformLabel: 'LinkedIn (B2B Authority)',
        followers: 4100,
        followersDelta: 78,
        reach: 12400,
        reachDelta: 15.6,
        engagementRate: 4.8,
        topContentType: 'Executive Insights & Brand Teardowns',
        totalPosts: 6
      }
    ]
  },

  facebook: {
    followers: 34200,
    netGrowth: 112,
    reachOrganic: 132400,
    reachPaid: 16200,
    engagementRate: 5.9,
    postFormats: [
      { format: 'Native Video Posts', count: 6, avgReach: 18400, avgEngagement: 6.4 },
      { format: 'Outbound Link Carousels', count: 6, avgReach: 14200, avgEngagement: 5.8 },
      { format: 'Curated Photo Albums', count: 4, avgReach: 8600, avgEngagement: 4.2 }
    ],
    videoMetrics: {
      views: 186400,
      avgWatchTimeSec: 28,
      retention3SecPercent: 62.4,
      retention1MinPercent: 24.8,
      commentary: 'Massive top-of-funnel hook retention in the first 3 seconds drove over 6,200 direct click-throughs from native video CTA buttons.'
    },
    topPosts: [
      {
        id: 'fb-power-1',
        title: 'Signature Collection Showcase: The Modern Standard',
        date: 'Week 2 Sprint',
        reach: 48900,
        engagementRate: 7.2,
        shares: 342,
        whyItWorked: 'Direct benefit hook and frictionless link sticker generated 2,840 link clicks alone.'
      },
      {
        id: 'fb-power-2',
        title: 'Customer Spotlight & Regional Style Guide',
        date: 'Week 3 Sprint',
        reach: 36200,
        engagementRate: 6.4,
        shares: 218,
        whyItWorked: 'Resonated heavily with Lagos and Accra metropolitan audiences, sparking community share loops.'
      }
    ],
    demographics: {
      topLocations: ['Accra, Ghana (38%)', 'Lagos, Nigeria (34%)', 'Cape Town, South Africa (28%)'],
      topAgeGender: '88.8% Women / 11.2% Men · Prime 25–44 years old',
      summary: 'Powerhouse female audience seeking premium lifestyle solutions with strong outbound click intent.'
    },
    growthPlaybook: {
      subsStrategy: {
        conversionHook: 'Join 34,000+ tastemakers across Accra, Lagos & Cape Town for weekly private collection drops.',
        profileBioTweak: 'The Premier Lifestyle Standard for Africa’s Metropolitan Elite. Tap below for direct access ↘',
        leadMagnetOrSeries: 'Launch "The Urban Vanguard" weekly spotlight series with gated VIP access.',
        keyAction: 'Pin highest-converting video post with a prominent link button at top of Page.'
      },
      viewsStrategy: {
        viralHookTemplate: 'Stop scrolling if you live in Accra, Lagos, or Cape Town: Here is what everyone is talking about.',
        retentionTrigger: 'Visual pattern interrupt at 0:02 followed by rapid sequence reveals to prevent drop-off.',
        algorithmDistributionHack: 'Encourage comment tagging by asking viewers which city has the sharper style.',
        keyAction: 'A/B test cold-open video hooks within first 24 hours of publishing.'
      },
      commentsStrategy: {
        discussionPrompt: 'Accra or Lagos: Which city wore this look best? Drop your verdict below.',
        pinnedCommentPlay: 'Pin direct VIP link with explicit scarcity: "Only 150 allocations remaining this month."',
        engagementVelocityTactic: 'Reply to all comments in first 30 minutes with direct personalized link recommendations.',
        keyAction: 'Set up automated Messenger welcome sequence triggered by comment keywords.'
      },
      algorithmUpdatesNews: {
        latestUpdate: 'Facebook 2026 algorithm prioritizes native video watch-time and outbound link satisfaction score.',
        impactOnBrand: 'High retention videos receive 4x more organic feed recommendation.',
        tacticalPivot: 'Pair every high-retention video with a clean, mobile-optimized destination page.'
      },
      suggestions: [
        { id: 'fb-s1', field: 'views', label: 'Hook Optimization', tactic: 'Front-load visual payoff into 0:00–0:02.', expectedImpact: '+40% 3s retention' },
        { id: 'fb-s2', field: 'subs', label: 'Comment Automation', tactic: 'Deploy automated DM link reply on post comments.', expectedImpact: '+2,500 monthly clicks' }
      ]
    }
  },

  instagram: {
    followers: 18450,
    netGrowth: 184,
    followUnfollowRatio: '4.8:1',
    reach: 67650,
    impressions: 75888,
    profileVisits: 8940,
    websiteTaps: 2710,
    formatSplit: [
      { format: 'reels', formatLabel: 'Cinematic Reels', count: 10, reach: 46200, shares: 1420, avgWatchOrSave: '19.4s avg watch / 840 saves' },
      { format: 'stories', formatLabel: 'Interactive Stories', count: 32, reach: 12400, shares: 210, avgWatchOrSave: '84.2% completion / Link Taps' },
      { format: 'carousels', formatLabel: 'Value Carousels', count: 6, reach: 9050, shares: 480, avgWatchOrSave: '5.2s per slide' }
    ],
    storyCompletionRate: 84.2,
    nonFollowerDiscoveryRate: 64.8,
    topPosts: [
      {
        id: 'ig-power-1',
        title: 'Behind the Design: The Cape Town Sunset Session',
        format: 'Reel',
        reach: 28400,
        engagementRate: 9.6,
        saves: 1120,
        shares: 640,
        whyItWorked: 'High sensory music bed and aspirational urban tone drove 420+ profile visits in 48 hours.'
      },
      {
        id: 'ig-power-2',
        title: 'Accra vs Lagos: The Ultimate Lifestyle Comparison',
        format: 'Carousel',
        reach: 19800,
        engagementRate: 8.2,
        saves: 890,
        shares: 510,
        whyItWorked: 'Culturally attuned comparison sparked intense debate and share velocity across WhatsApp and DMs.'
      }
    ],
    growthPlaybook: {
      subsStrategy: {
        conversionHook: 'Follow for exclusive visual culture, curated design, and private invite codes.',
        profileBioTweak: 'Curated Excellence · Accra | Lagos | Cape Town · Shop & Discover ↘',
        leadMagnetOrSeries: 'Run weekly Story Broadcast Channel drop every Thursday at 6 PM GMT.',
        keyAction: 'Refresh Story Highlights with clear categories: "New In", "Reviews", "VIP Access".'
      },
      viewsStrategy: {
        viralHookTemplate: 'The 3 styling principles that defined Accra & Lagos fashion this season.',
        retentionTrigger: 'Seamless 7-second audio loop that triggers repeat plays before viewer realizes it looped.',
        algorithmDistributionHack: 'Leverage trending original audio tracks within 72 hours of algorithmic surge.',
        keyAction: 'Batch produce 8 high-contrast short-form Reels with minimal on-screen clutter.'
      },
      commentsStrategy: {
        discussionPrompt: 'Comment "ACCESS" and our system will DM you the private shopping link instantly.',
        pinnedCommentPlay: 'Pin customer testimonial highlighting delivery speed in Lagos and Accra.',
        engagementVelocityTactic: 'Use ManyChat automated DM trigger for 100% comment-to-DM conversion.',
        keyAction: 'Implement keyword-triggered DM funnels on all new Reels.'
      },
      algorithmUpdatesNews: {
        latestUpdate: 'Instagram 2026 ranking algorithm heavily favors Send/Share via DM as the #1 ranking signal.',
        impactOnBrand: 'Content that prompts people to DM a friend achieves 3x higher Explore reach.',
        tacticalPivot: 'Design every carousel and Reel around "Send this to someone heading to Cape Town/Lagos".'
      },
      suggestions: [
        { id: 'ig-s1', field: 'subs', label: 'DM Automation', tactic: 'Set up "Comment VIP" auto-DM pipeline.', expectedImpact: '+85% lead capture' },
        { id: 'ig-s2', field: 'views', label: 'DM Share Bait', tactic: 'Add "Send to your bestie" visual cue at 0:05.', expectedImpact: '2.5x shares' }
      ]
    }
  },

  youtube: {
    subscribers: 6200,
    netGrowth: 94,
    subsGainedPerVideoAvg: 23,
    views: 17638,
    watchTimeHours: 540,
    avgViewDuration: '4m 12s',
    avgPercentViewed: 52.4,
    ctr: 8.2,
    impressionsSuggestedBrowse: 84000,
    trafficSources: [
      { source: 'YouTube Shorts Feed', percentage: 56.4 },
      { source: 'Suggested Videos', percentage: 24.8 },
      { source: 'Direct / External Search', percentage: 18.8 }
    ],
    topVideos: [
      {
        id: 'yt-power-1',
        title: 'Metropolitan Elegance: Accra & Lagos Documentary Teaser',
        views: 8900,
        watchHours: 280,
        ctr: 9.4,
        retentionInsight: 'High 4K visual pacing sustained 62% viewer retention through 3 minutes.'
      }
    ],
    retentionDropOffInsight: 'Shorts feed demonstrates zero drop-off in first 5 seconds when cold-open voiceover begins immediately.',
    growthPlaybook: {
      subsStrategy: {
        conversionHook: 'Subscribe for in-depth visual documentaries and exclusive brand masterclasses.',
        profileBioTweak: 'Documenting the rise of African urban luxury. New doc releases every fortnight.',
        leadMagnetOrSeries: 'Launch "Urban Chronicles" 6-part mini-doc series.',
        keyAction: 'Add branded end-screen subscribe cards and pinned link cards.'
      },
      viewsStrategy: {
        viralHookTemplate: 'What they never told you about the creative revolution in Lagos.',
        retentionTrigger: 'Paced sound design cuts with rhythmic b-roll transitions.',
        algorithmDistributionHack: 'Syndicate top Instagram Reels directly into YouTube Shorts with custom SEO titles.',
        keyAction: 'Cross-syndicate 10 top-performing Reels as YouTube Shorts this month.'
      },
      commentsStrategy: {
        discussionPrompt: 'What should our next city documentary cover? Vote in the comments.',
        pinnedCommentPlay: 'Pin channel subscription link with timestamp index.',
        engagementVelocityTactic: 'Post community poll 24 hours prior to doc drops.',
        keyAction: 'Engage top 10 commenters with custom video responses.'
      },
      algorithmUpdatesNews: {
        latestUpdate: 'YouTube Shorts algorithmic weights now heavily award repeat viewers returning to long-form.',
        impactOnBrand: 'Shorts act as prime subscriber feeder for long-form trust building.',
        tacticalPivot: 'Every Short must link directly to the related long-form case study.'
      },
      suggestions: [
        { id: 'yt-s1', field: 'views', label: 'Shorts Syndication', tactic: 'Re-upload top 5 Instagram Reels as YouTube Shorts.', expectedImpact: '+15K views' }
      ]
    }
  },

  linkedin: {
    followers: 4100,
    netGrowth: 78,
    pageVisitors: 1420,
    impressions: 12400,
    engagementRate: 4.8,
    ctr: 3.8,
    contentTypes: [
      { type: 'Strategic PDF Decks', engagementRate: 6.2, reach: 5800, note: 'Massive B2B partnership save rate' },
      { type: 'Founder Thought Leadership', engagementRate: 4.8, reach: 4200, note: 'High comment density from agency leaders' },
      { type: 'Video Teardowns', engagementRate: 3.4, reach: 2400, note: 'Consistent executive reach' }
    ],
    seniorityDemographics: [
      { title: 'Senior Executives (VP, C-Suite)', percentage: 38 },
      { title: 'Directors & Managers', percentage: 42 },
      { title: 'Founders & Business Owners', percentage: 20 }
    ],
    topPosts: [
      {
        id: 'li-power-1',
        title: 'The Multi-Million Dollar Shift: Why African Urban Consumers Are Leading Global Aesthetic Trends',
        reach: 6400,
        engagementRate: 7.2,
        whyItWorked: 'Authoritative data breakdown citing Lagos, Accra, and Cape Town consumer velocity.'
      }
    ],
    growthPlaybook: {
      subsStrategy: {
        conversionHook: 'Follow for executive breakdowns on modern consumer behavior and B2B growth.',
        profileBioTweak: 'Building High-Growth Brands Across Africa & Beyond | Direct Inquiries ↘',
        leadMagnetOrSeries: 'Publish monthly "Metropolitan Consumer Index" 10-page whitepaper.',
        keyAction: 'Transform top monthly social data into an executive carousel report.'
      },
      viewsStrategy: {
        viralHookTemplate: 'Most consumer brands misunderstand the purchasing power in Accra and Lagos. Here is the real data:',
        retentionTrigger: 'Clean visual slides with bold data callouts and zero corporate jargon.',
        algorithmDistributionHack: 'Encourage company leadership to comment and repost within first hour.',
        keyAction: 'Publish 2 long-form PDF document carousels per week.'
      },
      commentsStrategy: {
        discussionPrompt: 'Do you agree that regional urban hubs are outpacing traditional Western markets in brand loyalty?',
        pinnedCommentPlay: 'Pin link to download the full Executive Intelligence Report.',
        engagementVelocityTactic: 'Tag key industry collaborators in insightful follow-up comments.',
        keyAction: 'Engage every C-suite comment with substantive strategic perspective.'
      },
      algorithmUpdatesNews: {
        latestUpdate: 'LinkedIn favors niche domain authority and knowledge-sharing documents over superficial polls.',
        impactOnBrand: 'Multi-page PDF carousels receive 3.5x higher dwell time and organic feed distribution.',
        tacticalPivot: 'Package all client social metrics into sleek executive PDF slide carousels.'
      },
      suggestions: [
        { id: 'li-s1', field: 'subs', label: 'B2B Whitepapers', tactic: 'Repurpose monthly report into LinkedIn PDF decks.', expectedImpact: '+500 executive followers' }
      ]
    }
  },

  tiktok: {
    followers: 8600,
    netGrowth: 380,
    videoViews: 28400,
    profileViews: 3420,
    likes: 4890,
    shares: 1140,
    comments: 420,
    engagementRate: 9.2,
    postFormats: [
      { format: 'Sound Design Foley Loops (<12s)', count: 4, avgViews: 8400, avgEngagement: 11.2 },
      { format: 'POV Behind-the-Scenes', count: 3, avgViews: 5200, avgEngagement: 8.4 },
      { format: 'Aesthetic Trend Syncs', count: 1, avgViews: 3800, avgEngagement: 7.1 }
    ],
    videoMetrics: {
      avgWatchTimeSec: 14.8,
      completionRatePercent: 54.2,
      fypTrafficPercent: 89.4,
      retentionInsight: 'Acoustic pattern interrupts in the first 1.2 seconds produced 2.8 average replays per viewer on the For You Page.'
    },
    topPosts: [
      {
        id: 'tt-power-1',
        title: 'POV: Walking through Victoria Island, Lagos with the new collection',
        views: 14200,
        likes: 2800,
        shares: 680,
        comments: 240,
        engagementRate: 12.4,
        whyItWorked: 'Sensory ambient audio and hyper-relatable urban setting triggered viral FYP wave.'
      }
    ],
    demographics: {
      topLocations: ['Lagos, Nigeria (44%)', 'Accra, Ghana (32%)', 'Cape Town, South Africa (24%)'],
      topAgeGender: '91% Female / 9% Male · Peak 20–34 years old',
      summary: 'Hyper-engaged trendsetter audience with exceptional audio-save and replay rates.'
    },
    growthPlaybook: {
      subsStrategy: {
        conversionHook: 'Follow for daily urban aesthetic inspiration and unreleased preview drops.',
        profileBioTweak: 'Visualizing African City Culture · Lagos | Accra | Cape Town · Shop New Drops ↘',
        leadMagnetOrSeries: 'Launch "Sounds of the City": 15-second acoustic soundscapes.',
        keyAction: 'Pin 3 signature aesthetic viral videos to top of profile.'
      },
      viewsStrategy: {
        viralHookTemplate: 'If you love high-end minimalism in Africa, this is for you.',
        retentionTrigger: 'Seamless visual and audio loop designed to repeat without visual seams.',
        algorithmDistributionHack: 'Leverage localized sound beds trending in Lagos and Accra.',
        keyAction: 'Post 4 sound-loop micro-clips weekly during peak afternoon commuting hours.'
      },
      commentsStrategy: {
        discussionPrompt: 'Which city vibe matches your energy today? Lagos or Accra?',
        pinnedCommentPlay: 'Pin link in bio reminder for exclusive drop access.',
        engagementVelocityTactic: 'Reply with video responses to top questions.',
        keyAction: 'Use video reply format to address audience questions directly.'
      },
      algorithmUpdatesNews: {
        latestUpdate: 'TikTok rewards high completion rate and loop count above raw share numbers.',
        impactOnBrand: 'Sub-15 second seamless loops outperform 60-second explainers by 5x in viral reach.',
        tacticalPivot: 'Keep TikTok assets strictly under 15 seconds with seamless loop continuity.'
      },
      suggestions: [
        { id: 'tt-s1', field: 'views', label: 'Loop Multiplier', tactic: 'Produce seamless 9s loops with invisible cuts.', expectedImpact: '3x replay multiplier' }
      ]
    }
  },

  contentPerformance: {
    topPostsAllPlatforms: [
      {
        rank: 1,
        platform: 'facebook',
        title: 'Signature Collection: The Modern Standard',
        reach: 48900,
        engagementRate: 7.2,
        viralityScore: 92,
        whyItWorked: 'High-contrast opening 2 seconds paired with bold headline text and direct link friction reduction driving 2,840 outbound link clicks.'
      },
      {
        rank: 2,
        platform: 'instagram',
        title: 'Behind the Design: Cape Town Sunset Session',
        reach: 28400,
        engagementRate: 9.6,
        viralityScore: 88,
        whyItWorked: 'Aspirational lifestyle resonance paired with premium ambient audio bed driving 1,120 saves & 420 profile visits.'
      },
      {
        rank: 3,
        platform: 'tiktok',
        title: 'POV: Victoria Island, Lagos Atmosphere',
        reach: 14200,
        engagementRate: 12.4,
        viralityScore: 94,
        whyItWorked: 'Hyper-localized urban pride sparked immediate peer-to-peer messaging shares (680 shares, 2.8x replay multiplier).'
      }
    ],
    contentPillars: [
      {
        pillarName: 'Cosmopolitan Urban Pride',
        shareOfVoicePercent: 40,
        performanceIndex: 'High',
        avgEngagement: 8.8,
        keyTakeaway: 'Top-of-Funnel Viral Reach & Demographic Magnet (Accra, Lagos, Cape Town)'
      },
      {
        pillarName: 'Product Utility & Style Integration',
        shareOfVoicePercent: 35,
        performanceIndex: 'High',
        avgEngagement: 7.4,
        keyTakeaway: 'Direct Conversion Engine (8,910+ Outbound Link Clicks)'
      },
      {
        pillarName: 'Artisan Craftsmanship & Behind-the-Scenes',
        shareOfVoicePercent: 25,
        performanceIndex: 'Medium',
        avgEngagement: 6.2,
        keyTakeaway: 'Trust, Brand Authority & Long-Term Loyalty (+296 Net Followers)'
      }
    ],
    bestPostingSchedule: {
      bestDays: ['Tuesday', 'Thursday', 'Sunday'],
      bestTimeWindow: '12:00 PM – 2:00 PM & 7:00 PM – 9:30 PM (GMT & WAT)',
      insight: 'Sub-Saharan metropolitan users demonstrate peak mobile purchasing and link-clicking behavior during mid-day lunch breaks and evening relaxation hours.'
    }
  },

  audienceInsights: {
    growthQuality: 'Exceptional organic quality with an 88.8% female demographic concentration. Prime age groups 25–34 (51.2%) and 35–44 (28.4%) represent the core decision-makers with proven disposable income.',
    organicVsPaidRatio: '89.2% Organic Discovery vs. 10.8% Paid Boost Reach',
    demographicShifts: 'Rapidly consolidating around the Accra–Lagos–Cape Town triangle, proving strong cross-border brand appeal across English-speaking African commercial capitals.'
  },

  competitiveBenchmark: {
    industryBenchmarkAvg: {
      engagementRate: '2.4%',
      reachGrowth: '+12.5%',
      summary: 'Our portfolio is drastically outperforming industry benchmarks: 6.8% engagement rate vs 2.4% industry average, and 3.4% click-through rate vs 0.8% retail standard.'
    },
    competitors: [
      {
        competitor: 'Regional Commercial Benchmark A',
        followerCount: '45,000',
        monthlyGrowthRate: '+0.4%',
        avgEngagementRate: '2.1%',
        qualitativeNote: 'Relies on static catalog imagery; zero dynamic video hooks or sound design integration.'
      },
      {
        competitor: 'Regional Commercial Benchmark B',
        followerCount: '28,000',
        monthlyGrowthRate: '+1.1%',
        avgEngagementRate: '2.8%',
        qualitativeNote: 'Inconsistent posting schedule; fails to leverage WhatsApp or direct link automation.'
      }
    ]
  },

  recommendations: {
    actionableItems: [
      {
        id: 'rec-p-1',
        priority: 'High',
        platform: 'Facebook',
        recommendation: 'Scale the highest-converting video teaser with a dedicated $20/day lookalike ad boost targeting women 25–44 in Accra and Lagos.',
        expectedOutcome: 'Drive an incremental 4,500+ outbound link clicks at sub-$0.12 CPC.'
      },
      {
        id: 'rec-p-2',
        priority: 'High',
        platform: 'Instagram',
        recommendation: 'Deploy ManyChat keyword automation on all Reels so every "LINK" comment triggers an automated personalized DM with trackable link.',
        expectedOutcome: 'Increase link click conversion from 2,710 to 5,000+ while capturing 1,200+ direct phone/email leads.'
      },
      {
        id: 'rec-p-3',
        priority: 'Strategic',
        platform: 'Cross-Platform',
        recommendation: 'Syndicate top 4 Facebook & Instagram short-form assets directly into TikTok and YouTube Shorts within 48 hours of publication.',
        expectedOutcome: 'Unlock 50,000+ incremental impressions with zero additional production budget.'
      },
      {
        id: 'rec-p-4',
        priority: 'Medium',
        platform: 'LinkedIn',
        recommendation: 'Publish bi-weekly "African Cosmopolitan Consumer" PDF slide decks authored by the executive director.',
        expectedOutcome: 'Attract high-ticket corporate partnerships, brand sponsorships, and press coverage.'
      }
    ],
    contentCalendarDirection: 'Double down on high-energy urban lifestyle themes, frictionless click-through mechanics, and culturally grounded storytelling spanning Accra, Lagos, and Cape Town.',
    testingPriorities: [
      'Test cold-open geo-hooks ("If you are in Lagos vs Accra...") vs universal lifestyle hooks',
      'Test 7-second seamless sound loops vs 30-second narrative voiceovers',
      'Test single product focus vs multi-product lifestyle carousel presentations'
    ]
  },

  uploadedScreenshots: []
};
