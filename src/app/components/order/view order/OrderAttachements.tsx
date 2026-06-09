import { DOCUMENT_REFERENCE_TYPE } from "@/interface";
import { useDocumentCenterStore } from "@/store/useDocumentCenterStore";
import useOrderDocumentTypesStore from "@/store/useOrderDocumentTypesStore";
import {
  Button,
  Card,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { FileCheck2 } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FaFileInvoice } from "react-icons/fa6";
import { HiDownload } from "react-icons/hi";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiAttachment2 } from "react-icons/ri";
import { downloadAtIndex } from "@/src/types/admin";
import OrderDocumentUploadPicker, {
  getOrderDocumentUploadItems,
  getOrderDocumentValidationError,
  OrderDocumentFilesByType,
} from "@/src/app/orders/components/OrderDocumentUploadPicker";
import type { UploadedFile } from "@/store/useFileUploadStore";
import AttachmentPreviewModal, {
  AttachmentItem,
} from "../../AttachmentPreviewModal";

interface OrderAttachementsProp {
  orderId: number;
  attachmentProgress?: number;
  onDocumentsUploaded?: () => Promise<void> | void;
}

const getDocumentCompletionPercent = (value?: number | null) => {
  const percent = Math.round(Number(value ?? 0));

  if (!Number.isFinite(percent)) {
    return 0;
  }

  return Math.min(100, Math.max(0, percent));
};

const OrderAttachements: React.FC<OrderAttachementsProp> = ({
  orderId,
  attachmentProgress,
  onDocumentsUploaded,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [documentFiles, setDocumentFiles] = useState<OrderDocumentFilesByType>(
    {}
  );
  const [selectedDocumentTypeIds, setSelectedDocumentTypeIds] = useState<
    number[]
  >([]);
  const [uploadPickerResetKey, setUploadPickerResetKey] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [showUploadPanel, setShowUploadPanel] = useState(false);

  const {
    fetchDocuments,
    documentsByReferenceId,
    uploadOrderDocuments,
    loadingDoc,
  } = useDocumentCenterStore();
  const { orderDocumentTypes, fetchOrderDocumentTypes } =
    useOrderDocumentTypesStore();

  const documents = orderId ? documentsByReferenceId[orderId] || [] : [];
  const documentCompletion = getDocumentCompletionPercent(attachmentProgress);

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

  const handleOrderDocumentFilesChange = useCallback(
    (typeId: number, files: UploadedFile[]) => {
      setDocumentFiles((prev) => {
        const next = { ...prev };

        if (files.length === 0) {
          delete next[typeId];
        } else {
          next[typeId] = files;
        }

        return next;
      });
    },
    []
  );

  const handleRemoveOrderDocumentFile = useCallback(
    (typeId: number, fileIndex: number) => {
      setDocumentFiles((prev) => {
        const currentFiles = prev[typeId] ?? [];
        const nextFiles = currentFiles.filter((_, index) => index !== fileIndex);
        const next = { ...prev };

        if (nextFiles.length === 0) {
          delete next[typeId];
        } else {
          next[typeId] = nextFiles;
        }

        return next;
      });
    },
    []
  );

  const resetUploadPicker = useCallback(() => {
    setDocumentFiles({});
    setSelectedDocumentTypeIds([]);
    setUploadPickerResetKey((prev) => prev + 1);
  }, []);

  const handleCloseUploadPanel = () => {
    if (uploading) return;

    resetUploadPicker();
    setShowUploadPanel(false);
  };

  const handleUploadDocuments = async () => {
    if (!orderId) {
      toast.error("Order is still loading. Please try again.");
      return;
    }

    if (selectedDocumentTypeIds.length === 0) {
      toast.error("Select a document type before uploading.");
      return;
    }

    const availableDocumentTypes =
      orderDocumentTypes.length > 0
        ? orderDocumentTypes
        : await fetchOrderDocumentTypes();
    const documentTypesError = useOrderDocumentTypesStore.getState().error;

    if (documentTypesError && availableDocumentTypes.length === 0) {
      toast.error("Order document types could not be loaded. Please try again.");
      return;
    }

    const documentValidationError = getOrderDocumentValidationError(
      availableDocumentTypes,
      documentFiles,
      selectedDocumentTypeIds
    );

    if (documentValidationError) {
      toast.error(documentValidationError);
      return;
    }

    const documentsToUpload = getOrderDocumentUploadItems(
      availableDocumentTypes,
      documentFiles
    );

    if (documentsToUpload.length === 0) {
      toast.error("Add at least one file before uploading.");
      return;
    }

    setUploading(true);
    try {
      const uploaded = await uploadOrderDocuments(orderId, documentsToUpload);
      if (!uploaded) return;

      resetUploadPicker();
      setShowUploadPanel(false);
      await fetchDocuments(DOCUMENT_REFERENCE_TYPE.ORDER, orderId);
      await onDocumentsUploaded?.();
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (!orderId) return;
    fetchDocuments(DOCUMENT_REFERENCE_TYPE.ORDER, orderId);
  }, [fetchDocuments, orderId]);

  return (
    <>
      <Card className="bg-white dark:bg-slate-700 border-0 shadow-xl">
        <div className="p-6">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-5 rounded-xl flex items-center justify-center">
                <RiAttachment2 />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Order Attachments
                </h2>
                <p className="text-sm text-gray-600 dark:text-slate-300">
                  {documents?.length} files attached
                </p>
              </div>
            </div>

            <div className="flex flex-col items-start gap-1 lg:items-end">
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-slate-300">
                <FileCheck2 className="h-4 w-4 text-gray-500 dark:text-slate-400" />
                <span className="text-gray-500 dark:text-slate-400">
                  Document Completion
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {documentCompletion}%
                </span>
              </div>
              <div className="w-40 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <div
                  className="h-full bg-blue-600 dark:bg-blue-500 transition-all"
                  style={{ width: `${documentCompletion}%` }}
                />
              </div>
              <button
                type="button"
                onClick={() => setShowUploadPanel(true)}
                disabled={!orderId || uploading}
                className="mt-3 flex h-[34px] w-fit items-center justify-center rounded-lg bg-[#584BDD] px-4 text-sm text-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                Add Order Documents
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
            {documents?.map((attachment, index) => (
              <div
                key={index}
                className="group p-4 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-gray-50 to-white dark:from-slate-700 dark:to-slate-800"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-5 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <FaFileInvoice />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-slate-100 truncate">
                      {attachment?.fileName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">
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
                    onPress={() => downloadAtIndex(documents as any, index)}
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

      <Modal
        isOpen={showUploadPanel}
        size="5xl"
        scrollBehavior="inside"
        onOpenChange={handleCloseUploadPanel}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add Order Documents
                <span className="text-xs font-normal text-gray-500 dark:text-slate-400">
                  Select a document type and upload files matching its supported
                  extensions.
                </span>
              </ModalHeader>
              <ModalBody>
                <OrderDocumentUploadPicker
                  documentFiles={documentFiles}
                  onDocumentFilesChange={handleOrderDocumentFilesChange}
                  onRemoveDocumentFile={handleRemoveOrderDocumentFile}
                  onSelectedDocumentTypesChange={setSelectedDocumentTypeIds}
                  disabled={loadingDoc || uploading || !orderId}
                  resetKey={uploadPickerResetKey}
                  className="flex w-full max-w-full flex-col gap-5"
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="flat"
                  onPress={handleCloseUploadPanel}
                  isDisabled={uploading}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={handleUploadDocuments}
                  isLoading={uploading}
                  isDisabled={loadingDoc || !orderId}
                >
                  Upload Documents
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

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
