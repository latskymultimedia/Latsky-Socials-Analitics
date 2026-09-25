export function formatNumber(num: number | undefined | null): string {
  if (num === undefined || num === null || isNaN(num)) return '0';
  if (Math.abs(num) >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (Math.abs(num) >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
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
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}
