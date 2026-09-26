import { PlatformType } from './report';

export interface ScreengrabPromptItem {
  id: string;
  platform: PlatformType;
  title: string;
  description: string;
  requiredMetricTargets: string[];
  recommendedAspect?: string;
  exampleInstruction: string;
}

export const REQUIRED_SCREENGRAB_CHECKLIST: ScreengrabPromptItem[] = [
  {
    id: 'fb-30d-reach-views',
    platform: 'facebook',
    title: 'Facebook: 30-Day Reach, Page Views & Follower Delta',
    description: 'Meta Business Suite > Insights > Overview (last 28 or 30 days).',
    requiredMetricTargets: [
      'Total Page Reach (Organic vs Paid)',
      'Net New Followers / Page Likes',
      'Total Content Interactions',
      'Link Clicks & Page Visits'
    ],
    exampleInstruction: 'Go to business.facebook.com > Insights > Overview > Date filter: Last 28 Days. Screengrab top metric cards.'
  },
  {
    id: 'fb-video-retention',
    platform: 'facebook',
    title: 'Facebook: Video Performance & 3-sec vs 1-min Retention',
    description: 'Meta Business Suite > Content > Video performance tab.',
    requiredMetricTargets: [
      '3-Second Video Plays vs 1-Minute Video Views',
      'Average Minutes Viewed',
      'Video Format Performance (Reels vs Long Video)'
    ],
    exampleInstruction: 'Insights > Video Insights > Aggregate Audience Watch Retention graph.'
  },
  {
    id: 'yt-overview-views-watchtime',
    platform: 'youtube',
    title: 'YouTube Studio: 28/30-Day Views, Watch Hours & Subscribers',
    description: 'YouTube Studio > Analytics > Overview tab.',
    requiredMetricTargets: [
      'Views (with comparison curve)',
      'Watch Time (hours)',
      'Subscribers Gained / Lost',
      'Top Videos list for the period'
    ],
    exampleInstruction: 'studio.youtube.com > Analytics > Overview (Date range: Last 28 Days).'
  },
  {
    id: 'yt-audience-retention',
    platform: 'youtube',
    title: 'YouTube Studio: Audience Retention Curve & Demographics',
    description: 'YouTube Studio > Analytics > Audience & Content tabs.',
    requiredMetricTargets: [
      'Returning vs New Viewers',
      'Audience Demographics (Age / Gender / Geography)',
      'Click-Through Rate (CTR) and Traffic Sources (Browse, Suggested, Search)'
    ],
    exampleInstruction: 'Analytics > Audience tab + Content tab (Impressions and how they led to watch time).'
  },
  {
    id: 'ig-overview-reach-actions',
    platform: 'instagram',
    title: 'Instagram: Accounts Reached, Engaged & Profile Activity',
    description: 'Instagram Mobile App > Professional Dashboard > Insights > Last 30 Days.',
    requiredMetricTargets: [
      'Accounts Reached (Followers vs Non-Followers split)',
      'Accounts Engaged & Total Interactions',
      'Profile Visits & External Link Taps',
      'Total Followers with Follow / Unfollow ratio'
    ],
    exampleInstruction: 'Open Professional Dashboard on mobile > Insights Overview > Last 30 days.'
  },
  {
    id: 'ig-reels-stories-split',
    platform: 'instagram',
    title: 'Instagram: Content Format Split (Reels vs Carousels vs Stories)',
    description: 'Instagram Insights > Content You Shared > Top Posts / Reels by reach & saves.',
    requiredMetricTargets: [
      'Top 3 Reels plays, watch time & shares',
      'Story completion rate & drop-off',
      'Carousels saves and engagement depth'
    ],
    exampleInstruction: 'Insights > Content You Shared > Filter by Reels > Reach, then Filter by Saves.'
  },
  {
    id: 'li-analytics-visitors-content',
    platform: 'linkedin',
    title: 'LinkedIn: Page Analytics, Impressions & Visitor Seniority',
    description: 'LinkedIn Page Admin > Analytics > Visitors + Content tabs.',
    requiredMetricTargets: [
      'Page Unique Visitors & Follower Growth',
      'Total Impressions, CTR & Engagement Rate',
      'Visitor Demographics (Job Function & Seniority levels: Director, Founder, Manager)',
      'Top Document/Carousel vs Native Post engagement'
    ],
    exampleInstruction: 'LinkedIn Company Page > Analytics > Visitors (Demographics view) + Content (Post table).'
  },
  {
    id: 'tt-analytics-overview',
    platform: 'tiktok',
    title: 'TikTok Studio: Video Views, Profile Views & Net Followers',
    description: 'TikTok Studio / Creator Center > Analytics > Overview (Last 28 or 30 days).',
    requiredMetricTargets: [
      'Total Video Views & Comparative Trend Curve',
      'Profile Views & Conversion to Follows',
      'Net New Followers Gained',
      'Total Likes, Comments & Shares Across Uploads'
    ],
    exampleInstruction: 'tiktok.com/analytics or Creator Center > Analytics > Overview (Date range: Last 28 Days).'
  },
  {
    id: 'tt-retention-fyp-split',
    platform: 'tiktok',
    title: 'TikTok Analytics: Watch Time, Completion Rate & FYP %',
    description: 'TikTok Analytics > Content tab > Individual Top Video Analytics.',
    requiredMetricTargets: [
      'Average Watch Time & Total Play Time',
      'Watched Full Video (Completion Rate %)',
      'For You Page (FYP) vs Personal Profile Traffic Ratio',
      'Audience Retention Curve & Drop-off Points'
    ],
    exampleInstruction: 'Creator Center > Content tab > Click top video > View full Analytics retention curve.'
  }
];
