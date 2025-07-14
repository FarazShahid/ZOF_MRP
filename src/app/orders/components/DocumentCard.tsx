import React from "react";
import { FaEye } from "react-icons/fa";

interface DocumentCardProp {
  path: string;
  fileType: string;
  fileTitle: string;
  isPrintable?: boolean;
}

const previewableExtensions = ["pdf", "jpg", "jpeg", "png", "webp", "gif"];

const DocumentCard: React.FC<DocumentCardProp> = ({
  path,
  fileType,
  fileTitle,
  isPrintable,
}) => {
  const extension = fileType?.toLowerCase();
  const isPreviewable = previewableExtensions.includes(extension);

  return (
    <div className="rounded-xl border shadow w-full max-w-[180px] pt-3 py-3 px-3">
      {isPreviewable ? (
        extension === "pdf" ? (
          <iframe
            src={path}
            className="w-full h-36 border rounded"
            title={fileTitle}
          />
        ) : (
          <img
            src={path}
            className="w-full h-36 object-contain rounded"
            alt={fileTitle}
          />
        )
      ) : (
        <div className="w-full h-36 border rounded flex items-center justify-center text-sm text-gray-500">
          No Preview Available
        </div>
      )}

      <div className="mt-3 dark:border-gray-600 border-gray-200 border-t-2 flex justify-between items-center p-3">
        <div className="flex flex-col text-sm text-gray-400">
          <p className="truncate overflow-hidden whitespace-nowrap max-w-[120px] dark:text-gray-200 text-gray-600">
            {fileTitle}
          </p>
        </div>
        <div className="flex items-center gap-1 text-gray-400">
          {!isPrintable && (
            <a
              href={path}
              target={isPreviewable ? "_blank" : undefined}
              rel={isPreviewable ? "noopener noreferrer" : undefined}
              download={!isPreviewable ? fileTitle : undefined}
              className="text-sm"
            >
              <FaEye size={22} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
