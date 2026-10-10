export function formatNumber(num: number | undefined | null): string {
  if (num === undefined || num === null || isNaN(num)) return '0';
  const abs = Math.abs(num);
  if (abs >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (abs >= 1_000) {
    // round FIRST, so 999,999 becomes "1M" instead of "1000K"
    const k = Number((num / 1_000).toFixed(1));
    if (Math.abs(k) >= 1_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    return String(k) + 'K';
  }
  return num.toLocaleString();
}

/** Escapes text for safe insertion into HTML (&, <, >, ", '). */
export function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Returns a deep copy of any value with every string HTML-escaped. */
export function escapeDeep<T>(node: T): T {
  if (typeof node === 'string') return escapeHtml(node) as unknown as T;
  if (Array.isArray(node)) return node.map((n) => escapeDeep(n)) as unknown as T;
  if (node && typeof node === 'object') {
    const out: any = {};
    for (const [k, v] of Object.entries(node as any)) out[k] = escapeDeep(v);
    return out;
  }
  return node;
}

export function formatExactNumber(num: number | undefined | null): string {
  if (num === undefined || num === null || isNaN(num)) return '0';
  return num.toLocaleString();
}

export function formatPercent(num: number | undefined | null, includeSign = false): string {
  if (num === undefined || num === null || isNaN(num)) return '0%';
  const sign = includeSign && num > 0 ? '+' : '';
  return `${sign}${num.toFixed(1)}%`;
}

export function getPlatformColor(platform: string): { bg: string; text: string; border: string; hex: string } {
  switch (platform.toLowerCase()) {
    case 'youtube':
      return { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', hex: '#FF0000' };
    case 'instagram':
      return { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200', hex: '#E1306C' };
    case 'linkedin':
      return { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', hex: '#0A66C2' };
    case 'facebook':
      return { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', hex: '#1877F2' };
    case 'tiktok':
      return { bg: 'bg-slate-100', text: 'text-slate-900', border: 'border-slate-300', hex: '#000000' };
    default:
      return { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', hex: '#475569' };
  }
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // If it's not an image (or SVG), or if it's already under 3.5MB, preserve the pristine original
    // This avoids lossy JPEG re-compression that degrades small OCR numbers, commas, and decimals!
    if (!file.type.startsWith('image/') || file.type.includes('svg') || file.size <= 3.5 * 1024 * 1024) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Limit max dimension to 2200px for optimal speed and vision model comprehension
        const maxDimension = 2200;
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Compress as JPEG 0.95 for maximum text legibility
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.95);
        resolve(compressedBase64);
      };
      img.onerror = () => {
        resolve(e.target?.result as string);
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
