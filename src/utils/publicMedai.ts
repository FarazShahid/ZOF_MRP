export const Public_Media_URL = `${process.env.NEXT_PUBLIC_API_URL}/public/media/`;

/** Hosts for which next/image should use unoptimized (browser loads directly) to avoid upstream 400/403. */
const UNOPTIMIZED_IMAGE_HOSTS = [
  "localhost",
  "127.0.0.1",
  "backend-mgt.sealsforge.com",
  "backend-qa.sealsforge.com",
  "genxstorage.blob.core.windows.net",
];


export function shouldUseUnoptimizedImage(url: string): boolean {
  if (typeof url !== "string") return false;
  try {
    const { hostname } = new URL(url);
    return UNOPTIMIZED_IMAGE_HOSTS.includes(hostname);
  } catch {
    return false;
  }
}

export const withMediaPrefix = (url: string) => {
    if (!url) return url;
  
    // already absolute (http/https) or data/blob
    if (/^(https?:)?\/\//i.test(url) || url.startsWith("blob:") || url.startsWith("data:")) return url;
  
    // avoid double prefix
    if (url.startsWith(Public_Media_URL)) return url;
  
    // ensure single slash
    const base = Public_Media_URL.endsWith("/") ? Public_Media_URL : `${Public_Media_URL}/`;
    const clean = url.startsWith("/") ? url.slice(1) : url;
  console.log('clean',clean,base)
    return `${base}${clean}`;
  };