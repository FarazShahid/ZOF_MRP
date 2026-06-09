import { create } from "zustand";
import toast from "react-hot-toast";
import { FileTypesEnum } from "@/src/types/order"; 
import { fetchWithAuth } from "@/src/app/services/authservice";
import { withMediaPrefix } from "@/src/utils/publicMedai";
import useOrderDocumentTypesStore from "./useOrderDocumentTypesStore";

interface TypeCoverage {
  perTypeCount: Record<number, number>;
  matchedTypes: number; 
  totalTypes: number;   
  percent: number;     
  totalDocs: number;     
}

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
  typeId?: number;
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
  data: Document[];
  message: string;
}

interface ApiErrorResponse {
  message?: string | string[];
}

interface OrderDocumentUploadItem {
  file: File;
  typeId: number;
}

interface DocumentCenterStore {
  documents: Document[];
  documentsByReferenceId: Record<number, Document[]>; 
  typeCoverageByReferenceId: Record<number, TypeCoverage>;
  loadingDoc: boolean;
  error: string | null;

  uploadDocument: (
    file: File,
    referenceType: string,
    referenceId: number,
    tag?: string,
    typeId?: number,
  ) => Promise<UploadResponse | null>;

  uploadOrderDocuments: (
    orderId: number,
    documents: OrderDocumentUploadItem[],
    options?: { showSuccessToast?: boolean }
  ) => Promise<boolean>;

  fetchDocuments: (referenceType: string, referenceId: number, typeId?: number) => Promise<void>;
  //setTypeCoverage: (referenceId: number, coverage: TypeCoverage) => void;
}

const getResponseMessage = (
  payload: ApiErrorResponse | null,
  fallback: string
) => {
  const message = payload?.message;
  if (Array.isArray(message)) return message.join(" ");
  return message || fallback;
};

const readJson = async <T>(response: Response): Promise<T | null> => {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
};

export const useDocumentCenterStore = create<DocumentCenterStore>((set) => ({
  documents: [],
  documentsByReferenceId: {},
  typeCoverageByReferenceId: {},
  loadingDoc: false,
  error: null,

  uploadDocument: async (
    file: File,
    referenceType: string,
    referenceId: number,
    tag?: string,
    typeId?: number
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
      if (typeof typeId === "number") query.append("typeId", String(typeId));

      const response = await fetchWithAuth(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/media-handler/upload?${query.toString()}`,
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

  uploadOrderDocuments: async (orderId, documents, options) => {
    if (documents.length === 0) return true;

    try {
      set({ loadingDoc: true, error: null });

      const formData = new FormData();
      documents.forEach((document) => {
        formData.append("documents", document.file);
        formData.append("typeIds", String(document.typeId));
      });

      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/documents`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await readJson<ApiErrorResponse>(response);

      if (!response.ok) {
        const message = getResponseMessage(
          result,
          "Failed to upload order documents"
        );
        set({ loadingDoc: false, error: message });
        toast.error(message);
        return false;
      }

      set({ loadingDoc: false, error: null });
      if (options?.showSuccessToast !== false) {
        toast.success("Order documents uploaded");
      }
      return true;
    } catch (err) {
      console.error("Order document upload failed", err);
      const message = "Failed to upload order documents";
      set({ loadingDoc: false, error: message });
      toast.error(message);
      return false;
    }
  },

  fetchDocuments: async (referenceType: string, referenceId: number, typeId?: number) => {
    set({ loadingDoc: true, error: null });

    try {
      const query = new URLSearchParams({
        referenceType,
        referenceId: referenceId.toString(),
      });

      if (typeof typeId === "number") query.append("typeId", String(typeId));

      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/media-handler/documents?${query.toString()}`
      );

      const result: GetByIdResponse = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Failed to fetch documents");
        set({
          loadingDoc: false,
          error: result.message || "Failed to fetch documents",
        });
        return;
      }

      const docs: Document[] = (result.data ?? []).map((d) => ({
        ...d,
        fileUrl: withMediaPrefix(d.fileUrl),
      }));
       

      let documentTypes = FileTypesEnum;
      if (referenceType === "order") {
        const store = useOrderDocumentTypesStore.getState();
        const orderDocumentTypes =
          store.orderDocumentTypes.length > 0
            ? store.orderDocumentTypes
            : await store.fetchOrderDocumentTypes();

        documentTypes = orderDocumentTypes.map((type) => ({
          id: type.Id,
          name: type.Name,
        }));
      }

      const perTypeCount: Record<number, number> = {};
      for (const t of documentTypes) perTypeCount[t.id] = 0;

      for (const d of docs) {
        if (typeof d?.typeId === "number" && perTypeCount[d.typeId] !== undefined) {
          perTypeCount[d.typeId] += 1;
        }
      }

      const totalTypes = documentTypes.length;
      const matchedTypes = documentTypes.reduce(
        (acc, t) => acc + (perTypeCount[t.id] > 0 ? 1 : 0),
        0
      );
      const percent = totalTypes === 0 ? 0 : (matchedTypes / totalTypes) * 100;


      set((state) => ({
        documents: docs,
        documentsByReferenceId: {
          ...state.documentsByReferenceId,
          [referenceId]: docs,
        },
        typeCoverageByReferenceId: {
          ...state.typeCoverageByReferenceId,
          [referenceId]: {
            perTypeCount,
            matchedTypes,
            totalTypes,
            percent,
            totalDocs: docs.length,
          },
        },
        loadingDoc: false,
      }));


    } catch (err) {
      toast.error("Failed to fetch documents");
      set({ loadingDoc: false, error: "Failed to fetch documents" });
    }
  },
}));
