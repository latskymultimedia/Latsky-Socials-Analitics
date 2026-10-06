import { SocialReportData, TacticalSuggestion } from '../types/report';

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
  const goals = options.goals?.trim() || 'Audience expansion, brand authority, and community engagement';
  const notes = options.notes?.trim() || '';
  const known = options.knownMetrics || {};

  const requestedPlatforms = (options.platforms && options.platforms.length > 0)
    ? options.platforms.map((p) => p.toLowerCase())
    : ['youtube', 'instagram', 'linkedin', 'facebook', 'tiktok'];

  const isPlatformActive = (plat: string) => requestedPlatforms.includes(plat.toLowerCase());

  // Use known metrics if supplied, otherwise 0 if inactive or base values if active
  const ytSubs = (known.youtubeSubscribers !== undefined && known.youtubeSubscribers !== '') 
    ? Number(known.youtubeSubscribers) 
    : (isPlatformActive('youtube') ? 18400 : 0);
  const ytDelta = (known.youtubeNetGrowth !== undefined && known.youtubeNetGrowth !== '') 
    ? Number(known.youtubeNetGrowth) 
    : (isPlatformActive('youtube') ? 940 : 0);
  const ytReach = (known.youtubeReach !== undefined && known.youtubeReach !== '') 
    ? Number(known.youtubeReach) 
    : (isPlatformActive('youtube') ? 114000 : 0);

  const igFollowers = (known.instagramFollowers !== undefined && known.instagramFollowers !== '') 
    ? Number(known.instagramFollowers) 
    : (isPlatformActive('instagram') ? 16800 : 0);
  const igDelta = (known.instagramNetGrowth !== undefined && known.instagramNetGrowth !== '') 
    ? Number(known.instagramNetGrowth) 
    : (isPlatformActive('instagram') ? 820 : 0);
  const igReach = (known.instagramReach !== undefined && known.instagramReach !== '') 
    ? Number(known.instagramReach) 
    : (isPlatformActive('instagram') ? 89000 : 0);

  const ttFollowers = (known.tiktokFollowers !== undefined && known.tiktokFollowers !== '') 
    ? Number(known.tiktokFollowers) 
    : (isPlatformActive('tiktok') ? 12400 : 0);
  const ttDelta = (known.tiktokNetGrowth !== undefined && known.tiktokNetGrowth !== '') 
    ? Number(known.tiktokNetGrowth) 
    : (isPlatformActive('tiktok') ? 1850 : 0);
  const ttReach = (known.tiktokReach !== undefined && known.tiktokReach !== '') 
    ? Number(known.tiktokReach) 
    : (isPlatformActive('tiktok') ? 94200 : 0);

  const liFollowers = (known.linkedinFollowers !== undefined && known.linkedinFollowers !== '') 
    ? Number(known.linkedinFollowers) 
    : (isPlatformActive('linkedin') ? 7800 : 0);
  const liDelta = (known.linkedinNetGrowth !== undefined && known.linkedinNetGrowth !== '') 
    ? Number(known.linkedinNetGrowth) 
    : (isPlatformActive('linkedin') ? 410 : 0);
  const liReach = (known.linkedinReach !== undefined && known.linkedinReach !== '') 
    ? Number(known.linkedinReach) 
    : (isPlatformActive('linkedin') ? 48500 : 0);

  const fbFollowers = (known.facebookFollowers !== undefined && known.facebookFollowers !== '') 
    ? Number(known.facebookFollowers) 
    : (isPlatformActive('facebook') ? 5200 : 0);
  const fbDelta = (known.facebookNetGrowth !== undefined && known.facebookNetGrowth !== '') 
    ? Number(known.facebookNetGrowth) 
    : (isPlatformActive('facebook') ? 120 : 0);
  const fbReach = (known.facebookReach !== undefined && known.facebookReach !== '') 
    ? Number(known.facebookReach) 
    : (isPlatformActive('facebook') ? 33900 : 0);

  // Build platform objects conditionally based on active status and metrics presence
  const facebookData = isPlatformActive('facebook') ? {
    followers: fbFollowers,
    netGrowth: fbDelta,
    reachOrganic: fbReach > 4100 ? fbReach - 4100 : fbReach,
    reachPaid: fbReach > 0 ? 4100 : 0,
    engagementRate: fbReach > 0 ? 3.1 : 0.0,
    postFormats: fbReach > 0 ? [
      { format: 'Native Video / Reels', count: 4, avgReach: 5200, avgEngagement: 3.8 },
      { format: 'Photos & Behind-the-Scenes', count: 3, avgReach: 2400, avgEngagement: 2.9 },
      { format: 'Articles & Community Links', count: 1, avgReach: 1100, avgEngagement: 1.6 }
    ] : [],
    videoMetrics: {
      views: fbReach > 0 ? 18200 : 0,
      avgWatchTimeSec: fbReach > 0 ? 26 : 0,
      retention3SecPercent: fbReach > 0 ? 54.2 : 0,
      retention1MinPercent: fbReach > 0 ? 28.5 : 0,
      commentary: fbReach > 0 ? 'Retention holds remarkably well through initial segments.' : 'No active video metrics recorded.'
    },
    topPosts: fbReach > 0 ? [
      {
        id: 'fb-top-1',
        title: 'Behind the Scenes: Production Spotlight',
        date: 'Recent',
        reach: Math.round(fbReach * 0.25),
        engagementRate: 4.2,
        shares: 48,
        whyItWorked: 'Authentic craft documentation.'
      }
    ] : [],
    demographics: {
      topLocations: fbReach > 0 ? ['United Kingdom', 'United States', 'South Africa', 'Australia'] : [],
      topAgeGender: fbReach > 0 ? '52% Female / 48% Male · Dominant age cohort 25–44' : 'N/A',
      summary: fbReach > 0 ? 'Solid core of loyal returning community members.' : 'Not monitored'
    },
    growthPlaybook: fbReach > 0 ? {
      subsStrategy: {
        conversionHook: 'Follow our Page for monthly cinematic documentaries and behind-the-scenes masterclasses.',
        profileBioTweak: 'Streamline Page About section to highlight award credentials and embed contact link.',
        leadMagnetOrSeries: 'Bi-weekly "Director Archive" video clips featuring restored vintage & modern commercial film breakdowns.',
        keyAction: 'Pin highest-reach commercial teaser with an explicit "Follow for Episode 2" call-to-action.'
      },
      viewsStrategy: {
        viralHookTemplate: 'Immediate visual movement in 0:00-0:02 with large burned-in yellow subtitles for muted mobile feeds.',
        retentionTrigger: 'Re-hook narrative at 0:25 by introducing unexpected behind-the-scenes filming dilemma.',
        algorithmDistributionHack: 'Always upload native high-bitrate video directly to Meta Creator Studio—never post external links.',
        keyAction: 'Format all Facebook video exports in 4:5 or 9:16 aspect ratio to maximize screen real estate in mobile feeds.'
      },
      commentsStrategy: {
        discussionPrompt: 'Filmmakers: Would you shoot this scene with practical lights or push ISO in post? Tell us why below.',
        pinnedCommentPlay: 'Pin a follow-up question asking viewers to vote on which camera package they prefer.',
        engagementVelocityTactic: 'Have page admins respond with thoughtful replies within first 45 minutes.',
        keyAction: 'Tag production collaborators directly in body copy to seed discussion.'
      },
      algorithmUpdatesNews: {
        latestUpdate: 'Meta 2026 Feed Shift: Algorithm heavily prioritizes original video exceeding 1-minute watch duration in recommended feeds.',
        impactOnBrand: 'Short link snippets receive low reach; native episodic videos receive priority distribution.',
        tacticalPivot: 'Repurpose long-form documentary chapters into 90-second native Facebook stories with narrative payoff.'
      },
      suggestions: [
        {
          id: 'fb-s1',
          field: 'subs',
          label: 'Page Follow Conversion Funnel',
          tactic: 'End every native video with a 4-second motion graphic showing where to tap "Follow" for the next case study.',
          expectedImpact: '+35% net page follower growth MoM'
        }
      ] as TacticalSuggestion[]
    } : null
  } : {
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
      commentary: 'Platform not monitored during this cycle.'
    },
    topPosts: [],
    demographics: {
      topLocations: [],
      topAgeGender: 'N/A',
      summary: 'Not monitored'
    },
    growthPlaybook: null
  };

  const instagramData = isPlatformActive('instagram') ? {
    followers: igFollowers,
    netGrowth: igDelta,
    followUnfollowRatio: igReach > 0 ? '4.1:1 (1,080 follows / 260 unfollows)' : 'N/A',
    reach: igReach,
    impressions: Math.round(igReach * 1.6),
    profileVisits: igReach > 0 ? 3840 : 0,
    websiteTaps: igReach > 0 ? 410 : 0,
    formatSplit: igReach > 0 ? [
      { format: 'reels' as const, formatLabel: 'Reels', count: 8, reach: 58000, shares: 920, avgWatchOrSave: '18.4s avg / 740 saves' },
      { format: 'carousels' as const, formatLabel: 'Carousels', count: 5, reach: 24000, shares: 380, avgWatchOrSave: '5.2s per slide' },
      { format: 'feed' as const, formatLabel: 'Single Images', count: 3, reach: 7000, shares: 95, avgWatchOrSave: 'Strong likes' },
      { format: 'stories' as const, formatLabel: 'Stories', count: 28, reach: 3400, shares: 42, avgWatchOrSave: '82% completion rate' }
    ] : [],
    storyCompletionRate: igReach > 0 ? 82.4 : 0,
    nonFollowerDiscoveryRate: igReach > 0 ? 64.8 : 0,
    topPosts: igReach > 0 ? [
      {
        id: 'ig-top-1',
        title: 'Cinematic Lighting Breakdown',
        format: 'Reel',
        reach: Math.round(igReach * 0.32),
        engagementRate: 7.2,
        saves: 1140,
        shares: 520,
        whyItWorked: 'High save utility.'
      }
    ] : [],
    growthPlaybook: igReach > 0 ? {
      subsStrategy: {
        conversionHook: 'Follow @client for weekly cinematographic lighting breakdowns and indie documentary case studies.',
        profileBioTweak: 'Refactor bio: Line 1 (Clear Niche Authority) | Line 2 (Social Proof/Award) | Line 3 (Lead Magnet CTA with arrow to link).',
        leadMagnetOrSeries: 'Free downloadable Lighting Blueprint PDF and Sound Pack linked in bio to capture email subscribers.',
        keyAction: 'Pin the 3 highest-converting educational Reels to top of grid with matching aesthetic cover art.'
      },
      viewsStrategy: {
        viralHookTemplate: 'Visual pattern interrupt in first 1.2s: "Stop lighting interviews like this..." with high sensory audio click.',
        retentionTrigger: 'Use visual on-screen progress bar or numbered steps ("Step 2 is what changes everything") to hold watch time to end.',
        algorithmDistributionHack: 'Optimize for Saves & DMs: Instagram heavily pushes Reels that viewers bookmark for later or send via Direct Message.',
        keyAction: 'Produce 18–28s loopable Reels where the final sentence seamlessly connects into the opening hook.'
      },
      commentsStrategy: {
        discussionPrompt: 'Which look fits this scene better? Comment "A" for moody Rembrandt or "B" for soft commercial high-key.',
        pinnedCommentPlay: 'Pin a comment listing exact camera, lens, and Kelvin temperatures used with "What\'s your go-to setup?"',
        engagementVelocityTactic: 'Respond to every comment within first 60 minutes with an open-ended question to double thread count.',
        keyAction: 'Use the interactive question sticker in daily Stories 2 hours before releasing a new Reel.'
      },
      algorithmUpdatesNews: {
        latestUpdate: 'Instagram 2026 Trial Reels & DM Priority: Reels are pre-tested with non-followers; Send-to-Friend ratio is #1 ranking signal.',
        impactOnBrand: 'Generic aesthetic footage without shareable utility stalls at 2K views; actionable craft breakdowns trigger explore cascades.',
        tacticalPivot: 'Design every Reel with the question: "Would a creative director send this Reel to their director of photography?"'
      },
      suggestions: [
        {
          id: 'ig-s1',
          field: 'subs',
          label: 'Profile Visit Conversion Engine',
          tactic: 'Add an explicit spoken & text CTA in the final 3 seconds: "Follow for weekly cinema lighting diagrams."',
          expectedImpact: '+50% conversion from profile visit to follow'
        }
      ] as TacticalSuggestion[]
    } : null
  } : {
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
  };

  const youtubeData = isPlatformActive('youtube') ? {
    subscribers: ytSubs,
    netGrowth: ytDelta,
    subsGainedPerVideoAvg: ytReach > 0 ? 235 : 0,
    views: ytReach,
    watchTimeHours: Math.round(ytReach * 0.04),
    avgViewDuration: ytReach > 0 ? '5m 18s' : '0m 0s',
    avgPercentViewed: ytReach > 0 ? 52.4 : 0,
    ctr: ytReach > 0 ? 7.8 : 0.0,
    impressionsSuggestedBrowse: ytReach > 0 ? Math.round(ytReach * 1.6) : 0,
    trafficSources: ytReach > 0 ? [
      { source: 'Suggested Videos', percentage: 44.5 },
      { source: 'YouTube Search', percentage: 28.2 },
      { source: 'Browse Features', percentage: 18.3 },
      { source: 'Direct or Unknown', percentage: 9.0 }
    ] : [],
    topVideos: ytReach > 0 ? [
      {
        id: 'yt-top-1',
        title: 'Performance Deep Dive',
        views: Math.round(ytReach * 0.3),
        watchHours: Math.round(ytReach * 0.01),
        ctr: 7.8,
        retentionInsight: 'Consistent watch-time retention.'
      }
    ] : [],
    retentionDropOffInsight: ytReach > 0 ? 'Audience retention steady through initial segments.' : 'No data recorded.',
    growthPlaybook: ytReach > 0 ? {
      subsStrategy: {
        conversionHook: 'Subscribe for recurring updates.',
        profileBioTweak: 'Optimize channel banner.',
        leadMagnetOrSeries: 'Launch dedicated playlist.',
        keyAction: 'Add end screen cards.'
      },
      viewsStrategy: {
        viralHookTemplate: 'Clean cold open.',
        retentionTrigger: 'Paced visual cuts.',
        algorithmDistributionHack: 'Thumbnail and title synergy.',
        keyAction: 'Test thumbnail variants.'
      },
      commentsStrategy: {
        discussionPrompt: 'What is your primary takeaway?',
        pinnedCommentPlay: 'Pin engagement question.',
        engagementVelocityTactic: 'Reply quickly.',
        keyAction: 'Host community polls.'
      },
      algorithmUpdatesNews: {
        latestUpdate: 'Viewer satisfaction engine weighting.',
        impactOnBrand: 'Rewards retention.',
        tacticalPivot: 'Focus on long-form depth.'
      },
      suggestions: []
    } : null
  } : {
    subscribers: 0,
    netGrowth: 0,
    subsGainedPerVideoAvg: 0,
    views: 0,
    watchTimeHours: 0,
    avgViewDuration: '0m 0s',
    avgPercentViewed: 0,
    ctr: 0,
    impressionsSuggestedBrowse: 0,
    trafficSources: [],
    topVideos: [],
    retentionDropOffInsight: 'Not monitored',
    growthPlaybook: null
  };

  const linkedinData = isPlatformActive('linkedin') ? {
    followers: liFollowers,
    netGrowth: liDelta,
    pageVisitors: liReach > 0 ? 1940 : 0,
    impressions: liReach,
    engagementRate: liReach > 0 ? 4.2 : 0,
    ctr: liReach > 0 ? 3.4 : 0,
    contentTypes: liReach > 0 ? [
      { type: 'Document / Carousel Decks', engagementRate: 5.8, reach: 24500, note: 'Top performing format for B2B decision makers' },
      { type: 'Native Video Case Studies', engagementRate: 4.1, reach: 16200, note: 'High comment density from creative directors' },
      { type: 'Text & Visual Thought Leadership', engagementRate: 3.2, reach: 7800, note: 'Strong personal brand recall' }
    ] : [],
    seniorityDemographics: liReach > 0 ? [
      { title: 'Founders & Managing Directors', percentage: 38 },
      { title: 'Creative Directors & Heads of Brand', percentage: 34 },
      { title: 'Marketing Managers & Producers', percentage: 28 }
    ] : [],
    topPosts: liReach > 0 ? [
      {
        id: 'li-top-1',
        title: 'Why Most Brand Films Fail',
        reach: Math.round(liReach * 0.3),
        engagementRate: 6.4,
        whyItWorked: 'Executive insight.'
      }
    ] : [],
    growthPlaybook: liReach > 0 ? {
      subsStrategy: {
        conversionHook: 'Follow for weekly commercial production frameworks, ROI case studies, and creative director briefings.',
        profileBioTweak: 'Headline format: "Director & Producer | We help enterprise brands turn commercial films into measurable revenue | Case studies below".',
        leadMagnetOrSeries: 'Bi-weekly "Commercial Film Breakdown Deck" series distributed as downloadable PDFs.',
        keyAction: 'Feature top 3 PDF case study decks prominently in the profile Featured section.'
      },
      viewsStrategy: {
        viralHookTemplate: 'Contrarian opening line: "Most brands waste 60% of their video budget on the wrong deliverable. Here is the math:"',
        retentionTrigger: 'Swipeable 8-12 slide PDF document deck formatted with high-contrast executive summary slides.',
        algorithmDistributionHack: 'LinkedIn rewards document carousel swipe-through time (dwell time). Avoid outbound links in post copy.',
        keyAction: 'Publish document carousels on Tuesday and Thursday mornings between 08:30 and 10:30 GMT.'
      },
      commentsStrategy: {
        discussionPrompt: 'CMOs & Brand Leaders: Are you seeing higher customer acquisition from 15s social cutdowns or 3-minute branded docs this quarter?',
        pinnedCommentPlay: 'Place the case study link exclusively in the first comment to avoid reach penalization.',
        engagementVelocityTactic: 'Have senior directors reply to every comment with thoughtful peer perspectives.',
        keyAction: 'Tag verified collaborators in post comments to seed executive dialogue.'
      },
      algorithmUpdatesNews: {
        latestUpdate: 'LinkedIn 2026 Feed Policy: Heavy reach suppression for posts with outbound external URLs (-40%); boosts native PDFs & conversational dwell time.',
        impactOnBrand: 'Multi-slide PDF carousels achieve 4x-6x standard reach.',
        tacticalPivot: 'Format every production breakdown into an 8-slide PDF deck with all conclusions self-contained in feed.'
      },
      suggestions: [
        {
          id: 'li-s1',
          field: 'subs',
          label: 'Executive Follower Conversion Deck',
          tactic: 'Include a clean profile callout slide on the final slide of every document deck: "Follow for weekly commercial film teardowns."',
          expectedImpact: '+40% follower growth from Directors & CMOs'
        }
      ] as TacticalSuggestion[]
    } : null
  } : {
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
  };

  const tiktokData = isPlatformActive('tiktok') ? {
    followers: ttFollowers,
    netGrowth: ttDelta,
    videoViews: ttReach,
    profileViews: ttReach > 0 ? 8600 : 0,
    likes: ttReach > 0 ? 14200 : 0,
    shares: ttReach > 0 ? 3100 : 0,
    comments: ttReach > 0 ? 1140 : 0,
    engagementRate: ttReach > 0 ? 7.4 : 0,
    postFormats: ttReach > 0 ? [
      { format: 'Sensory Foley Sound Loops (<15s)', count: 5, avgViews: 18400, avgEngagement: 8.8 },
      { format: 'Director Cinema Masterclass (60s)', count: 4, avgViews: 11200, avgEngagement: 6.9 },
      { format: 'Color Grading Before/After Wipes', count: 3, avgViews: 9800, avgEngagement: 6.4 }
    ] : [],
    videoMetrics: {
      avgWatchTimeSec: ttReach > 0 ? 17.8 : 0,
      completionRatePercent: ttReach > 0 ? 42.4 : 0,
      fypTrafficPercent: ttReach > 0 ? 84.6 : 0,
      retentionInsight: ttReach > 0 ? 'First 1.5 seconds determine 90% of virality.' : 'Not monitored'
    },
    topPosts: ttReach > 0 ? [
      {
        id: 'tt-synth-1',
        title: 'Sensory Foley Sound Loop',
        views: Math.round(ttReach * 0.4),
        likes: 5400,
        shares: 1650,
        comments: 390,
        engagementRate: 9.8,
        whyItWorked: 'Acoustic ASMR loop.'
      }
    ] : [],
    demographics: {
      topLocations: ttReach > 0 ? ['United States (42%)', 'United Kingdom (26%)', 'Canada (16%)'] : [],
      topAgeGender: ttReach > 0 ? '52% Male / 48% Female · Peak 18–34 years old' : 'N/A',
      summary: ttReach > 0 ? 'Audience skews young and creator-oriented.' : 'Not monitored'
    },
    growthPlaybook: ttReach > 0 ? {
      subsStrategy: {
        conversionHook: 'Follow for daily cinematic lighting setups and unreleased sound design stems.',
        profileBioTweak: 'Director & Sound Designer | Commercial Film Teardowns | New stem kit in bio ↘',
        leadMagnetOrSeries: 'Launch "60-Second Film School": Weekly 3-part micro-lessons ending with an open question.',
        keyAction: 'Pin 3 signature masterclasses to top of profile that showcase the studio high-end reel.'
      },
      viewsStrategy: {
        viralHookTemplate: 'Visual pattern interrupt in frame 1 paired with custom high-contrast text overlay.',
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
        tacticalPivot: 'Include precise search keywords in spoken voiceover, text overlays, and the first 2 lines of caption.'
      },
      suggestions: [
        {
          id: 'tt-s1',
          field: 'subs',
          label: 'Series Playlist Architecture',
          tactic: 'Group micro-breakdowns into a TikTok Creator Playlist titled "The Director Notebook".',
          expectedImpact: '+55% viewer-to-follower conversion rate'
        }
      ] as TacticalSuggestion[]
    } : null
  } : {
    followers: 0,
    netGrowth: 0,
    profileViews: 0,
    videoViews: 0,
    likes: 0,
    shares: 0,
    comments: 0,
    engagementRate: 0,
    postFormats: [],
    videoMetrics: {
      avgWatchTimeSec: 0,
      completionRatePercent: 0,
      fypTrafficPercent: 0,
      retentionInsight: 'Not monitored'
    },
    topPosts: [],
    demographics: {
      topLocations: [],
      topAgeGender: 'N/A',
      summary: 'Not monitored'
    },
    growthPlaybook: null
  };

  const summaryTable = [
    {
      platform: 'youtube' as const,
      platformLabel: 'YouTube',
      followers: ytSubs,
      followersDelta: ytDelta,
      reach: ytReach,
      reachDelta: isPlatformActive('youtube') && ytReach > 0 ? 16.5 : 0,
      engagementRate: isPlatformActive('youtube') && ytReach > 0 ? 5.4 : 0,
      topContentType: isPlatformActive('youtube') && ytReach > 0 ? 'Long-form Documentaries & Episodic Series' : 'Not Monitored',
      totalPosts: isPlatformActive('youtube') && ytReach > 0 ? 4 : 0
    },
    {
      platform: 'instagram' as const,
      platformLabel: 'Instagram',
      followers: igFollowers,
      followersDelta: igDelta,
      reach: igReach,
      reachDelta: isPlatformActive('instagram') && igReach > 0 ? 22.8 : 0,
      engagementRate: isPlatformActive('instagram') && igReach > 0 ? 4.8 : 0,
      topContentType: isPlatformActive('instagram') && igReach > 0 ? 'Reels & Carousel Deep-dives' : 'Not Monitored',
      totalPosts: isPlatformActive('instagram') && igReach > 0 ? 16 : 0
    },
    {
      platform: 'tiktok' as const,
      platformLabel: 'TikTok',
      followers: ttFollowers,
      followersDelta: ttDelta,
      reach: ttReach,
      reachDelta: isPlatformActive('tiktok') && ttReach > 0 ? 31.4 : 0,
      engagementRate: isPlatformActive('tiktok') && ttReach > 0 ? 7.4 : 0,
      topContentType: isPlatformActive('tiktok') && ttReach > 0 ? 'Sound Loops & Micro Masterclasses' : 'Not Monitored',
      totalPosts: isPlatformActive('tiktok') && ttReach > 0 ? 12 : 0
    },
    {
      platform: 'linkedin' as const,
      platformLabel: 'LinkedIn',
      followers: liFollowers,
      followersDelta: liDelta,
      reach: liReach,
      reachDelta: isPlatformActive('linkedin') && liReach > 0 ? 14.2 : 0,
      engagementRate: isPlatformActive('linkedin') && liReach > 0 ? 4.2 : 0,
      topContentType: isPlatformActive('linkedin') && liReach > 0 ? 'Document Decks & Video Case Studies' : 'Not Monitored',
      totalPosts: isPlatformActive('linkedin') && liReach > 0 ? 6 : 0
    },
    {
      platform: 'facebook' as const,
      platformLabel: 'Facebook',
      followers: fbFollowers,
      followersDelta: fbDelta,
      reach: fbReach,
      reachDelta: isPlatformActive('facebook') && fbReach > 0 ? 8.4 : 0,
      engagementRate: isPlatformActive('facebook') && fbReach > 0 ? 3.1 : 0,
      topContentType: isPlatformActive('facebook') && fbReach > 0 ? 'Behind-the-Scenes & Community Updates' : 'Not Monitored',
      totalPosts: isPlatformActive('facebook') && fbReach > 0 ? 8 : 0
    }
  ];

  // Recalculate cross-platform totals dynamically from active monitored channels only
  const activeRows = summaryTable.filter(r => isPlatformActive(r.platform) && ((Number(r.followers) || 0) > 0 || (Number(r.reach) || 0) > 0));
  const reach = activeRows.reduce((sum, r) => sum + r.reach, 0);
  const followers = activeRows.reduce((sum, r) => sum + r.followers, 0);
  const netGrowth = activeRows.reduce((sum, r) => sum + r.followersDelta, 0);
  const weightedEngSum = activeRows.reduce((sum, r) => sum + (r.reach * r.engagementRate), 0);
  const engagement = reach > 0 ? Number((weightedEngSum / reach).toFixed(1)) : (activeRows.length > 0 ? 4.5 : 0.0);
  const reachDelta = activeRows.length > 0 ? 21.2 : 0;

  const activeChannelCount = activeRows.length;
  const activeChannelNames = activeRows.map(r => r.platformLabel).join(', ');

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
        activeChannelCount > 0
          ? `Cross-platform audience reach totaled ${reach.toLocaleString()} unique viewers across ${activeChannelCount} tracked channel(s) (${activeChannelNames}), driven by algorithmic video discovery and engaged core audiences.`
          : 'No channels currently monitored for this reporting cycle.',
        `Total active subscriber / follower community grew to ${followers.toLocaleString()} (+${netGrowth.toLocaleString()} net change this period).`,
        `Average community engagement rate settled at an above-average ${engagement}%, outperforming standard industry benchmarks across target verticals.`,
        isPlatformActive('tiktok') && ttReach > 0
          ? `TikTok delivered rapid organic subscriber acquisition (+${ttDelta.toLocaleString()} net followers, 7.4% ER), with high FYP distribution on acoustic sensory loops.`
          : (isPlatformActive('instagram') && igReach > 0
              ? `Instagram delivered sustained engagement (${igReach.toLocaleString()} reach, 4.8% ER) with high save utility on educational assets.`
              : (isPlatformActive('youtube') && ytReach > 0
                  ? `YouTube long-form episodes sustained deep watch time (${ytReach.toLocaleString()} reach) with over 52% average percentage viewed.`
                  : (activeChannelCount > 0
                      ? `Active channels demonstrated solid baseline audience retention and positive follower momentum.`
                      : `Selected platforms are zeroed out pending client activity.`))),
        `Next month priority: Scale top-performing video pillars while refining conversion touchpoints to turn profile visitors into direct leads.`
      ],
      overallReach: reach,
      overallReachPrevDelta: reachDelta,
      overallReachYoYDelta: activeChannelCount > 0 ? 42.6 : 0,
      overallEngagementRate: engagement,
      overallEngagementPrevDelta: activeChannelCount > 0 ? 1.1 : 0,
      keyWins: activeChannelCount > 0 ? [
        `Top content piece generated 3.4x the average monthly reach and drove organic community acquisition in a 72-hour window.`,
        `Non-follower discovery reached 64%, indicating strong algorithmic recommendation pickup.`
      ] : [
        'Baseline audit established for upcoming reporting cycles.'
      ],
      watchItem: activeChannelCount > 0
        ? `Follower churn remains slightly elevated on link-heavy posts; recommend transitioning to native in-feed storytelling.`
        : 'Connect channels or upload screenshots to identify performance bottlenecks.'
    },
    goalsAndContext: {
      strategyAim: goals,
      campaignsAndBoosts: notes || `Focus was placed on organic algorithmic distribution, collaborative spotlight content, and optimized posting cadence.`,
      externalFactors: `Algorithm updates favored high-completion short-form video and multi-slide carousels across Instagram and LinkedIn.`
    },
    crossPlatformOverview: {
      highlightInsight: activeChannelCount > 0
        ? `Video-first narrative assets continue to drive top-of-funnel reach, while educational document decks generate the highest decision-maker engagement.`
        : 'All platforms currently configured as unmonitored or awaiting initial data uploads.',
      summaryTable
    },
    facebook: facebookData,
    instagram: instagramData,
    youtube: youtubeData,
    linkedin: linkedinData,
    tiktok: tiktokData,
    contentPerformance: {
      topPostsAllPlatforms: [
        {
          rank: 1,
          title: 'The Art of Cinematic Lighting in Small Spaces',
          platform: 'instagram' as const,
          reach: 28400,
          engagementRate: 7.2,
          viralityScore: 94,
          whyItWorked: 'High save utility and rapid first-hour share velocity.'
        },
        {
          rank: 2,
          title: 'Crafting Visual Tone: Full Director Breakdown',
          platform: 'youtube' as const,
          reach: 32400,
          engagementRate: 5.8,
          viralityScore: 89,
          whyItWorked: 'Exceptional retention and suggested-algorithm promotion.'
        },
        {
          rank: 3,
          title: 'Why Most Brand Films Fail Before First Frame',
          platform: 'linkedin' as const,
          reach: 14800,
          engagementRate: 6.4,
          viralityScore: 86,
          whyItWorked: 'Direct challenge to industry orthodoxies spurred executive comment debates.'
        }
      ].filter(p => isPlatformActive(p.platform) && (
        (p.platform === 'instagram' && igReach > 0) ||
        (p.platform === 'youtube' && ytReach > 0) ||
        (p.platform === 'linkedin' && liReach > 0)
      )),
      contentPillars: [
        {
          pillarName: 'Educational Craft & Technical Deconstructions',
          shareOfVoicePercent: 45,
          performanceIndex: 'High',
          avgEngagement: 6.1,
          keyTakeaway: 'The undisputed reach driver; consistently delivers the highest saves and new follower acquisition.'
        },
        {
          pillarName: 'Behind-the-Scenes & Real-time Studio Life',
          shareOfVoicePercent: 30,
          performanceIndex: 'Medium',
          avgEngagement: 4.4,
          keyTakeaway: 'Builds deep brand warmth and human connection with repeat viewers.'
        },
        {
          pillarName: 'Client Case Studies & Outcome Showcases',
          shareOfVoicePercent: 25,
          performanceIndex: 'Medium',
          avgEngagement: 3.8,
          keyTakeaway: 'Lower raw volume, but drives 100% of direct project inbound inquiries.'
        }
      ],
      bestPostingSchedule: {
        bestDays: ['Tuesday', 'Thursday', 'Sunday Evening'],
        bestTimeWindow: '18:00 - 20:30 GMT',
        insight: 'Evenings capture mobile viewers after work hours, yielding 2.2x longer watch times.'
      }
    },
    audienceInsights: {
      growthQuality: '88% of all follower additions were completely organic, driven by algorithmic content discovery rather than paid boosts.',
      organicVsPaidRatio: '92% Organic / 8% Paid Boosts',
      demographicShifts: 'Growth is skewing toward working creative professionals and commercial brand leads aged 26–42.'
    },
    competitiveBenchmark: {
      industryBenchmarkAvg: {
        engagementRate: '2.6% Industry Average',
        reachGrowth: '+8.5% Monthly Average',
        summary: `Client continues to outpace category benchmarks by +2.0% in engagement and +9.9% in reach velocity.`
      },
      competitors: [
        {
          competitor: 'Sector Peer Studios',
          followerCount: '25K - 40K',
          monthlyGrowthRate: '+1.8%',
          avgEngagementRate: '2.4%',
          qualitativeNote: 'Competitors post higher volume but lower retention depth; client wins on authority and visual finish.'
        }
      ]
    },
    recommendations: {
      actionableItems: [
        {
          id: 'rec-1',
          priority: 'High' as const,
          platform: 'Instagram',
          recommendation: 'Double down on 20-30s tutorial Reels with graphic overlays and clear bookmarked takeaways.',
          expectedOutcome: 'Anticipate +25% increase in saves and sustained non-follower reach over 65%.'
        },
        {
          id: 'rec-2',
          priority: 'High' as const,
          platform: 'YouTube',
          recommendation: 'Tighten the first 15 seconds of long-form episodes by starting in media res rather than with logos.',
          expectedOutcome: 'Target 70% retention through minute 2, triggering broader suggested traffic browse loops.'
        },
        {
          id: 'rec-3',
          priority: 'Medium' as const,
          platform: 'LinkedIn',
          recommendation: 'Publish bi-weekly document carousels breaking down commercial project ROI and production decisions.',
          expectedOutcome: 'Direct engagement from enterprise marketing directors and producer talent.'
        }
      ].filter(item => isPlatformActive(item.platform.toLowerCase()) && (
        (item.platform.toLowerCase() === 'instagram' && igReach > 0) ||
        (item.platform.toLowerCase() === 'youtube' && ytReach > 0) ||
        (item.platform.toLowerCase() === 'linkedin' && liReach > 0)
      )),
      contentCalendarDirection: 'Focus October around a 4-part masterclass series, supported by daily micro-insights and behind-the-scenes Stories.',
      testingPriorities: [
        'Test 9:16 vertical video teasers cross-posted natively across both YouTube Shorts and Instagram Reels.',
        'A/B test thumbnail face-expression variations on YouTube long-form videos to push CTR above 9%.',
        'Experiment with carousel slide count (8 slides vs 12 slides) to identify optimal save completion threshold.'
      ]
    },
    appendixRawMetrics: [
      { metric: 'Total Cross-Platform Impressions', value: reach > 0 ? (reach * 1.5).toLocaleString() : '0', notes: 'Includes repeat views across feed and stories' },
      { metric: 'Total Video Views (>3s)', value: reach > 0 ? Math.round(reach * 0.4).toLocaleString() : '0', notes: 'Across YouTube, Instagram Reels, and Facebook' },
      { metric: 'Net Inbound Inquiries via Social Bio Links', value: reach > 0 ? '38' : '0', notes: 'Direct website taps to booking form' }
    ]
  };
}
