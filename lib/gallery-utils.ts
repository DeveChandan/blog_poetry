/**
 * Utility to parse Google Drive sharing links and convert them into direct rendering links
 * suitable for standard HTML <img> tags.
 */
export function getGoogleDriveDirectLink(url: string): string {
  if (!url) return "";
  
  const trimmedUrl = url.trim();

  // 1. Check for standard google drive file share URLs:
  // e.g. https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  // or https://drive.google.com/file/d/FILE_ID/edit
  const fileIdMatch = trimmedUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileIdMatch && fileIdMatch[1]) {
    return `https://lh3.googleusercontent.com/u/0/d/${fileIdMatch[1]}`;
  }

  // 2. Check for open?id=FILE_ID format
  // e.g. https://drive.google.com/open?id=FILE_ID
  const queryMatch = trimmedUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (queryMatch && queryMatch[1]) {
    return `https://lh3.googleusercontent.com/u/0/d/${queryMatch[1]}`;
  }

  // 3. Check for uc?id=FILE_ID format
  // e.g. https://docs.google.com/uc?id=FILE_ID
  const ucMatch = trimmedUrl.match(/uc\?id=([a-zA-Z0-9_-]+)/);
  if (ucMatch && ucMatch[1]) {
    return `https://lh3.googleusercontent.com/u/0/d/${ucMatch[1]}`;
  }

  // 4. Return original URL if it doesn't match Google Drive formats
  return trimmedUrl;
}

/**
 * Scans HTML content for Google Drive links (e.g. inside <img src="..."> or hyperlinks)
 * and replaces them with direct rendering links.
 */
export function convertGoogleDriveContentImages(content: string): string {
  if (!content) return "";

  // Matches Google Drive file/open/uc URLs in content and transforms them
  return content.replace(/https:\/\/(?:drive\.google\.com|docs\.google\.com)\/[^\s"'>]+/g, (match) => {
    return getGoogleDriveDirectLink(match);
  });
}
