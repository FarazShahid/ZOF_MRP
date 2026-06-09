import { fetchWithAuth } from "@/src/app/services/authservice";
import toast from "react-hot-toast";
import { create } from "zustand";

export interface OrderDocumentType {
  Id: number;
  Name: string;
  IsRequired: boolean;
  SupportedExtensions: string[] | null;
  CreatedOn: string;
  CreatedBy: string | null;
  UpdatedOn: string;
  UpdatedBy: string | null;
}

export interface AddOrUpdateOrderDocumentType {
  Name: string;
  IsRequired: boolean;
  SupportedExtensions: string[];
}

interface ApiResponse<T> {
  data: T;
  statusCode: number;
  message: string;
}

interface ApiErrorResponse {
  message?: string | string[];
}

interface OrderDocumentTypesStore {
  orderDocumentTypes: OrderDocumentType[];
  orderDocumentTypeById: OrderDocumentType | null;
  loading: boolean;
  error: string | null;

  fetchOrderDocumentTypes: () => Promise<OrderDocumentType[]>;
  getOrderDocumentTypeById: (id: number) => Promise<void>;
  addOrderDocumentType: (
    payload: AddOrUpdateOrderDocumentType,
    onSuccess?: () => void
  ) => Promise<void>;
  updateOrderDocumentType: (
    id: number,
    payload: AddOrUpdateOrderDocumentType,
    onSuccess?: () => void
  ) => Promise<void>;
  deleteOrderDocumentType: (id: number, onSuccess?: () => void) => Promise<void>;
  clearOrderDocumentType: () => void;
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

const normalizeDocumentType = (
  documentType: OrderDocumentType
): OrderDocumentType => ({
  ...documentType,
  IsRequired: Boolean(documentType.IsRequired),
  SupportedExtensions: Array.isArray(documentType.SupportedExtensions)
    ? documentType.SupportedExtensions
    : [],
});

const useOrderDocumentTypesStore = create<OrderDocumentTypesStore>(
  (set, get) => ({
    orderDocumentTypes: [],
    orderDocumentTypeById: null,
    loading: false,
    error: null,

    fetchOrderDocumentTypes: async () => {
      set({ loading: true, error: null });
      try {
        const response = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_API_URL}/order-document-types`
        );
        const result = await readJson<
          ApiResponse<OrderDocumentType[]> | ApiErrorResponse
        >(response);

        if (!response.ok) {
          const message = getResponseMessage(
            result as ApiErrorResponse,
            "Failed to fetch order document types"
          );
          set({ loading: false, error: message });
          toast.error(message);
          return [];
        }

        const data = (result as ApiResponse<OrderDocumentType[]> | null)?.data;
        const orderDocumentTypes = Array.isArray(data)
          ? data.map(normalizeDocumentType)
          : [];

        set({ orderDocumentTypes, loading: false, error: null });
        return orderDocumentTypes;
      } catch (error: any) {
        const message = error?.message || "Failed to fetch order document types";
        set({ loading: false, error: message });
        toast.error(message);
        return [];
      }
    },

    getOrderDocumentTypeById: async (id: number) => {
      set({ loading: true, error: null });
      try {
        const response = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_API_URL}/order-document-types/${id}`
        );
        const result = await readJson<
          ApiResponse<OrderDocumentType> | ApiErrorResponse
        >(response);

        if (!response.ok) {
          const message = getResponseMessage(
            result as ApiErrorResponse,
            "Failed to fetch order document type"
          );
          set({ loading: false, error: message });
          toast.error(message);
          return;
        }

        const data = (result as ApiResponse<OrderDocumentType> | null)?.data;
        set({
          orderDocumentTypeById: data ? normalizeDocumentType(data) : null,
          loading: false,
          error: null,
        });
      } catch (error: any) {
        const message = error?.message || "Failed to fetch order document type";
        set({ loading: false, error: message });
        toast.error(message);
      }
    },

    addOrderDocumentType: async (
      payload: AddOrUpdateOrderDocumentType,
      onSuccess?: () => void
    ) => {
      set({ loading: true, error: null });
      try {
        const response = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_API_URL}/order-document-types`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
        const result = await readJson<
          ApiResponse<OrderDocumentType> | ApiErrorResponse
        >(response);

        if (!response.ok) {
          const message = getResponseMessage(
            result as ApiErrorResponse,
            "Failed to add order document type"
          );
          set({ loading: false, error: message });
          toast.error(message);
          return;
        }

        set({ loading: false, error: null });
        toast.success("Order document type added successfully");
        onSuccess?.();
        await get().fetchOrderDocumentTypes();
      } catch (error: any) {
        const message = error?.message || "Failed to add order document type";
        set({ loading: false, error: message });
        toast.error(message);
      }
    },

    updateOrderDocumentType: async (
      id: number,
      payload: AddOrUpdateOrderDocumentType,
      onSuccess?: () => void
    ) => {
      set({ loading: true, error: null });
      try {
        const response = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_API_URL}/order-document-types/${id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
        const result = await readJson<
          ApiResponse<OrderDocumentType> | ApiErrorResponse
        >(response);

        if (!response.ok) {
          const message = getResponseMessage(
            result as ApiErrorResponse,
            "Failed to update order document type"
          );
          set({ loading: false, error: message });
          toast.error(message);
          return;
        }

        set({ loading: false, error: null });
        toast.success("Order document type updated successfully");
        onSuccess?.();
        await get().fetchOrderDocumentTypes();
      } catch (error: any) {
        const message = error?.message || "Failed to update order document type";
        set({ loading: false, error: message });
        toast.error(message);
      }
    },

    deleteOrderDocumentType: async (id: number, onSuccess?: () => void) => {
      set({ loading: true, error: null });
      try {
        const response = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_API_URL}/order-document-types/${id}`,
          { method: "DELETE" }
        );
        const result = response.ok
          ? null
          : await readJson<ApiErrorResponse>(response);

        if (!response.ok) {
          const message = getResponseMessage(
            result,
            "Failed to delete order document type"
          );
          set({ loading: false, error: message });
          toast.error(message);
          return;
        }

        set({ loading: false, error: null });
        toast.success("Order document type deleted successfully");
        onSuccess?.();
        await get().fetchOrderDocumentTypes();
      } catch (error: any) {
        const message = error?.message || "Failed to delete order document type";
        set({ loading: false, error: message });
        toast.error(message);
      }
    },

    clearOrderDocumentType: () => set({ orderDocumentTypeById: null }),
  })
);

export default useOrderDocumentTypesStore;
