import React from "react";
import { FaEye } from "react-icons/fa";

interface DocumentCardProp {
  path: string;
  fileType: string; // e.g. "pdf", "docx"
  fileTitle: string; // display title
  isPrintable?: boolean;
  onPreview?: () => void;
}

const previewableExtensions = ["pdf", "jpg", "jpeg", "png", "webp", "gif"];

const DocumentCard: React.FC<DocumentCardProp> = ({
  path,
  fileType,
  fileTitle,
    onPreview,
}) => {
  const extensionFromProp = fileType?.toLowerCase();
  const extensionFromPath = (path?.split(".").pop() || "").toLowerCase();
  const extension = extensionFromProp || extensionFromPath;

  const isPreviewable = previewableExtensions.includes(extension);
  const displayTitle = fileTitle || path?.split("/").pop() || "File";

    const handleClick = (e: React.MouseEvent) => {
    if (onPreview && isPreviewable) {
      e.preventDefault();
      onPreview();
    }
    // else allow natural link behavior
  };

  return (
    <>
       <a
          href={path}
          download={displayTitle}
          target={isPreviewable ? "_blank" : undefined}
          rel="noreferrer"
          onClick={handleClick}
          className="inline-flex items-center gap-1 max-w-[150px] h-fit px-2 py-1 rounded-full border text-xs dark:border-gray-600 border-gray-300 dark:bg-slate-800 bg-gray-50 hover:bg-gray-100 dark:hover:bg-slate-700 transition"
          title={`Open ${displayTitle}`}
        >
          <FaEye className="shrink-0" size={12} />
          <span className="truncate">{displayTitle}</span>
          {extension && (
            <span className="shrink-0 uppercase text-[10px] px-1 py-[1px] rounded-full bg-gray-200 dark:bg-slate-700">
              {extension}
            </span>
          )}
        </a>
    </>
  );
};

export default DocumentCard;
