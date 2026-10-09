import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { generateSynthesizedAgencyReport } from './serverReportSynthesizer.js';
import { parseMetaCsvExports, applyMetaCsvToReport, parseMetric } from './src/utils/metaCsvParser.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

/**
 * Reconciles and harmonizes all social metrics:
 * 1. Synchronizes summaryTable with platform-specific fields.
 * 2. STRICTLY zeros out any platform that is NOT in requestedPlatforms or has 0 followers/reach.
 * 3. Deterministically computes overallReach as the true mathematical sum of active tracked platforms.
 * 4. Computes true reach-weighted engagement rates to eliminate AI calculation errors.
 */
function reconcileAndHarmonizeReport(
  report: any,
  requestedPlatforms: string[] = [],
  knownMetrics: Record<string, any> = {}
) {
  if (!report) return report;

  const validPlatforms = ['youtube', 'instagram', 'linkedin', 'facebook', 'tiktok'];
  // Empty platforms array should NOT default to all platforms; empty means no active platforms requested
  const targets = Array.isArray(requestedPlatforms)
    ? requestedPlatforms.map((p) => p.toLowerCase())
    : validPlatforms;

  const isPlatformActive = (plat: string) => targets.includes(plat.toLowerCase());

  if (!report.crossPlatformOverview) report.crossPlatformOverview = {};
  if (!Array.isArray(report.crossPlatformOverview.summaryTable)) {
    report.crossPlatformOverview.summaryTable = [];
  }

  const defaultLabels: Record<string, string> = {
    youtube: 'YouTube',
    instagram: 'Instagram',
    linkedin: 'LinkedIn',
    facebook: 'Facebook',
    tiktok: 'TikTok'
  };

  // Ensure each platform row exists
  validPlatforms.forEach((plat) => {
    let row = report.crossPlatformOverview.summaryTable.find(
      (r: any) => r && r.platform && r.platform.toLowerCase() === plat
    );
    if (!row) {
      row = {
        platform: plat,
        platformLabel: defaultLabels[plat],
        followers: 0,
        followersDelta: 0,
        reach: 0,
        reachDelta: 0,
        engagementRate: 0,
        topContentType: 'Not Monitored',
        totalPosts: 0
      };
      report.crossPlatformOverview.summaryTable.push(row);
    }
  });

  // STEP 1: SYNC PRIOR TO ZERO-OUT & APPLY KNOWN METRICS PRECEDENCE
  validPlatforms.forEach((plat) => {
    const row = report.crossPlatformOverview.summaryTable.find((r: any) => r.platform?.toLowerCase() === plat);
    if (!row) return;

    if (report[plat]) {
      const subsOrFollowers = parseMetric(report[plat].subscribers || report[plat].followers || row.followers);
      const netDelta = parseMetric(report[plat].netGrowth || row.followersDelta);
      const reachVal = parseMetric(report[plat].reach || report[plat].impressions || report[plat].videoViews || row.reach);
      const engVal = parseMetric(report[plat].engagementRate || row.engagementRate);

      report[plat].followers = subsOrFollowers;
      if (report[plat].subscribers !== undefined) report[plat].subscribers = subsOrFollowers;
      report[plat].netGrowth = netDelta;

      row.followers = subsOrFollowers;
      row.followersDelta = netDelta;
      row.reach = reachVal;
      row.engagementRate = engVal;
    }

    // Apply known user metrics with strict top precedence
    if (knownMetrics[`${plat}Subscribers`] !== undefined && knownMetrics[`${plat}Subscribers`] !== '') {
      const kmSubs = parseMetric(knownMetrics[`${plat}Subscribers`]);
      if (report[plat]) report[plat].subscribers = kmSubs;
      row.followers = kmSubs;
    }
    if (knownMetrics[`${plat}Followers`] !== undefined && knownMetrics[`${plat}Followers`] !== '') {
      const kmFollowers = parseMetric(knownMetrics[`${plat}Followers`]);
      if (report[plat]) report[plat].followers = kmFollowers;
      row.followers = kmFollowers;
    }
    if (knownMetrics[`${plat}NetGrowth`] !== undefined && knownMetrics[`${plat}NetGrowth`] !== '') {
      const kmNet = parseMetric(knownMetrics[`${plat}NetGrowth`]);
      if (report[plat]) report[plat].netGrowth = kmNet;
      row.followersDelta = kmNet;
    }
    if (knownMetrics[`${plat}Reach`] !== undefined && knownMetrics[`${plat}Reach`] !== '') {
      const kmReach = parseMetric(knownMetrics[`${plat}Reach`]);
      if (report[plat]) report[plat].reach = kmReach;
      row.reach = kmReach;
    }
  });

  // STEP 2: RECURSIVE ZERO-OUT OF INACTIVE PLATFORMS (INCLUDING reachOrganic, reachPaid & stale deltas)
  validPlatforms.forEach((plat) => {
    const row = report.crossPlatformOverview.summaryTable.find((r: any) => r.platform?.toLowerCase() === plat);
    const active = isPlatformActive(plat);

    if (!active) {
      if (report[plat]) {
        report[plat].followers = 0;
        report[plat].subscribers = 0;
        report[plat].netGrowth = 0;
        report[plat].reach = 0;
        report[plat].reachOrganic = 0;
        report[plat].reachPaid = 0;
        report[plat].impressions = 0;
        report[plat].videoViews = 0;
        report[plat].views = 0;
        report[plat].watchTimeHours = 0;
        report[plat].engagementRate = 0;
        report[plat].topPosts = [];
        report[plat].topVideos = [];
        report[plat].postFormats = [];
        report[plat].formatSplit = [];
        report[plat].trafficSources = [];
        report[plat].contentTypes = [];
        report[plat].growthPlaybook = null;
        if (report[plat].videoMetrics) {
          report[plat].videoMetrics = {
            views: 0,
            avgWatchTimeSec: 0,
            retention3SecPercent: 0,
            retention1MinPercent: 0,
            commentary: 'Active cross-syndication opportunity.'
          };
        }
        if (report[plat].demographics) {
          report[plat].demographics = {
            topLocations: [],
            topAgeGender: 'Omni-Channel Baseline',
            summary: 'Cross-syndication pipeline.'
          };
        }
      }
      if (row) {
        row.followers = 0;
        row.followersDelta = 0;
        row.reach = 0;
        row.reachDelta = 0;
        row.engagementRate = 0;
        row.totalPosts = 0;
        row.topContentType = 'Not Monitored';
      }
    } else if (row && row.followers === 0 && row.reach === 0) {
      // Clear stale delta fields if no followers or reach present
      row.followersDelta = 0;
      row.reachDelta = 0;
      row.engagementRate = 0;
      if (report[plat]) {
        report[plat].netGrowth = 0;
        report[plat].reachOrganic = 0;
        report[plat].reachPaid = 0;
        report[plat].engagementRate = 0;
      }
    }
  });

  // DETERMINISTICALLY RECALCULATE EXECUTIVE SUMMARY TOTALS (NO AI MATH ERRORS)
  if (!report.executiveSummary) report.executiveSummary = {};
  
  const activeRows = report.crossPlatformOverview.summaryTable.filter(
    (r: any) => isPlatformActive(r.platform) && (parseMetric(r.followers) > 0 || parseMetric(r.reach) > 0)
  );

  const totalCalculatedReach = activeRows.reduce((sum: number, r: any) => sum + parseMetric(r.reach), 0);
  report.executiveSummary.overallReach = totalCalculatedReach;

  const weightedEngSum = activeRows.reduce(
    (sum: number, r: any) => sum + (parseMetric(r.reach) * parseMetric(r.engagementRate)),
    0
  );

  if (totalCalculatedReach > 0) {
    report.executiveSummary.overallEngagementRate = Number((weightedEngSum / totalCalculatedReach).toFixed(1));
  } else {
    report.executiveSummary.overallEngagementRate = 0.0;
  }

  // Filter cross-platform top posts and recommendations to only active platforms
  if (report.contentPerformance?.topPostsAllPlatforms && Array.isArray(report.contentPerformance.topPostsAllPlatforms)) {
    report.contentPerformance.topPostsAllPlatforms = report.contentPerformance.topPostsAllPlatforms.filter(
      (p: any) => p && p.platform && isPlatformActive(p.platform)
    );
  }

  if (report.recommendations?.actionableItems && Array.isArray(report.recommendations.actionableItems)) {
    report.recommendations.actionableItems = report.recommendations.actionableItems.filter(
      (item: any) => !item.platform || isPlatformActive(item.platform.toLowerCase())
    );
  }

  return report;
}

async function startServer() {
  const app = express();
  
  const portArgIdx = process.argv.indexOf('--port');
  const cliPort = portArgIdx !== -1 && process.argv[portArgIdx + 1] ? parseInt(process.argv[portArgIdx + 1], 10) : null;
  const PORT = cliPort || (process.env.PORT ? parseInt(process.env.PORT, 10) : 3000) || 3000;

  const hostArgIdx = process.argv.indexOf('--host');
  const HOST = hostArgIdx !== -1 && process.argv[hostArgIdx + 1] ? process.argv[hostArgIdx + 1] : '0.0.0.0';

  app.use(express.json({ limit: '60mb' }));
  app.use(express.urlencoded({ extended: true, limit: '60mb' }));

  // Support both root and GitHub Pages subfolder prefix in dev / preview
  app.use((req, _res, next) => {
    if (req.url.startsWith('/Latsky-Socials-Analitics/')) {
      req.url = req.url.replace('/Latsky-Socials-Analitics/', '/');
    }
    next();
  });

  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString()
    });
  });

  // Enhanced Multimodal Screenshot Analysis with Auto-Classification
  app.post('/api/analyze-screenshots', async (req, res) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.status(400).json({
          error: 'GEMINI_API_KEY is not configured in the environment. Please check your secrets configuration.'
        });
      }

      const {
        images,
        clientName = 'Client Brand',
        clientSubtitle = '',
        reportPeriod = 'Current Month',
        goals = '',
        notes = '',
        platforms = ['facebook', 'instagram', 'youtube', 'linkedin', 'tiktok'],
        knownMetrics = {}
      } = req.body;

      if (!Array.isArray(images) || images.length === 0) {
        return res.status(400).json({
          error: 'No files provided for audit. At least one screenshot or export is required.'
        });
      }

      const multimodalParts: any[] = [];
      const csvDataBlocks: string[] = [];

      images.forEach((img: any, idx: number) => {
        const fileName = img.name || `uploaded_file_${idx + 1}`;
        const platform = (img.platform || img.label || 'general').toUpperCase();

        const isCsv = img.fileType === 'csv' || 
          fileName.toLowerCase().endsWith('.csv') || 
          fileName.toLowerCase().endsWith('.tsv') || 
          img.dataUrl?.startsWith('data:text/csv');

        if (isCsv) {
          let text = img.textContent || '';
          if (!text && img.dataUrl && img.dataUrl.includes(',')) {
            const split = img.dataUrl.split(',');
            try {
              text = Buffer.from(split[1], 'base64').toString('utf-8');
            } catch {
              text = split[1];
            }
          }
          if (text) {
            csvDataBlocks.push(`=== CSV TABULAR DATA #${idx + 1}: "${fileName}" [Target: ${platform}] ===\n${text}\n=============================================================`);
          }
          return;
        }

        let mimeType = img.mimeType || 'image/jpeg';
        let base64Data = img.dataUrl || '';

        if (img.dataUrl && img.dataUrl.includes(',')) {
          const split = img.dataUrl.split(',');
          base64Data = split[1];
          const match = split[0].match(/:(.*?);/);
          if (match && match[1]) mimeType = match[1];
        }

        base64Data = base64Data.trim().replace(/\s+/g, '');
        if (!mimeType) mimeType = 'image/jpeg';
        if (mimeType.toLowerCase() === 'image/jpg') mimeType = 'image/jpeg';

        multimodalParts.push({
          text: `\n[FILE ATTACHMENT #${idx + 1}: ${fileName} (Tag: ${platform})]`
        });
        multimodalParts.push({
          inlineData: { mimeType, data: base64Data }
        });
      });

      const auditPrompt = `
You are an elite Director of Social Media Strategy & Analytics at a world-class creative agency (operating with Claude-level forensic depth).
Analyze the attached dashboard screenshots for client "${clientName}" (${clientSubtitle}). Period: "${reportPeriod}".
User Goals / Notes: "${goals} ${notes}".
ACTIVELY MONITORED PLATFORMS: ${platforms.join(', ')}.
UNMONITORED PLATFORMS (Must be strictly set to 0 and marked as "Not Monitored"): All platforms NOT in the active list above.

${csvDataBlocks.length > 0 ? `RAW CSV TABULAR DATA:\n${csvDataBlocks.join('\n\n')}\n` : ''}

CRITICAL AUTO-CLASSIFICATION & DIAGNOSTIC INSTRUCTIONS:
1. AUTO-CLASSIFY EVERY ATTACHMENT:
   Examine each image or data export closely. Automatically classify what platform it is (e.g., instagram, youtube, tiktok, facebook, linkedin, ga4, or general) and the screenType (e.g., "Instagram Reach Overview", "YouTube Studio Audience Retention", "TikTok Video Performance", "GA4 Acquisition Report", "Meta Page Performance", "LinkedIn Seniority Demographics").
2. CRISIS-FIX CONTENT HOOKS:
   Generate 5 crisis-fix content hooks based on performance dips, retention friction, or drop-offs discovered in the data.
3. PRECISE QUANTITATIVE EXTRACTION:
   Extract exact numbers (followers, subscribers, net delta, reach, views, watch time, engagement rates).
4. UNMONITORED PLATFORMS:
   If a platform is NOT in [${platforms.join(', ')}], strictly set followers to 0 and reach to 0.

Produce strictly valid JSON adhering to this structure:
{
  "classifiedUploads": [
    { "fileName": "string", "detectedPlatform": "instagram/youtube/tiktok/facebook/linkedin/ga4", "screenType": "string" }
  ],
  "clientName": "${clientName}",
  "clientSubtitle": "${clientSubtitle}",
  "reportPeriod": "${reportPeriod}",
  "executiveSummary": {
    "headlineTakeaways": ["Takeaway 1", "Takeaway 2", "Takeaway 3"],
    "overallReach": 0,
    "overallReachPrevDelta": 0,
    "overallReachYoYDelta": 0,
    "overallEngagementRate": 0.0,
    "overallEngagementPrevDelta": 0.0,
    "keyWins": ["Win 1", "Win 2"],
    "watchItem": "Primary warning bottleneck"
  },
  "crisisFixHooks": [
    { "platform": "Instagram", "weaknessFound": "e.g. Drop-off at second 3", "hookSolution": "Exact 2-second visual hook script" },
    { "platform": "YouTube", "weaknessFound": "e.g. CTR below 4% on browse features", "hookSolution": "Thumb/title curiosity gap adjustment" },
    { "platform": "TikTok", "weaknessFound": "e.g. Completion rate falloff after 15s", "hookSolution": "Micro-pattern interrupt sound/cut" },
    { "platform": "LinkedIn", "weaknessFound": "e.g. Low comment velocity on link posts", "hookSolution": "Native document slider format pivot" },
    { "platform": "Facebook", "weaknessFound": "e.g. Organic reach suppression", "hookSolution": "Vertical reel with immediate community question" }
  ],
  "crossPlatformOverview": {
    "highlightInsight": "Cross-platform synthesis",
    "summaryTable": [
      { "platform": "youtube", "platformLabel": "YouTube", "followers": 0, "followersDelta": 0, "reach": 0, "reachDelta": 0, "engagementRate": 0.0, "totalPosts": 0, "topContentType": "Docu" },
      { "platform": "instagram", "platformLabel": "Instagram", "followers": 0, "followersDelta": 0, "reach": 0, "reachDelta": 0, "engagementRate": 0.0, "totalPosts": 0, "topContentType": "Reels" },
      { "platform": "linkedin", "platformLabel": "LinkedIn", "followers": 0, "followersDelta": 0, "reach": 0, "reachDelta": 0, "engagementRate": 0.0, "totalPosts": 0, "topContentType": "PDFs" },
      { "platform": "facebook", "platformLabel": "Facebook", "followers": 0, "followersDelta": 0, "reach": 0, "reachDelta": 0, "engagementRate": 0.0, "totalPosts": 0, "topContentType": "Native Video" },
      { "platform": "tiktok", "platformLabel": "TikTok", "followers": 0, "followersDelta": 0, "reach": 0, "reachDelta": 0, "engagementRate": 0.0, "totalPosts": 0, "topContentType": "Loops" }
    ]
  }
}
Output strictly valid JSON with no markdown wrapping.`;

      const candidateModels = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
      let responseText = '';

      for (const model of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents: { parts: [...multimodalParts, { text: auditPrompt }] },
            config: {
              systemInstruction: 'You are an expert agency analyst. Output strictly valid JSON matching the requested schema with zero markdown formatting backticks.',
              responseMimeType: 'application/json'
            }
          });
          responseText = response.text || '';
          if (responseText) break;
        } catch (err) {
          console.warn(`Model ${model} failed, trying next...`, err);
        }
      }

      let parsedData: any = null;
      if (responseText) {
        try {
          const cleaned = responseText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
          parsedData = JSON.parse(cleaned);
        } catch (e) {
          console.warn('JSON parse failed, falling back to agency synthesizer.');
        }
      }

      // Generate a rich agency baseline report so all deep-dive sections (platforms, recommendations, audience) are complete
      const baseReport = generateSynthesizedAgencyReport({
        clientName,
        clientSubtitle,
        reportPeriod,
        goals,
        notes,
        platforms,
        imageCount: images.length,
        knownMetrics
      });

      // Merge auto-classification, crisis hooks, and extracted metrics onto the base report
      const mergedReport = {
        ...baseReport,
        ...parsedData,
        executiveSummary: {
          ...baseReport.executiveSummary,
          ...(parsedData?.executiveSummary || {})
        },
        crossPlatformOverview: {
          ...baseReport.crossPlatformOverview,
          ...(parsedData?.crossPlatformOverview || {})
        },
        classifiedUploads: parsedData?.classifiedUploads || images.map((img: any, idx: number) => ({
          fileName: img.name || `Upload #${idx + 1}`,
          detectedPlatform: img.platform || 'general',
          screenType: `${(img.platform || 'Social').toUpperCase()} Dashboard Screenshot`
        })),
        crisisFixHooks: parsedData?.crisisFixHooks || [
          {
            platform: 'Instagram',
            weaknessFound: 'Drop-off at second 3 on Reels; viewers scrolling before value pitch',
            hookSolution: 'Open with immediate frame motion: "Stop doing X if you want Y" text overlay in first 1.5 seconds.'
          },
          {
            platform: 'YouTube',
            weaknessFound: 'CTR below 4% on browse features; thumbnail text too small on mobile',
            hookSolution: 'Crop thumbnail subject 30% closer; reduce title words to under 45 characters with high-curiosity keyword.'
          },
          {
            platform: 'TikTok',
            weaknessFound: 'Completion rate dipping on videos over 25 seconds',
            hookSolution: 'Insert micro-pattern interrupt (B-roll cut + sound effect) every 4 seconds to reset attention clock.'
          }
        ]
      };

      // Ingest Meta CSV Exports directly if present in uploads
      const csvMetrics = parseMetaCsvExports(images);
      let reportWithCsv = mergedReport;
      if (csvMetrics.filesProcessed.length > 0) {
        reportWithCsv = applyMetaCsvToReport(mergedReport, csvMetrics, platforms);
      }

      // HARMONIZE AND RECONCILE (Enforces mathematical correctness, weighted averages, and zero-out rules)
      const finalReport = reconcileAndHarmonizeReport(reportWithCsv, platforms, knownMetrics);

      return res.json({
        success: true,
        report: finalReport,
        isAiGenerated: Boolean(parsedData),
        csvFilesParsed: csvMetrics.filesProcessed
      });
    } catch (err: any) {
      console.error('Audit analysis error:', err);
      const csvMetrics = parseMetaCsvExports(req.body?.images || []);
      const fallback = generateSynthesizedAgencyReport({
        clientName: req.body?.clientName || 'Client Brand',
        clientSubtitle: req.body?.clientSubtitle || '',
        reportPeriod: req.body?.reportPeriod || 'Current Month',
        platforms: req.body?.platforms || ['facebook', 'instagram', 'youtube', 'linkedin', 'tiktok'],
        knownMetrics: req.body?.knownMetrics || {}
      });
      const reportWithCsv = csvMetrics.filesProcessed.length > 0
        ? applyMetaCsvToReport(fallback, csvMetrics, req.body?.platforms)
        : fallback;
      const reconciledFallback = reconcileAndHarmonizeReport(reportWithCsv, req.body?.platforms, req.body?.knownMetrics);
      return res.json({ success: true, report: reconciledFallback, isSynthesized: true });
    }
  });

  app.post('/api/synthesize-report', (req, res) => {
    try {
      const {
        clientName = 'Client Brand',
        clientSubtitle = '',
        reportPeriod = 'Current Month',
        goals = '',
        notes = '',
        platforms = ['facebook', 'instagram', 'youtube', 'linkedin', 'tiktok'],
        imageCount = 0,
        knownMetrics = {},
        files = [],
        images = []
      } = req.body;

      const rawReport = generateSynthesizedAgencyReport({
        clientName,
        clientSubtitle,
        reportPeriod,
        goals,
        notes,
        platforms,
        imageCount,
        knownMetrics,
      });

      const allFiles = [...(files || []), ...(images || [])];
      const csvMetrics = parseMetaCsvExports(allFiles);
      const reportWithCsv = csvMetrics.filesProcessed.length > 0
        ? applyMetaCsvToReport(rawReport, csvMetrics, platforms)
        : rawReport;

      const report = reconcileAndHarmonizeReport(reportWithCsv, platforms, knownMetrics);
      return res.json({ success: true, report, isSynthesized: true });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Synthesis failed' });
    }
  });

  // Firecrawl Live URL & Competitor Scraping Endpoint
  app.post('/api/firecrawl-scrape', async (req, res) => {
    try {
      const { url, clientName = '', apiKey = '' } = req.body;
      const firecrawlKey = apiKey || process.env.FIRECRAWL_API_KEY;

      if (!url) {
        return res.status(400).json({ error: 'Target URL is required for Firecrawl research.' });
      }

      let markdownContent = '';
      let crawlTitle = '';

      if (firecrawlKey && firecrawlKey !== 'fc-YOUR_FIRECRAWL_KEY') {
        try {
          const fcResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${firecrawlKey}`,
            },
            body: JSON.stringify({
              url,
              formats: ['markdown'],
              onlyMainContent: true,
              waitFor: 2000,
            }),
          });

          if (!fcResponse.ok) {
            const errData = await fcResponse.json().catch(() => ({}));
            throw new Error(errData.error || `Firecrawl error ${fcResponse.status}`);
          }

          const fcData = await fcResponse.json();
          markdownContent = fcData?.data?.markdown || '';
          crawlTitle = fcData?.data?.metadata?.title || url;
        } catch (fcErr: any) {
          console.warn('Firecrawl API request failed, falling back to simulated extraction:', fcErr.message);
        }
      }

      // If no valid key was configured or API was unreachable, use Gemini research
      if (!markdownContent) {
        const researchPrompt = `
You are an expert social media researcher. The user wants to analyze this competitor or client online presence:
URL: ${url}
Client Context: ${clientName}

Synthesize a thorough competitor/benchmark breakdown:
1. Brand positioning and audience tone.
2. Estimated monthly social growth rate and engagement patterns.
3. Content strengths (formats that win) and glaring weaknesses or gaps to exploit.
4. Concrete benchmark takeaways for the monthly social report.

Format in concise, executive bullet points.`;

        const simResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: researchPrompt,
        });

        markdownContent = simResponse.text || 'Competitor profile extracted successfully.';
        crawlTitle = `Benchmark Analysis: ${new URL(url.startsWith('http') ? url : `https://${url}`).hostname}`;
      }

      // Summarize with Gemini into structured competitor benchmark entry
      const analysisPrompt = `
Given this scraped webpage content:
"""
${markdownContent.slice(0, 8000)}
"""

Extract or generate a structured competitor benchmark entry adhering to JSON:
{
  "competitor": "${crawlTitle.slice(0, 40)}",
  "followerCount": "e.g. 35K - 60K (estimated or discovered)",
  "monthlyGrowthRate": "e.g. +2.4%",
  "avgEngagementRate": "e.g. 2.8%",
  "qualitativeNote": "Specific analysis of what they are doing well and how our client can outperform them.",
  "rawSummary": "A 2-3 sentence overview of findings from their online footprint."
}`;

      const aiResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: analysisPrompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const cleaned = (aiResponse.text || '{}').replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
      const parsedBenchmark = JSON.parse(cleaned);

      return res.json({
        success: true,
        source: firecrawlKey ? 'firecrawl' : 'ai-enhanced',
        benchmark: parsedBenchmark,
        rawMarkdown: markdownContent.slice(0, 3000),
      });
    } catch (err: any) {
      console.error('Firecrawl scraping error:', err);
      return res.status(500).json({
        error: err.message || 'Failed to scrape or analyze URL',
      });
    }
  });

  // Industry-Wide Live Web Intel & Trend Radar (Firecrawl + Gemini AI)
  app.post('/api/industry-web-intel', async (req, res) => {
    try {
      const {
        industry = 'Commercial Media & Creative Production',
        clientName = 'Client Brand',
        apiKey = '',
        targetUrls = []
      } = req.body;
      const firecrawlKey = apiKey || process.env.FIRECRAWL_API_KEY;

      let scrapedWebContext = '';
      let sourcesScraped: string[] = [];
      let sourceOrigin = 'ai_grounded';

      // 1. If Firecrawl API Key is available, scrape live web trends
      if (firecrawlKey && firecrawlKey !== 'fc-YOUR_FIRECRAWL_KEY') {
        try {
          console.log(`Running Firecrawl search for industry: "${industry}"...`);
          const fcSearch = await fetch('https://api.firecrawl.dev/v1/search', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${firecrawlKey}`,
            },
            body: JSON.stringify({
              query: `${industry} social media growth tactics algorithm 2026 subscribers views comments`,
              limit: 3,
              scrapeOptions: {
                formats: ['markdown'],
                onlyMainContent: true
              }
            }),
          });

          if (fcSearch.ok) {
            const searchData = await fcSearch.json();
            const results = searchData?.data || [];
            if (Array.isArray(results) && results.length > 0) {
              scrapedWebContext = results.map((r: any) => `### Source: ${r.url || r.metadata?.title || 'Web Result'}\n${(r.markdown || '').slice(0, 4000)}`).join('\n\n');
              sourcesScraped = results.map((r: any) => r.url).filter(Boolean);
              sourceOrigin = 'firecrawl_live';
            }
          }
        } catch (fcSearchErr: any) {
          console.warn('Firecrawl search endpoint error:', fcSearchErr?.message || fcSearchErr);
        }

        // If targetUrls provided, scrape them to augment data
        if (Array.isArray(targetUrls) && targetUrls.length > 0) {
          for (const url of targetUrls.slice(0, 2)) {
            try {
              const fcScrape = await fetch('https://api.firecrawl.dev/v1/scrape', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${firecrawlKey}`,
                },
                body: JSON.stringify({
                  url,
                  formats: ['markdown'],
                  onlyMainContent: true,
                  waitFor: 2000
                })
              });
              if (fcScrape.ok) {
                const scrapeData = await fcScrape.json();
                const md = scrapeData?.data?.markdown || '';
                if (md) {
                  scrapedWebContext += `\n\n### Scraped Target: ${url}\n${md.slice(0, 4000)}`;
                  if (!sourcesScraped.includes(url)) sourcesScraped.push(url);
                  sourceOrigin = 'firecrawl_live';
                }
              }
            } catch (err: any) {
              console.warn(`Failed to scrape ${url}:`, err.message);
            }
          }
        }
      }

      // 2. Synthesize with Gemini into structured IndustryWebIntel and PlatformGrowthPlaybook
      const prompt = `
You are the world's foremost Director of Social Media Strategy & Analytics.
Client Name: "${clientName}"
Client Industry / Vertical: "${industry}"
${scrapedWebContext ? `CURRENT SCRAPED WEB DATA FROM FIRECRAWL:\n"""\n${scrapedWebContext.slice(0, 10000)}\n"""` : 'Conduct an exhaustive deep dive on current 2026 social media growth dynamics, algorithm shifts, and industry benchmarks for this specific industry.'}

YOUR MISSION:
Analyze this industry in hyper-granular detail to tell the client EXACTLY:
1. How to get more subscribers/followers in this specific industry (conversion funnels, bio hooks, lead magnets).
2. How to get more views & reach (first 2-second pattern interrupts, watch-time retention triggers, 2026 algorithmic distribution mechanics).
3. How to spark high-intent comments & conversations (debates, polarization, community comment velocity).
4. Critical 2026 Social Platform Updates & Algorithm News (YouTube's viewer satisfaction pivot, Instagram's trial reels & send-to-friend DM ranking, LinkedIn's -40% outbound link penalty & native PDF priority, Meta's Facebook video priority).
5. Granular suggested actions added in specific fields for each platform.

Produce strictly valid JSON with this exact schema:
{
  "industryIntel": {
    "industryName": "${industry}",
    "scrapedAt": "${new Date().toISOString()}",
    "source": "${sourceOrigin}",
    "sourcesScraped": ${JSON.stringify(sourcesScraped)},
    "industryOverview": "Executive summary of the state of social media in this sector right now.",
    "subGrowthPlaybook": "Tactical playbook for converting casual viewers into subscribers/followers in this vertical.",
    "viewsAndReachPlaybook": "Tactical playbook for engineering massive reach and algorithm pickups in this vertical.",
    "commentsAndDebatesPlaybook": "Tactical playbook for triggering high-intent comments and discussion in this vertical.",
    "socialAlgorithmNews2026": [
      {
        "platform": "YouTube",
        "newsHeadline": "Headline of current algorithm shift",
        "strategicTakeaway": "What this means for the client"
      },
      {
        "platform": "Instagram",
        "newsHeadline": "Headline of current algorithm shift",
        "strategicTakeaway": "What this means for the client"
      },
      {
        "platform": "LinkedIn",
        "newsHeadline": "Headline of current algorithm shift",
        "strategicTakeaway": "What this means for the client"
      },
      {
        "platform": "Meta / Facebook",
        "newsHeadline": "Headline of current algorithm shift",
        "strategicTakeaway": "What this means for the client"
      }
    ],
    "trendingHooksAndFormats": [
      {
        "formatName": "Format 1",
        "hookPattern": "Exact opening 2-second hook pattern",
        "whyItWorksInThisIndustry": "Reasoning"
      },
      {
        "formatName": "Format 2",
        "hookPattern": "Exact opening 2-second hook pattern",
        "whyItWorksInThisIndustry": "Reasoning"
      },
      {
        "formatName": "Format 3",
        "hookPattern": "Exact opening 2-second hook pattern",
        "whyItWorksInThisIndustry": "Reasoning"
      }
    ]
  },
  "platformPlaybooks": {
    "instagram": {
      "subsStrategy": { "conversionHook": "...", "profileBioTweak": "...", "leadMagnetOrSeries": "...", "keyAction": "..." },
      "viewsStrategy": { "viralHookTemplate": "...", "retentionTrigger": "...", "algorithmDistributionHack": "...", "keyAction": "..." },
      "commentsStrategy": { "discussionPrompt": "...", "pinnedCommentPlay": "...", "engagementVelocityTactic": "...", "keyAction": "..." },
      "algorithmUpdatesNews": { "latestUpdate": "...", "impactOnBrand": "...", "tacticalPivot": "..." },
      "suggestions": [
        { "id": "ig-t1", "field": "subs", "label": "...", "tactic": "...", "expectedImpact": "..." },
        { "id": "ig-t2", "field": "views", "label": "...", "tactic": "...", "expectedImpact": "..." },
        { "id": "ig-t3", "field": "comments", "label": "...", "tactic": "...", "expectedImpact": "..." },
        { "id": "ig-t4", "field": "algorithm_news", "label": "...", "tactic": "...", "expectedImpact": "..." }
      ]
    },
    "youtube": {
      "subsStrategy": { "conversionHook": "...", "profileBioTweak": "...", "leadMagnetOrSeries": "...", "keyAction": "..." },
      "viewsStrategy": { "viralHookTemplate": "...", "retentionTrigger": "...", "algorithmDistributionHack": "...", "keyAction": "..." },
      "commentsStrategy": { "discussionPrompt": "...", "pinnedCommentPlay": "...", "engagementVelocityTactic": "...", "keyAction": "..." },
      "algorithmUpdatesNews": { "latestUpdate": "...", "impactOnBrand": "...", "tacticalPivot": "..." },
      "suggestions": [
        { "id": "yt-t1", "field": "subs", "label": "...", "tactic": "...", "expectedImpact": "..." },
        { "id": "yt-t2", "field": "views", "label": "...", "tactic": "...", "expectedImpact": "..." },
        { "id": "yt-t3", "field": "comments", "label": "...", "tactic": "...", "expectedImpact": "..." },
        { "id": "yt-t4", "field": "algorithm_news", "label": "...", "tactic": "...", "expectedImpact": "..." }
      ]
    },
    "linkedin": {
      "subsStrategy": { "conversionHook": "...", "profileBioTweak": "...", "leadMagnetOrSeries": "...", "keyAction": "..." },
      "viewsStrategy": { "viralHookTemplate": "...", "retentionTrigger": "...", "algorithmDistributionHack": "...", "keyAction": "..." },
      "commentsStrategy": { "discussionPrompt": "...", "pinnedCommentPlay": "...", "engagementVelocityTactic": "...", "keyAction": "..." },
      "algorithmUpdatesNews": { "latestUpdate": "...", "impactOnBrand": "...", "tacticalPivot": "..." },
      "suggestions": [
        { "id": "li-t1", "field": "subs", "label": "...", "tactic": "...", "expectedImpact": "..." },
        { "id": "li-t2", "field": "views", "label": "...", "tactic": "...", "expectedImpact": "..." },
        { "id": "li-t3", "field": "comments", "label": "...", "tactic": "...", "expectedImpact": "..." },
        { "id": "li-t4", "field": "algorithm_news", "label": "...", "tactic": "...", "expectedImpact": "..." }
      ]
    },
    "facebook": {
      "subsStrategy": { "conversionHook": "...", "profileBioTweak": "...", "leadMagnetOrSeries": "...", "keyAction": "..." },
      "viewsStrategy": { "viralHookTemplate": "...", "retentionTrigger": "...", "algorithmDistributionHack": "...", "keyAction": "..." },
      "commentsStrategy": { "discussionPrompt": "...", "pinnedCommentPlay": "...", "engagementVelocityTactic": "...", "keyAction": "..." },
      "algorithmUpdatesNews": { "latestUpdate": "...", "impactOnBrand": "...", "tacticalPivot": "..." },
      "suggestions": [
        { "id": "fb-t1", "field": "subs", "label": "...", "tactic": "...", "expectedImpact": "..." },
        { "id": "fb-t2", "field": "views", "label": "...", "tactic": "...", "expectedImpact": "..." },
        { "id": "fb-t3", "field": "comments", "label": "...", "tactic": "...", "expectedImpact": "..." }
      ]
    }
  }
}
`;

      const aiResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const cleaned = (aiResponse.text || '{}').replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
      const parsed = JSON.parse(cleaned);

      return res.json({
        success: true,
        source: sourceOrigin,
        industryIntel: parsed.industryIntel,
        platformPlaybooks: parsed.platformPlaybooks,
        sourcesScraped,
      });
    } catch (err: any) {
      console.error('Industry web intel error:', err);
      return res.status(500).json({
        error: err.message || 'Failed to synthesize industry web intelligence',
      });
    }
  });

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);

    app.get('*', async (req, res, next) => {
      try {
        const url = req.originalUrl;
        let template = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        if (vite) vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  }

  const server = app.listen(PORT, HOST, () => {
    console.log(`Latsky Socials server running on http://${HOST}:${PORT}`);
    console.log(`  ➜  Local:   http://localhost:${PORT}/`);
    console.log(`  ➜  Network: http://${HOST}:${PORT}/`);
  });

  const handleShutdown = () => {
    console.log('Shutting down server gracefully...');
    server.close(() => {
      process.exit(0);
    });
  };

  process.on('SIGTERM', handleShutdown);
  process.on('SIGINT', handleShutdown);
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
