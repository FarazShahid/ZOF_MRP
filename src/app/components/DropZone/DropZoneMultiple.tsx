"use client";

import { useState, useCallback } from "react";
import JSZip from "jszip";
import { useDropzone } from "react-dropzone";
import readXlsxFile from "read-excel-file";
import { MdCancel } from "react-icons/md";
import { FaRegEye } from "react-icons/fa";
import FilePreviewModal from "../../product/component/FilePreviewModal";
import { UploadedFile, useFileUploadStore } from "@/store/useFileUploadStore";

type DropZoneProps = {
  index: number;
  onFileSelect: (file: File, index: number) => void;
};

const DropZoneMultiple: React.FC<DropZoneProps> = ({ index, onFileSelect }) => {
  const {
    uploadedFilesByIndex,
    setUploadedFilesByIndex,
    removeUploadedFileByIndex,
  } = useFileUploadStore();

  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  const [OpenViewModal, setOpenViewModal] = useState<boolean>(false);

  const uploadedFiles = uploadedFilesByIndex[index] || [];

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const newFiles: UploadedFile[] = [];

      for (const file of acceptedFiles) {
        const type = file.type;
        let previewUrl: string | undefined;
        let zipContents: string[] | undefined;
        let excelPreview: string[][] | undefined;

        if (file.name.endsWith(".zip")) {
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

        // Excel preview (safe reader, coerced to string matrix)
        if (
          file.name.endsWith(".xlsx") ||
          file.name.endsWith(".xls") ||
          type ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
          type === "application/vnd.ms-excel"
        ) {
          try {
            const rows = await readXlsxFile(file);
            excelPreview = rows.slice(0, 10).map((row) =>
              row.map((cell) =>
                cell === null || cell === undefined ? "" : String(cell)
              )
            );
          } catch (error) {
            console.error("Error reading Excel file:", error);
          }
        }

        const newFile: UploadedFile = {
          file,
          type,
          previewUrl,
          zipContents,
          excelPreview,
        };

        newFiles.push(newFile);

        onFileSelect(file, index);
      }
      setUploadedFilesByIndex(index, [
        ...(uploadedFilesByIndex[index] || []),
        ...newFiles,
      ]);
    },
    [index, onFileSelect, setUploadedFilesByIndex, uploadedFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      "image/*": [],
      "application/pdf": [],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [],
      "application/vnd.ms-excel": [], // ✅ .xls
      "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        [],
      "application/zip": [],
      "application/x-zip-compressed": [],
    },
  });

  const handleRemove = (fileIndex: number) => {
    removeUploadedFileByIndex(index, fileIndex);
  };

  const handleOpenModal = (file: UploadedFile) => {
    setSelectedFile(file);
    setOpenViewModal(true);
  };

  const handleCloseModal = () => {
    setOpenViewModal(false);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  return (
    <div className="space-y-4 w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-blue-500 bg-blue-500/10"
            : "border-slate-700 hover:border-blue-500 bg-slate-800/30"
        }`}
      >
        <input {...getInputProps()} />
        <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-4">
          <i className="ri-upload-cloud-2-line text-3xl text-slate-500 w-8 h-8 flex items-center justify-center" />
        </div>
        <p className="text-white text-sm font-medium mb-1">
          {isDragActive ? "Drop the files here..." : "Click to upload or drag and drop"}
        </p>
        <p className="text-slate-500 text-xs">
          PDF, images, documents, ZIP up to 25MB each
        </p>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          {uploadedFiles.map((f, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between px-4 py-3 bg-slate-800 rounded-lg border border-slate-700"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center shrink-0">
                  <i className="ri-file-3-line text-blue-400 w-4 h-4 flex items-center justify-center" />
                </div>
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium truncate">{f.file.name}</p>
                  <p className="text-slate-500 text-xs">{formatSize(f.file.size)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  className="mt-2 p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                  onClick={() => handleOpenModal(f)}
                  title="Preview"
                >
                  <FaRegEye size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Remove"
                >
                  <i className="ri-delete-bin-line w-4 h-4 flex items-center justify-center" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <FilePreviewModal
        isOpen={OpenViewModal}
        closeViewModal={handleCloseModal}
        file={selectedFile}
      />
    </div>
  );
};

export default DropZoneMultiple;
