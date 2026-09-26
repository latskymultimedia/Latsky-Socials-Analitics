import { SocialReportData, PlatformType, ActionRecommendation, TacticalSuggestion } from '../types/report';
import { formatNumber, formatPercent } from './formatters';

/**
 * Generates a clean, standalone, printable agency HTML report for the client.
 * When a specific platform is provided (e.g. 'youtube', 'instagram', 'linkedin', 'facebook'),
 * it generates an EXCLUSIVE, SINGLE-PLATFORM audit document with zero cross-platform data.
 * When platformFilter is omitted or 'overall', it generates the multi-platform executive review.
 */
export function generateStandaloneHtmlReport(
  report: SocialReportData,
  platformFilter?: PlatformType | 'overall'
): string {
  const isPlatformSpecific = Boolean(platformFilter && platformFilter !== 'overall');
  const targetPlatform: PlatformType = isPlatformSpecific ? (platformFilter as PlatformType) : 'general';

  const title = isPlatformSpecific
    ? `${report.clientName} - ${targetPlatform.toUpperCase()} Performance & Growth Blueprint`
    : `${report.clientName} - Monthly Social Performance Intelligence Report`;

  const rows = report.crossPlatformOverview?.summaryTable || [];
  const recs = report.recommendations?.actionableItems || [];

  // Filter recommendations strictly to this platform if platform-specific
  const platformRecs = isPlatformSpecific
    ? recs.filter((r) => r.platform.toLowerCase() === targetPlatform.toLowerCase() || r.platform.toLowerCase() === targetPlatform)
    : recs;

  // Grab the platform summary row for this platform if specific
  const platformRow = isPlatformSpecific
    ? rows.find((r) => r.platform.toLowerCase() === targetPlatform.toLowerCase())
    : null;

  // Common CSS styling
  const commonStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');
    
    :root {
      --primary: #18181b;
      --accent: #d97706;
      --bg: #f8fafc;
      --card-bg: #ffffff;
      --border: #e2e8f0;
      --text: #0f172a;
      --muted: #64748b;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: var(--bg);
      color: var(--text);
      line-height: 1.5;
      padding: 32px 16px;
    }

    .container {
      max-width: 920px;
      margin: 0 auto;
      background: var(--card-bg);
      padding: 44px;
      border-radius: 16px;
      border: 1px solid var(--border);
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
    }

    /* Print toolbar at top */
    .toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--border);
    }

    .btn {
      background: #18181b;
      color: white;
      border: none;
      padding: 10px 18px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: background 0.15s;
    }

    .btn:hover {
      background: #27272a;
    }

    /* Header */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 28px;
      padding-bottom: 20px;
      border-bottom: 2px solid var(--text);
    }

    .badge {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 700;
      background: #fef3c7;
      color: #b45309;
      padding: 4px 8px;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: inline-block;
      margin-bottom: 6px;
    }

    .badge-platform {
      background: #f1f5f9;
      color: #0f172a;
      border: 1px solid #cbd5e1;
    }

    .title {
      font-size: 26px;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #09090b;
      line-height: 1.2;
    }

    .subtitle {
      font-size: 13px;
      color: var(--muted);
      margin-top: 4px;
    }

    .logo {
      max-width: 90px;
      max-height: 90px;
      object-fit: contain;
      border-radius: 8px;
    }

    /* Sections */
    .section {
      margin-bottom: 32px;
    }

    .section-title {
      font-size: 15px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #18181b;
      margin-bottom: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
      border-bottom: 1px solid var(--border);
      padding-bottom: 6px;
    }

    /* Metric Grid */
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
      margin-bottom: 16px;
    }

    .grid-3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-bottom: 16px;
    }

    .grid-4 {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 16px;
    }

    .metric-card {
      background: #f8fafc;
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 14px;
    }

    .metric-label {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      color: var(--muted);
      letter-spacing: 0.5px;
    }

    .metric-val {
      font-size: 22px;
      font-weight: 800;
      color: #09090b;
      margin-top: 3px;
    }

    .metric-sub {
      font-size: 11px;
      color: #16a34a;
      font-weight: 600;
      margin-top: 2px;
    }

    /* Playbook Card */
    .playbook-box {
      border: 1px solid var(--border);
      background: #ffffff;
      border-radius: 10px;
      padding: 16px;
      margin-bottom: 14px;
    }

    .playbook-box-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 6px;
    }

    .playbook-box-title {
      font-size: 13px;
      font-weight: 800;
      color: #09090b;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .field-row {
      margin-bottom: 8px;
      font-size: 12px;
      line-height: 1.5;
    }

    .field-label {
      font-weight: 700;
      color: #334155;
      display: inline;
    }

    .field-val {
      color: #0f172a;
      display: inline;
    }

    .action-badge-box {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      padding: 8px 12px;
      border-radius: 6px;
      margin-top: 8px;
      font-size: 12px;
      color: #14532d;
    }

    .news-badge-box {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      padding: 10px 14px;
      border-radius: 8px;
      margin-top: 8px;
      font-size: 12px;
      color: #1e3a8a;
    }

    /* Table */
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
      margin-top: 8px;
    }

    th {
      text-align: left;
      padding: 8px 10px;
      background: #f1f5f9;
      color: #475569;
      font-weight: 700;
      border-bottom: 1px solid var(--border);
      font-size: 11px;
      text-transform: uppercase;
    }

    td {
      padding: 10px;
      border-bottom: 1px solid var(--border);
      color: #1e293b;
    }

    tr:last-child td {
      border-bottom: none;
    }

    /* Rec cards */
    .rec-card {
      padding: 12px 14px;
      background: #f8fafc;
      border-left: 4px solid #18181b;
      border-radius: 0 8px 8px 0;
      margin-bottom: 8px;
      font-size: 12px;
    }

    .rec-priority {
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      color: #b45309;
      margin-bottom: 3px;
    }

    .footer {
      margin-top: 36px;
      padding-top: 14px;
      border-top: 1px solid var(--border);
      font-size: 11px;
      color: var(--muted);
      display: flex;
      justify-content: space-between;
    }

    @media print {
      body {
        background: white;
        padding: 0;
      }
      .container {
        box-shadow: none;
        border: none;
        padding: 0;
        max-width: 100%;
      }
      .toolbar {
        display: none !important;
      }
      .page-break {
        page-break-before: always;
      }
    }
  `;

  // =========================================================================
  // SINGLE PLATFORM DEDICATED EXPORT BRANCH (Strictly isolates ONE platform)
  // =========================================================================
  if (isPlatformSpecific) {
    const p = targetPlatform;
    const fb = report.facebook;
    const ig = report.instagram;
    const yt = report.youtube;
    const li = report.linkedin;
    const tt = report.tiktok;

    let platformHtmlBody = '';

    if (p === 'instagram') {
      const playbook = ig.growthPlaybook;
      platformHtmlBody = `
        <!-- KPI Row -->
        <div class="grid-4">
          <div class="metric-card">
            <div class="metric-label">Followers & Net</div>
            <div class="metric-val">${formatNumber(ig.followers)}</div>
            <div class="metric-sub">+${formatNumber(ig.netGrowth)} (${ig.followUnfollowRatio})</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Monthly Reach</div>
            <div class="metric-val">${formatNumber(ig.reach)}</div>
            <div class="metric-sub">${formatNumber(ig.impressions)} impressions</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Web Clicks / Visits</div>
            <div class="metric-val">${formatNumber(ig.websiteTaps)}</div>
            <div class="metric-sub">From ${formatNumber(ig.profileVisits)} visits</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Non-Follower Discovery</div>
            <div class="metric-val">${ig.nonFollowerDiscoveryRate}%</div>
            <div class="metric-sub">Story ${ig.storyCompletionRate}% completion</div>
          </div>
        </div>

        <!-- Format Performance Table -->
        <div class="section">
          <div class="section-title">01. Instagram Format Efficacy & Reach Breakdown</div>
          <table>
            <thead>
              <tr>
                <th>Format</th>
                <th>Post Count</th>
                <th>Total Reach</th>
                <th>Shares</th>
                <th>Watch / Save Benchmark</th>
              </tr>
            </thead>
            <tbody>
              ${ig.formatSplit.map((f) => `
                <tr>
                  <td><strong>${f.formatLabel}</strong></td>
                  <td>${f.count} posts</td>
                  <td>${formatNumber(f.reach)}</td>
                  <td>${formatNumber(f.shares)}</td>
                  <td>${f.avgWatchOrSave}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- Top Instagram Posts -->
        <div class="section">
          <div class="section-title">02. Top Performing Instagram Posts</div>
          <div class="grid-2">
            ${ig.topPosts.map((post) => `
              <div style="border: 1px solid var(--border); padding: 12px; border-radius: 8px; background: #fafafa; font-size: 12px;">
                <div style="display: flex; justify-content: space-between; font-weight: 700; margin-bottom: 4px;">
                  <span style="color: #e11d48; text-transform: uppercase; font-size: 10px;">${post.format}</span>
                  <span style="color: #09090b;">${post.engagementRate}% ER · ${formatNumber(post.saves)} saves</span>
                </div>
                <div style="font-weight: 700; color: #09090b; margin-bottom: 6px;">${post.title}</div>
                <div style="background: white; border: 1px solid var(--border); padding: 8px; border-radius: 6px; color: #334155; font-size: 11px;">
                  <strong>Why it worked: </strong>${post.whyItWorked}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Growth Playbook for Instagram -->
        ${playbook ? `
        <div class="section page-break">
          <div class="section-title">03. Instagram Tactical Growth Playbook</div>
          
          <!-- 1. Subs Strategy -->
          <div class="playbook-box">
            <div class="playbook-box-header">
              <span class="playbook-box-title">👥 Follower & Subscriber Conversion Funnel</span>
              <span class="badge">Audience Growth</span>
            </div>
            <div class="field-row"><div class="field-label">Conversion Hook: </div><div class="field-val">${playbook.subsStrategy.conversionHook}</div></div>
            <div class="field-row"><div class="field-label">Profile Bio Tweak: </div><div class="field-val">${playbook.subsStrategy.profileBioTweak}</div></div>
            <div class="field-row"><div class="field-label">Lead Magnet / Series: </div><div class="field-val">${playbook.subsStrategy.leadMagnetOrSeries}</div></div>
            <div class="action-badge-box"><strong>Immediate Key Action: </strong>${playbook.subsStrategy.keyAction}</div>
          </div>

          <!-- 2. Views & Reach Strategy -->
          <div class="playbook-box">
            <div class="playbook-box-header">
              <span class="playbook-box-title">🚀 Views & Viral Reach Acceleration</span>
              <span class="badge">Algorithm Reach</span>
            </div>
            <div class="field-row"><div class="field-label">Opening Hook Pattern: </div><div class="field-val">${playbook.viewsStrategy.viralHookTemplate}</div></div>
            <div class="field-row"><div class="field-label">Retention Trigger: </div><div class="field-val">${playbook.viewsStrategy.retentionTrigger}</div></div>
            <div class="field-row"><div class="field-label">Algorithm Mechanics: </div><div class="field-val">${playbook.viewsStrategy.algorithmDistributionHack}</div></div>
            <div class="action-badge-box"><strong>Immediate Key Action: </strong>${playbook.viewsStrategy.keyAction}</div>
          </div>

          <!-- 3. Comments Strategy -->
          <div class="playbook-box">
            <div class="playbook-box-header">
              <span class="playbook-box-title">💬 High-Intent Comments & Community Discussion</span>
              <span class="badge">Engagement Catalyst</span>
            </div>
            <div class="field-row"><div class="field-label">Discussion Hook Prompt: </div><div class="field-val">${playbook.commentsStrategy.discussionPrompt}</div></div>
            <div class="field-row"><div class="field-label">Pinned Comment Strategy: </div><div class="field-val">${playbook.commentsStrategy.pinnedCommentPlay}</div></div>
            <div class="field-row"><div class="field-label">Velocity Protocol: </div><div class="field-val">${playbook.commentsStrategy.engagementVelocityTactic}</div></div>
            <div class="action-badge-box"><strong>Immediate Key Action: </strong>${playbook.commentsStrategy.keyAction}</div>
          </div>

          <!-- 4. Algorithm News -->
          <div class="news-badge-box">
            <div style="font-weight: 800; text-transform: uppercase; font-size: 11px; margin-bottom: 4px;">⚡ 2026 Instagram Algorithm Update to Watch</div>
            <div style="font-weight: 700; margin-bottom: 4px;">${playbook.algorithmUpdatesNews.latestUpdate}</div>
            <div style="margin-bottom: 4px;"><strong>Impact on Brand: </strong>${playbook.algorithmUpdatesNews.impactOnBrand}</div>
            <div><strong>Tactical Pivot: </strong>${playbook.algorithmUpdatesNews.tacticalPivot}</div>
          </div>

          <!-- 5. Granular Suggestions -->
          ${playbook.suggestions && playbook.suggestions.length > 0 ? `
          <div style="margin-top: 16px;">
            <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; color: #475569; margin-bottom: 8px;">Specific Field Suggestions & Experiments:</div>
            ${playbook.suggestions.map((s) => `
              <div class="rec-card">
                <div class="rec-priority">[${s.field.toUpperCase()}] · ${s.label}</div>
                <div style="font-weight: 600; color: #09090b; margin-bottom: 2px;">${s.tactic}</div>
                <div style="font-size: 11px; color: #16a34a; font-weight: 600;">Expected Impact: ${s.expectedImpact}</div>
              </div>
            `).join('')}
          </div>
          ` : ''}
        </div>
        ` : ''}
      `;
    } else if (p === 'youtube') {
      const playbook = yt.growthPlaybook;
      platformHtmlBody = `
        <!-- KPI Row -->
        <div class="grid-4">
          <div class="metric-card">
            <div class="metric-label">Subscribers & Net</div>
            <div class="metric-val">${formatNumber(yt.subscribers)}</div>
            <div class="metric-sub">+${formatNumber(yt.netGrowth)} (${yt.subsGainedPerVideoAvg}/video)</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Channel Views</div>
            <div class="metric-val">${formatNumber(yt.views)}</div>
            <div class="metric-sub">${yt.ctr}% Click-Through Rate</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Watch Time Hours</div>
            <div class="metric-val">${formatNumber(yt.watchTimeHours)}h</div>
            <div class="metric-sub">Avg duration: ${yt.avgViewDuration}</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Viewer Retention</div>
            <div class="metric-val">${yt.avgPercentViewed}%</div>
            <div class="metric-sub">Impressions: ${formatNumber(yt.impressionsSuggestedBrowse)}</div>
          </div>
        </div>

        <!-- Traffic Sources & Retention Insight -->
        <div class="section">
          <div class="section-title">01. YouTube Traffic Sources & Audience Retention</div>
          <div class="grid-2">
            <div>
              <table>
                <thead>
                  <tr>
                    <th>Traffic Source</th>
                    <th>Share</th>
                  </tr>
                </thead>
                <tbody>
                  ${yt.trafficSources.map((t) => `
                    <tr>
                      <td>${t.source}</td>
                      <td><strong>${t.percentage}%</strong></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
            <div style="border: 1px solid var(--border); padding: 14px; border-radius: 8px; background: #fafafa; font-size: 12px;">
              <strong style="color: #09090b; display: block; margin-bottom: 6px;">Audience Drop-Off & Retention Guidance:</strong>
              <p style="color: #334155; line-height: 1.5; margin-bottom: 8px;">${yt.retentionDropOffInsight}</p>
              <div style="background: white; border: 1px solid #e2e8f0; padding: 8px; border-radius: 6px; font-size: 11px;">
                <strong>Baseline View Duration: </strong>${yt.avgViewDuration} (${yt.avgPercentViewed}% viewed)
              </div>
            </div>
          </div>
        </div>

        <!-- Top YouTube Videos -->
        <div class="section">
          <div class="section-title">02. Top Performing YouTube Videos</div>
          <div class="grid-2">
            ${yt.topVideos.map((video) => `
              <div style="border: 1px solid var(--border); padding: 12px; border-radius: 8px; background: #fafafa; font-size: 12px;">
                <div style="display: flex; justify-content: space-between; font-weight: 700; margin-bottom: 4px;">
                  <span style="color: #dc2626; font-size: 11px;">${formatNumber(video.views)} views</span>
                  <span style="color: #09090b;">${video.ctr}% CTR · ${formatNumber(video.watchHours)}h watch</span>
                </div>
                <div style="font-weight: 700; color: #09090b; margin-bottom: 6px;">${video.title}</div>
                <div style="background: white; border: 1px solid var(--border); padding: 8px; border-radius: 6px; color: #334155; font-size: 11px;">
                  <strong>Retention Callout: </strong>${video.retentionInsight}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Growth Playbook for YouTube -->
        ${playbook ? `
        <div class="section page-break">
          <div class="section-title">03. YouTube Channel Growth Playbook</div>
          
          <!-- 1. Subs Strategy -->
          <div class="playbook-box">
            <div class="playbook-box-header">
              <span class="playbook-box-title">👥 Subscriber Conversion Funnel</span>
              <span class="badge">Subscribers</span>
            </div>
            <div class="field-row"><div class="field-label">Conversion Hook: </div><div class="field-val">${playbook.subsStrategy.conversionHook}</div></div>
            <div class="field-row"><div class="field-label">Channel Bio / Trailer: </div><div class="field-val">${playbook.subsStrategy.profileBioTweak}</div></div>
            <div class="field-row"><div class="field-label">Recurring Series Play: </div><div class="field-val">${playbook.subsStrategy.leadMagnetOrSeries}</div></div>
            <div class="action-badge-box"><strong>Immediate Key Action: </strong>${playbook.subsStrategy.keyAction}</div>
          </div>

          <!-- 2. Views & Reach Strategy -->
          <div class="playbook-box">
            <div class="playbook-box-header">
              <span class="playbook-box-title">🚀 Watch Time & Browse Feature Acceleration</span>
              <span class="badge">Views & CTR</span>
            </div>
            <div class="field-row"><div class="field-label">Opening Cold-Open: </div><div class="field-val">${playbook.viewsStrategy.viralHookTemplate}</div></div>
            <div class="field-row"><div class="field-label">Retention Trigger: </div><div class="field-val">${playbook.viewsStrategy.retentionTrigger}</div></div>
            <div class="field-row"><div class="field-label">Algorithm Browse Formula: </div><div class="field-val">${playbook.viewsStrategy.algorithmDistributionHack}</div></div>
            <div class="action-badge-box"><strong>Immediate Key Action: </strong>${playbook.viewsStrategy.keyAction}</div>
          </div>

          <!-- 3. Comments Strategy -->
          <div class="playbook-box">
            <div class="playbook-box-header">
              <span class="playbook-box-title">💬 Comments & Community Tab Catalyst</span>
              <span class="badge">Discussion</span>
            </div>
            <div class="field-row"><div class="field-label">Pinned Discussion Prompt: </div><div class="field-val">${playbook.commentsStrategy.discussionPrompt}</div></div>
            <div class="field-row"><div class="field-label">First-Hour Response Strategy: </div><div class="field-val">${playbook.commentsStrategy.engagementVelocityTactic}</div></div>
            <div class="action-badge-box"><strong>Immediate Key Action: </strong>${playbook.commentsStrategy.keyAction}</div>
          </div>

          <!-- 4. Algorithm News -->
          <div class="news-badge-box">
            <div style="font-weight: 800; text-transform: uppercase; font-size: 11px; margin-bottom: 4px;">⚡ 2026 YouTube Algorithm Shift to Watch</div>
            <div style="font-weight: 700; margin-bottom: 4px;">${playbook.algorithmUpdatesNews.latestUpdate}</div>
            <div style="margin-bottom: 4px;"><strong>Impact on Brand: </strong>${playbook.algorithmUpdatesNews.impactOnBrand}</div>
            <div><strong>Tactical Pivot: </strong>${playbook.algorithmUpdatesNews.tacticalPivot}</div>
          </div>

          <!-- 5. Granular Suggestions -->
          ${playbook.suggestions && playbook.suggestions.length > 0 ? `
          <div style="margin-top: 16px;">
            <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; color: #475569; margin-bottom: 8px;">Specific Suggested Fields & Experiments:</div>
            ${playbook.suggestions.map((s) => `
              <div class="rec-card">
                <div class="rec-priority">[${s.field.toUpperCase()}] · ${s.label}</div>
                <div style="font-weight: 600; color: #09090b; margin-bottom: 2px;">${s.tactic}</div>
                <div style="font-size: 11px; color: #16a34a; font-weight: 600;">Expected Impact: ${s.expectedImpact}</div>
              </div>
            `).join('')}
          </div>
          ` : ''}
        </div>
        ` : ''}
      `;
    } else if (p === 'linkedin') {
      const playbook = li.growthPlaybook;
      platformHtmlBody = `
        <!-- KPI Row -->
        <div class="grid-4">
          <div class="metric-card">
            <div class="metric-label">Followers & Net</div>
            <div class="metric-val">${formatNumber(li.followers)}</div>
            <div class="metric-sub">+${formatNumber(li.netGrowth)} new this month</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Page Visitors</div>
            <div class="metric-val">${formatNumber(li.pageVisitors)}</div>
            <div class="metric-sub">${li.ctr}% Click-Through Rate</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Total Impressions</div>
            <div class="metric-val">${formatNumber(li.impressions)}</div>
            <div class="metric-sub">B2B Reach Engine</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Engagement Rate</div>
            <div class="metric-val">${li.engagementRate}%</div>
            <div class="metric-sub">Benchmark: 2.8%</div>
          </div>
        </div>

        <!-- Content Types & Seniority Demographics -->
        <div class="section">
          <div class="section-title">01. LinkedIn Format Efficacy & Decision-Maker Seniority</div>
          <div class="grid-2">
            <div>
              <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #475569; margin-bottom: 6px;">Format Performance:</div>
              ${li.contentTypes.map((c) => `
                <div style="border: 1px solid var(--border); padding: 8px 10px; border-radius: 6px; margin-bottom: 6px; font-size: 11px; background: #fafafa;">
                  <div style="display: flex; justify-content: space-between; font-weight: 700;">
                    <span>${c.type}</span>
                    <span style="color: #0369a1;">${c.engagementRate}% ER · ${formatNumber(c.reach)} reach</span>
                  </div>
                  <div style="color: #64748b; margin-top: 2px;">${c.note}</div>
                </div>
              `).join('')}
            </div>
            <div>
              <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #475569; margin-bottom: 6px;">Audience Seniority Breakdown:</div>
              <table>
                <thead>
                  <tr>
                    <th>Seniority Tier</th>
                    <th>Audience Share</th>
                  </tr>
                </thead>
                <tbody>
                  ${li.seniorityDemographics.map((s) => `
                    <tr>
                      <td>${s.title}</td>
                      <td><strong>${s.percentage}%</strong></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Top LinkedIn Posts -->
        <div class="section">
          <div class="section-title">02. Top Performing LinkedIn Posts</div>
          <div class="grid-2">
            ${li.topPosts.map((post) => `
              <div style="border: 1px solid var(--border); padding: 12px; border-radius: 8px; background: #fafafa; font-size: 12px;">
                <div style="display: flex; justify-content: space-between; font-weight: 700; margin-bottom: 4px;">
                  <span style="color: #0369a1; font-size: 11px;">${formatNumber(post.reach)} reach</span>
                  <span style="color: #09090b;">${post.engagementRate}% ER</span>
                </div>
                <div style="font-weight: 700; color: #09090b; margin-bottom: 6px;">${post.title}</div>
                <div style="background: white; border: 1px solid var(--border); padding: 8px; border-radius: 6px; color: #334155; font-size: 11px;">
                  <strong>Why it worked: </strong>${post.whyItWorked}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Growth Playbook for LinkedIn -->
        ${playbook ? `
        <div class="section page-break">
          <div class="section-title">03. LinkedIn Executive Authority & Lead Gen Playbook</div>
          
          <!-- 1. Subs Strategy -->
          <div class="playbook-box">
            <div class="playbook-box-header">
              <span class="playbook-box-title">👥 Executive Follower Conversion Funnel</span>
              <span class="badge">Followers</span>
            </div>
            <div class="field-row"><div class="field-label">Conversion Hook: </div><div class="field-val">${playbook.subsStrategy.conversionHook}</div></div>
            <div class="field-row"><div class="field-label">Headline & Bio Optimization: </div><div class="field-val">${playbook.subsStrategy.profileBioTweak}</div></div>
            <div class="field-row"><div class="field-label">Lead Magnet Decks: </div><div class="field-val">${playbook.subsStrategy.leadMagnetOrSeries}</div></div>
            <div class="action-badge-box"><strong>Immediate Key Action: </strong>${playbook.subsStrategy.keyAction}</div>
          </div>

          <!-- 2. Views & Reach Strategy -->
          <div class="playbook-box">
            <div class="playbook-box-header">
              <span class="playbook-box-title">🚀 Document Carousel Dwell Time Strategy</span>
              <span class="badge">Reach</span>
            </div>
            <div class="field-row"><div class="field-label">First Line Contrarian Hook: </div><div class="field-val">${playbook.viewsStrategy.viralHookTemplate}</div></div>
            <div class="field-row"><div class="field-label">Slide Retention Trigger: </div><div class="field-val">${playbook.viewsStrategy.retentionTrigger}</div></div>
            <div class="field-row"><div class="field-label">Algorithm Zero-Link Rule: </div><div class="field-val">${playbook.viewsStrategy.algorithmDistributionHack}</div></div>
            <div class="action-badge-box"><strong>Immediate Key Action: </strong>${playbook.viewsStrategy.keyAction}</div>
          </div>

          <!-- 3. Comments Strategy -->
          <div class="playbook-box">
            <div class="playbook-box-header">
              <span class="playbook-box-title">💬 Peer Decision-Maker Dialogue Catalyst</span>
              <span class="badge">Executive Comments</span>
            </div>
            <div class="field-row"><div class="field-label">High-Level Dilemma Prompt: </div><div class="field-val">${playbook.commentsStrategy.discussionPrompt}</div></div>
            <div class="field-row"><div class="field-label">First Comment Placement: </div><div class="field-val">${playbook.commentsStrategy.pinnedCommentPlay}</div></div>
            <div class="action-badge-box"><strong>Immediate Key Action: </strong>${playbook.commentsStrategy.keyAction}</div>
          </div>

          <!-- 4. Algorithm News -->
          <div class="news-badge-box">
            <div style="font-weight: 800; text-transform: uppercase; font-size: 11px; margin-bottom: 4px;">⚡ 2026 LinkedIn Algorithm Policy to Watch</div>
            <div style="font-weight: 700; margin-bottom: 4px;">${playbook.algorithmUpdatesNews.latestUpdate}</div>
            <div style="margin-bottom: 4px;"><strong>Impact on Brand: </strong>${playbook.algorithmUpdatesNews.impactOnBrand}</div>
            <div><strong>Tactical Pivot: </strong>${playbook.algorithmUpdatesNews.tacticalPivot}</div>
          </div>

          <!-- 5. Granular Suggestions -->
          ${playbook.suggestions && playbook.suggestions.length > 0 ? `
          <div style="margin-top: 16px;">
            <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; color: #475569; margin-bottom: 8px;">Specific Suggested Fields & Experiments:</div>
            ${playbook.suggestions.map((s) => `
              <div class="rec-card">
                <div class="rec-priority">[${s.field.toUpperCase()}] · ${s.label}</div>
                <div style="font-weight: 600; color: #09090b; margin-bottom: 2px;">${s.tactic}</div>
                <div style="font-size: 11px; color: #16a34a; font-weight: 600;">Expected Impact: ${s.expectedImpact}</div>
              </div>
            `).join('')}
          </div>
          ` : ''}
        </div>
        ` : ''}
      `;
    } else {
      // Facebook
      const playbook = fb.growthPlaybook;
      platformHtmlBody = `
        <!-- KPI Row -->
        <div class="grid-4">
          <div class="metric-card">
            <div class="metric-label">Page Likes / Followers</div>
            <div class="metric-val">${formatNumber(fb.followers)}</div>
            <div class="metric-sub">+${formatNumber(fb.netGrowth)} net followers</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Total Reach</div>
            <div class="metric-val">${formatNumber(fb.reachOrganic + fb.reachPaid)}</div>
            <div class="metric-sub">${formatNumber(fb.reachOrganic)} organic · ${formatNumber(fb.reachPaid)} paid</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Engagement Rate</div>
            <div class="metric-val">${fb.engagementRate}%</div>
            <div class="metric-sub">Above Meta avg (1.5%)</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Video 3s Retention</div>
            <div class="metric-val">${fb.videoMetrics.retention3SecPercent}%</div>
            <div class="metric-sub">${fb.videoMetrics.retention1MinPercent}% 1-min retention</div>
          </div>
        </div>

        <!-- Format & Video Metrics -->
        <div class="section">
          <div class="section-title">01. Facebook Post Formats & Video Retention</div>
          <div class="grid-2">
            <div>
              <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #475569; margin-bottom: 6px;">Format Performance:</div>
              ${fb.postFormats.map((f) => `
                <div style="border: 1px solid var(--border); padding: 8px 10px; border-radius: 6px; margin-bottom: 6px; font-size: 11px; background: #fafafa;">
                  <div style="display: flex; justify-content: space-between; font-weight: 700;">
                    <span>${f.format} (${f.count} posts)</span>
                    <span style="color: #2563eb;">${f.avgEngagement}% ER</span>
                  </div>
                  <div style="color: #64748b; margin-top: 2px;">Avg Reach: ${formatNumber(f.avgReach)}</div>
                </div>
              `).join('')}
            </div>
            <div style="border: 1px solid var(--border); padding: 14px; border-radius: 8px; background: #fafafa; font-size: 12px;">
              <strong style="color: #09090b; display: block; margin-bottom: 6px;">Video Retention & Audience Demographics:</strong>
              <p style="color: #334155; line-height: 1.5; margin-bottom: 8px;">${fb.videoMetrics.commentary}</p>
              <div style="background: white; border: 1px solid #e2e8f0; padding: 8px; border-radius: 6px; font-size: 11px;">
                <div><strong>Demographics: </strong>${fb.demographics.topAgeGender}</div>
                <div style="color: #64748b; margin-top: 2px;">Locations: ${fb.demographics.topLocations.join(' · ')}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Top Facebook Posts -->
        <div class="section">
          <div class="section-title">02. Top Performing Facebook Posts</div>
          <div class="grid-2">
            ${fb.topPosts.map((post) => `
              <div style="border: 1px solid var(--border); padding: 12px; border-radius: 8px; background: #fafafa; font-size: 12px;">
                <div style="display: flex; justify-content: space-between; font-weight: 700; margin-bottom: 4px;">
                  <span style="color: #2563eb; font-size: 11px;">${formatNumber(post.reach)} reach</span>
                  <span style="color: #09090b;">${post.shares} shares · ${post.engagementRate}% ER</span>
                </div>
                <div style="font-weight: 700; color: #09090b; margin-bottom: 6px;">${post.title}</div>
                <div style="background: white; border: 1px solid var(--border); padding: 8px; border-radius: 6px; color: #334155; font-size: 11px;">
                  <strong>Why it worked: </strong>${post.whyItWorked}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Growth Playbook for Facebook -->
        ${playbook ? `
        <div class="section page-break">
          <div class="section-title">03. Facebook Community & Video Playbook</div>
          
          <!-- 1. Subs Strategy -->
          <div class="playbook-box">
            <div class="playbook-box-header">
              <span class="playbook-box-title">👥 Page Follower Conversion Funnel</span>
              <span class="badge">Page Follows</span>
            </div>
            <div class="field-row"><div class="field-label">Conversion Hook: </div><div class="field-val">${playbook.subsStrategy.conversionHook}</div></div>
            <div class="field-row"><div class="field-label">Page Bio / About: </div><div class="field-val">${playbook.subsStrategy.profileBioTweak}</div></div>
            <div class="field-row"><div class="field-label">Recurring Video Series: </div><div class="field-val">${playbook.subsStrategy.leadMagnetOrSeries}</div></div>
            <div class="action-badge-box"><strong>Immediate Key Action: </strong>${playbook.subsStrategy.keyAction}</div>
          </div>

          <!-- 2. Views & Reach Strategy -->
          <div class="playbook-box">
            <div class="playbook-box-header">
              <span class="playbook-box-title">🚀 Native Video Feed Reach Maximizer</span>
              <span class="badge">Watch Time</span>
            </div>
            <div class="field-row"><div class="field-label">First 2-Sec Muted Hook: </div><div class="field-val">${playbook.viewsStrategy.viralHookTemplate}</div></div>
            <div class="field-row"><div class="field-label">Retention Trigger: </div><div class="field-val">${playbook.viewsStrategy.retentionTrigger}</div></div>
            <div class="field-row"><div class="field-label">Algorithm Priority: </div><div class="field-val">${playbook.viewsStrategy.algorithmDistributionHack}</div></div>
            <div class="action-badge-box"><strong>Immediate Key Action: </strong>${playbook.viewsStrategy.keyAction}</div>
          </div>

          <!-- 3. Comments Strategy -->
          <div class="playbook-box">
            <div class="playbook-box-header">
              <span class="playbook-box-title">💬 Community Discussion & Polls</span>
              <span class="badge">Comments</span>
            </div>
            <div class="field-row"><div class="field-label">Discussion Prompt: </div><div class="field-val">${playbook.commentsStrategy.discussionPrompt}</div></div>
            <div class="field-row"><div class="field-label">Pinned Question: </div><div class="field-val">${playbook.commentsStrategy.pinnedCommentPlay}</div></div>
            <div class="action-badge-box"><strong>Immediate Key Action: </strong>${playbook.commentsStrategy.keyAction}</div>
          </div>

          <!-- 4. Algorithm News -->
          <div class="news-badge-box">
            <div style="font-weight: 800; text-transform: uppercase; font-size: 11px; margin-bottom: 4px;">⚡ 2026 Meta Algorithm Shift to Watch</div>
            <div style="font-weight: 700; margin-bottom: 4px;">${playbook.algorithmUpdatesNews.latestUpdate}</div>
            <div style="margin-bottom: 4px;"><strong>Impact on Brand: </strong>${playbook.algorithmUpdatesNews.impactOnBrand}</div>
            <div><strong>Tactical Pivot: </strong>${playbook.algorithmUpdatesNews.tacticalPivot}</div>
          </div>

          <!-- 5. Granular Suggestions -->
          ${playbook.suggestions && playbook.suggestions.length > 0 ? `
          <div style="margin-top: 16px;">
            <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; color: #475569; margin-bottom: 8px;">Specific Suggested Fields & Experiments:</div>
            ${playbook.suggestions.map((s) => `
              <div class="rec-card">
                <div class="rec-priority">[${s.field.toUpperCase()}] · ${s.label}</div>
                <div style="font-weight: 600; color: #09090b; margin-bottom: 2px;">${s.tactic}</div>
                <div style="font-size: 11px; color: #16a34a; font-weight: 600;">Expected Impact: ${s.expectedImpact}</div>
              </div>
            `).join('')}
          </div>
          ` : ''}
        </div>
        ` : ''}
      `;
    } else if (p === 'tiktok' && tt) {
      const playbook = tt.growthPlaybook;
      platformHtmlBody = `
        <!-- KPI Row -->
        <div class="grid-4">
          <div class="metric-card">
            <div class="metric-label">Followers & Net</div>
            <div class="metric-val">${formatNumber(tt.followers)}</div>
            <div class="metric-sub">+${formatNumber(tt.netGrowth)} net followers</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Video Views (30D)</div>
            <div class="metric-val">${formatNumber(tt.videoViews)}</div>
            <div class="metric-sub">${formatNumber(tt.profileViews)} profile visits</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Engagement Rate</div>
            <div class="metric-val">${tt.engagementRate}%</div>
            <div class="metric-sub">${formatNumber(tt.likes)} likes · ${formatNumber(tt.shares)} shares</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Watch Time / FYP %</div>
            <div class="metric-val">${tt.videoMetrics.completionRatePercent}% Full</div>
            <div class="metric-sub">${tt.videoMetrics.avgWatchTimeSec}s avg · ${tt.videoMetrics.fypTrafficPercent}% FYP</div>
          </div>
        </div>

        <!-- Format & Video Metrics -->
        <div class="section">
          <div class="section-title">01. TikTok Clip Formats & Watch Retention</div>
          <div class="grid-2">
            <div>
              <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #475569; margin-bottom: 6px;">Format Performance:</div>
              ${tt.postFormats.map((f) => `
                <div style="border: 1px solid var(--border); padding: 8px 10px; border-radius: 6px; margin-bottom: 6px; font-size: 11px; background: #fafafa;">
                  <div style="display: flex; justify-content: space-between; font-weight: 700;">
                    <span>${f.format} (${f.count} clips)</span>
                    <span style="color: #09090b;">${f.avgEngagement}% ER</span>
                  </div>
                  <div style="color: #64748b; font-size: 10px; margin-top: 2px;">
                    ${formatNumber(f.avgViews)} avg views per clip
                  </div>
                </div>
              `).join('')}
            </div>

            <div>
              <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #475569; margin-bottom: 6px;">Algorithm Retention & Demographics:</div>
              <div style="border: 1px solid var(--border); padding: 12px; border-radius: 8px; background: #f8fafc; font-size: 12px; line-height: 1.5; color: #334155; margin-bottom: 10px;">
                ${tt.videoMetrics.retentionInsight}
              </div>
              <div style="border: 1px solid var(--border); padding: 10px; border-radius: 6px; font-size: 11px; background: white;">
                <div style="font-weight: 700; color: #0f172a;">${tt.demographics.topAgeGender}</div>
                <div style="color: #64748b; margin-top: 2px;">Key Geographies: ${tt.demographics.topLocations.join(' · ')}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Top TikTok Posts -->
        <div class="section">
          <div class="section-title">02. Top Performing TikTok Videos</div>
          <div class="grid-2">
            ${tt.topPosts.map((post) => `
              <div style="border: 1px solid var(--border); padding: 12px; border-radius: 8px; background: #fafafa; font-size: 12px;">
                <div style="display: flex; justify-content: space-between; font-weight: 700; margin-bottom: 4px;">
                  <span style="color: #09090b; font-size: 11px;">${formatNumber(post.views)} views</span>
                  <span style="color: #09090b;">${post.likes} likes · ${post.shares} shares</span>
                </div>
                <div style="font-weight: 700; color: #09090b; margin-bottom: 6px;">${post.title}</div>
                <div style="background: white; border: 1px solid var(--border); padding: 8px; border-radius: 6px; color: #334155; font-size: 11px;">
                  <strong>Why it worked: </strong>${post.whyItWorked}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Growth Playbook for TikTok -->
        ${playbook ? `
        <div class="section page-break">
          <div class="section-title">03. TikTok Viral Pacing & Creator Playbook</div>
          
          <!-- 1. Subs Strategy -->
          <div class="playbook-box">
            <div class="playbook-box-header">
              <span class="playbook-box-title">👥 Follower Conversion Funnel</span>
              <span class="badge">Followers</span>
            </div>
            <div class="field-row"><div class="field-label">Conversion Hook: </div><div class="field-val">${playbook.subsStrategy.conversionHook}</div></div>
            <div class="field-row"><div class="field-label">Bio Optimization: </div><div class="field-val">${playbook.subsStrategy.profileBioTweak}</div></div>
            <div class="field-row"><div class="field-label">Recurring Video Series: </div><div class="field-val">${playbook.subsStrategy.leadMagnetOrSeries}</div></div>
            <div class="action-badge-box"><strong>Immediate Key Action: </strong>${playbook.subsStrategy.keyAction}</div>
          </div>

          <!-- 2. Views & Reach Strategy -->
          <div class="playbook-box">
            <div class="playbook-box-header">
              <span class="playbook-box-title">🚀 FYP Algorithm & View Acceleration</span>
              <span class="badge">Watch Time</span>
            </div>
            <div class="field-row"><div class="field-label">First 1.5s Hook Pattern: </div><div class="field-val">${playbook.viewsStrategy.viralHookTemplate}</div></div>
            <div class="field-row"><div class="field-label">Retention Trigger: </div><div class="field-val">${playbook.viewsStrategy.retentionTrigger}</div></div>
            <div class="field-row"><div class="field-label">FYP Loop Mechanism: </div><div class="field-val">${playbook.viewsStrategy.algorithmDistributionHack}</div></div>
            <div class="action-badge-box"><strong>Immediate Key Action: </strong>${playbook.viewsStrategy.keyAction}</div>
          </div>

          <!-- 3. Comments Strategy -->
          <div class="playbook-box">
            <div class="playbook-box-header">
              <span class="playbook-box-title">💬 Comment Section Controversy & Debates</span>
              <span class="badge">Comments</span>
            </div>
            <div class="field-row"><div class="field-label">Discussion Prompt: </div><div class="field-val">${playbook.commentsStrategy.discussionPrompt}</div></div>
            <div class="field-row"><div class="field-label">Pinned Comment Play: </div><div class="field-val">${playbook.commentsStrategy.pinnedCommentPlay}</div></div>
            <div class="field-row"><div class="field-label">First Hour Replies: </div><div class="field-val">${playbook.commentsStrategy.engagementVelocityTactic}</div></div>
            <div class="action-badge-box"><strong>Immediate Key Action: </strong>${playbook.commentsStrategy.keyAction}</div>
          </div>

          <!-- 4. Algorithm News -->
          <div class="playbook-box">
            <div class="playbook-box-header">
              <span class="playbook-box-title">⚡ 2026 TikTok Algorithm News</span>
              <span class="badge">Shift</span>
            </div>
            <div class="field-row"><div class="field-label">Algorithm Update: </div><div class="field-val">${playbook.algorithmUpdatesNews.latestUpdate}</div></div>
            <div class="field-row"><div class="field-label">Brand Impact: </div><div class="field-val">${playbook.algorithmUpdatesNews.impactOnBrand}</div></div>
            <div class="action-badge-box" style="background: #fffbeb; border-color: #fde68a; color: #92400e;"><strong>Tactical Counter-Measure: </strong>${playbook.algorithmUpdatesNews.tacticalPivot}</div>
          </div>

          <!-- Tactical suggestions -->
          ${playbook.suggestions && playbook.suggestions.length > 0 ? `
            <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #475569; margin: 16px 0 8px;">Actionable Field Experiments:</div>
            <div class="grid-2">
              ${playbook.suggestions.map((s) => `
                <div style="border: 1px solid var(--border); padding: 10px; border-radius: 8px; background: #fafafa; font-size: 11px;">
                  <div style="font-weight: 700; color: #09090b; margin-bottom: 2px;">[${s.field.toUpperCase()}] ${s.label}</div>
                  <div style="color: #334155; margin-bottom: 4px;">${s.tactic}</div>
                  <div style="color: #16a34a; font-weight: 600;">Expected Impact: ${s.expectedImpact}</div>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
        ` : ''}
      `;
    }

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>${commonStyles}</style>
</head>
<body>
  <div class="container">
    <div class="toolbar">
      <div>
        <span class="badge badge-platform">ISOLATED ${targetPlatform.toUpperCase()} PERFORMANCE DOSSIER</span>
        <div style="font-size: 12px; color: #64748b; margin-top: 2px;">Dedicated single-channel briefing. All metrics and tactics strictly isolated to ${targetPlatform.toUpperCase()}.</div>
      </div>
      <button class="btn" onclick="window.print()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
        Save / Print as PDF
      </button>
    </div>

    <!-- Header -->
    <div class="header">
      <div>
        <span class="badge">LATSKY SOCIALS SINGLE-CHANNEL INTELLIGENCE</span>
        <h1 class="title">${report.clientName}</h1>
        <div class="subtitle"><strong>${targetPlatform.toUpperCase()} Channel Performance Audit</strong> · Reporting Period: <strong>${report.reportPeriod}</strong> (${report.comparisonPeriod})</div>
        <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Prepared by ${report.preparedBy || report.agencyName} · Confidential Deliverable</div>
      </div>
      ${report.clientLogoUrl ? `<img src="${report.clientLogoUrl}" alt="Logo" class="logo" />` : ''}
    </div>

    <!-- Platform Body -->
    ${platformHtmlBody}

    <!-- Platform Specific Recommendations -->
    ${platformRecs.length > 0 ? `
    <div class="section">
      <div class="section-title">04. Dedicated ${targetPlatform.toUpperCase()} Recommendations & Way Forward</div>
      ${platformRecs.map((rec) => `
        <div class="rec-card">
          <div class="rec-priority">[${rec.priority} Priority] · ${rec.platform}</div>
          <div style="font-weight: 600; color: #09090b; margin-bottom: 3px;">${rec.recommendation}</div>
          <div style="font-size: 11px; color: #64748b;">Expected Outcome: ${rec.expectedOutcome}</div>
        </div>
      `).join('')}
    </div>
    ` : ''}

    <div class="footer">
      <div>Exclusive ${targetPlatform.toUpperCase()} Briefing generated by ${report.agencyName || 'Latsky Socials'}</div>
      <div>Confidential Client Deliverable · ${new Date().toLocaleDateString()}</div>
    </div>
  </div>
</body>
</html>`;
  }

  // =========================================================================
  // MULTI-PLATFORM OVERALL REPORT BRANCH (When full report is requested)
  // =========================================================================
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>${commonStyles}</style>
</head>
<body>
  <div class="container">
    <div class="toolbar">
      <div>
        <span class="badge">LATSKY SOCIALS REPORT EXPORT</span>
        <div style="font-size: 12px; color: #64748b;">Ready to print or save as PDF via your browser's Print dialog.</div>
      </div>
      <button class="btn" onclick="window.print()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
        Save / Print as PDF
      </button>
    </div>

    <div class="header">
      <div>
        <span class="badge">LATSKY SOCIALS INTELLIGENCE</span>
        <h1 class="title">${report.clientName}</h1>
        <div class="subtitle">${report.clientSubtitle || 'Executive Monthly Review'} · Reporting Period: <strong>${report.reportPeriod}</strong> (${report.comparisonPeriod})</div>
        <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Agency: ${report.agencyName} · Prepared by: ${report.preparedBy}</div>
      </div>
      ${report.clientLogoUrl ? `<img src="${report.clientLogoUrl}" alt="Logo" class="logo" />` : ''}
    </div>

    <!-- Executive Summary -->
    <div class="section">
      <div class="section-title">01. Executive Summary</div>
      
      <div class="grid-2">
        <div class="metric-card">
          <div class="metric-label">Cross-Platform Reach</div>
          <div class="metric-val">${formatNumber(report.executiveSummary.overallReach)}</div>
          <div class="metric-sub">${formatPercent(report.executiveSummary.overallReachPrevDelta, true)} MoM · ${formatPercent(report.executiveSummary.overallReachYoYDelta, true)} YoY</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Avg Engagement Rate</div>
          <div class="metric-val">${formatPercent(report.executiveSummary.overallEngagementRate)}</div>
          <div class="metric-sub">${formatPercent(report.executiveSummary.overallEngagementPrevDelta, true)} MoM</div>
        </div>
      </div>

      <div style="margin-bottom: 10px; font-weight: 700; font-size: 12px; text-transform: uppercase; color: #475569;">Key Takeaways:</div>
      <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px;">
        ${report.executiveSummary.headlineTakeaways.map((t) => `
          <li style="padding: 10px 14px; background: #ffffff; border: 1px solid var(--border); border-radius: 8px; font-size: 12px; line-height: 1.5;">
            <strong>Takeaway: </strong>${t}
          </li>
        `).join('')}
      </ul>

      <div class="grid-2" style="margin-top: 14px;">
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 12px; border-radius: 8px;">
          <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #166534; margin-bottom: 3px;">Top Win</div>
          <div style="font-size: 12px; color: #14532d;">${report.executiveSummary.keyWins[0] || 'Strong reach growth'}</div>
        </div>
        <div style="background: #fffbeb; border: 1px solid #fde68a; padding: 12px; border-radius: 8px;">
          <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #92400e; margin-bottom: 3px;">Watch Item</div>
          <div style="font-size: 12px; color: #78350f;">${report.executiveSummary.watchItem || 'Monitor follower churn'}</div>
        </div>
      </div>
    </div>

    <!-- Cross-Platform Table -->
    <div class="section page-break">
      <div class="section-title">02. Cross-Platform Performance Overview</div>
      <div style="font-size: 12px; color: #475569; margin-bottom: 10px;">${report.crossPlatformOverview.highlightInsight}</div>
      <table>
        <thead>
          <tr>
            <th>Platform</th>
            <th>Audience (Δ)</th>
            <th>Monthly Reach</th>
            <th>Engagement Rate</th>
            <th>Top Content Type</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((row) => `
            <tr>
              <td><strong>${row.platformLabel}</strong></td>
              <td>${formatNumber(row.followers)} (${row.followersDelta > 0 ? '+' : ''}${formatNumber(row.followersDelta)})</td>
              <td>${formatNumber(row.reach)} (${formatPercent(row.reachDelta, true)})</td>
              <td><strong>${formatPercent(row.engagementRate)}</strong></td>
              <td>${row.topContentType}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- Recommendations -->
    <div class="section">
      <div class="section-title">03. Actionable Way Forward & Recommendations</div>
      <div style="margin-bottom: 14px;">
        ${recs.map((rec) => `
          <div class="rec-card">
            <div class="rec-priority">[${rec.priority} Priority] · ${rec.platform}</div>
            <div style="font-weight: 600; color: #09090b; margin-bottom: 3px;">${rec.recommendation}</div>
            <div style="font-size: 11px; color: #64748b;">Expected Outcome: ${rec.expectedOutcome}</div>
          </div>
        `).join('')}
      </div>

      <div style="background: #f1f5f9; padding: 14px; border-radius: 8px; font-size: 12px; margin-top: 14px;">
        <strong>Content Calendar Direction for Next Month:</strong>
        <p style="margin-top: 4px; color: #334155;">${report.recommendations.contentCalendarDirection}</p>
      </div>
    </div>

    <div class="footer">
      <div>Report generated by ${report.agencyName || 'Latsky Socials'}</div>
      <div>Confidential Client Deliverable · ${new Date().toLocaleDateString()}</div>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Downloads a file directly to the user's computer
 */
export function downloadFile(content: string, filename: string, mimeType: string): boolean {
  try {
    const blob = new Blob([content], { type: mimeType });
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
    }, 250);
    return true;
  } catch (err) {
    console.error('downloadFile failed:', err);
    return false;
  }
}

/**
 * Exports printable HTML report.
 * If platform is specified (e.g. 'youtube', 'instagram', 'linkedin', 'facebook'),
 * it downloads the strictly isolated single-platform dossier.
 */
export function exportHtmlReport(report: SocialReportData, platform?: PlatformType | 'overall'): boolean {
  const isPlatform = Boolean(platform && platform !== 'overall');
  const sanitizedClient = (report.clientName || 'Client').replace(/[^a-z0-9_-]/gi, '_');
  const sanitizedPeriod = (report.reportPeriod || 'Report').replace(/[^a-z0-9_-]/gi, '_');
  const platformPrefix = isPlatform ? `${platform?.toUpperCase()}_ONLY_` : '';
  const filename = `${sanitizedClient}_${platformPrefix}Social_Report_${sanitizedPeriod}.html`;
  const html = generateStandaloneHtmlReport(report, platform);
  return downloadFile(html, filename, 'text/html;charset=utf-8');
}

/**
 * Exports report in Markdown format
 */
export function exportMarkdownReport(report: SocialReportData, markdownContent: string): boolean {
  const sanitizedClient = (report.clientName || 'Client').replace(/[^a-z0-9_-]/gi, '_');
  const sanitizedPeriod = (report.reportPeriod || 'Report').replace(/[^a-z0-9_-]/gi, '_');
  const filename = `${sanitizedClient}_Social_Summary_${sanitizedPeriod}.md`;
  return downloadFile(markdownContent, filename, 'text/markdown;charset=utf-8');
}
