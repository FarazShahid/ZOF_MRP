"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import JSZip from "jszip";
import { Field, ErrorMessage, FieldArray } from "formik";
import { LuMaximize } from "react-icons/lu";
import { MdCancel } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import FilePreviewModal from "./FilePreviewModal";

type UploadedFile = {
  file: File;
  type: string;
  previewUrl?: string;
  zipContents?: string[];
};

export default function Step3({ formik }: any) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  const [OpenViewModal, setOpenViewModal] = useState<boolean>(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = [];

    for (const file of acceptedFiles) {
      const type = file.type;
      let previewUrl: string | undefined;
      let zipContents: string[] | undefined;

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

      newFiles.push({ file, type, previewUrl, zipContents });
    }

    setUploadedFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
      "application/pdf": [],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [],
      "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        [],
      "application/zip": [],
      "application/x-zip-compressed": [],
    },
  });
  const handleRemove = (indexToRemove: number) => {
    setUploadedFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleOpenModal = (file: UploadedFile) => {
    setSelectedFile(file);
    setOpenViewModal(true);
  };
  const handleCloseModal = () => {
    setOpenViewModal(false);
  };

  return (
    <div className="space-y-6 w-[500px]">
      <div className="p-4">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed p-6 rounded-md text-center cursor-pointer ${
            isDragActive ? "bg-gray-800" : "bg-gray-900"
          }`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>
              Drag & drop files here, or click to select (images, docs, zip...)
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {uploadedFiles.map((f, idx) => (
            <div
              key={idx}
              className="border rounded-lg shadow hover:shadow-md transition relative p-4"
            >
              <button
                onClick={() => handleRemove(idx)}
                className="absolute top-0 right-0 text-red-500 hover:text-red-700"
              >
                <MdCancel size={20} />
              </button>

              {/* Thumbnail / Preview */}
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

              {/* File Info */}
              <div className="mt-2">
                <p className="font-medium truncate">{f.file.name}</p>
                <p className="text-xs text-gray-500">
                  {f.type || "Unknown type"}
                </p>
              </div>
              <button
                className="mt-2 text-sm text-blue-500 hover:underline"
                onClick={() => handleOpenModal(f)}
              >
                <FaRegEye size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-gray-400">
          Description
        </label>
        <Field
          as="textarea"
          name="Description"
          placeholder="Product Description..."
          className="rounded-xl text-gray-400 min-h-[105px] h-full text-sm p-2 w-full outline-none bg-gray-950 border-1 border-gray-600"
        />
      </div>

      <FilePreviewModal
        isOpen={OpenViewModal}
        closeViewModal={handleCloseModal}
        file={selectedFile}
      />
    </div>
  );
}
