import { create } from "zustand";
import toast from "react-hot-toast";
import { FileTypesEnum } from "@/src/types/order"; 
import { fetchWithAuth } from "@/src/app/services/authservice";

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

  fetchDocuments: (referenceType: string, referenceId: number, typeId?: number) => Promise<void>;
  //setTypeCoverage: (referenceId: number, coverage: TypeCoverage) => void;
}

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

  fetchDocuments: async (referenceType: string, referenceId: number, typeId?: number) => {
    set({ loadingDoc: true, error: null });

    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/media-handler/documents?referenceType=${referenceType}&referenceId=${referenceId}`
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

      const docs = result.data ?? [];
      const perTypeCount: Record<number, number> = {};
      for (const t of FileTypesEnum) perTypeCount[t.id] = 0;

      for (const d of docs) {
        if (typeof d?.typeId === "number" && perTypeCount[d.typeId] !== undefined) {
          perTypeCount[d.typeId] += 1;
        }
      }

      const totalTypes = FileTypesEnum.length;
      const matchedTypes = FileTypesEnum.reduce(
        (acc, t) => acc + (perTypeCount[t.id] > 0 ? 1 : 0),
        0
      );
      const percent = totalTypes === 0 ? 0 : (matchedTypes / totalTypes) * 100;


      set((state) => ({
        documents: result.data,
        documentsByReferenceId: {
          ...state.documentsByReferenceId,
          [referenceId]: result.data,
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
  // setTypeCoverage: (referenceId, coverage) =>
  //   set((state) => ({
  //     typeCoverageByReferenceId: {
  //       ...state.typeCoverageByReferenceId,
  //       [referenceId]: coverage,
  //     },
  //   })),
}));
