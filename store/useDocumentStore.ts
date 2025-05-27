import { create } from "zustand";
import toast from "react-hot-toast";
import { fetchWithAuth } from "@/src/app/services/authservice";


export interface GetDocumentsResponse {
    id: number;
    title: string;
    description?: string;
    document_type: number;
    document_type_name: string;
    media_id: number;
    path: string;
    role_id?: number;
    role_name?: string;
    employee_id?: number;
    employee_name?: string;
    created_by: string;
    updated_by: string;
    created_on: string;
    updated_on: string;
}

interface GetAllDocumentsResponse {
    data: GetDocumentsResponse[],
    statusCode: number;
    message: string;
}
interface GetDocumentsByIdType {
    data: GetDocumentsResponse | null,
    statusCode: number;
    message: string;
}

interface StoreState {
    documents: GetDocumentsResponse[];
    documentById: GetDocumentsResponse | null;
    loading: boolean;
    error: string | null;
    fetchAllDocuments: () => Promise<void>;
    fetchDocumentsWithFilters: (employeeId?: number, roleId?: number) => Promise<void>;
    getDocumentById: (employeeId: number) => Promise<void>;
    deleteDocument: (id: number, onSuccess: () => void) => Promise<void>;
}


export const useDocumentStore = create<StoreState>((set, get) => ({
    documents: [],
    documentById: null,
    loading: false,
    error: null,

    fetchAllDocuments: async () => {
        set({ loading: true, error: null });

        try {
            const response = await fetchWithAuth(
                `${process.env.NEXT_PUBLIC_API_URL}/documents`
            );
            if (!response.ok) {
                set({ loading: false, error: "Error Fetching Data" });
                toast.error("Error Fetching Data");
            }
            const data: GetAllDocumentsResponse = await response.json();
            set({ documents: data.data, loading: false });
        } catch (error) {
            console.error(error);
            set({ loading: false, error: "Error Fetching Data" });
            toast.error("Error Fetching Data");
        }
    },

    fetchDocumentsWithFilters: async (employeeId?: number, roleId?: number) => {
        set({ loading: true, error: null });

        try {
            const params = new URLSearchParams();
            if (employeeId) params.append("employee_id", employeeId.toString());
            if (roleId) params.append("role_id", roleId.toString());

            const query = params.toString();
            const url = `${process.env.NEXT_PUBLIC_API_URL}/documents${query ? `?${query}` : ""}`;

            const response = await fetchWithAuth(url);

            if (!response.ok) {
                set({ loading: false, error: "Error Fetching Data" });
                toast.error("Error Fetching Data");
                return;
            }

            const data: GetAllDocumentsResponse = await response.json();
            set({ documents: data.data, loading: false });
        } catch (error) {
            console.error(error);
            set({ loading: false, error: "Error Fetching Data" });
            toast.error("Error Fetching Data");
        }
    },

    getDocumentById: async (id: number) => {
        set({ loading: true, error: null });
        try {
            const response = await fetchWithAuth(
                `${process.env.NEXT_PUBLIC_API_URL}/documents/${id}`
            );
            if (!response.ok) {
                const error = await response.json();
                set({ loading: false, error: null });
                toast.error(error.message);
            }
            const data: GetDocumentsByIdType = await response.json();
            set({ documentById: data.data, loading: false });
        } catch (error) {
            console.error(error);
            set({ error: "Failed to fetch Data", loading: false });
            toast.error("Error Fetching Data");
        }
    },

    deleteDocument: async (id: number, onSuccess?: () => void) => {
        set({ loading: true, error: null });
        try {
            const response = await fetchWithAuth(
                `${process.env.NEXT_PUBLIC_API_URL}/documents/${id}`,
                { method: "DELETE" }
            );
            if (!response.ok) {
                const error = await response.json();
                set({ loading: false, error: null });
                toast.error(error.message || "Failed to delete document");
            } else {
                set({ loading: false, error: null });
                toast.success("Document deleted successfully");
                if (onSuccess) onSuccess();
                await get().fetchAllDocuments();
            }
        } catch (error) {
            console.error(error);
            set({ error: "Failed to delete document", loading: false });
            toast.error("Failed to delete document");
        }
    },

}));