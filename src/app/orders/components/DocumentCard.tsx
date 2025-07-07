import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import { MdDownloadForOffline } from "react-icons/md";
// import { getFileType } from '@/services/interface';
// import { GetDocumentsResponse } from '@/store/useDocuementCenter';

interface DocumentCardProp {
  path: string;
  fileType: string;
  fileTitle: string;
}

const DocumentCard: React.FC<DocumentCardProp> = ({
  path,
  fileType,
  fileTitle,
}) => {
  return (
    <div className="rounded-xl border shadow w-full max-w-[200px] pt-3 py-3 px-3">
      <iframe
          src={path}
          className="w-full h-48 border rounded"
          title={fileTitle}
        />
      <div className="mt-3 dark:border-gray-600 border-gray-200 border-t-2 flex justify-between items-center p-3">
        <div className="flex flex-col text-sm text-gray-400">
          <p className="truncate overflow-hidden whitespace-nowrap max-w-[180px] dark:text-gray-200 text-gray-600">
            {fileTitle}
          </p>
        </div>
        <div className="flex items-center gap-1 text-gray-400">
          <a
            href={path}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm"
          >
            <FaEye size={22} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
