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

  // Platform specific base numbers, allowing explicit override from user-verified knownMetrics
  const ytSubs = known.youtubeSubscribers ? Number(known.youtubeSubscribers) : (isPlatformActive('youtube') ? 18400 : 0);
  const ytDelta = known.youtubeNetGrowth ? Number(known.youtubeNetGrowth) : (isPlatformActive('youtube') ? 940 : 0);
  const ytReach = known.youtubeReach ? Number(known.youtubeReach) : (isPlatformActive('youtube') ? 114000 : 0);

  const igFollowers = known.instagramFollowers ? Number(known.instagramFollowers) : (isPlatformActive('instagram') ? 16800 : 0);
  const igDelta = known.instagramNetGrowth ? Number(known.instagramNetGrowth) : (isPlatformActive('instagram') ? 820 : 0);
  const igReach = known.instagramReach ? Number(known.instagramReach) : (isPlatformActive('instagram') ? 89000 : 0);

  const ttFollowers = known.tiktokFollowers ? Number(known.tiktokFollowers) : (isPlatformActive('tiktok') ? 12400 : 0);
  const ttDelta = known.tiktokNetGrowth ? Number(known.tiktokNetGrowth) : (isPlatformActive('tiktok') ? 1850 : 0);
  const ttReach = known.tiktokReach ? Number(known.tiktokReach) : (isPlatformActive('tiktok') ? 94200 : 0);

  const liFollowers = known.linkedinFollowers ? Number(known.linkedinFollowers) : (isPlatformActive('linkedin') ? 7800 : 0);
  const liDelta = known.linkedinNetGrowth ? Number(known.linkedinNetGrowth) : (isPlatformActive('linkedin') ? 410 : 0);
  const liReach = known.linkedinReach ? Number(known.linkedinReach) : (isPlatformActive('linkedin') ? 48500 : 0);

  const fbFollowers = known.facebookFollowers ? Number(known.facebookFollowers) : (isPlatformActive('facebook') ? 5200 : 0);
  const fbDelta = known.facebookNetGrowth ? Number(known.facebookNetGrowth) : (isPlatformActive('facebook') ? 120 : 0);
  const fbReach = known.facebookReach ? Number(known.facebookReach) : (isPlatformActive('facebook') ? 33900 : 0);

  const summaryTable = [
    {
      platform: 'youtube' as const,
      platformLabel: 'YouTube',
      followers: ytSubs,
      followersDelta: ytDelta,
      reach: ytReach,
      reachDelta: isPlatformActive('youtube') ? 16.5 : 0,
      engagementRate: isPlatformActive('youtube') ? 5.4 : 0,
      topContentType: isPlatformActive('youtube') ? 'Long-form Documentaries & Episodic Series' : 'Not Monitored',
      totalPosts: isPlatformActive('youtube') ? 4 : 0
    },
    {
      platform: 'instagram' as const,
      platformLabel: 'Instagram',
      followers: igFollowers,
      followersDelta: igDelta,
      reach: igReach,
      reachDelta: isPlatformActive('instagram') ? 22.8 : 0,
      engagementRate: isPlatformActive('instagram') ? 4.8 : 0,
      topContentType: isPlatformActive('instagram') ? 'Cinematic Reels & Multi-Slide Carousels' : 'Not Monitored',
      totalPosts: isPlatformActive('instagram') ? 16 : 0
    },
    {
      platform: 'linkedin' as const,
      platformLabel: 'LinkedIn',
      followers: liFollowers,
      followersDelta: liDelta,
      reach: liReach,
      reachDelta: isPlatformActive('linkedin') ? 14.2 : 0,
      engagementRate: isPlatformActive('linkedin') ? 4.2 : 0,
      topContentType: isPlatformActive('linkedin') ? 'PDF Strategy Decks & Founder Perspectives' : 'Not Monitored',
      totalPosts: isPlatformActive('linkedin') ? 12 : 0
    },
    {
      platform: 'facebook' as const,
      platformLabel: 'Facebook',
      followers: fbFollowers,
      followersDelta: fbDelta,
      reach: fbReach,
      reachDelta: isPlatformActive('facebook') ? 8.4 : 0,
      engagementRate: isPlatformActive('facebook') ? 3.1 : 0,
      topContentType: isPlatformActive('facebook') ? 'Behind-the-Scenes & Community Updates' : 'Not Monitored',
      totalPosts: isPlatformActive('facebook') ? 8 : 0
    },
    {
      platform: 'tiktok' as const,
      platformLabel: 'TikTok',
      followers: ttFollowers,
      followersDelta: ttDelta,
      reach: ttReach,
      reachDelta: isPlatformActive('tiktok') ? 31.4 : 0,
      engagementRate: isPlatformActive('tiktok') ? 7.4 : 0,
      topContentType: isPlatformActive('tiktok') ? 'Sensory Clips & Sound Design ASMR' : 'Not Monitored',
      totalPosts: isPlatformActive('tiktok') ? 12 : 0
    }
  ];

  // Mathematically compute exact totals across active platforms
  const activeRows = summaryTable.filter((r) => isPlatformActive(r.platform));
  const reach = activeRows.reduce((sum, r) => sum + r.reach, 0);
  const followers = activeRows.reduce((sum, r) => sum + r.followers, 0);
  const netGrowth = activeRows.reduce((sum, r) => sum + r.followersDelta, 0);
  const weightedEngSum = activeRows.reduce((sum, r) => sum + (r.reach * r.engagementRate), 0);
  const engagement = reach > 0 ? Number((weightedEngSum / reach).toFixed(1)) : 5.2;
  const reachDelta = 21.2;

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
        `Cross-platform audience reach totaled ${reach.toLocaleString()} unique viewers across ${activeChannelCount} tracked channel(s) (${activeChannelNames}), driven by algorithmic video discovery and engaged core audiences.`,
        `Total active subscriber / follower community grew to ${followers.toLocaleString()} (+${netGrowth.toLocaleString()} net change this period).`,
        `Average community engagement rate settled at an above-average ${engagement}%, outperforming standard industry benchmarks across target verticals.`,
        isPlatformActive('tiktok')
          ? `TikTok delivered rapid organic subscriber acquisition (+${ttDelta.toLocaleString()} net followers, 7.4% ER), with high FYP distribution on acoustic sensory loops.`
          : `Top performing format delivered 2.8x average baseline reach and drove strong organic community expansion.`,
        `Next month priority: Scale top-performing video pillars while refining conversion touchpoints to turn profile visitors into direct leads.`
      ],
      overallReach: reach,
      overallReachPrevDelta: reachDelta,
      overallReachYoYDelta: 42.6,
      overallEngagementRate: engagement,
      overallEngagementPrevDelta: 1.1,
      keyWins: [
        `Top content piece generated 3.4x the average monthly reach and drove 480+ new organic followers in a 72-hour window.`,
        `Non-follower discovery reached 64%, indicating strong algorithmic recommendation pickup.`
      ],
      watchItem: `Follower churn remains slightly elevated on link-heavy posts; recommend transitioning to native in-feed storytelling.`
    },
    goalsAndContext: {
      strategyAim: goals,
      campaignsAndBoosts: notes || `Focus was placed on organic algorithmic distribution, collaborative spotlight content, and optimized posting cadence.`,
      externalFactors: `Algorithm updates favored high-completion short-form video and multi-slide carousels across Instagram and LinkedIn.`
    },
    crossPlatformOverview: {
      highlightInsight: `Video-first narrative assets continue to drive top-of-funnel reach, while educational document decks generate the highest decision-maker engagement.`,
      summaryTable
    },
    facebook: {
      followers: fbFollowers,
      netGrowth: fbDelta,
      reachOrganic: fbReach > 4100 ? fbReach - 4100 : fbReach,
      reachPaid: isPlatformActive('facebook') ? 4100 : 0,
      engagementRate: isPlatformActive('facebook') ? 3.1 : 0,
      postFormats: [
        { format: 'Native Video / Reels', count: isPlatformActive('facebook') ? 4 : 0, avgReach: isPlatformActive('facebook') ? 5200 : 0, avgEngagement: 3.8 },
        { format: 'Photos & Behind-the-Scenes', count: isPlatformActive('facebook') ? 3 : 0, avgReach: isPlatformActive('facebook') ? 2400 : 0, avgEngagement: 2.9 },
        { format: 'Articles & Community Links', count: isPlatformActive('facebook') ? 1 : 0, avgReach: isPlatformActive('facebook') ? 1100 : 0, avgEngagement: 1.6 }
      ],
      videoMetrics: {
        views: isPlatformActive('facebook') ? 18200 : 0,
        avgWatchTimeSec: 26,
        retention3SecPercent: 54.2,
        retention1MinPercent: 28.5,
        commentary: 'Retention holds remarkably well through the initial 30 seconds when visual movement starts immediately.'
      },
      topPosts: [
        {
          id: 'fb-top-1',
          title: 'Behind the Scenes: Production Spotlight',
          date: 'Sep 14',
          reach: 8400,
          engagementRate: 4.2,
          shares: 48,
          whyItWorked: 'Authentic craft documentation created high shareability among industry peers.'
        }
      ],
      demographics: {
        topLocations: ['United Kingdom', 'United States', 'South Africa', 'Australia'],
        topAgeGender: '52% Female / 48% Male · Dominant age cohort 25–44',
        summary: 'Solid core of loyal returning community members with strong commentary engagement.'
      },
      growthPlaybook: {
        subsStrategy: {
          conversionHook: 'Follow our Page for monthly cinematic documentaries and behind-the-scenes filmmaking masterclasses.',
          profileBioTweak: 'Streamline Page About section to highlight award credentials and embed direct WhatsApp / Messenger booking button.',
          leadMagnetOrSeries: 'Bi-weekly "Director Archive" video clips featuring restored vintage & modern commercial film breakdowns.',
          keyAction: 'Pin highest-reach commercial teaser with an explicit "Follow for Episode 2" call-to-action.'
        },
        viewsStrategy: {
          viralHookTemplate: 'Immediate visual movement in 0:00-0:02 with large burned-in yellow subtitles for muted mobile feeds.',
          retentionTrigger: 'Re-hook narrative at 0:25 by introducing unexpected behind-the-scenes filming dilemma.',
          algorithmDistributionHack: 'Always upload native high-bitrate video directly to Meta Creator Studio—never post external YouTube links.',
          keyAction: 'Format all Facebook video exports in 4:5 or 9:16 aspect ratio to maximize screen real estate in mobile feeds.'
        },
        commentsStrategy: {
          discussionPrompt: 'Filmmakers & Cinephiles: Would you shoot this scene with practical lights or push ISO in post? Tell us why below.',
          pinnedCommentPlay: 'Pin a follow-up question asking viewers to vote on which camera package they prefer for indie docs.',
          engagementVelocityTactic: 'Have page admins respond with thoughtful multi-sentence replies within first 45 minutes.',
          keyAction: 'Tag production collaborators and equipment manufacturers directly in body copy to seed discussion.'
        },
        algorithmUpdatesNews: {
          latestUpdate: 'Meta 2026 Feed Shift: Algorithm heavily prioritizes original video exceeding 1-minute watch duration in recommended feeds.',
          impactOnBrand: 'Short link snippets and photo posts receive under 3% organic reach; native episodic videos receive up to 6x distribution.',
          tacticalPivot: 'Repurpose long-form documentary chapters into 90-second native Facebook stories with narrative payoff.'
        },
        suggestions: ([
          {
            id: 'fb-s1',
            field: 'subs',
            label: 'Page Follow Conversion Funnel',
            tactic: 'End every native video with a 4-second motion graphic showing where to tap "Follow" for the next case study.',
            expectedImpact: '+35% net page follower growth MoM'
          },
          {
            id: 'fb-s2',
            field: 'views',
            label: 'Native Video Feed Maximizer',
            tactic: 'Hardcode dynamic animated subtitles and high-contrast color grades for muted autoplay feeds.',
            expectedImpact: '+40% 1-minute retention rate'
          },
          {
            id: 'fb-s3',
            field: 'comments',
            label: 'Debate Catalyst Hook',
            tactic: 'Pose polarizing production craft trade-offs in post captions (e.g. Vintage Anamorphic glass vs Modern High-Res sensors).',
            expectedImpact: '3x higher comment count on native video posts'
          }
        ] as TacticalSuggestion[])
      }
    },
    instagram: {
      followers: igFollowers,
      netGrowth: igDelta,
      followUnfollowRatio: isPlatformActive('instagram') ? '4.1:1 (1,080 follows / 260 unfollows)' : 'N/A',
      reach: igReach,
      impressions: isPlatformActive('instagram') ? Math.round(igReach * 1.6) : 0,
      profileVisits: isPlatformActive('instagram') ? 3840 : 0,
      websiteTaps: isPlatformActive('instagram') ? 410 : 0,
      formatSplit: [
        { format: 'reels', formatLabel: 'Reels', count: 8, reach: 58000, shares: 920, avgWatchOrSave: '18.4s avg / 740 saves' },
        { format: 'carousels', formatLabel: 'Carousels', count: 5, reach: 24000, shares: 380, avgWatchOrSave: '5.2s per slide' },
        { format: 'feed', formatLabel: 'Single Images', count: 3, reach: 7000, shares: 95, avgWatchOrSave: 'Strong likes' },
        { format: 'stories', formatLabel: 'Stories', count: 28, reach: 3400, shares: 42, avgWatchOrSave: '82% completion rate' }
      ],
      storyCompletionRate: 82.4,
      nonFollowerDiscoveryRate: 64.8,
      topPosts: [
        {
          id: 'ig-top-1',
          title: 'The Art of Cinematic Lighting in Small Spaces',
          format: 'Reel',
          reach: 28400,
          engagementRate: 7.2,
          saves: 1140,
          shares: 520,
          whyItWorked: 'High save utility: viewers bookmarked the setup diagram for personal reference.'
        },
        {
          id: 'ig-top-2',
          title: '5 Lessons from 30 Days in the Editing Suite',
          format: 'Carousel',
          reach: 14200,
          engagementRate: 5.6,
          saves: 480,
          shares: 190,
          whyItWorked: 'Paced carousel storytelling encouraged 88% slide-through rate.'
        }
      ],
      growthPlaybook: {
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
        suggestions: ([
          {
            id: 'ig-s1',
            field: 'subs',
            label: 'Profile Visit Conversion Engine',
            tactic: 'Add an explicit spoken & text CTA in the final 3 seconds: "Follow for weekly cinema lighting diagrams."',
            expectedImpact: '+50% conversion from profile visit to follow'
          },
          {
            id: 'ig-s2',
            field: 'views',
            label: 'DM Share & Save Multiplier',
            tactic: 'Include a 2-second technical breakdown graphic at the end so viewers are compelled to pause and bookmark.',
            expectedImpact: '2.5x increase in saves and non-follower reach'
          },
          {
            id: 'ig-s3',
            field: 'comments',
            label: 'Two-Option Debate Catalyst',
            tactic: 'Show a side-by-side color grade or lighting setup and ask audience to debate the better choice in comments.',
            expectedImpact: '+80% comment volume in first 3 hours'
          },
          {
            id: 'ig-s4',
            field: 'algorithm_news',
            label: 'Trial Reels Algorithm Exploit',
            tactic: 'Upload 3 test variants with different audio hooks to let Instagram identify the best non-follower recommendation cluster.',
            expectedImpact: 'Higher probability of 50K+ explore breakout'
          }
        ] as TacticalSuggestion[])
      }
    },
    youtube: {
      subscribers: ytSubs,
      netGrowth: ytDelta,
      subsGainedPerVideoAvg: isPlatformActive('youtube') ? 235 : 0,
      views: isPlatformActive('youtube') ? 74200 : 0,
      watchTimeHours: isPlatformActive('youtube') ? 4850 : 0,
      avgViewDuration: isPlatformActive('youtube') ? '5m 18s' : '0m 0s',
      avgPercentViewed: isPlatformActive('youtube') ? 52.4 : 0,
      ctr: isPlatformActive('youtube') ? 7.8 : 0,
      impressionsSuggestedBrowse: isPlatformActive('youtube') ? 184000 : 0,
      trafficSources: [
        { source: 'Suggested Videos', percentage: 44.5 },
        { source: 'YouTube Search', percentage: 28.2 },
        { source: 'Browse Features', percentage: 18.3 },
        { source: 'Direct or Unknown', percentage: 9.0 }
      ],
      topVideos: [
        {
          id: 'yt-top-1',
          title: 'Crafting Visual Tone: Complete Breakdown',
          views: 32400,
          watchHours: 2480,
          ctr: 8.6,
          retentionInsight: '68% retention maintained past the 3-minute mark after dynamic cold open.'
        }
      ],
      retentionDropOffInsight: 'Audience dip observed at 0:45 when transitioning from hook to sponsor mention; recommended to weave sponsorship seamlessly into main narrative.',
      growthPlaybook: {
        subsStrategy: {
          conversionHook: 'Mid-roll value anchor at minute 6: "If this breakdown gave you one new production idea, subscribe for our next doc episode."',
          profileBioTweak: 'Featured video banner trailer showcasing best cinematic footage + direct subscribe link in channel description.',
          leadMagnetOrSeries: 'Episodic branded doc masterclass series with dedicated playlist for binge-watching.',
          keyAction: 'Add clear End Screen element linking to next episode playlist with verbal prompt from the narrator.'
        },
        viewsStrategy: {
          viralHookTemplate: 'Cold-open teaser: Start with the most intense 10 seconds of the film/case study before title credits.',
          retentionTrigger: 'Paced visual shifts every 4-6 seconds (B-roll, kinetic typography, grading split) to eliminate monotone talking head drops.',
          algorithmDistributionHack: 'Title + Thumbnail Synergy: Thumbnail creates the question; Title introduces the stakes; Video delivers immediate answer.',
          keyAction: 'Upload 3 thumbnail variations and use YouTube native A/B testing during the first 48 hours of release.'
        },
        commentsStrategy: {
          discussionPrompt: 'Question of the Video pinned at 0:00: "What was the most challenging scene you ever had to shoot on location? Share below."',
          pinnedCommentPlay: 'Pin a comprehensive timestamp guide with a challenge prompt inviting timestamps of viewers\' favorite frames.',
          engagementVelocityTactic: 'Dedicate the first 90 minutes post-upload to actively replying to every thoughtful comment with custom questions.',
          keyAction: 'Publish a YouTube Community Tab poll 24 hours prior to release asking audience what topic to cover in depth.'
        },
        algorithmUpdatesNews: {
          latestUpdate: 'YouTube 2026 Viewer Satisfaction Engine: YouTube heavily weights post-watch satisfaction surveys and return viewers over raw CTR.',
          impactOnBrand: 'High-clickbait thumbnails with low retention hurt channel authority; deep 15-25 min high-retention films get recommended for months.',
          tacticalPivot: 'Focus on long-tail evergreen topics with rich narrative depth to build sustainable browse feature distribution.'
        },
        suggestions: ([
          {
            id: 'yt-s1',
            field: 'subs',
            label: 'Mid-Roll Subscriber Conversion Hook',
            tactic: 'Insert a 5-second contextual subscriber trigger immediately following the biggest insight of the video.',
            expectedImpact: '+45% subscriber conversion per 1,000 views'
          },
          {
            id: 'yt-s2',
            field: 'views',
            label: 'Browse Feature Thumbnail Formula',
            tactic: 'Use high-contrast 3-element thumbnail: Human subject eye contact + intrigue object + 2-3 word bold text punchline.',
            expectedImpact: 'Push CTR from 7.8% to 9.5%+'
          },
          {
            id: 'yt-s3',
            field: 'comments',
            label: 'Community Tab Priming Engine',
            tactic: 'Run a visual poll on the Community tab 2 days before publishing to trigger subscriber feed alerts.',
            expectedImpact: '+60% first-day velocity and comment volume'
          },
          {
            id: 'yt-s4',
            field: 'algorithm_news',
            label: 'Viewer Satisfaction Chaptering',
            tactic: 'Include detailed chapter markers and descriptive titles so viewers who re-watch specific sections signal high satisfaction.',
            expectedImpact: 'Extended algorithmic evergreen shelf-life'
          }
        ] as TacticalSuggestion[])
      }
    },
    linkedin: {
      followers: liFollowers,
      netGrowth: liDelta,
      pageVisitors: isPlatformActive('linkedin') ? 1940 : 0,
      impressions: liReach,
      engagementRate: isPlatformActive('linkedin') ? 4.2 : 0,
      ctr: isPlatformActive('linkedin') ? 3.4 : 0,
      contentTypes: [
        { type: 'Document / Carousel Decks', engagementRate: 5.8, reach: 24500, note: 'Top performing format for B2B decision makers' },
        { type: 'Native Video Case Studies', engagementRate: 4.1, reach: 16200, note: 'High comment density from creative directors' },
        { type: 'Text & Visual Thought Leadership', engagementRate: 3.2, reach: 7800, note: 'Strong personal brand recall' }
      ],
      seniorityDemographics: [
        { title: 'Founders & Managing Directors', percentage: 38 },
        { title: 'Creative Directors & Heads of Brand', percentage: 34 },
        { title: 'Marketing Managers & Producers', percentage: 28 }
      ],
      topPosts: [
        {
          id: 'li-top-1',
          title: 'Why Most Brand Films Fail Before the First Frame',
          reach: 14800,
          engagementRate: 6.4,
          whyItWorked: 'Challenged conventional wisdom with concrete budget efficiency metrics.'
        }
      ],
      growthPlaybook: {
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
          pinnedCommentPlay: 'Place the case study link or high-res video link exclusively in the first comment to avoid reach penalization.',
          engagementVelocityTactic: 'Have the founder and senior directors reply to every comment with thoughtful peer perspectives.',
          keyAction: 'Tag 2-3 verified project collaborators or agency partners in post comments to seed executive dialogue.'
        },
        algorithmUpdatesNews: {
          latestUpdate: 'LinkedIn 2026 Feed Policy: Heavy reach suppression for posts with outbound external URLs (-40%); boosts native PDFs & conversational dwell time.',
          impactOnBrand: 'Posting YouTube links directly on LinkedIn yields near-zero reach; multi-slide PDF carousels achieve 4x-6x standard reach.',
          tacticalPivot: 'Format every production breakdown into an 8-slide PDF deck with all conclusions self-contained in feed.'
        },
        suggestions: ([
          {
            id: 'li-s1',
            field: 'subs',
            label: 'Executive Follower Conversion Deck',
            tactic: 'Include a clean profile callout slide on the final slide of every document deck: "Follow for weekly commercial film teardowns."',
            expectedImpact: '+40% follower growth from Directors & CMOs'
          },
          {
            id: 'li-s2',
            field: 'views',
            label: 'Document Dwell Time Architecture',
            tactic: 'Design 8–10 slide PDFs in 1080x1350 vertical aspect ratio with concise 30-word insights per slide.',
            expectedImpact: '3x higher algorithmic dwell time and reach'
          },
          {
            id: 'li-s3',
            field: 'comments',
            label: 'Executive Peer Debate Prompt',
            tactic: 'End copy with a nuanced budget or strategy dilemma that senior marketing managers feel compelled to weigh in on.',
            expectedImpact: 'Higher comment depth from senior decision makers'
          },
          {
            id: 'li-s4',
            field: 'algorithm_news',
            label: 'Zero-Link Native Distribution',
            tactic: 'Keep main post 100% link-free; place booking link and full film link in comment #1 after initial engagement begins.',
            expectedImpact: 'Avoid the 40% outbound link reach penalty'
          }
        ] as TacticalSuggestion[])
      }
    },
    tiktok: {
      followers: ttFollowers,
      netGrowth: ttDelta,
      videoViews: ttReach,
      profileViews: isPlatformActive('tiktok') ? 8600 : 0,
      likes: isPlatformActive('tiktok') ? 14200 : 0,
      shares: isPlatformActive('tiktok') ? 3100 : 0,
      comments: isPlatformActive('tiktok') ? 1140 : 0,
      engagementRate: isPlatformActive('tiktok') ? 7.4 : 0,
      postFormats: [
        { format: 'Sensory Foley Sound Loops (<15s)', count: isPlatformActive('tiktok') ? 5 : 0, avgViews: isPlatformActive('tiktok') ? 18400 : 0, avgEngagement: 8.8 },
        { format: 'Director Cinema Masterclass (60s)', count: isPlatformActive('tiktok') ? 4 : 0, avgViews: isPlatformActive('tiktok') ? 11200 : 0, avgEngagement: 6.9 },
        { format: 'Color Grading Before/After Wipes', count: isPlatformActive('tiktok') ? 3 : 0, avgViews: isPlatformActive('tiktok') ? 9800 : 0, avgEngagement: 6.4 }
      ],
      videoMetrics: {
        avgWatchTimeSec: 17.8,
        completionRatePercent: 42.4,
        fypTrafficPercent: 84.6,
        retentionInsight: 'First 1.5 seconds determine 90% of virality. Sound design ASMR clips average 2.1 loops per viewer, pushing them into algorithmic FYP distribution waves.'
      },
      topPosts: [
        {
          id: 'tt-synth-1',
          title: 'Sensory Foley Sound Design Breakdown',
          views: 38400,
          likes: 5400,
          shares: 1650,
          comments: 390,
          engagementRate: 9.8,
          whyItWorked: 'Sensory acoustic trigger; viewers looped audio multiple times to inspect the mic capsule.'
        },
        {
          id: 'tt-synth-2',
          title: 'Why Hollywood Movies Look Green in 2026',
          views: 29800,
          likes: 4100,
          shares: 980,
          comments: 440,
          engagementRate: 8.2,
          whyItWorked: 'Contrarian industry thesis sparked active debate between colorists and filmmakers.'
        }
      ],
      demographics: {
        topLocations: ['United States (42%)', 'United Kingdom (26%)', 'Canada (16%)'],
        topAgeGender: '52% Male / 48% Female · Peak 18–34 years old',
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
        suggestions: ([
          {
            id: 'tt-s1',
            field: 'subs',
            label: 'Series Playlist Architecture',
            tactic: 'Group micro-breakdowns into a TikTok Creator Playlist titled "The Director Notebook".',
            expectedImpact: '+55% viewer-to-follower conversion rate'
          },
          {
            id: 'tt-s2',
            field: 'views',
            label: 'Seamless Audio Loop Craft',
            tactic: 'Compose audio beds where the final snare hit resolves on the first frame of the repeat loop.',
            expectedImpact: 'Average watch time increases from 17s to 23s'
          },
          {
            id: 'tt-s3',
            field: 'comments',
            label: 'Video Reply Strategy',
            tactic: 'Post 1 video reply per week addressing a contentious user question.',
            expectedImpact: 'Double the comment volume and cultivate community authority'
          },
          {
            id: 'tt-s4',
            field: 'algorithm_news',
            label: 'Spoken SEO Transcript Optimization',
            tactic: 'Verbalize primary industry keywords in the first 5 seconds to trigger TikTok automated search categorization.',
            expectedImpact: 'Long-tail search traffic increases by 40% over 60 days'
          }
        ] as TacticalSuggestion[])
      }
    },
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
      ],
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
      ],
      contentCalendarDirection: 'Focus October around a 4-part masterclass series, supported by daily micro-insights and behind-the-scenes Stories.',
      testingPriorities: [
        'Test 9:16 vertical video teasers cross-posted natively across both YouTube Shorts and Instagram Reels.',
        'A/B test thumbnail face-expression variations on YouTube long-form videos to push CTR above 9%.',
        'Experiment with carousel slide count (8 slides vs 12 slides) to identify optimal save completion threshold.'
      ]
    },
    appendixRawMetrics: [
      { metric: 'Total Cross-Platform Impressions', value: '384,200', notes: 'Includes repeat views across feed and stories' },
      { metric: 'Total Video Views (>3s)', value: '124,800', notes: 'Across YouTube, Instagram Reels, and Facebook' },
      { metric: 'Net Inbound Inquiries via Social Bio Links', value: '38', notes: 'Direct website taps to booking form' }
    ]
  };
}
