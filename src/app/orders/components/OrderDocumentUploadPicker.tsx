"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import JSZip from "jszip";
import toast from "react-hot-toast";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import { FaRegEye } from "react-icons/fa";
import { MdCancel } from "react-icons/md";

import Label from "../../components/common/Label";
import FilePreviewModal from "../../product/component/FilePreviewModal";
import {
  getSupportedExtensionsLabel,
  isFileExtensionAllowed,
} from "@/src/app/schema/OrderDocumentTypeSchema";
import type { UploadedFile } from "@/store/useFileUploadStore";
import useOrderDocumentTypesStore, {
  OrderDocumentType,
} from "@/store/useOrderDocumentTypesStore";

export type OrderDocumentFilesByType = Record<number, UploadedFile[]>;

export type OrderDocumentUploadItem = {
  file: File;
  typeId: number;
};

export type DocumentAttachmentRow = {
  rowId: number;
  typeId: number | "";
};

type OrderDocumentUploadPickerProps = {
  documentFiles: OrderDocumentFilesByType;
  onDocumentFilesChange: (typeId: number, files: UploadedFile[]) => void;
  onRemoveDocumentFile: (typeId: number, fileIndex: number) => void;
  onSelectedDocumentTypesChange: (typeIds: number[]) => void;
  documentRows?: DocumentAttachmentRow[];
  onDocumentRowsChange?: (rows: DocumentAttachmentRow[]) => void;
  disabled?: boolean;
  resetKey?: number;
  className?: string;
};

const dropzoneAccept = {
  "image/*": [],
  "application/pdf": [],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [],
  "application/vnd.ms-excel": [],
  "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    [],
  "application/zip": [],
  "application/x-zip-compressed": [],
};

export const createEmptyDocumentRow = (): DocumentAttachmentRow => ({
  rowId: Date.now() + Math.random(),
  typeId: "",
});

const getRequiredDocumentMessage = (documentType: OrderDocumentType) => {
  const supportedExtensions = getSupportedExtensionsLabel(
    documentType.SupportedExtensions
  );

  if (supportedExtensions === "Any file type") {
    return `${documentType.Name} is required. Please add a file.`;
  }

  return `${documentType.Name} is required. Please add ${supportedExtensions}.`;
};

export const getOrderDocumentValidationError = (
  documentTypes: OrderDocumentType[],
  documentFiles: OrderDocumentFilesByType,
  selectedDocumentTypeIds: number[]
) => {
  const selectedDocumentTypeIdSet = new Set(selectedDocumentTypeIds);

  for (const documentType of documentTypes) {
    if (!selectedDocumentTypeIdSet.has(documentType.Id)) continue;

    const files = documentFiles[documentType.Id] ?? [];

    if (files.length === 0) {
      return getRequiredDocumentMessage(documentType);
    }

    const unsupportedFile = files.find(
      (file) =>
        !isFileExtensionAllowed(file.file.name, documentType.SupportedExtensions)
    );

    if (unsupportedFile) {
      return `${unsupportedFile.file.name} is not allowed for ${
        documentType.Name
      }. Allowed: ${getSupportedExtensionsLabel(
        documentType.SupportedExtensions
      )}.`;
    }
  }

  return "";
};

export const getOrderDocumentUploadItems = (
  documentTypes: OrderDocumentType[],
  documentFiles: OrderDocumentFilesByType
): OrderDocumentUploadItem[] => {
  const typeIds = new Set(documentTypes.map((documentType) => documentType.Id));

  return Object.entries(documentFiles).flatMap(([typeId, files]) => {
    const numericTypeId = Number(typeId);
    if (!typeIds.has(numericTypeId)) return [];

    return files.map((uploadedFile) => ({
      file: uploadedFile.file,
      typeId: numericTypeId,
    }));
  });
};

const getDocumentTypeError = (
  documentType: OrderDocumentType,
  files: UploadedFile[]
) => {
  if (files.length === 0) {
    return `${documentType.Name} file is required.`;
  }

  const unsupportedFile = files.find(
    (file) =>
      !isFileExtensionAllowed(file.file.name, documentType.SupportedExtensions)
  );

  if (unsupportedFile) {
    return `${unsupportedFile.file.name} must be ${getSupportedExtensionsLabel(
      documentType.SupportedExtensions
    )}.`;
  }

  return "";
};

const createUploadedFile = async (file: File): Promise<UploadedFile> => {
  const type = file.type;
  let previewUrl: string | undefined;
  let zipContents: string[] | undefined;
  let excelPreview: string[][] | undefined;
  const fileName = file.name.toLowerCase();

  if (fileName.endsWith(".zip")) {
    try {
      const zip = await JSZip.loadAsync(file);
      zipContents = Object.keys(zip.files);
    } catch (err) {
      console.error("Error unzipping file:", err);
    }
  }

  if (type.startsWith("image/") || type === "application/pdf") {
    previewUrl = URL.createObjectURL(file);
  }

  if (
    fileName.endsWith(".xlsx") ||
    fileName.endsWith(".xls") ||
    type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    type === "application/vnd.ms-excel"
  ) {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet, {
        header: 1,
      }) as string[][];
      excelPreview = json.slice(0, 10);
    } catch (error) {
      console.error("Error reading Excel file:", error);
    }
  }

  return {
    file,
    type,
    previewUrl,
    zipContents,
    excelPreview,
  };
};

type DocumentTypeDropZoneProps = {
  documentType: OrderDocumentType;
  files: UploadedFile[];
  loading: boolean;
  onDocumentFilesChange: (typeId: number, files: UploadedFile[]) => void;
  onRemoveDocumentFile: (typeId: number, fileIndex: number) => void;
};

const EmptyPreviewArea = () => (
  <div className="flex min-h-[180px] items-center justify-center rounded-lg border border-gray-200 bg-white text-sm text-gray-500 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400">
    No files selected.
  </div>
);

const DisabledDropZonePlaceholder = () => (
  <div className="space-y-6 w-full">
    <div className="p-4">
      <div className="flex min-h-[82px] items-center justify-center rounded-md border-2 border-dashed p-6 text-center opacity-70 dark:bg-slate-800 bg-gray-400">
        <p>Select a document type before uploading files.</p>
      </div>
      <div className="mt-6">
        <EmptyPreviewArea />
      </div>
    </div>
  </div>
);

const DocumentTypeDropZone: React.FC<DocumentTypeDropZoneProps> = ({
  documentType,
  files,
  loading,
  onDocumentFilesChange,
  onRemoveDocumentFile,
}) => {
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const validFiles = acceptedFiles.filter((file) =>
        isFileExtensionAllowed(file.name, documentType.SupportedExtensions)
      );
      const invalidFiles = acceptedFiles.filter(
        (file) =>
          !isFileExtensionAllowed(file.name, documentType.SupportedExtensions)
      );

      if (invalidFiles.length > 0) {
        toast.error(
          `${documentType.Name} only accepts ${getSupportedExtensionsLabel(
            documentType.SupportedExtensions
          )}.`
        );
      }

      if (validFiles.length === 0) return;

      const uploadedFiles = await Promise.all(
        validFiles.map((file) => createUploadedFile(file))
      );

      onDocumentFilesChange(documentType.Id, [...files, ...uploadedFiles]);
    },
    [documentType, files, onDocumentFilesChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: dropzoneAccept,
    disabled: loading,
  });

  const handleOpenPreview = (file: UploadedFile) => {
    setSelectedFile(file);
    setIsPreviewOpen(true);
  };

  return (
    <div className="space-y-6 w-full">
      <div className="p-4">
        <div
          {...getRootProps()}
          className={`flex min-h-[82px] items-center justify-center border-2 border-dashed p-6 rounded-md text-center ${
            loading ? "cursor-not-allowed opacity-70" : "cursor-pointer"
          } ${
            isDragActive
              ? "dark:bg-gray-800 bg-gray-500"
              : "dark:bg-slate-800 bg-gray-400"
          }`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the file here ...</p>
          ) : (
            <p>
              Drag & drop a file here, or click to select (image, doc, zip...)
            </p>
          )}
        </div>

        <div className="mt-6 min-h-[180px]">
          {files.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {files.map((uploadedFile, index) => (
                <div
                  key={`${uploadedFile.file.name}-${uploadedFile.file.lastModified}-${index}`}
                  className="border rounded-lg shadow hover:shadow-md transition relative p-4"
                >
                  <button
                    type="button"
                    onClick={() => onRemoveDocumentFile(documentType.Id, index)}
                    className="absolute top-0 right-0 text-red-500 hover:text-red-700"
                  >
                    <MdCancel size={20} />
                  </button>

                  {uploadedFile.previewUrl &&
                  uploadedFile.type.startsWith("image/") ? (
                    <img
                      src={uploadedFile.previewUrl}
                      className="rounded-md w-full h-20 object-cover mb-2"
                      alt="Uploaded"
                    />
                  ) : uploadedFile.previewUrl &&
                    uploadedFile.type === "application/pdf" ? (
                    <iframe
                      src={uploadedFile.previewUrl}
                      className="w-full h-40 rounded mb-2"
                      title={uploadedFile.file.name}
                    />
                  ) : uploadedFile.excelPreview ? (
                    <div className="h-40 overflow-y-auto text-sm bg-gray-100 p-2 rounded">
                      <p className="font-semibold mb-1">Excel Preview:</p>
                      <table className="text-xs w-full table-auto border">
                        <tbody>
                          {uploadedFile.excelPreview.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                              {row.map((cell, cellIndex) => (
                                <td
                                  key={cellIndex}
                                  className="border px-1 py-0.5"
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : uploadedFile.zipContents ? (
                    <div className="h-40 overflow-y-auto text-sm bg-gray-100 p-2 rounded">
                      <p className="font-semibold mb-1">ZIP contents:</p>
                      <ul className="list-disc pl-4">
                        {uploadedFile.zipContents.map((item, itemIndex) => (
                          <li key={itemIndex}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="h-40 flex items-center justify-center bg-gray-100 rounded text-gray-500 text-sm">
                      No preview available
                    </div>
                  )}

                  <div className="mt-2">
                    <p className="font-medium truncate whitespace-nowrap overflow-hidden">
                      {uploadedFile.file.name}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500 truncate whitespace-nowrap overflow-hidden">
                        {uploadedFile.type || "Unknown type"}
                      </p>
                      <button
                        type="button"
                        className="mt-2 text-sm text-green-500 hover:underline"
                        onClick={() => handleOpenPreview(uploadedFile)}
                      >
                        <FaRegEye size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyPreviewArea />
          )}
        </div>
      </div>

      <FilePreviewModal
        isOpen={isPreviewOpen}
        closeViewModal={() => setIsPreviewOpen(false)}
        file={selectedFile}
      />
    </div>
  );
};

const OrderDocumentUploadPicker: React.FC<OrderDocumentUploadPickerProps> = ({
  documentFiles,
  onDocumentFilesChange,
  onRemoveDocumentFile,
  onSelectedDocumentTypesChange,
  documentRows: controlledDocumentRows,
  onDocumentRowsChange,
  disabled = false,
  resetKey,
  className = "flex w-full max-w-full flex-col gap-5 md:w-[760px]",
}) => {
  const [internalDocumentRows, setInternalDocumentRows] = useState<
    DocumentAttachmentRow[]
  >([
    createEmptyDocumentRow(),
  ]);
  const documentRows = controlledDocumentRows ?? internalDocumentRows;
  const setDocumentRows = useCallback(
    (
      updater:
        | DocumentAttachmentRow[]
        | ((currentRows: DocumentAttachmentRow[]) => DocumentAttachmentRow[])
    ) => {
      if (controlledDocumentRows) {
        const nextRows =
          typeof updater === "function"
            ? updater(controlledDocumentRows)
            : updater;
        onDocumentRowsChange?.(nextRows);
        return;
      }

      setInternalDocumentRows(updater);
    },
    [controlledDocumentRows, onDocumentRowsChange]
  );
  const { fetchOrderDocumentTypes, orderDocumentTypes, loading } =
    useOrderDocumentTypesStore();
  const isDisabled = disabled || loading;

  useEffect(() => {
    if (orderDocumentTypes.length === 0) {
      fetchOrderDocumentTypes();
    }
  }, [fetchOrderDocumentTypes, orderDocumentTypes.length]);

  useEffect(() => {
    if (resetKey === undefined) return;
    setDocumentRows([createEmptyDocumentRow()]);
  }, [resetKey, setDocumentRows]);

  const sortedDocumentTypes = useMemo(
    () =>
      [...orderDocumentTypes].sort((first, second) => {
        if (first.IsRequired === second.IsRequired) {
          return first.Name.localeCompare(second.Name);
        }

        return first.IsRequired ? -1 : 1;
      }),
    [orderDocumentTypes]
  );

  const selectedTypeIds = useMemo(
    () =>
      documentRows
        .map((row) => row.typeId)
        .filter((typeId): typeId is number => typeof typeId === "number"),
    [documentRows]
  );

  useEffect(() => {
    onSelectedDocumentTypesChange(selectedTypeIds);
  }, [onSelectedDocumentTypesChange, selectedTypeIds]);

  const getAvailableDocumentTypes = (currentTypeId: number | "") =>
    sortedDocumentTypes.filter(
      (documentType) =>
        documentType.Id === currentTypeId ||
        !selectedTypeIds.includes(documentType.Id)
    );

  const areAllDocumentTypesAdded =
    sortedDocumentTypes.length > 0 &&
    selectedTypeIds.length >= sortedDocumentTypes.length;

  const handleAddDocumentRow = () => {
    if (isDisabled) return;

    if (documentRows.some((row) => row.typeId === "")) {
      toast.error("Select a document type before adding another document.");
      return;
    }

    if (areAllDocumentTypesAdded) {
      toast.error("All document types are already added.");
      return;
    }

    setDocumentRows((prev) => [...prev, createEmptyDocumentRow()]);
  };

  const handleDocumentTypeChange = (rowId: number, value: string) => {
    const nextTypeId = value ? Number(value) : "";
    const currentRow = documentRows.find((row) => row.rowId === rowId);

    if (
      typeof nextTypeId === "number" &&
      documentRows.some(
        (row) => row.rowId !== rowId && row.typeId === nextTypeId
      )
    ) {
      toast.error("This document type is already selected.");
      return;
    }

    if (
      currentRow &&
      typeof currentRow.typeId === "number" &&
      currentRow.typeId !== nextTypeId
    ) {
      onDocumentFilesChange(currentRow.typeId, []);
    }

    setDocumentRows((prev) =>
      prev.map((row) =>
        row.rowId === rowId ? { ...row, typeId: nextTypeId } : row
      )
    );
  };

  const handleRemoveDocumentRow = (row: DocumentAttachmentRow) => {
    if (typeof row.typeId === "number") {
      onDocumentFilesChange(row.typeId, []);
    }

    setDocumentRows((prev) => {
      const nextRows = prev.filter((item) => item.rowId !== row.rowId);
      return nextRows.length > 0 ? nextRows : [createEmptyDocumentRow()];
    });
  };

  return (
    <div className={className}>
      <div className="flex flex-col gap-3">
        {loading && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Loading document types...
          </span>
        )}

        {!loading && sortedDocumentTypes.length === 0 && (
          <span className="text-xs text-red-500">
            Add order document types before uploading order attachments.
          </span>
        )}

        <div className="grid grid-cols-1 gap-3">
          {documentRows.map((row) => {
            const documentType =
              typeof row.typeId === "number"
                ? sortedDocumentTypes.find((type) => type.Id === row.typeId)
                : undefined;
            const files = documentType
              ? documentFiles[documentType.Id] ?? []
              : [];
            const error = documentType
              ? getDocumentTypeError(documentType, files)
              : "";

            return (
              <div
                key={row.rowId}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-slate-800"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex w-full flex-col gap-1">
                      <Label isRequired={false} label="Document Type" />
                      <select
                        value={row.typeId}
                        disabled={isDisabled}
                        onChange={(event) =>
                          handleDocumentTypeChange(
                            row.rowId,
                            event.target.value
                          )
                        }
                        className="rounded-xl dark:text-gray-400 text-gray-800 text-sm p-2 w-full outline-none dark:bg-slate-800 bg-gray-100 border-1 dark:border-gray-400 border-gray-100"
                      >
                        <option value="">
                          {loading
                            ? "Loading document types..."
                            : "Select a document type"}
                        </option>
                        {getAvailableDocumentTypes(row.typeId).map((type) => (
                          <option key={type.Id} value={type.Id}>
                            {type.Name}
                            {type.IsRequired ? " (Required)" : ""}
                          </option>
                        ))}
                      </select>
                    </div>

                    {documentRows.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveDocumentRow(row)}
                        className="self-start text-red-500 hover:text-red-700"
                      >
                        <MdCancel size={22} />
                      </button>
                    )}
                  </div>

                  {documentType ? (
                    <>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            documentType.IsRequired
                              ? "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-200"
                              : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                          }`}
                        >
                          {documentType.IsRequired ? "Required" : "Optional"}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Supported Extensions:{" "}
                          {getSupportedExtensionsLabel(
                            documentType.SupportedExtensions
                          )}
                        </span>
                      </div>

                      <DocumentTypeDropZone
                        documentType={documentType}
                        files={files}
                        loading={isDisabled}
                        onDocumentFilesChange={onDocumentFilesChange}
                        onRemoveDocumentFile={onRemoveDocumentFile}
                      />

                      {error && (
                        <span className="mt-2 block text-xs text-red-500">
                          {error}
                        </span>
                      )}
                    </>
                  ) : (
                    <DisabledDropZonePlaceholder />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {sortedDocumentTypes.length > 0 && (
          <button
            type="button"
            onClick={handleAddDocumentRow}
            disabled={isDisabled || areAllDocumentTypesAdded}
            className="flex h-[30px] w-fit items-center justify-center rounded-lg bg-[#584BDD] px-3 text-sm text-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            Add Other Document
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderDocumentUploadPicker;
