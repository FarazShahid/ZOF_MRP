"use client";

import React, { useEffect, useMemo, useState } from "react";
import { IoDocumentAttach } from "react-icons/io5";

import { useDocumentCenterStore } from "@/store/useDocumentCenterStore";
import AttachmentPreviewModal, {
  AttachmentItem,
} from "../../components/AttachmentPreviewModal";
import DocumentCard from "./DocumentCard";

interface TypedRecentAttachmentsViewProps {
  referenceType: string;
  referenceId: number;
  isPrintable?: boolean;
  label?: string;
}

const TypedRecentAttachmentsView: React.FC<TypedRecentAttachmentsViewProps> = ({
  referenceType,
  referenceId,
  isPrintable,
  label = "Attachments",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const { fetchDocuments, documentsByReferenceId } = useDocumentCenterStore();

  useEffect(() => {
    fetchDocuments(referenceType, referenceId);
  }, [fetchDocuments, referenceId, referenceType]);

  const documents = documentsByReferenceId[referenceId] || [];

  const items: AttachmentItem[] = useMemo(
    () =>
      (documents || []).map((document: any) => ({
        fileName: document.fileName,
        fileType: document.fileType,
        fileUrl: document.fileUrl,
      })),
    [documents]
  );

  const openAt = (index: number) => {
    setStartIndex(index);
    setIsOpen(true);
  };

  if (!documents || documents.length === 0) return null;

  return (
    <div
      className="dark:dark:bg-[#161616] bg-gray-100 rounded-2xl border-1 dark:border-slate-700 border-slate-300 p-3"
      key={referenceId}
    >
      <h6 className="flex items-center gap-3 text-gray-700">
        <IoDocumentAttach size={25} /> {label}
      </h6>
      <div className="flex flex-wrap gap-3 mt-5">
        {documents.map((document: any, index) => (
          <div
            key={`${document.fileUrl}-${index}`}
            className="flex max-w-[190px] flex-col gap-1 rounded-lg border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-slate-900"
          >
            <DocumentCard
              fileTitle={document.fileName}
              fileType={document.fileType}
              path={document.fileUrl}
              isPrintable={isPrintable}
              onPreview={() => openAt(index)}
            />
            <span
              className="w-fit max-w-full truncate rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-200"
              title={document.typeName || "Document type not assigned"}
            >
              {document.typeName || "No document type"}
            </span>
          </div>
        ))}
      </div>

      <AttachmentPreviewModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        items={items}
        startIndex={startIndex}
      />
    </div>
  );
};

export default TypedRecentAttachmentsView;
