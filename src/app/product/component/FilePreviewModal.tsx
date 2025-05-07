import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
import React from "react";

interface UploadedFile {
    file: File;
    type: string;
    previewUrl?: string;
    zipContents?: string[];
  }

interface ComponentProps {
  isOpen: boolean;
  closeViewModal: () => void;
  file: UploadedFile | null;
}


const FilePreviewModal: React.FC<ComponentProps> = ({
  isOpen,
  closeViewModal,
  file,
}) => {
  return (
    <Modal isOpen={isOpen} size="4xl" onOpenChange={closeViewModal}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {file?.file.name}
            </ModalHeader>
            <ModalBody>
              {file?.previewUrl && file.type.startsWith("image/") && (
                <img
                  src={file.previewUrl}
                  className="w-full max-h-[70vh] object-contain rounded"
                  alt="Preview"
                />
              )}
              {file?.type === "application/pdf" && (
                <iframe
                  src={file.previewUrl}
                  className="w-full h-[70vh] border rounded"
                  title="PDF Preview"
                />
              )}
              {file?.zipContents && (
                <ul className="text-sm list-disc pl-4 max-h-[50vh] overflow-auto">
                  {file.zipContents.map((entry, i) => (
                    <li key={i}>{entry}</li>
                  ))}
                </ul>
              )}
              {!file?.previewUrl && !file?.zipContents && (
                <p className="text-gray-500 text-sm">No preview available.</p>
              )}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default FilePreviewModal;
