"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useDocumentCenterStore } from "@/store/useDocumentCenterStore";
import { IoDocumentAttach } from "react-icons/io5";
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
        className="dark:dark:bg-[#161616] bg-gray-100 rounded-2xl border-1 dark:border-slate-700 border-slate-300 p-3"
        key={referenceId}
      >
        <h6 className="flex items-center gap-3 text-gray-700">
          <IoDocumentAttach size={25} /> {label}
        </h6>
        <div className="flex flex-wrap gap-2 mt-5">
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
