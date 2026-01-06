export const Public_Media_URL = `${process.env.NEXT_PUBLIC_API_URL}/public/media/`;

export const withMediaPrefix = (url: string) => {
    if (!url) return url;
  
    // already absolute (http/https) or data/blob
    if (/^(https?:)?\/\//i.test(url) || url.startsWith("blob:") || url.startsWith("data:")) return url;
  
    // avoid double prefix
    if (url.startsWith(Public_Media_URL)) return url;
  
    // ensure single slash
    const base = Public_Media_URL.endsWith("/") ? Public_Media_URL : `${Public_Media_URL}/`;
    const clean = url.startsWith("/") ? url.slice(1) : url;
  
    return `${base}${clean}`;
  };