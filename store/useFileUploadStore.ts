import { create } from "zustand";

export type UploadedFile = {
  file: File;
  type: string;
  previewUrl?: string;
  zipContents?: string[];
};

interface FileUploadStore {
  uploadedFiles: UploadedFile[];
  setUploadedFiles: (files: UploadedFile[]) => void;
  addUploadedFile: (file: UploadedFile) => void;
  removeUploadedFile: (index: number) => void;
  resetUploadedFiles: () => void;
}

export const useFileUploadStore = create<FileUploadStore>((set) => ({
  uploadedFiles: [],
  setUploadedFiles: (files) => set({ uploadedFiles: files }),
  addUploadedFile: (file) =>
    set((state) => ({ uploadedFiles: [...state.uploadedFiles, file] })),
  removeUploadedFile: (index) =>
    set((state) => ({
      uploadedFiles: state.uploadedFiles.filter((_, i) => i !== index),
    })),
  resetUploadedFiles: () => set({ uploadedFiles: [] }),
}));
