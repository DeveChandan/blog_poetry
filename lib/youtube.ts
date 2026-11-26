export function extractYouTubeId(input: string): string {
  if (!input) return ""
  const trimmed = input.trim().replace(/\s+/g, "")
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&\s\/\?]+)/,
    /^([A-Za-z0-9_-]{11})$/,
  ]
  for (const pattern of patterns) {
    const match = trimmed.match(pattern)
    if (match && match[1]) return match[1]
  }
  return ""
}
