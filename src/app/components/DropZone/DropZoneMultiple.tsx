// "use client";

// import { useState, useCallback } from "react";
// import JSZip from "jszip";
// import { useDropzone } from "react-dropzone";
// import { MdCancel } from "react-icons/md";
// import { FaRegEye } from "react-icons/fa";
// import FilePreviewModal from "../../product/component/FilePreviewModal";
// import { useFileUploadStore } from "@/store/useFileUploadStore";

// type UploadedFile = {
//   file: File;
//   type: string;
//   previewUrl?: string;
//   zipContents?: string[];
// };

// const DropZoneMultiple = () => {
//    const {
//     uploadedFiles,
//     addUploadedFile,
//     removeUploadedFile,
//   } = useFileUploadStore();
  
//   const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
//   const [OpenViewModal, setOpenViewModal] = useState<boolean>(false);

//   const onDrop = useCallback(async (acceptedFiles: File[]) => {

//     for (const file of acceptedFiles) {
//       const type = file.type;
//       let previewUrl: string | undefined;
//       let zipContents: string[] | undefined;

//       if (file.name.endsWith(".zip")) {
//         try {
//           const zip = await JSZip.loadAsync(file);
//           zipContents = Object.keys(zip.files);
//         } catch (err) {
//           console.error("Error unzipping file:", err);
//         }
//       }

//       if (type.startsWith("image/") || type === "application/pdf") {
//         previewUrl = URL.createObjectURL(file);
//       }

//      const newFile: UploadedFile = ({ file, type, previewUrl, zipContents });
//      addUploadedFile(newFile);
//     }

//   }, [addUploadedFile]);

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     accept: {
//       "image/*": [],
//       "application/pdf": [],
//       "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
//         [],
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [],
//       "application/vnd.openxmlformats-officedocument.presentationml.presentation":
//         [],
//       "application/zip": [],
//       "application/x-zip-compressed": [],
//     },
//   });

//   const handleRemove = (indexToRemove: number) => {
//     removeUploadedFile(indexToRemove);
//   };
//   const handleOpenModal = (file: UploadedFile) => {
//     setSelectedFile(file);
//     setOpenViewModal(true);
//   };
//   const handleCloseModal = () => {
//     setOpenViewModal(false);
//   };

//   return (
//     <div className="space-y-6 w-full">
//       <div className="p-4">
//         <div
//           {...getRootProps()}
//           className={`border-2 border-dashed p-6 rounded-md text-center cursor-pointer ${
//             isDragActive ? "bg-gray-800" : "bg-gray-900"
//           }`}
//         >
//           <input {...getInputProps()} />
//           {isDragActive ? (
//             <p>Drop the files here ...</p>
//           ) : (
//             <p>
//               Drag & drop files here, or click to select (images, docs, zip...)
//             </p>
//           )}
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
//           {uploadedFiles.map((f, idx) => (
//             <div
//               key={idx}
//               className="border rounded-lg shadow hover:shadow-md transition relative p-4"
//             >
//               <button
//                 onClick={() => handleRemove(idx)}
//                 className="absolute top-0 right-0 text-red-500 hover:text-red-700"
//               >
//                 <MdCancel size={20} />
//               </button>

//               {/* Thumbnail / Preview */}
//               {f.previewUrl && f.type.startsWith("image/") ? (
//                 <img
//                   src={f.previewUrl}
//                   className="rounded-md w-full h-20 object-cover mb-2"
//                   alt="Uploaded"
//                 />
//               ) : f.previewUrl && f.type === "application/pdf" ? (
//                 <iframe
//                   src={f.previewUrl}
//                   className="w-full h-40 rounded mb-2"
//                 />
//               ) : f.zipContents ? (
//                 <div className="h-40 overflow-y-auto text-sm bg-gray-100 p-2 rounded">
//                   <p className="font-semibold mb-1">ZIP contents:</p>
//                   <ul className="list-disc pl-4">
//                     {f.zipContents.map((item, i) => (
//                       <li key={i}>{item}</li>
//                     ))}
//                   </ul>
//                 </div>
//               ) : (
//                 <div className="h-40 flex items-center justify-center bg-gray-100 rounded text-gray-500 text-sm">
//                   No preview available
//                 </div>
//               )}

//               {/* File Info */}
//               <div className="mt-2">
//                 <p className="font-medium truncate">{f.file.name}</p>
//                 <div className="flex items-center justify-between">
//                   <p className="text-xs text-gray-500">
//                     {f.type || "Unknown type"}
//                   </p>
//                   <button
//                     className="mt-2 text-sm text-green-500 hover:underline"
//                     onClick={() => handleOpenModal(f)}
//                   >
//                     <FaRegEye size={18} />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <FilePreviewModal
//         isOpen={OpenViewModal}
//         closeViewModal={handleCloseModal}
//         file={selectedFile}
//       />
//     </div>
//   );
// };

// export default DropZoneMultiple;


import React from 'react'

const DropZoneMultiple = () => {
  return (
    <div>DropZoneMultiple</div>
  )
}

export default DropZoneMultiple