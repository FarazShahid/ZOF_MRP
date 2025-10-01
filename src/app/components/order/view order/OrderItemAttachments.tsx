import { DOCUMENT_REFERENCE_TYPE } from "@/interface";
import { useDocumentCenterStore } from "@/store/useDocumentCenterStore";
import React, { useEffect, useMemo, useState } from "react";
import { FaFileInvoice } from "react-icons/fa6";
import AttachmentPreviewModal, {
  AttachmentItem,
} from "../../AttachmentPreviewModal";
import { IoMdDownload } from "react-icons/io";
import { IoEyeOutline } from "react-icons/io5";

interface OrderAttachementsProp {
  productId: number;
}
const OrderItemAttachments: React.FC<OrderAttachementsProp> = ({
  productId,
}) => {
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp"];

  const [isOpen, setIsOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const { fetchDocuments, documentsByReferenceId } = useDocumentCenterStore();

  const documents = documentsByReferenceId[productId] || [];

  const { imageDocs, otherDocs } = useMemo(() => {
    const imageDocs = (documents || []).filter((d: any) =>
      imageExtensions.includes(d?.fileType?.toLowerCase())
    );
    const otherDocs = (documents || []).filter(
      (d: any) => !imageExtensions.includes(d?.fileType?.toLowerCase())
    );
    return { imageDocs, otherDocs };
  }, [documents]);

  const imageItems: AttachmentItem[] = useMemo(
    () =>
      imageDocs.map((d: any) => ({
        fileName: d?.fileName,
        fileType: d?.fileType,
        fileUrl: d?.fileUrl,
      })),
    [imageDocs]
  );

  const otherItems: AttachmentItem[] = useMemo(
    () =>
      otherDocs.map((d: any) => ({
        fileName: d?.fileName,
        fileType: d?.fileType,
        fileUrl: d?.fileUrl,
      })),
    [otherDocs]
  );

  const openAt = (idx: number) => {
    setStartIndex(idx);
    setIsOpen(true);
  };

  useEffect(() => {
    fetchDocuments(DOCUMENT_REFERENCE_TYPE.PRODUCT, productId);
  }, [productId]);

  return (
    <>
      <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
        <div className="flex items-center gap-2 mb-4">
          <i className="ri-attachment-line w-4 h-4 flex items-center justify-center text-gray-500"></i>
          <span className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
            Product Attachments
          </span>
        </div>

        {/* Image gallery */}
        {imageDocs.length > 0 && (
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-6">
            {imageDocs.map((img, index) => (
              <div
                key={index}
                className="relative cursor-pointer group"
                onClick={() => openAt(index)}
              >
                <img
                  src={img.fileUrl}
                  alt={img.fileName}
                  className="rounded-lg object-cover w-full h-24"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                  <IoEyeOutline className="text-white text-xl" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Other attachments */}
        <div className="space-y-2">
          {otherDocs.map((attachment, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all duration-200 border border-gray-200 dark:border-gray-600"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white">
                  <FaFileInvoice />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {attachment.fileName}.{attachment.fileType}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => openAt(imageDocs.length + index)} // shift index
                  className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <IoEyeOutline />
                </button>
                <button
                  type="button"
                  className="p-2 hover:bg-green-100 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                >
                  <IoMdDownload />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <AttachmentPreviewModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        items={[...imageItems, ...otherItems]}
        startIndex={startIndex}
      />
    </>
  );
};

export default OrderItemAttachments;
