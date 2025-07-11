import { create } from "zustand";
import toast from "react-hot-toast";
import { fetchWithAuth } from "@/src/app/services/authservice"; 

interface Document {
  id: number;
  fileName: string;
  fileType: string;
  fileUrl: string;
  mediaId: number;
  referenceId: number;
  referenceType: string;
  uploaded_by: string;
  uploaded_on: string;
  updated_on: string;
  tag?: string;
}

interface UploadResponse {
  message: string;
  media: Document;
  link: {
    id: number;
    media_id: number;
    reference_type: string;
    reference_id: number;
    tag?: string;
    created_on: string;
    created_by: string;
  };
}

interface GetByIdResponse {
    data: Document[],
    message: string;
}

interface DocumentCenterStore {
  documents: Document[];
  loadingDoc: boolean;
  error: string | null;

  uploadDocument: (
    file: File,
    referenceType: string,
    referenceId: number,
    tag?: string
  ) => Promise<UploadResponse | null>;

  fetchDocuments: (
    referenceType: string,
    referenceId: number
  ) => Promise<void>;
}

export const useDocumentCenterStore = create<DocumentCenterStore>((set) => ({
  documents: [],
  loadingDoc: false,
  error: null,

  uploadDocument: async (
    file: File,
    referenceType: string,
    referenceId: number,
    tag?: string
  ) => {
    try {
      
      set({ loadingDoc: true, error: null });
      const formData = new FormData();
      formData.append("file", file);

      const query = new URLSearchParams({
        referenceType,
        referenceId: referenceId.toString(),
      });

      if (tag) query.append("tag", tag);

      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/media-handler/upload?${query.toString()}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result: UploadResponse = await response.json();

      if (!response.ok) {
        set({ loadingDoc: false, error: null });
        toast.error(result.message || "Upload failed");
        return null;
      }

      set({ loadingDoc: false, error: null });
      toast.success("Document uploaded");
      return result;
    } catch (err) {
      console.error("Upload failed", err);
      toast.error("Upload failed");
      return null;
    }
  },

  fetchDocuments: async (referenceType: string, referenceId: number) => {
    set({ loadingDoc: true, error: null });

    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/media-handler/documents?referenceType=${referenceType}&referenceId=${referenceId}`
      );

      const result: GetByIdResponse = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Failed to fetch documents");
        set({ loadingDoc: false, error: result.message || "Failed to fetch documents" });
        return;
      }

      set({ documents: result.data, loadingDoc: false });
    } catch (err) {
      toast.error("Failed to fetch documents");
      set({ loadingDoc: false, error: "Failed to fetch documents" });
    }
  },
}));
