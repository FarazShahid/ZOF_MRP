"use client";

import React, { useEffect } from "react";
import { useDocumentCenterStore } from "@/store/useDocumentCenterStore";
import { IoDocumentAttach } from "react-icons/io5";
import DocumentCard from "../orders/components/DocumentCard";

interface ComponentProp {
  referenceType: string;
  referenceId: number;
  isPrintable?: boolean;
}

const RecentAttachmentsView: React.FC<ComponentProp> = ({
  referenceType,
  referenceId,
  isPrintable
}) => {
  const { fetchDocuments, documentsByReferenceId  } = useDocumentCenterStore();

  useEffect(() => {
    fetchDocuments(referenceType, referenceId);
  }, [referenceId, referenceType]);

    const documents = documentsByReferenceId[referenceId] || [];

    console.log("documents", documents);

  return (
    <div className="bg-gray-100 rounded-lg p-3" key={referenceId}>
      <h6 className="flex items-center gap-3 text-gray-700">
        <IoDocumentAttach size={25} /> Attachments
      </h6>
      {documents && (
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
      )}
    </div>
  );
};

export default RecentAttachmentsView;
