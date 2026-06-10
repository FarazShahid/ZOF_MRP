export const Public_Media_URL = `${process.env.NEXT_PUBLIC_API_URL}/public/media/`;

export const getAzureBlobNameFromUrl = (url: string) => {
  try {
    const parsedUrl = new URL(url);

    if (!parsedUrl.hostname.endsWith(".blob.core.windows.net")) {
      return null;
    }

    const pathParts = parsedUrl.pathname
      .split("/")
      .filter(Boolean)
      .map((part) => decodeURIComponent(part));

    if (pathParts.length < 2) return null;

    return pathParts.slice(1).join("/");
  } catch {
    return null;
  }
};

export const getPublicMediaUrl = (blobName: string) => {
  const base = Public_Media_URL.endsWith("/")
    ? Public_Media_URL
    : `${Public_Media_URL}/`;

  return `${base}${encodeURIComponent(blobName)}`;
};

export const withMediaPrefix = (url: string) => {
    if (!url) return url;

    if (url.startsWith(Public_Media_URL)) return url;

    const azureBlobName = getAzureBlobNameFromUrl(url);
    if (azureBlobName) return getPublicMediaUrl(azureBlobName);
  
    // already absolute (http/https) or data/blob
    if (/^(https?:)?\/\//i.test(url) || url.startsWith("blob:") || url.startsWith("data:")) return url;
  
    // avoid double prefix
    if (url.startsWith(Public_Media_URL)) return url;
  
    // ensure single slash
    const base = Public_Media_URL.endsWith("/") ? Public_Media_URL : `${Public_Media_URL}/`;
    const clean = url.startsWith("/") ? url.slice(1) : url;
    return `${base}${clean}`;
  };
