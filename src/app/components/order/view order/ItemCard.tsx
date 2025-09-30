import { OrderItem } from "@/src/app/interfaces/OrderStoreInterface";
import { Badge, Button, Card, Chip } from "@heroui/react";
import React, { FC, useEffect, useMemo, useState } from "react";
import { FaCheck, FaFileInvoice } from "react-icons/fa6";
import { LuRuler } from "react-icons/lu";
import OrderItemAttachments from "./OrderItemAttachments";
import AttachmentPreviewModal, {
  AttachmentItem,
} from "../../AttachmentPreviewModal";
import { useDocumentCenterStore } from "@/store/useDocumentCenterStore";
import { DOCUMENT_REFERENCE_TYPE } from "@/interface";
import { IoEyeOutline } from "react-icons/io5";
import { IoMdDownload } from "react-icons/io";

interface OrderItemCardProps {
  item: OrderItem;
  isSelected: boolean;
  onSelect: () => void;
}

const ItemCard: FC<OrderItemCardProps> = ({ item, isSelected, onSelect }) => {
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp"];

  const [isOpen, setIsOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

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

  useEffect(() => {
    fetchDocuments(DOCUMENT_REFERENCE_TYPE.PRODUCT, item.ProductId);
  }, [item.ProductId]);

  return (
    <Card
      className={`group overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${
        isSelected
          ? "ring-2 ring-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 shadow-xl"
          : "bg-white dark:bg-gray-800 hover:shadow-xl"
      } border-0 shadow-lg`}
    >
      <div className="relative">
        {/* Selection Overlay */}
        {isSelected && (
          <div className="absolute top-4 right-4 z-10">
            <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg">
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
          {/* Header with checkbox */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={onSelect}
                className="w-4 h-4 text-blue-600 rounded cursor-pointer"
              />
              <div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100">
                  {item.ProductName}
                </h3>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-3 mb-5">
            <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-lg">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Fabric Type
              </span>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-1">
                {item.ProductFabricType}
              </p>
            </div>

            <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-lg">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">
                Printing Options
              </span>
              <div className="flex flex-wrap gap-2">
                {item.printingOptions.map((option, index) => (
                  <Chip radius="full" key={index} color="default" size="sm">
                    {option.PrintingOptionName}
                  </Chip>
                ))}
              </div>
            </div>
          </div>

          {/* Sizes and Quantities */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Sizes & Quantities
              </span>
            </div>

            <div className="space-y-3">
              {item.orderItemDetails.map((sizeItem, ind) => {
                return (
                  <div
                    key={ind}
                    className="cursor-pointer flex items-center justify-between p-3 bg-gradient-to-r from-white to-gray-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xs">
                          {sizeItem.SizeOptionName.charAt(0)}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-gray-900 dark:text-gray-100 text-xs">
                          {sizeItem.SizeOptionName}
                        </span>
                        <div className="flex items-center justify-between gap-5 w-full">
                          <div className="flex items-center gap-2 text-xs">
                            Qty:{" "}
                            <Chip radius="full" color="default" size="sm">
                              {sizeItem.Quantity}
                            </Chip>
                          </div>
                          {/* <button
                            type="button"
                            className="flex items-center gap-1 bg-blue-800 text-white rounded-md px-2 "
                          >
                            <LuRuler /> chart
                          </button> */}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Product Attachments */}
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
                      onClick={() => openAt(imageDocs.length + index)} 
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
        </div>
      </div>
    </Card>
  );
};

export default ItemCard;
