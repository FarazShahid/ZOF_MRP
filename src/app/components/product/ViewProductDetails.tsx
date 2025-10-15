"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Button,
  Spinner,
  Chip,
} from "@heroui/react";
import useProductStore from "@/store/useProductStore";
import { DOCUMENT_REFERENCE_TYPE } from "@/interface";
import { useDocumentCenterStore } from "@/store/useDocumentCenterStore";
import AttachmentPreviewModal, {
  AttachmentItem,
} from "../AttachmentPreviewModal";
import { IoEyeOutline } from "react-icons/io5";
import { IoMdDownload } from "react-icons/io";
import { CgAttachment } from "react-icons/cg";
import useColorOptionsStore from "@/store/useColorOptionsStore";
import useSizeOptionsStore from "@/store/useSizeOptionsStore";
import usePrintingOptionsStore from "@/store/usePrintingOptionsStore";
import useCutOptionsStore from "@/store/useCutOptionsStore";
import useSleeveType from "@/store/useSleeveType";
import useFabricStore from "@/store/useFabricStore";
import useClientStore from "@/store/useClientStore";
import { downloadAtIndex } from "@/src/types/admin";

interface ViewProductDetailsProps {
  isOpen: boolean;
  productId: number | null;
  onClose: () => void;
}

const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp"];

const ViewProductDetails: React.FC<ViewProductDetailsProps> = ({
  isOpen,
  productId,
  onClose,
}) => {
  const { getProductById, productById, loading } = useProductStore();

  const { colorOptions, fetchColorOptions } = useColorOptionsStore();
  const { sizeOptions, fetchsizeOptions } = useSizeOptionsStore();
  const { printingOptions, fetchprintingOptions } = usePrintingOptionsStore();
  const { cutOptions, fetchcutOptions } = useCutOptionsStore();
  const { sleeveTypeData, fetchSleeveType } = useSleeveType();
  const { fabricType, getFabricById } = useFabricStore();
  const { clientById, getClientById } = useClientStore();

  const { fetchDocuments, documentsByReferenceId } = useDocumentCenterStore();

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    if (isOpen && productId && productId > 0) {
      getProductById(productId);
      fetchDocuments(DOCUMENT_REFERENCE_TYPE.PRODUCT, productId);
      fetchColorOptions();
      fetchsizeOptions();
      fetchprintingOptions();
      fetchcutOptions();
      fetchSleeveType();
    }
  }, [isOpen, productId]);

  useEffect(() => {
    if (productById?.FabricTypeId) {
      getFabricById(Number(productById.FabricTypeId));
    }
    if (productById?.ClientId) {
      getClientById(Number(productById.ClientId));
    }
  }, [productById?.FabricTypeId, productById?.ClientId]);

  const documents = documentsByReferenceId[(productId as number) || 0] || [];

  const { imageDocs, otherDocs } = useMemo(() => {
    const imageDocs = (documents || []).filter((d: any) =>
      imageExtensions.includes(d?.fileType?.toLowerCase())
    );
    const otherDocs = (documents || []).filter(
      (d: any) => !imageExtensions.includes(d?.fileType?.toLowerCase())
    );
    return { imageDocs, otherDocs };
  }, [documents]);

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
    setIsPreviewOpen(true);
  };

  const colorMap = useMemo(() => {
    const map = new Map<number, { Name: string; HexCode: string }>();
    (colorOptions || []).forEach((c: any) =>
      map.set(Number(c.Id), { Name: c.Name, HexCode: c.HexCode })
    );
    return map;
  }, [colorOptions]);

  const sizeMap = useMemo(() => {
    const map = new Map<number, { OptionSizeOptions: string }>();
    (sizeOptions || []).forEach((s: any) =>
      map.set(Number(s.Id), { OptionSizeOptions: s.OptionSizeOptions })
    );
    return map;
  }, [sizeOptions]);

  const printingMap = useMemo(() => {
    const map = new Map<number, { Type: string }>();
    (printingOptions || []).forEach((p: any) =>
      map.set(Number(p.Id), { Type: p.Type })
    );
    return map;
  }, [printingOptions]);

  const cutMap = useMemo(() => {
    const map = new Map<number, { OptionProductCutOptions: string }>();
    (cutOptions || []).forEach((c: any) =>
      map.set(Number(c.Id), { OptionProductCutOptions: c.OptionProductCutOptions })
    );
    return map;
  }, [cutOptions]);

  const sleeveMap = useMemo(() => {
    const map = new Map<number, { sleeveTypeName: string }>();
    (sleeveTypeData || []).forEach((s: any) =>
      map.set(Number(s.id), { sleeveTypeName: s.sleeveTypeName })
    );
    return map;
  }, [sleeveTypeData]);

  const selectedColors = useMemo(() => {
    return (productById?.productColors || [])
      .map((c: any) => ({
        id: c.colorId,
        name: colorMap.get(Number(c.colorId))?.Name,
        hex: colorMap.get(Number(c.colorId))?.HexCode,
      }))
      .filter((x) => x.name);
  }, [productById?.productColors, colorMap]);

  const selectedSizes = useMemo(() => {
    return (productById?.productSizes || [])
      .map((s: any) => sizeMap.get(Number(s.sizeId))?.OptionSizeOptions)
      .filter(Boolean);
  }, [productById?.productSizes, sizeMap]);

  const selectedPrinting = useMemo(() => {
    return (productById?.printingOptions || [])
      .map((p: any) => printingMap.get(Number(p.PrintingOptionId))?.Type)
      .filter(Boolean);
  }, [productById?.printingOptions, printingMap]);

  const selectedCutOptions = useMemo(() => {
    return (productById?.productDetails || [])
      .map((d: any) => cutMap.get(Number(d.ProductCutOptionId))?.OptionProductCutOptions)
      .filter(Boolean);
  }, [productById?.productDetails, cutMap]);

  const selectedSleeveTypes = useMemo(() => {
    return (productById?.productDetails || [])
      .map((d: any) => sleeveMap.get(Number(d.SleeveTypeId))?.sleeveTypeName)
      .filter(Boolean);
  }, [productById?.productDetails, sleeveMap]);

  return (
    <Modal isOpen={isOpen} size="4xl" onOpenChange={onClose}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {productById?.Name || "Product Details"}
            </ModalHeader>
            <ModalBody>
              {loading ? (
                <Spinner />
              ) : (
                <div className="max-h-[calc(100vh-320px)] overflow-x-auto">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="font-medium">Name:</div>
                      <p>{productById?.Name ?? "—"}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="font-medium">Client:</div>
                      <p>{clientById?.Name ?? "—"}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="font-medium">Event:</div>
                      <p>{"—"}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="font-medium">Fabric Type:</div>
                      <p>{fabricType?.type ?? productById?.FabricTypeId ?? "—"}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="font-medium">Fabric Name:</div>
                      <p>{fabricType?.name ?? "—"}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="font-medium">GSM:</div>
                      <p>{fabricType?.gsm ?? "—"}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="font-medium">Status:</div>
                      <p>{productById?.productStatus ?? "—"}</p>
                    </div>
                  </div>

                  {selectedColors.length > 0 && (
                    <div className="mb-4">
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        Available Colors
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedColors.map((c) => (
                          <div key={c.id} className="flex items-center gap-2 px-3 py-1 rounded-xl border bg-gray-50 dark:bg-slate-800">
                            <span
                              className="inline-block w-4 h-4 rounded"
                              style={{ backgroundColor: c.hex || "#ccc" }}
                            />
                            <span className="text-sm">{c.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedSizes.length > 0 && (
                    <div className="mb-4">
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        Size Options
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedSizes.map((s, i) => (
                          <Chip key={i} radius="full" size="sm">
                            {s}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedPrinting.length > 0 && (
                    <div className="mb-4">
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        Printing Options
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedPrinting.map((p, i) => (
                          <Chip key={i} radius="full" size="sm">
                            {p}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  )}

                  {(selectedCutOptions.length > 0 || selectedSleeveTypes.length > 0) && (
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {selectedCutOptions.length > 0 && (
                        <div>
                          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                            Cut Options
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {selectedCutOptions.map((c, i) => (
                              <Chip key={i} radius="full" size="sm">
                                {c}
                              </Chip>
                            ))}
                          </div>
                        </div>
                      )}
                      {selectedSleeveTypes.length > 0 && (
                        <div>
                          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                            Sleeve Type
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {selectedSleeveTypes.map((s, i) => (
                              <Chip key={i} radius="full" size="sm">
                                {s}
                              </Chip>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {productById?.qaChecklist && productById.qaChecklist.length > 0 && (
                    <div className="mb-6">
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        QA Checklist
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {productById.qaChecklist.map((q) => (
                          <Chip key={q.id} radius="full" size="sm">
                            {q.name}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  )}

                  {productById?.Description && (
                    <div className="mb-6">
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        Description
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{productById.Description}</p>
                    </div>
                  )}

                  <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
                    <div className="flex items-center gap-2 mb-4">
                      <CgAttachment />
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Product Attachments
                      </span>
                    </div>

                    {imageDocs.length > 0 && (
                      <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-6">
                        {imageDocs.map((img: any, index: number) => (
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

                    <div className="space-y-2">
                      {otherDocs.map((attachment: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all duration-200 border border-gray-200 dark:border-gray-600"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white">
                              <IoEyeOutline />
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
                              onClick={() => {
                                const realIndex = (documents as any[]).findIndex(
                                  (d) => d?.fileUrl === attachment.fileUrl && d?.fileName === attachment.fileName
                                );
                                downloadAtIndex(documents as any, realIndex === -1 ? 0 : realIndex);
                              }}
                              className="p-2 hover:bg-green-100 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                            >
                              <IoMdDownload />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <AttachmentPreviewModal
                      isOpen={isPreviewOpen}
                      onClose={() => setIsPreviewOpen(false)}
                      items={items}
                      startIndex={startIndex}
                    />
                  </div>
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="primary" variant="flat" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ViewProductDetails;
