import { FileUploadType, PlatformType, UploadedScreenshot } from '../types/report';
import { fileToBase64 } from './formatters';

// Helper to compress and downscale images before sending to AI analysis
export function compressImage(file: File, maxWidth = 2200, quality = 0.95): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string); // Fallback to original if context fails
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Convert to compressed JPEG data URL
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
}

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
  } else if (fileType === 'image') {
    // Automatically compress and downscale images before storing in state or sending to AI analysis
    try {
      dataUrl = await compressImage(file);
    } catch (compressionErr) {
      console.warn('Image compression fallback to raw base64:', compressionErr);
      dataUrl = await fileToBase64(file);
    }
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
