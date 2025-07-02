import { create } from "zustand";

export type UploadedFile = {
  file: File;
  type: string;
  previewUrl?: string;
  zipContents?: string[];
};

type FileUploadState = {
  uploadedFilesByIndex: Record<number, UploadedFile[]>;
  setUploadedFilesByIndex: (index: number, files: UploadedFile[]) => void;
  removeUploadedFileByIndex: (index: number, fileIndex?: number) => void;
};

export const useFileUploadStore = create<FileUploadState>((set) => ({
  uploadedFilesByIndex: {},
  setUploadedFilesByIndex: (index, files) =>
    set((state) => ({
      uploadedFilesByIndex: { ...state.uploadedFilesByIndex, [index]: files },
    })),
  removeUploadedFileByIndex: (index: number, fileIndex?: number) =>
  set((state) => {
    const files = state.uploadedFilesByIndex[index] || [];
    const updatedFiles = files.filter((_, i) => i !== fileIndex);
    return {
      uploadedFilesByIndex: {
        ...state.uploadedFilesByIndex,
        [index]: updatedFiles,
      },
    };
  }),
}));
