import { parseMetric } from './parseMetric';

export const VALID_PLATFORMS = ['youtube', 'instagram', 'linkedin', 'facebook', 'tiktok'] as const;
export type ValidPlatform = (typeof VALID_PLATFORMS)[number];

export const PLATFORM_LABELS: Record<string, string> = {
  youtube: 'YouTube',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  facebook: 'Facebook',
  tiktok: 'TikTok'
};

/**
 * Normalises a requested-platform list.
 *  - not an array (undefined/null)  -> ALL platforms (nothing was specified)
 *  - array                          -> lowercased, de-duplicated, valid only. An EMPTY array stays EMPTY (= none active).
 */
export function normalizePlatforms(requested: unknown): string[] {
  if (!Array.isArray(requested)) return [...VALID_PLATFORMS];
  const out: string[] = [];
  for (const p of requested) {
    const key = String(p || '').toLowerCase().trim();
    if ((VALID_PLATFORMS as readonly string[]).includes(key) && !out.includes(key)) out.push(key);
  }
  return out;
}

export function isPlatformActive(platform: string, active: string[]): boolean {
  return active.includes(String(platform || '').toLowerCase());
}

/** The field(s) that hold "reach" differ per platform. This is the single place that knows how. */
const PRIMARY_REACH_FIELDS: Record<string, string[]> = {
  facebook: ['reachOrganic'],       // + reachPaid, handled below
  instagram: ['reach', 'impressions'],
  youtube: ['views'],
  linkedin: ['impressions'],
  tiktok: ['videoViews']
};
const GENERIC_REACH_FIELDS = ['reach', 'impressions', 'views', 'videoViews', 'reachOrganic'];

export function getReach(platform: string, obj: any): number {
  if (!obj) return 0;
  const plat = platform.toLowerCase();
  if (plat === 'facebook') {
    const total = (parseMetric(obj.reachOrganic) ?? 0) + (parseMetric(obj.reachPaid) ?? 0);
    if (total > 0) return total;
  }
  for (const f of [...(PRIMARY_REACH_FIELDS[plat] || []), ...GENERIC_REACH_FIELDS]) {
    const v = parseMetric(obj[f]);
    if (v !== null && v > 0) return v;
  }
  return 0;
}

/** Writes a reach value into the platform's own primary reach field. */
export function setReach(platform: string, obj: any, value: number): void {
  if (!obj) return;
  switch (platform.toLowerCase()) {
    case 'facebook': obj.reachOrganic = value; obj.reachPaid = 0; break;
    case 'youtube': obj.views = value; break;
    case 'linkedin': obj.impressions = value; break;
    case 'tiktok': obj.videoViews = value; break;
    default: obj.reach = value;
  }
}
