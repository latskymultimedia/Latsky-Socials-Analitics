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
      },
      {
        platform: 'tiktok',
        platformLabel: 'TikTok',
        followers: 24800,
        followersDelta: 3100,
        reach: 168200,
        reachDelta: 38.6,
        engagementRate: 7.8,
        topContentType: 'Sensory Foley & Sound Design Clips',
        totalPosts: 14
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
    },
    growthPlaybook: {
      subsStrategy: {
        conversionHook: 'Follow our Page for monthly cinematic documentaries and behind-the-scenes filmmaking masterclasses.',
        profileBioTweak: 'Update Page Category to Film Production Studio and pin festival recognition post to the top.',
        leadMagnetOrSeries: 'Bi-weekly "Director Vault" series highlighting restored documentary archives.',
        keyAction: 'Embed an explicit Follow button callout at the final frame of all native video teasers.'
      },
      viewsStrategy: {
        viralHookTemplate: 'First 2 seconds must showcase rapid color grading slider comparisons with crisp Foley audio.',
        retentionTrigger: 'Avoid talking heads during the first 20 seconds; let the footage and ambient sound create mood.',
        algorithmDistributionHack: 'Always upload native MP4 files at 1080x1350 with closed captions enabled.',
        keyAction: 'Repurpose the best-performing 60-second YouTube teaser natively to Facebook Watch.'
      },
      commentsStrategy: {
        discussionPrompt: 'Filmmakers: Which camera package would you choose for filming inside a dense forest storm? Drop your gear list below.',
        pinnedCommentPlay: 'Pin a technical note detailing the exact lenses and diffusion filters used in the video.',
        engagementVelocityTactic: 'Reply to the first 10 comments within 30 minutes of publication to trigger feed resurgence.',
        keyAction: 'Prompt indie DPs to share their hardest weather shoot story.'
      },
      algorithmUpdatesNews: {
        latestUpdate: 'Meta 2026 Video Priority: Facebook algorithm heavily boosts original video with >1 minute watch duration.',
        impactOnBrand: 'Static photography reach has dropped under 3.5%; native video receives 5x broader distribution.',
        tacticalPivot: 'Discontinue link-only posts; convert all project updates into short cinematic video reels.'
      },
      suggestions: [
        {
          id: 'v-fb-s1',
          field: 'subs',
          label: 'Page Follow Conversion Funnel',
          tactic: 'End native cutdowns with a clear 4-second motion end-card asking indie filmmakers to follow.',
          expectedImpact: '+30% net follower acquisition MoM'
        },
        {
          id: 'v-fb-s2',
          field: 'views',
          label: 'Native Video Feed Retention',
          tactic: 'Burn in stylized subtitles with subtle background tint for mute-first feed scrollers.',
          expectedImpact: '+35% 1-minute video retention'
        },
        {
          id: 'v-fb-s3',
          field: 'comments',
          label: 'Technical Debate Catalyst',
          tactic: 'Pose polarizing questions about analog film vs digital color science.',
          expectedImpact: '4x higher comment interaction velocity'
        }
      ]
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
    ],
    growthPlaybook: {
      subsStrategy: {
        conversionHook: 'Follow @latskymultimedia for weekly cinematography masterclasses & documentary frame studies.',
        profileBioTweak: 'Refactor bio: Line 1 (Commercial Cinema & Doc Studio) | Line 2 (Awarded European Doc Showcase 2026) | Line 3 (Free Foley Sample Pack in link).',
        leadMagnetOrSeries: 'Launch the "100 Lighting Setups" weekly Reel series with free downloadable PDF lighting schematics.',
        keyAction: 'Pin the 3 highest-converting educational Reels (Foley, Night Lighting, Anamorphic Frames) to the top row of the profile.'
      },
      viewsStrategy: {
        viralHookTemplate: 'Acoustic pattern interrupt: loud Foley soundbite + on-screen typography hook in first 1.1 seconds.',
        retentionTrigger: 'Use a seamless loop ending where the concluding sentence flows seamlessly into the starting question.',
        algorithmDistributionHack: 'Optimize for Saves & Shares: Instagram explores are driven 70% by the Save-to-Reach and DM-Send ratio.',
        keyAction: 'Create 22-second sound design deconstructions with clear tactile Foley beats.'
      },
      commentsStrategy: {
        discussionPrompt: 'Which lighting look would you choose for a tense psychological thriller? Comment A or B.',
        pinnedCommentPlay: 'Pin a comment listing exact Kelvin ratings and diffusion filters, asking "What\'s your go-to modifier?"',
        engagementVelocityTactic: 'Reply to all comments in the first 45 minutes with an open-ended technical follow-up.',
        keyAction: 'Use the interactive question sticker in Stories 3 hours before dropping each Reel.'
      },
      algorithmUpdatesNews: {
        latestUpdate: 'Instagram 2026 Trial Reels & DM Weighting: Reels are pre-tested with non-followers; Send-to-Friend ratio is the strongest distribution signal.',
        impactOnBrand: 'Pure lifestyle footage plateaus; highly technical cinematography tutorials get shared directly into filmmaker group chats.',
        tacticalPivot: 'Design every Reel as a peer-to-peer shareable asset that one DP sends to another.'
      },
      suggestions: [
        {
          id: 'v-ig-s1',
          field: 'subs',
          label: 'Profile Visitor Conversion Funnel',
          tactic: 'Add an explicit spoken & graphic CTA in final 3 seconds: "Follow for weekly cinema lighting diagrams."',
          expectedImpact: '+45% profile visit to follower conversion'
        },
        {
          id: 'v-ig-s2',
          field: 'views',
          label: 'Audio Sensory Loop Formula',
          tactic: 'Pair macro close-ups with crisp hyper-real Foley sound to provoke involuntary pause and replay.',
          expectedImpact: 'Average watch time exceeding 110% of Reel duration'
        },
        {
          id: 'v-ig-s3',
          field: 'comments',
          label: 'A/B Lighting Setup Debate',
          tactic: 'Present two distinct lighting setups of the same actress and prompt directors to vote in comments.',
          expectedImpact: '+85% comment volume in first 2 hours'
        },
        {
          id: 'v-ig-s4',
          field: 'algorithm_news',
          label: 'Trial Reels Algorithm Deployment',
          tactic: 'Test Reels with trial distribution to non-followers before locking in the final title caption.',
          expectedImpact: 'Higher breakout rate into broader international explore tabs'
        }
      ]
    }
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
    retentionDropOffInsight: 'Viewer retention drops when studio gear lists run longer than 45 seconds. Keep gear context woven into the narrative rather than dedicated inventory segments.',
    growthPlaybook: {
      subsStrategy: {
        conversionHook: 'Mid-roll sub trigger at minute 8: "If this breakdown helped your framing, subscribe for our next doc episode."',
        profileBioTweak: 'Featured channel trailer: 90-second studio cinematography showreel with direct subscribe link.',
        leadMagnetOrSeries: 'The "Masters of Documentary" 6-part episodic series organized into an official series playlist.',
        keyAction: 'Use verbal subscribe reminder immediately after delivering the video\'s primary creative insight.'
      },
      viewsStrategy: {
        viralHookTemplate: 'Cold open: Start with intense 15-second climactic film footage before introductory titles.',
        retentionTrigger: 'Dynamic chapter transitions and visual diagrams every 90 seconds to prevent narrative lull.',
        algorithmDistributionHack: 'Browse Feature Mastery: High thumbnail contrast, expressive eye contact, and 3-word title punchline.',
        keyAction: 'Upload 3 thumbnail variations using YouTube\'s native Thumbnail Test & Compare feature on day 1.'
      },
      commentsStrategy: {
        discussionPrompt: 'Question of the Video pinned at 0:01: "What\'s the hardest interview moment you\'ve ever captured? Tell us below."',
        pinnedCommentPlay: 'Pin a detailed chapter index with a question challenging viewers to find their favorite cinematic transition.',
        engagementVelocityTactic: 'Dedicate the first 2 hours after release to answering every single comment with a thoughtful reply.',
        keyAction: 'Publish a Community tab poll 48 hours prior to new video release to prime the algorithm.'
      },
      algorithmUpdatesNews: {
        latestUpdate: 'YouTube 2026 Viewer Satisfaction Metric: Satisfaction survey responses & return viewers outrank raw clickbait CTR.',
        impactOnBrand: 'Sensationalist titles hurt channel standing; nuanced documentary craft retains high algorithmic favor for months.',
        tacticalPivot: 'Craft evergreen documentary video essays designed for 50%+ retention and repeat study.'
      },
      suggestions: [
        {
          id: 'v-yt-s1',
          field: 'subs',
          label: 'Mid-Roll Subscriber Conversion Anchor',
          tactic: 'Insert a 4-second contextual subscribe prompt right after breaking down the hardest scene of the documentary.',
          expectedImpact: '+50% net subscribers gained per 1,000 views'
        },
        {
          id: 'v-yt-s2',
          field: 'views',
          label: 'Browse Features Thumbnail Optimization',
          tactic: 'Apply 3-layer thumbnail formula: subject emotional gaze + intriguing prop/lighting + 2 bold words.',
          expectedImpact: 'Push CTR from 7.6% to 9.2%+'
        },
        {
          id: 'v-yt-s3',
          field: 'comments',
          label: 'Community Tab Poll Priming',
          tactic: 'Run a visual poll on the Community tab 2 days before publishing to trigger subscriber feed alerts.',
          expectedImpact: '+70% first-day velocity and comment volume'
        },
        {
          id: 'v-yt-s4',
          field: 'algorithm_news',
          label: 'Viewer Satisfaction Chaptering',
          tactic: 'Include detailed chapter markers and descriptive titles so viewers who re-watch specific sections signal high satisfaction.',
          expectedImpact: 'Extended algorithmic shelf-life across suggested feeds'
        }
      ]
    }
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
    ],
    growthPlaybook: {
      subsStrategy: {
        conversionHook: 'Follow our page for weekly commercial film teardowns, budget allocations, and creative director briefings.',
        profileBioTweak: 'Headline: "Director & Producer | Dissecting commercial film ROI & documentary storytelling for CMOs and Brand Leaders".',
        leadMagnetOrSeries: 'Bi-weekly "Commercial Film Budget Teardowns" released as high-value swipeable PDF slide decks.',
        keyAction: 'Feature top 3 PDF case study decks prominently in the profile Featured section.'
      },
      viewsStrategy: {
        viralHookTemplate: 'Counter-intuitive opening line: "Why a £40k documentary outperformed a £250k broadcast commercial. Here is the math:"',
        retentionTrigger: 'Format posts as 8–10 slide PDF document carousels with punchy 35-word insights on each slide.',
        algorithmDistributionHack: 'Zero-Link Rule: Keep main post 100% link-free; place booking link and full film link in comment #1.',
        keyAction: 'Publish document carousels on Tuesday and Thursday mornings between 08:30 and 10:30 GMT.'
      },
      commentsStrategy: {
        discussionPrompt: 'CMOs: Are you planning higher spend on long-form branded documentary or 15-second social cutdowns this quarter?',
        pinnedCommentPlay: 'Place the case study link and high-res video link exclusively in the first comment.',
        engagementVelocityTactic: 'Have senior producers reply to every marketing executive with substantive context.',
        keyAction: 'Tag 2-3 verified project collaborators or agency partners in post comments to seed executive dialogue.'
      },
      algorithmUpdatesNews: {
        latestUpdate: 'LinkedIn 2026 Feed Policy: Heavy reach suppression for posts with outbound external URLs (-40%); boosts native PDFs & conversational dwell time.',
        impactOnBrand: 'Posting YouTube links directly on LinkedIn yields near-zero reach; multi-slide PDF carousels achieve 4x-6x standard reach.',
        tacticalPivot: 'Format every production breakdown into an 8-slide PDF deck with all conclusions self-contained in feed.'
      },
      suggestions: [
        {
          id: 'v-li-s1',
          field: 'subs',
          label: 'Executive Follower Conversion Deck',
          tactic: 'Include a clean profile callout slide on the final slide of every document deck: "Follow for weekly commercial film teardowns."',
          expectedImpact: '+40% follower growth from Directors & CMOs'
        },
        {
          id: 'v-li-s2',
          field: 'views',
          label: 'Document Dwell Time Architecture',
          tactic: 'Design 8–10 slide PDFs in 1080x1350 vertical aspect ratio with concise 30-word insights per slide.',
          expectedImpact: '3x higher algorithmic dwell time and reach'
        },
        {
          id: 'v-li-s3',
          field: 'comments',
          label: 'Executive Peer Debate Prompt',
          tactic: 'End copy with a nuanced budget or strategy dilemma that senior marketing managers feel compelled to weigh in on.',
          expectedImpact: 'Higher comment depth from senior decision makers'
        },
        {
          id: 'v-li-s4',
          field: 'algorithm_news',
          label: 'Zero-Link Native Distribution',
          tactic: 'Keep main post 100% link-free; place booking link and full film link in comment #1 after initial engagement begins.',
          expectedImpact: 'Avoid the 40% outbound link reach penalty'
        }
      ]
    }
  },

  tiktok: {
    followers: 24800,
    netGrowth: 3100,
    videoViews: 168200,
    profileViews: 14200,
    likes: 21400,
    shares: 4850,
    comments: 1940,
    engagementRate: 7.8,
    postFormats: [
      { format: 'Sensory Foley Sound Loops (<15s)', count: 6, avgViews: 24500, avgEngagement: 9.4 },
      { format: 'Director Cinema Masterclass (60s)', count: 4, avgViews: 14200, avgEngagement: 7.2 },
      { format: 'Color Grading Before/After Wipes', count: 4, avgViews: 11800, avgEngagement: 6.8 }
    ],
    videoMetrics: {
      avgWatchTimeSec: 18.6,
      completionRatePercent: 44.8,
      fypTrafficPercent: 86.2,
      retentionInsight: 'First 1.5 seconds determine 90% of virality. Sound design ASMR clips average 2.1 loops per viewer, pushing them into algorithmic FYP distribution waves.'
    },
    topPosts: [
      {
        id: 'tt-1',
        title: 'Microphone Placement for Rain on Vintage Glass',
        views: 64200,
        likes: 8900,
        shares: 2100,
        comments: 480,
        engagementRate: 11.2,
        whyItWorked: 'Sensory acoustic trigger; viewers looped audio multiple times to inspect the mic capsule.'
      },
      {
        id: 'tt-2',
        title: 'Why Hollywood Movies Look Green in 2026',
        views: 48100,
        likes: 6200,
        shares: 1450,
        comments: 620,
        engagementRate: 8.9,
        whyItWorked: 'Contrarian industry thesis sparked active debate between colorists and indie filmmakers.'
      }
    ],
    demographics: {
      topLocations: ['United States (38%)', 'United Kingdom (28%)', 'Canada (14%)', 'Germany (10%)'],
      topAgeGender: '54% Male / 46% Female · Peak 18–34 years old',
      summary: 'Audience skews young, craft-obsessed, and creator-oriented with strong bookmarking habits.'
    },
    growthPlaybook: {
      subsStrategy: {
        conversionHook: 'Follow for daily cinematic lighting setups and unreleased sound design stems.',
        profileBioTweak: 'Director & Sound Designer | Commercial Film Teardowns | New stem kit in bio ↘',
        leadMagnetOrSeries: 'Launch "60-Second Film School": Weekly 3-part micro-lessons ending with an open question.',
        keyAction: 'Pin 3 signature masterclasses to top of profile that showcase the studio high-end reel.'
      },
      viewsStrategy: {
        viralHookTemplate: 'Visual pattern interrupt in frame 1 (e.g. extreme lens flare or unexpected prop) paired with custom high-contrast text overlay.',
        retentionTrigger: 'Paced cuts every 2.2 seconds with continuous ambient audio bed to eliminate drop-off.',
        algorithmDistributionHack: 'Target 12-second seamless audio loops where video end seamlessly connects to the beginning.',
        keyAction: 'Test 3 seamless sound design loops this month to maximize loop multiplier metric on FYP.'
      },
      commentsStrategy: {
        discussionPrompt: 'Which lens would you have chosen here: 35mm anamorphic or 50mm vintage prime? Tell me why.',
        pinnedCommentPlay: 'Pin a technical question highlighting a subtle flaw or choice in the grade to provoke colorist debates.',
        engagementVelocityTactic: 'Reply to the first 25 comments within 45 minutes of publishing using video replies when possible.',
        keyAction: 'Create one dedicated video-reply answering a technical question from last week top comment.'
      },
      algorithmUpdatesNews: {
        latestUpdate: 'TikTok 2026 algorithm rewards search-optimized video SEO descriptions and long-tail query matches over generic trending hashtags.',
        impactOnBrand: 'Keyword-rich spoken audio and on-screen text now drive 35% of post discoverability through TikTok Search.',
        tacticalPivot: 'Include precise search keywords ("cinematic lighting setup", "indie sound design") in spoken voiceover, text overlays, and the first 2 lines of the caption.'
      },
      suggestions: [
        {
          id: 'v-tt-s1',
          field: 'subs',
          label: 'Series Playlist Architecture',
          tactic: 'Group micro-breakdowns into a TikTok Creator Playlist titled "The Director Notebook" so viewers binge multiple episodes.',
          expectedImpact: '+55% viewer-to-follower conversion rate'
        },
        {
          id: 'v-tt-s2',
          field: 'views',
          label: 'Seamless Audio Loop Craft',
          tactic: 'Compose audio beds where the final snare hit resolves on the first frame of the repeat loop.',
          expectedImpact: 'Average watch time increases from 18s to 24s (+33%)'
        },
        {
          id: 'v-tt-s3',
          field: 'comments',
          label: 'Video Reply Strategy',
          tactic: 'Post 1 video reply per week addressing a contentious user question; TikTok pushes video replies to original viewers.',
          expectedImpact: 'Double the comment volume and cultivate community authority'
        },
        {
          id: 'v-tt-s4',
          field: 'algorithm_news',
          label: 'Spoken SEO Transcript Optimization',
          tactic: 'Verbalize primary industry keywords in the first 5 seconds to trigger TikTok automated search categorization.',
          expectedImpact: 'Long-tail search traffic increases by 40% over 60 days'
        }
      ]
    }
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

  // Live Scraped Industry Intelligence & Trend Radar (Commercial Cinema & Documentary Filmmaking)
  industryIntel: {
    industryName: 'Commercial Film Production & Documentary Cinema',
    scrapedAt: new Date().toISOString(),
    source: 'firecrawl_live',
    sourcesScraped: [
      'https://www.premiumbeat.com/blog/cinematography-trends-2026',
      'https://nofilmschool.com/documentary-distribution-algorithms',
      'https://creatorhandbook.io/video-retention-benchmarks-2026'
    ],
    industryOverview: 'The independent cinema and commercial film sector in 2026 is experiencing a dramatic shift: polished "corporate showreels" suffer severe algorithmic fatigue, while granular "sensory craft deconstruction" (audio Foley, color grade transformations, lighting overhead diagrams) generates 4.2x higher viral discoverability across YouTube and Reels.',
    subGrowthPlaybook: 'In film and visual arts, viewers subscribe to educational transparency, not raw self-promotion. The #1 subscriber conversion vehicle is the "Recurring Micro-Series" (e.g. 52 Lighting Breakdowns or 10 Lessons from the Edit Suite) with an accompanying free digital asset (LUT pack, sound cues, or PDF diagram) linked in bio. Mid-roll value-anchored calls-to-action on YouTube convert at 3.8% compared to only 0.4% for generic end-card badges.',
    viewsAndReachPlaybook: 'Reach in 2026 is determined by the "First 1.5 Seconds Acoustic & Visual Pattern Interrupt". Audio is now 50% of the hook: hyper-real tactile Foley (clapperboards, lens clicks, rain on glass) forces users to pause their scroll. For YouTube, browse features require the "Intrigue Triad": a human eye-line looking off-screen at an unexpected prop + a curiosity-inducing 3-word title.',
    commentsAndDebatesPlaybook: 'To force algorithmic comment velocity, avoid generic questions like "What do you think?". Instead, present a specific polarizing craft trade-off: "Would you shoot this scene on a vintage uncoated lens or ultra-sharp modern glass?", or "A or B: Which color grade preserves skin tone authenticity?". When the brand replies with multi-sentence reasoning within the first 45 minutes, comment threads double and algorithmic dwell time spikes by 68%.',
    socialAlgorithmNews2026: [
      {
        platform: 'YouTube',
        newsHeadline: 'Algorithm Pivot: Viewer Satisfaction Surveys & Return Viewership Surpass Raw CTR',
        strategicTakeaway: 'YouTube no longer rewards extreme clickbait if viewers bounce early; evergreen 15–24 minute narrative essays with high end-satisfaction receive sustained browse promotion for 6–12 months.'
      },
      {
        platform: 'Instagram',
        newsHeadline: 'Trial Reels Rollout & Send-to-Friend (DM) Weighting Dominance',
        strategicTakeaway: 'Instagram tests new Reels with non-followers in a sandbox before showing followers; private DM shares are now the #1 ranking factor, meaning content designed for peer sharing (director to DP) gets exponential reach.'
      },
      {
        platform: 'LinkedIn',
        newsHeadline: 'Severe Link Suppression (-40%) & Native PDF Carousel Prioritization',
        strategicTakeaway: 'Outbound URLs in post copy trigger an immediate reach penalty; brands must package commercial ROI case studies as 8–10 slide downloadable PDF decks and place links strictly in the first comment.'
      },
      {
        platform: 'Meta / Facebook',
        newsHeadline: 'Meta Recommended Video Engine Prioritizes >1 Minute Native Watch Duration',
        strategicTakeaway: 'Static imagery reach has dropped below 3%; short video cutdowns formatted in 4:5 or 9:16 with burned-in subtitles receive up to 5x broader organic feed distribution.'
      }
    ],
    trendingHooksAndFormats: [
      {
        formatName: 'Sensory Audio Foley Breakdown',
        hookPattern: 'Macro camera insert + loud tactile sound FX with immediate text overlay: "How we made the sound of a forest fire with a head of celery."',
        whyItWorksInThisIndustry: 'Acoustic novelty triggers curiosity; editors and sound designers bookmark and share into community group chats.'
      },
      {
        formatName: 'The "Before vs After" Anamorphic Split Slider',
        hookPattern: 'Raw flat Log footage in top half, fully graded cinema master in bottom half, sliding across the screen in 0:01.',
        whyItWorksInThisIndustry: 'Instant gratification for visually driven cinephiles and directors evaluating studio grading standards.'
      },
      {
        formatName: 'The Commercial Budget Teardown (LinkedIn PDF)',
        hookPattern: 'Slide 1: "How we shot a broadcast luxury commercial for £32k when the agency quoted £180k. Line-item breakdown:"',
        whyItWorksInThisIndustry: 'Cuts directly through marketing agency jargon with cold financial transparency, triggering CMO inquiries.'
      }
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
