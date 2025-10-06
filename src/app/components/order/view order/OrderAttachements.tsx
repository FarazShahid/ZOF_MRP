import { DOCUMENT_REFERENCE_TYPE } from "@/interface";
import { useDocumentCenterStore } from "@/store/useDocumentCenterStore";
import { Button, Card } from "@heroui/react";
import React, { useEffect, useMemo, useState } from "react";
import { FaFileInvoice } from "react-icons/fa6";
import { RiAttachment2 } from "react-icons/ri";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { HiDownload } from "react-icons/hi";
import AttachmentPreviewModal, {
  AttachmentItem,
} from "../../AttachmentPreviewModal";
import { FileTypesEnum } from "@/src/types/order";

interface OrderAttachementsProp {
  orderId: number;
}
const OrderAttachements: React.FC<OrderAttachementsProp> = ({ orderId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const { fetchDocuments, documentsByReferenceId, typeCoverageByReferenceId  } =
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
  }, []);

  // Helpers for rendering coverage UI
  const percent = Math.round(coverage?.percent ?? 0);
  const matchedOverTotal = coverage
    ? `${coverage.matchedTypes}/${coverage.totalTypes}`
    : `0/${FileTypesEnum.length}`;

  console.log("typeCoverageByReferenceId", typeCoverageByReferenceId);

  return (
    <>
      <Card className="bg-white dark:bg-gray-800 border-0 shadow-xl">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-5 rounded-xl flex items-center justify-center">
              <RiAttachment2 />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Order Attachments
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {documents?.length} files attached
              </p>
            </div>
          </div>

          {/* Coverage summary */}

          <div className="flex flex-col items-end gap-1">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Types covered: <b className="font-semibold">{matchedOverTotal}</b>{" "}
              • {percent}%
            </div>
            {/* Progress bar */}
            <div className="w-40 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <div
                className="h-full bg-blue-600 dark:bg-blue-500 transition-all"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
            {documents?.map((attachment, index) => (
              <div
                key={index}
                className="group p-4 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-5 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <FaFileInvoice />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {attachment?.fileName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {attachment?.fileType}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onPress={() => openAt(index)}
                    className="flex-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    <MdOutlineRemoveRedEye />
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400"
                  >
                    <HiDownload />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Fullscreen previewer with next/prev/rotate */}
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
