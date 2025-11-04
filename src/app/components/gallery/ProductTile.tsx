"use client";

import Image from "next/image";

interface ProductTileProps {
  name: string;
  category?: string;
  imageSrc?: string;
  linkUrl?: string;
  onClick?: () => void;
  fit?: "cover" | "contain";
}

const fallbackImages = [
  "/mockUps/tshirt1.png",
  "/mockUps/tshirt2.png",
  "/mockUps/hoodie.png",
];

function pickImageKey(key: string): string {
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) | 0;
  const idx = Math.abs(hash) % fallbackImages.length;
  return fallbackImages[idx];
}

const ProductTile = ({ name, category, imageSrc, linkUrl, onClick, fit = "cover" }: ProductTileProps) => {
  const src = imageSrc || pickImageKey(name);
  const fileType = (() => {
    try {
      const url = (linkUrl || imageSrc) || "";
      const qIdx = url.indexOf("?");
      const clean = qIdx >= 0 ? url.slice(0, qIdx) : url;
      const ext = clean.split(".").pop()?.toUpperCase();
      if (!ext || ext.length > 5) return undefined;
      return ext;
    } catch {
      return undefined;
    }
  })();
  return (
    <div
      className="group rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all overflow-hidden cursor-zoom-in"
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : -1}
      onKeyDown={(e) => { if (onClick && (e.key === "Enter" || e.key === " ")) onClick(); }}
    >
      <div className="relative aspect-[4/3] w-full bg-gray-50 dark:bg-neutral-800">
        <Image
          src={src}
          alt={name}
          fill
          className={`${fit === "contain" ? "object-contain p-2" : "object-cover"} transform transition-transform duration-300 group-hover:scale-[1.02]`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Bottom fade for legible text */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        {fileType ? (
          <div className="absolute left-2 top-2 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/80 backdrop-blur text-gray-800 dark:bg-neutral-800/80">
            {fileType}
          </div>
        ) : null}
        {/* Hover actions */}
        {linkUrl ? (
          <div className="absolute right-2 top-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <a
                href={linkUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-black/30 hover:bg-black/40 text-white backdrop-blur-sm"
                title="Open in new tab"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <path d="M15 3h6v6" />
                  <path d="M10 14 21 3" />
                </svg>
              </a>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); if (onClick) onClick(); }}
                className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-black/30 hover:bg-black/40 text-white backdrop-blur-sm"
                title="View"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
          </div>
        ) : null}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <div className="truncate font-medium text-white drop-shadow-sm text-[13px]">{name}</div>
          {category ? (
            <div className="mt-1 inline-flex items-center text-[10px] px-2 py-0.5 rounded-full bg-white/85 text-gray-800 dark:bg-neutral-800/85 backdrop-blur">
              {category}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ProductTile;


