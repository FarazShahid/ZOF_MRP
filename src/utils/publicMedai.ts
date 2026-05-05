const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export const Public_Media_URL = `${API_URL}/public/media/`;

const getApiOrigin = () => {
  try {
    return new URL(API_URL).origin;
  } catch {
    return "";
  }
};

const normalizeSlashes = (value: string) => value.replace(/\\/g, "/").trim();

const isAzureBlobUrl = (value: string) => {
  try {
    return new URL(value).hostname.endsWith(".blob.core.windows.net");
  } catch {
    return false;
  }
};

export const withMediaPrefix = (url: string) => {
  if (!url) return url;

  const normalized = normalizeSlashes(url);

  // already absolute (http/https) or data/blob
  if (
    /^(https?:)?\/\//i.test(normalized) ||
    normalized.startsWith("blob:") ||
    normalized.startsWith("data:")
  ) {
    return normalized;
  }

  const origin = getApiOrigin();

  // Some records already include public media segments, just without host.
  if (normalized.startsWith("/public/media/") || normalized.startsWith("public/media/")) {
    const clean = normalized.replace(/^\/+/, "");
    return origin ? `${origin}/${clean}` : `/${clean}`;
  }

  // Some records may already include the API path without host.
  if (normalized.startsWith("/api/public/media/") || normalized.startsWith("api/public/media/")) {
    const clean = normalized.replace(/^\/+/, "");
    return origin ? `${origin}/${clean}` : `/${clean}`;
  }

  // avoid double prefix for already-normalized values
  if (normalized.startsWith(Public_Media_URL)) return normalized;

  // default shape: backend returned a bare filename or relative subpath
  const base = Public_Media_URL.endsWith("/") ? Public_Media_URL : `${Public_Media_URL}/`;
  const clean = normalized.startsWith("/") ? normalized.slice(1) : normalized;
  return `${base}${clean}`;
};

export const stripAzureBlobQuery = (url: string) => {
  if (!url) return url;

  try {
    const parsed = new URL(url);
    if (!parsed.hostname.endsWith(".blob.core.windows.net")) return url;
    return `${parsed.origin}${parsed.pathname}`;
  } catch {
    return url;
  }
};

export const isExpiredAzureBlobUrl = (url: string) => {
  if (!url) return false;

  try {
    const parsed = new URL(url);
    if (!parsed.hostname.endsWith(".blob.core.windows.net")) return false;

    const expiresAt = parsed.searchParams.get("se");
    if (!expiresAt) return false;

    const expiryMs = Date.parse(expiresAt);
    if (!Number.isFinite(expiryMs)) return false;

    return expiryMs < Date.now();
  } catch {
    return false;
  }
};

export const getMediaUrlCandidates = (url: string) => {
  const normalized = withMediaPrefix(url);
  if (!normalized) return [];

  if (!isAzureBlobUrl(normalized)) return [normalized];

  const unsigned = stripAzureBlobQuery(normalized);
  if (unsigned === normalized) return [normalized];

  return isExpiredAzureBlobUrl(normalized)
    ? [unsigned, normalized]
    : [normalized, unsigned];
};

export const getPreferredMediaUrl = (url: string) => getMediaUrlCandidates(url)[0] || withMediaPrefix(url);
