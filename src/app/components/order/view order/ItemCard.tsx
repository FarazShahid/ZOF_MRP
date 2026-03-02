import { OrderItem } from "@/src/app/interfaces/OrderStoreInterface";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { FaCheck, FaFileInvoice } from "react-icons/fa6";
import AttachmentPreviewModal, {
  AttachmentItem,
} from "../../AttachmentPreviewModal";
import { useDocumentCenterStore } from "@/store/useDocumentCenterStore";
import { DOCUMENT_REFERENCE_TYPE } from "@/interface";
import { IoEyeOutline } from "react-icons/io5";
import { IoMdDownload } from "react-icons/io";
import { ViewMeasurementChart } from "@/src/app/orders/components/ViewMeasurementChart";
import { downloadAtIndex } from "@/src/types/admin";

interface OrderItemCardProps {
  item: OrderItem;
  isSelected: boolean;
  onSelect: () => void;
}

const ItemCard: FC<OrderItemCardProps> = ({ item, isSelected, onSelect }) => {
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp"];

  const [isOpen, setIsOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [openViewModal, setOpenViewModal] = useState<boolean>(false);
  const [measurementId, setMeasurementId] = useState<number>(0);
  const [sizeOptionName, setSizeOptionName] = useState<string>("");

  const { fetchDocuments, documentsByReferenceId } = useDocumentCenterStore();

  const documents = documentsByReferenceId[item.ProductId] || [];

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

  const handleOpenViewModal = useCallback((id: number, sizeName: string) => {
    setMeasurementId(id);
    setSizeOptionName(sizeName);
    setOpenViewModal(true);
  }, []);

  const handleCloseViewModal = useCallback(() => setOpenViewModal(false), []);

  useEffect(() => {
    fetchDocuments(DOCUMENT_REFERENCE_TYPE.PRODUCT, item.ProductId);
  }, [item.ProductId]);

  return (
    <div
      className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
        isSelected
          ? "border-blue-500 bg-slate-800/80 ring-2 ring-blue-500/30"
          : "border-slate-800 bg-slate-900 hover:border-slate-700"
      }`}
    >
      <div className="relative">
        {/* Selection Overlay */}
        {isSelected && (
          <div className="absolute top-4 right-4 z-10">
            <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center">
              <FaCheck />
            </div>
          </div>
        )}

        {/* Product Image */}
        {imageDocs.length > 0 && (
          <div className="relative overflow-hidden">
            <img
              src={imageDocs[0]?.fileUrl}
              alt={"image header"}
              className="w-full h-56 object-cover object-top group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        )}

        <div className="p-5">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={onSelect}
                className="w-4 h-4 text-blue-600 rounded cursor-pointer bg-slate-800 border-slate-600"
              />
              <div>
                <h3 className="font-bold text-white">{item.ProductName}</h3>
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-5">
            <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Fabric Type
              </span>
              <p className="text-sm font-semibold text-white mt-1">
                {item.ProductFabricType}
              </p>
            </div>

            <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 block">
                Printing Options
              </span>
              <div className="flex flex-wrap gap-2">
                {item.printingOptions.map((option, index) => (
                  <span
                    key={index}
                    className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-300 border border-slate-600"
                  >
                    {option.PrintingOptionName}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Sizes & Quantities
              </span>
            </div>

            <div className="space-y-3">
              {item.orderItemDetails.map((sizeItem, ind) => {
                return (
                  <div
                    key={ind}
                    onClick={() => handleOpenViewModal(sizeItem.MeasurementId, sizeItem.SizeOptionName)}
                    className="cursor-pointer flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-slate-600 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xs">
                          {sizeItem.SizeOptionName.charAt(0)}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-white text-xs">
                          {sizeItem.SizeOptionName}
                        </span>
                        <div className="flex items-center justify-between gap-5 w-full">
                          <div className="flex items-center gap-2 text-xs text-slate-300">
                            Qty:{" "}
                            <span className="px-2 py-0.5 rounded-full bg-slate-700 text-slate-200">
                              {sizeItem.Quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-slate-800 pt-6">
            <div className="flex items-center gap-2 mb-4">
              <i className="ri-attachment-2 text-slate-400 w-4 h-4 flex items-center justify-center" />
              <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">
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
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center text-slate-300">
                      <FaFileInvoice />
                    </div>
                    <span className="text-sm font-medium text-white">
                      {attachment.fileName}.{attachment.fileType}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openAt(imageDocs.length + index)}
                      className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                    >
                      <IoEyeOutline />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const realIndex = (documents as any[]).findIndex(
                          (d) => d?.fileUrl === attachment.fileUrl && d?.fileName === attachment.fileName
                        );
                        downloadAtIndex(documents as any, realIndex === -1 ? 0 : realIndex);
                      }}
                      className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
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
        </div>
      </div>

      {/* ----------- View Measurement  ------------ */}
      {openViewModal && (
        <ViewMeasurementChart
          isOpen={openViewModal}
          measurementId={measurementId}
          sizeOptionName={sizeOptionName}
          onCloseViewModal={handleCloseViewModal}
        />
      )}
    </div>
  );
};

export default ItemCard;
