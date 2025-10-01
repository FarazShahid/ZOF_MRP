"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { TbRotateClockwise, TbRotate2 } from "react-icons/tb";
import { IoMdDownload, IoMdOpen, IoMdClose } from "react-icons/io";

export type AttachmentItem = {
  fileName: string;
  fileType?: string; // e.g. "pdf", "docx", "jpg"
  fileUrl: string;
};

type AttachmentPreviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  items: AttachmentItem[];
  startIndex?: number;
};

const IMAGE_EXT = ["jpg", "jpeg", "png", "webp", "gif", "bmp", "svg"];
const OFFICE_EXT = ["doc", "docx", "xls", "xlsx", "ppt", "pptx"];

function getExt(it: AttachmentItem) {
  const fromType = (it?.fileType || "").toLowerCase();
  const fromUrl = (it?.fileUrl.split(".").pop() || "").toLowerCase();
  return fromType || fromUrl;
}

function isImageExt(ext: string) {
  return IMAGE_EXT.includes(ext);
}

function isPdfExt(ext: string) {
  return ext === "pdf";
}

function isOfficeExt(ext: string) {
  return OFFICE_EXT.includes(ext);
}

/**
 * For Office files we’ll use Microsoft’s viewer, for PDFs we’ll iframe the pdf,
 * and for images we’ll render an <img />.
 * For anything else, we show a “download/open” only view.
 */
function getViewerSrc(fileUrl: string, ext: string) {
  if (isOfficeExt(ext)) {
    // Office online viewer
    return `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(fileUrl)}`;
  }
  if (isPdfExt(ext)) {
    // Many browsers can natively preview PDFs
    return fileUrl;
  }
  return null;
}

const AttachmentPreviewModal: React.FC<AttachmentPreviewModalProps> = ({
  isOpen,
  onClose,
  items,
  startIndex = 0,
}) => {
  const [index, setIndex] = useState(startIndex);
  const [rotation, setRotation] = useState(0);

  const total = items.length;
  const current = items[index];
  const ext = useMemo(() => getExt(current).toLowerCase(), [current]);

  const isImage = isImageExt(ext);
  const isPdf = isPdfExt(ext);
  const isOffice = isOfficeExt(ext);
  const viewerSrc = getViewerSrc(current?.fileUrl, ext);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % total);
    setRotation(0);
  }, [total]);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + total) % total);
    setRotation(0);
  }, [total]);

  const rotateCW = () => setRotation((r) => (r + 90) % 360);
  const rotateCCW = () => setRotation((r) => (r - 90 + 360) % 360);

  // Keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "Escape") onClose();
      else if (e.key.toLowerCase() === "r") rotateCW();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, onClose]);

  useEffect(() => {
    setIndex(startIndex);
    setRotation(0);
  }, [startIndex, isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      size="5xl"
      backdrop="opaque"
      className="dark:bg-[#0f0f0f]"
      motionProps={{}}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm opacity-70">
                  {index + 1} / {total}
                </span>
                <span className="font-semibold">
                  {current.fileName || current?.fileUrl.split("/").pop()}
                </span>
              </div>
              <div className="flex items-center gap-2 pr-5">
                <Button size="sm" variant="flat" onPress={rotateCCW} title="Rotate Left">
                  <TbRotate2 />
                </Button>
                <Button size="sm" variant="flat" onPress={rotateCW} title="Rotate Right">
                  <TbRotateClockwise />
                </Button>
                <Button
                  size="sm"
                  as="a"
                  href={current?.fileUrl}
                  download={current?.fileName}
                  target="_blank"
                  rel="noreferrer"
                  title="Download"
                >
                  <IoMdDownload />
                </Button>
                <Button
                  size="sm"
                  as="a"
                  href={current?.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  title="Open in new tab"
                >
                  <IoMdOpen />
                </Button>
              </div>
            </ModalHeader>

            <ModalBody className="relative">
              {/* Prev / Next floating controls */}
              {total > 1 && (
                <>
                  <button
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full border dark:border-gray-700 border-gray-300 dark:bg-slate-800 bg-white/90 hover:bg-white"
                    onClick={prev}
                    title="Previous"
                  >
                    <IoIosArrowBack size={18} />
                  </button>
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full border dark:border-gray-700 border-gray-300 dark:bg-slate-800 bg-white/90 hover:bg-white"
                    onClick={next}
                    title="Next"
                  >
                    <IoIosArrowForward size={18} />
                  </button>
                </>
              )}

              {/* Content */}
              <div className="w-full h-[70vh] flex items-center justify-center overflow-hidden rounded-xl border dark:border-gray-700 border-gray-300 bg-black/5 dark:bg-black/30">
                {isImage && (
                  // Image can rotate via CSS
                  <img
                    src={current?.fileUrl}
                    alt={current?.fileName}
                    className="max-h-full max-w-full object-contain"
                    style={{ transform: `rotate(${rotation}deg)` }}
                  />
                )}

                {!isImage && (isPdf || isOffice) && viewerSrc && (
                  // Iframe (PDF or Office) — we rotate the containing wrapper
                  <div
                    className="w-full h-full flex items-center justify-center px-4"
                    style={{ transform: `rotate(${rotation}deg)` }}
                  >
                    <iframe
                      src={viewerSrc}
                      className="w-full h-full rounded"
                      // Note: some URLs may block framing with X-Frame-Options/CSP
                      // In that case "Open in new tab" still works.
                      allow="fullscreen"
                    />
                  </div>
                )}

                {!isImage && !isPdf && !isOffice && (
                  <div className="text-center p-6">
                    <p className="mb-3">
                      Preview not supported for <b>{ext || "this file type"}</b>.
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        as="a"
                        href={current?.fileUrl}
                        download={current.fileName}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <IoMdDownload /> Download
                      </Button>
                      <Button as="a" href={current?.fileUrl} target="_blank" rel="noreferrer" variant="flat">
                        <IoMdOpen /> Open in new tab
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </ModalBody>

            <ModalFooter>
              <div className="w-full flex items-center justify-between text-xs opacity-70">
                <span>
                  Type: <b>{ext || "unknown"}</b>
                </span>
                {/* <span className="truncate max-w-[70%]" title={current.fileUrl}>
                  {current.fileUrl}
                </span> */}
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default AttachmentPreviewModal;
