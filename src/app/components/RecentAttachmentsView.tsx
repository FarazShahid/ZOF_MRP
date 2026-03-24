"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useDocumentCenterStore } from "@/store/useDocumentCenterStore";
import DocumentCard from "../orders/components/DocumentCard";
import AttachmentPreviewModal, {
  AttachmentItem,
} from "./AttachmentPreviewModal";

interface ComponentProp {
  referenceType: string;
  referenceId: number;
  isPrintable?: boolean;
  label?: string;
}

const RecentAttachmentsView: React.FC<ComponentProp> = ({
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
  }, [referenceId, referenceType]);
  
  const documents = documentsByReferenceId[referenceId] || [];

  const items: AttachmentItem[] = useMemo(
    () =>
      (documents || []).map((d: any) => ({
        fileName: d.fileName,
        fileType: d.fileType,
        fileUrl: d.fileUrl,
      })),
    [documents]
  );

  const openAt = (idx: number) => {
    setStartIndex(idx);
    setIsOpen(true);
  };
  if (!documents || documents.length === 0) return null;
  return (
    documents &&
    documents.length > 0 && (
      <div
        className="rounded-xl border border-slate-700 bg-slate-800/50 p-4"
        key={referenceId}
      >
        <h6 className="flex items-center gap-2 text-slate-400 text-sm font-medium mb-3">
          <i className="ri-file-list-line w-4 h-4 flex items-center justify-center" />
          {label}
        </h6>
        <div className="flex flex-wrap gap-2">
          {documents?.map((doc, index) => {
            return (
              <DocumentCard
                key={index}
                fileTitle={doc.fileName}
                fileType={doc.fileType}
                path={doc.fileUrl}
                isPrintable={isPrintable}
                onPreview={() => openAt(index)}
              />
            );
          })}
        </div>

        {/* Fullscreen previewer with next/prev/rotate */}
        <AttachmentPreviewModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          items={items}
          startIndex={startIndex}
        />
      </div>
    )
  );
};

export default RecentAttachmentsView;
