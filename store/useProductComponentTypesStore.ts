import { fetchWithAuth } from "@/src/app/services/authservice";
import toast from "react-hot-toast";
import { create } from "zustand";

export interface ProductComponentType {
  id: number;
  name: string;
  createdOn: string;
  createdBy: string | null;
  updatedOn: string;
  updatedBy: string | null;
}

interface AddProductComponentType {
  name: string;
}

interface ApiEnvelope<T> {
  data?: T;
  message?: string | string[];
}

interface ProductComponentTypesState {
  productComponentTypes: ProductComponentType[];
  productComponentType: ProductComponentType | null;
  loading: boolean;
  error: string | null;
  fetchProductComponentTypes: () => Promise<ProductComponentType[]>;
  getProductComponentTypeById: (id: number) => Promise<void>;
  addProductComponentType: (
    payload: AddProductComponentType,
    onSuccess?: () => void
  ) => Promise<void>;
  updateProductComponentType: (
    id: number,
    payload: AddProductComponentType,
    onSuccess?: () => void
  ) => Promise<void>;
  deleteProductComponentType: (
    id: number,
    onSuccess?: () => void
  ) => Promise<void>;
}

const getResponseMessage = (
  payload: ApiEnvelope<unknown> | null,
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

const unwrapPayload = <T>(result: ApiEnvelope<T> | T | null): T | null => {
  if (!result) return null;
  if (typeof result === "object" && "data" in result) {
    return (result as ApiEnvelope<T>).data ?? null;
  }
  return result as T;
};

const normalizeProductComponentType = (item: any): ProductComponentType => ({
  id: Number(item?.id ?? item?.Id ?? 0),
  name: String(item?.name ?? item?.Name ?? ""),
  createdOn: String(item?.createdOn ?? item?.CreatedOn ?? ""),
  createdBy: item?.createdBy ?? item?.CreatedBy ?? null,
  updatedOn: String(item?.updatedOn ?? item?.UpdatedOn ?? ""),
  updatedBy: item?.updatedBy ?? item?.UpdatedBy ?? null,
});

const useProductComponentTypesStore = create<ProductComponentTypesState>(
  (set, get) => ({
    productComponentTypes: [],
    productComponentType: null,
    loading: false,
    error: null,

    fetchProductComponentTypes: async () => {
      set({ loading: true, error: null });

      try {
        const response = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_API_URL}/product-component-types`
        );
        const result = await readJson<
          ApiEnvelope<ProductComponentType[]> | ProductComponentType[]
        >(response);
        const payload = unwrapPayload<ProductComponentType[]>(result);

        if (!response.ok || !Array.isArray(payload)) {
          const message = getResponseMessage(
            result as ApiEnvelope<unknown>,
            "Failed to fetch product component types"
          );
          set({ loading: false, error: message });
          toast.error(message);
          return [];
        }

        const productComponentTypes = payload.map(normalizeProductComponentType);
        set({ productComponentTypes, loading: false, error: null });
        return productComponentTypes;
      } catch (error: any) {
        const message =
          error?.message || "Failed to fetch product component types";
        set({ loading: false, error: message });
        toast.error(message);
        return [];
      }
    },

    getProductComponentTypeById: async (id) => {
      set({ loading: true, error: null });

      try {
        const response = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_API_URL}/product-component-types/${id}`
        );
        const result = await readJson<
          ApiEnvelope<ProductComponentType> | ProductComponentType
        >(response);
        const payload = unwrapPayload<ProductComponentType>(result);

        if (!response.ok || !payload) {
          const message = getResponseMessage(
            result as ApiEnvelope<unknown>,
            "Failed to fetch product component type"
          );
          set({ loading: false, error: message });
          toast.error(message);
          return;
        }

        set({
          productComponentType: normalizeProductComponentType(payload),
          loading: false,
          error: null,
        });
      } catch (error: any) {
        const message =
          error?.message || "Failed to fetch product component type";
        set({ loading: false, error: message });
        toast.error(message);
      }
    },

    addProductComponentType: async (payload, onSuccess) => {
      set({ loading: true, error: null });

      try {
        const response = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_API_URL}/product-component-types`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: payload.name.trim() }),
          }
        );
        const result = await readJson<ApiEnvelope<unknown>>(response);

        if (!response.ok) {
          const message = getResponseMessage(
            result,
            "Failed to add product component type"
          );
          set({ loading: false, error: message });
          toast.error(message);
          return;
        }

        set({ loading: false, error: null });
        toast.success("Product component type added successfully");
        onSuccess?.();
        await get().fetchProductComponentTypes();
      } catch (error: any) {
        const message =
          error?.message || "Failed to add product component type";
        set({ loading: false, error: message });
        toast.error(message);
      }
    },

    updateProductComponentType: async (id, payload, onSuccess) => {
      set({ loading: true, error: null });

      try {
        const response = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_API_URL}/product-component-types/${id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: payload.name.trim() }),
          }
        );
        const result = await readJson<ApiEnvelope<unknown>>(response);

        if (!response.ok) {
          const message = getResponseMessage(
            result,
            "Failed to update product component type"
          );
          set({ loading: false, error: message });
          toast.error(message);
          return;
        }

        set({ loading: false, error: null });
        toast.success("Product component type updated successfully");
        onSuccess?.();
        await get().fetchProductComponentTypes();
      } catch (error: any) {
        const message =
          error?.message || "Failed to update product component type";
        set({ loading: false, error: message });
        toast.error(message);
      }
    },

    deleteProductComponentType: async (id, onSuccess) => {
      set({ loading: true, error: null });

      try {
        const response = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_API_URL}/product-component-types/${id}`,
          { method: "DELETE" }
        );
        const result = response.ok
          ? null
          : await readJson<ApiEnvelope<unknown>>(response);

        if (!response.ok) {
          const message = getResponseMessage(
            result,
            "Failed to delete product component type"
          );
          set({ loading: false, error: message });
          toast.error(message);
          return;
        }

        set({ loading: false, error: null });
        toast.success("Product component type deleted successfully");
        onSuccess?.();
        await get().fetchProductComponentTypes();
      } catch (error: any) {
        const message =
          error?.message || "Failed to delete product component type";
        set({ loading: false, error: message });
        toast.error(message);
      }
    },
  })
);

export default useProductComponentTypesStore;
