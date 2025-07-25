"use client";

import { useState, useCallback } from "react";
import JSZip from "jszip";
import * as XLSX from "xlsx";
import { useDropzone } from "react-dropzone";
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

        if (
          file.name.endsWith(".xlsx") ||
          file.name.endsWith(".xls") ||
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

  console.log("uploadedFiles", uploadedFiles);

  return (
    <div className="space-y-6 w-full">
      <div className="p-4">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed p-6 rounded-md text-center cursor-pointer ${
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

        {uploadedFiles.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            {uploadedFiles.map((f, idx) => (
              <div
                key={idx}
                className="border rounded-lg shadow hover:shadow-md transition relative p-4"
              >
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="absolute top-0 right-0 text-red-500 hover:text-red-700"
                >
                  <MdCancel size={20} />
                </button>

                {f.previewUrl && f.type.startsWith("image/") ? (
                  <img
                    src={f.previewUrl}
                    className="rounded-md w-full h-20 object-cover mb-2"
                    alt="Uploaded"
                  />
                ) : f.previewUrl && f.type === "application/pdf" ? (
                  <iframe
                    src={f.previewUrl}
                    className="w-full h-40 rounded mb-2"
                  />
                ) : f.excelPreview ? (
                  <div className="h-40 overflow-y-auto text-sm bg-gray-100 p-2 rounded">
                    <p className="font-semibold mb-1">Excel Preview:</p>
                    <table className="text-xs w-full table-auto border">
                      <tbody>
                        {f.excelPreview.map((row, i) => (
                          <tr key={i}>
                            {row.map((cell, j) => (
                              <td key={j} className="border px-1 py-0.5">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : f.zipContents ? (
                  <div className="h-40 overflow-y-auto text-sm bg-gray-100 p-2 rounded">
                    <p className="font-semibold mb-1">ZIP contents:</p>
                    <ul className="list-disc pl-4">
                      {f.zipContents.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="h-40 flex items-center justify-center bg-gray-100 rounded text-gray-500 text-sm">
                    No preview available
                  </div>
                )}

                <div className="mt-2">
                  <p className="font-medium truncate whitespace-nowrap overflow-hidden">{f.file.name}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500 truncate whitespace-nowrap overflow-hidden">
                      {f.type || "Unknown type"}
                    </p>
                    <button
                      type="button"
                      className="mt-2 text-sm text-green-500 hover:underline"
                      onClick={() => handleOpenModal(f)}
                    >
                      <FaRegEye size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <FilePreviewModal
        isOpen={OpenViewModal}
        closeViewModal={handleCloseModal}
        file={selectedFile}
      />
    </div>
  );
};

export default DropZoneMultiple;
