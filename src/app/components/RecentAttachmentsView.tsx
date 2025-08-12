"use client";

import React, { useEffect } from "react";
import { useDocumentCenterStore } from "@/store/useDocumentCenterStore";
import { IoDocumentAttach } from "react-icons/io5";
import DocumentCard from "../orders/components/DocumentCard";

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
  const { fetchDocuments, documentsByReferenceId } = useDocumentCenterStore();

  useEffect(() => {
    fetchDocuments(referenceType, referenceId);
  }, [referenceId, referenceType]);

  const documents = documentsByReferenceId[referenceId] || [];

  return (
    documents &&
    documents.length > 0 && (
      <div className="dark:dark:bg-[#161616] bg-gray-100 rounded-2xl border-1 dark:border-slate-700 border-slate-300 p-3" key={referenceId}>
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
              />
            );
          })}
        </div>
      </div>
    )
  );
};

export default RecentAttachmentsView;
