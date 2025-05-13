import { create } from "zustand";
import toast from "react-hot-toast";
import { fetchWithAuth } from "@/src/app/services/authservice";

type UploadResponse = {
  PhotoGuid: string;
  FileName: string;
  Extension: string;
  CloudPath: string;
  DocStatusId: number;
  DocTypeId: number;
  CreatedBy: string;
  UpdatedBy: string;
  PhysicalPath: string | null;
  Id: number;
  CreatedOn: string;
  UpdatedOn: string;
};

interface MediaHandlerState {
  isUploading: boolean;
  uploadError: string | null;
  uploadResult: UploadResponse | null;
  uploadFile: (file: File, typeId: number) => Promise<UploadResponse | null>;
}

const useMediaHandlerStore = create<MediaHandlerState>((set) => ({
  isUploading: false,
  uploadError: null,
  uploadResult: null,

  uploadFile: async (file, typeId) => {
    set({ isUploading: true, uploadError: null, uploadResult: null });

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/media-handler/upload?typeId=${typeId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: formData,
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Upload failed");
      }

      const json = await res.json();
      const data = json.data as UploadResponse;

      set({ isUploading: false, uploadResult: data });
      toast.success("File uploaded successfully!");
      return data;
    } catch (error: any) {
      set({ isUploading: false, uploadError: error.message });
      toast.error(error.message || "Upload failed.");
      return null;
    }
  },
}));

export default useMediaHandlerStore;
