import { FileUploadType, PlatformType, UploadedScreenshot } from '../types/report';
import { fileToBase64 } from './formatters';

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function detectFileType(file: File): FileUploadType {
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  if (name.endsWith('.csv') || name.endsWith('.tsv') || type === 'text/csv' || type === 'text/tab-separated-values') {
    return 'csv';
  }
  if (name.endsWith('.pdf') || type === 'application/pdf') {
    return 'pdf';
  }
  return 'image';
}

export function detectPlatformFromFileName(fileName: string, fallback: PlatformType = 'general'): PlatformType {
  const nameLower = fileName.toLowerCase();
  if (nameLower.includes('fb') || nameLower.includes('meta') || nameLower.includes('facebook')) return 'facebook';
  if (nameLower.includes('ig') || nameLower.includes('insta') || nameLower.includes('instagram')) return 'instagram';
  if (nameLower.includes('yt') || nameLower.includes('youtube') || nameLower.includes('studio')) return 'youtube';
  if (nameLower.includes('li') || nameLower.includes('linkedin')) return 'linkedin';
  if (nameLower.includes('tik') || nameLower.includes('tiktok')) return 'tiktok';
  return fallback;
}

export async function processUploadedFile(file: File, targetPlatform?: PlatformType): Promise<UploadedScreenshot> {
  const fileType = detectFileType(file);
  const platform = targetPlatform && targetPlatform !== 'general' 
    ? targetPlatform 
    : detectPlatformFromFileName(file.name);
  const fileSize = formatFileSize(file.size);

  let textContent: string | undefined;
  let dataUrl: string;

  if (fileType === 'csv') {
    textContent = await file.text();
    // For CSV, create dataUrl representation for consistency
    const encoded = encodeURIComponent(textContent);
    dataUrl = `data:text/csv;charset=utf-8,${encoded}`;
  } else {
    dataUrl = await fileToBase64(file);
  }

  return {
    id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    name: file.name,
    platform,
    dataUrl,
    fileType,
    fileSize,
    textContent,
    uploadedAt: new Date().toISOString()
  };
}
