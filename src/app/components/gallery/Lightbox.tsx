"use client";

import { useEffect } from "react";
import Image from "next/image";
import { shouldUseUnoptimizedImage } from "@/src/utils/publicMedai";

interface LightboxItem {
  src: string;
  title?: string;
  subtitle?: string;
}

interface LightboxProps {
  open: boolean;
  items: LightboxItem[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const Lightbox = ({ open, items, index, onClose, onPrev, onNext }: LightboxProps) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose, onPrev, onNext]);

  if (!open || items.length === 0) return null;
  const current = items[index];

  return (
    <div className="fixed inset-0 z-[10000]">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-0 flex flex-col">
        <div className="flex items-center justify-between p-3 text-white">
          <div className="truncate">
            <div className="text-sm font-medium truncate">{current?.title}</div>
            {current?.subtitle ? (
              <div className="text-xs opacity-80 truncate">{current.subtitle}</div>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <a
              href={current?.src}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-sm"
            >
              Open
            </a>
            <a
              href={current?.src}
              download
              className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-sm"
            >
              Download
            </a>
            <button onClick={onClose} className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-sm">Close</button>
          </div>
        </div>

        <div className="relative flex-1">
          <button
            onClick={onPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-[10001] p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
            aria-label="Previous"
          >
            ‹
          </button>
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <div className="relative w-full h-full">
              <Image src={current?.src || ""} alt={current?.title || ""} fill className="object-contain" sizes="100vw" unoptimized={shouldUseUnoptimizedImage(current?.src || "")} />
            </div>
          </div>
          <button
            onClick={onNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-[10001] p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
            aria-label="Next"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
};

export default Lightbox;


