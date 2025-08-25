import React from "react";
import { FaEye } from "react-icons/fa";

interface DocumentCardProp {
  path: string;
  fileType: string; // e.g. "pdf", "docx"
  fileTitle: string; // display title
  isPrintable?: boolean;
}

const previewableExtensions = ["pdf", "jpg", "jpeg", "png", "webp", "gif"];

const DocumentCard: React.FC<DocumentCardProp> = ({
  path,
  fileType,
  fileTitle,
}) => {
  const extensionFromProp = fileType?.toLowerCase();
  const extensionFromPath = (path?.split(".").pop() || "").toLowerCase();
  const extension = extensionFromProp || extensionFromPath;

  const isPreviewable = previewableExtensions.includes(extension);
  const displayTitle = fileTitle || path?.split("/").pop() || "File";

  return (
    <>
       <a
          href={path}
          download={displayTitle}
          target={isPreviewable ? "_blank" : undefined}
          className="inline-flex items-center gap-1 max-w-[150px] h-fit px-2 py-1 rounded-full border text-xs dark:border-gray-600 border-gray-300 dark:bg-slate-800 bg-gray-50 hover:bg-gray-100 dark:hover:bg-slate-700 transition"
          title={`Download ${displayTitle}`}
        >
          <FaEye className="shrink-0" size={12} />
          <span className="truncate">{displayTitle}</span>
          {extension && (
            <span className="shrink-0 uppercase text-[10px] px-1 py-[1px] rounded-full bg-gray-200 dark:bg-slate-700">
              {extension}
            </span>
          )}
        </a>
      {/* {isPreviewable && (
        <div className="rounded-xl border shadow w-full max-w-[180px] pt-3 py-3 px-3">
          {extension === "pdf" ? (
            <iframe
              src={path}
              className="w-full h-36 border rounded"
              title={displayTitle}
            />
          ) : (
            <img
              src={path}
              className="w-full h-36 object-contain rounded"
              alt={displayTitle}
            />
          )}
          <div className="mt-3 dark:border-gray-600 border-gray-200 border-t-2 flex justify-between items-center p-3">
            <div className="flex flex-col text-sm text-gray-400">
              <p className="truncate overflow-hidden whitespace-nowrap max-w-[120px] dark:text-foreground text-gray-700">
                {displayTitle}
              </p>
            </div>
            <div className="flex items-center gap-1 text-gray-400">
              {!isPrintable && (
                <a
                  href={path}
                  target={isPreviewable ? "_blank" : undefined}
                  rel={isPreviewable ? "noopener noreferrer" : undefined}
                  download={!isPreviewable ? displayTitle : undefined}
                  className="text-sm"
                  title={isPreviewable ? "Open" : "Download"}
                >
                  <FaEye size={22} />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {!isPreviewable && (
     
      )} */}
    </>
  );
};

export default DocumentCard;
