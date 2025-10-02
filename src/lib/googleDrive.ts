/**
 * Convert Google Drive share link to direct playable URL
 * @param url - Google Drive share link or file ID
 * @returns Direct playable URL for video embedding
 */
export function convertGoogleDriveUrl(url: string): string {
  // If it's already a direct URL, return it
  if (url.includes('/preview') || url.includes('/file/d/')) {
    const fileIdMatch = url.match(/\/file\/d\/([^/]+)/);
    if (fileIdMatch) {
      return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
    }
  }
  
  // If it's a share link like: https://drive.google.com/open?id=FILE_ID
  const openIdMatch = url.match(/[?&]id=([^&]+)/);
  if (openIdMatch) {
    return `https://drive.google.com/file/d/${openIdMatch[1]}/preview`;
  }
  
  // If it's just a file ID
  if (!url.includes('http') && url.length > 20) {
    return `https://drive.google.com/file/d/${url}/preview`;
  }
  
  return url;
}

/**
 * Check if URL is a Google Drive link
 */
export function isGoogleDriveUrl(url: string): boolean {
  return url.includes('drive.google.com');
}

/**
 * Extract file ID from Google Drive URL
 */
export function extractGoogleDriveFileId(url: string): string | null {
  const patterns = [
    /\/file\/d\/([^/]+)/,
    /[?&]id=([^&]+)/,
    /\/open\?id=([^&]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return null;
}
