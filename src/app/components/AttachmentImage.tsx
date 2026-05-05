"use client";

import React, { CSSProperties, ImgHTMLAttributes, useEffect, useMemo, useState } from "react";
import { getMediaUrlCandidates } from "@/src/utils/publicMedai";

type AttachmentImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: string;
  fallbackSrc?: string;
  imgStyle?: CSSProperties;
};

const AttachmentImage: React.FC<AttachmentImageProps> = ({
  src,
  fallbackSrc,
  alt = "",
  imgStyle,
  onError,
  ...props
}) => {
  const candidates = useMemo(() => {
    const urls = getMediaUrlCandidates(src);
    if (fallbackSrc && !urls.includes(fallbackSrc)) {
      urls.push(fallbackSrc);
    }
    return urls.filter(Boolean);
  }, [fallbackSrc, src]);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [candidates]);

  const currentSrc = candidates[Math.min(currentIndex, Math.max(candidates.length - 1, 0))] || "";

  return (
    <img
      {...props}
      src={currentSrc}
      alt={alt}
      style={imgStyle}
      onError={(event) => {
        setCurrentIndex((index) => {
          if (index < candidates.length - 1) {
            return index + 1;
          }
          return index;
        });

        onError?.(event);
      }}
    />
  );
};

export default AttachmentImage;
