/**
 * AI-PAVE Date and Time Formatting Utilities
 * Converts UTC / ISO timestamps into localized, human-readable date-time strings.
 */

export const formatLocalDateTime = (isoString?: string): string => {
  if (!isoString) return 'N/A';
  try {
    let normalized = isoString.trim();
    // If string has no timezone indicator (no 'Z', '+', or negative offset), treat as UTC
    if (!normalized.endsWith('Z') && !normalized.includes('+') && !/[-+]\d{2}:\d{2}$/.test(normalized)) {
      normalized = `${normalized}Z`;
    }
    const d = new Date(normalized);
    if (isNaN(d.getTime())) {
      const dRaw = new Date(isoString);
      if (!isNaN(dRaw.getTime())) {
        return formatPaddedDate(dRaw);
      }
      return isoString;
    }
    return formatPaddedDate(d);
  } catch {
    return isoString;
  }
};

export const formatLocalDate = (isoString?: string): string => {
  if (!isoString) return 'N/A';
  try {
    let normalized = isoString.trim();
    if (!normalized.endsWith('Z') && !normalized.includes('+') && !/[-+]\d{2}:\d{2}$/.test(normalized)) {
      normalized = `${normalized}Z`;
    }
    const d = new Date(normalized);
    if (isNaN(d.getTime())) return isoString.slice(0, 10);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  } catch {
    return isoString.slice(0, 10);
  }
};

const formatPaddedDate = (d: Date): string => {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  const seconds = pad(d.getSeconds());
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
