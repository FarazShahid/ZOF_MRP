import { DOCUMENT_REFERENCE_TYPE } from "@/interface";
import { useDocumentCenterStore } from "@/store/useDocumentCenterStore";
import React, { useEffect, useMemo, useState } from "react";
import { HiDownload } from "react-icons/hi";
import AttachmentPreviewModal, {
  AttachmentItem,
} from "../../AttachmentPreviewModal";
import { FileTypesEnum } from "@/src/types/order";
import { downloadAtIndex } from "@/src/types/admin";

const getFileIcon = (name: string) => {
  if (!name) return "ri-file-line text-slate-400";
  const n = name.toLowerCase();
  if (n.endsWith(".ai")) return "ri-file-line text-orange-400";
  if (n.endsWith(".psd")) return "ri-file-line text-blue-400";
  if (n.endsWith(".pdf")) return "ri-file-pdf-2-line text-red-400";
  if (n.endsWith(".png") || n.endsWith(".jpg") || n.endsWith(".jpeg")) return "ri-image-line text-purple-400";
  return "ri-file-line text-slate-400";
};

interface OrderAttachementsProp {
  orderId: number;
}

const OrderAttachements: React.FC<OrderAttachementsProp> = ({ orderId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const { fetchDocuments, documentsByReferenceId, typeCoverageByReferenceId } =
    useDocumentCenterStore();

  const documents = documentsByReferenceId[orderId] || [];
  const coverage = typeCoverageByReferenceId[orderId];

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

  useEffect(() => {
    fetchDocuments(DOCUMENT_REFERENCE_TYPE.ORDER, orderId);
  }, [orderId]);

  const percent = Math.round(coverage?.percent ?? 0);
  const matchedOverTotal = coverage
    ? `${coverage.matchedTypes}/${coverage.totalTypes}`
    : `0/${FileTypesEnum.length}`;

  return (
    <>
      <div className="space-y-6">
        {/* Summary - reference style */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
            <div className="text-xs text-slate-400 mb-1">Total Files</div>
            <div className="text-xl font-bold text-white">{documents.length}</div>
          </div>
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
            <div className="text-xs text-slate-400 mb-1">Types Covered</div>
            <div className="text-xl font-bold text-white">{matchedOverTotal}</div>
          </div>
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
            <div className="text-xs text-slate-400 mb-1">Coverage</div>
            <div className="text-xl font-bold text-white">{percent}%</div>
          </div>
        </div>

        {/* File list - reference style */}
        <div className="space-y-3">
          {documents.length === 0 ? (
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 text-center">
              <i className="ri-folder-open-line text-4xl text-slate-600 w-10 h-10 mx-auto flex items-center justify-center mb-3" />
              <p className="text-sm text-slate-500">No attachments yet</p>
            </div>
          ) : (
            documents.map((attachment: any, index: number) => (
              <div
                key={index}
                className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden"
              >
                <div className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center shrink-0">
                      <i
                        className={`${getFileIcon(attachment?.fileName)} text-xl w-5 h-5 flex items-center justify-center`}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-white truncate">
                        {attachment?.fileName ?? "—"}
                      </div>
                      <div className="text-xs text-slate-500">
                        {attachment?.fileType ?? "—"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => openAt(index)}
                      className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer"
                      title="View"
                    >
                      <i className="ri-eye-line w-4 h-4 flex items-center justify-center" />
                    </button>
                    <button
                      type="button"
                      onClick={() => downloadAtIndex(documents, index)}
                      className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg transition-colors cursor-pointer"
                      title="Download"
                    >
                      <HiDownload className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <AttachmentPreviewModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        items={items}
        startIndex={startIndex}
      />
    </>
  );
};

export default OrderAttachements;
