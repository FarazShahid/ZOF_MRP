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
  removeUploadedFileByIndex: (index: number) => void;
};

export const useFileUploadStore = create<FileUploadState>((set) => ({
  uploadedFilesByIndex: {},
  setUploadedFilesByIndex: (index, files) =>
    set((state) => ({
      uploadedFilesByIndex: { ...state.uploadedFilesByIndex, [index]: files },
    })),
  removeUploadedFileByIndex: (index) =>
    set((state) => {
      const newState = { ...state.uploadedFilesByIndex };
      delete newState[index];
      return { uploadedFilesByIndex: newState };
    }),
}));
