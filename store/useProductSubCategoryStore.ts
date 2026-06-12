import { fetchWithAuth } from "@/src/app/services/authservice";
import toast from "react-hot-toast";
import { create } from "zustand";

export interface ProductSubCategory {
  id: number;
  name: string;
  productCategoryId: number;
  productCategoryName: string;
  createdOn: string;
  createdBy: string | null;
  updatedOn: string;
  updatedBy: string | null;
}

export interface AddProductSubCategoryPayload {
  name: string;
  productCategoryId: number;
}

interface ProductSubCategoryQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  productCategoryId?: number;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

interface ApiEnvelope<T> {
  data?: T;
  message?: string | string[];
  pagination?: PaginationMeta;
}

interface ProductSubCategoryState {
  productSubCategories: ProductSubCategory[];
  productSubCategory: ProductSubCategory | null;
  pagination: PaginationMeta | null;
  loading: boolean;
  error: string | null;
  fetchProductSubCategories: (
    query?: ProductSubCategoryQuery
  ) => Promise<ProductSubCategory[]>;
  getProductSubCategoryById: (id: number) => Promise<void>;
  addProductSubCategory: (
    payload: AddProductSubCategoryPayload,
    onSuccess?: () => void
  ) => Promise<void>;
  updateProductSubCategory: (
    id: number,
    payload: AddProductSubCategoryPayload,
    onSuccess?: () => void
  ) => Promise<void>;
  deleteProductSubCategory: (
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

const normalizeProductSubCategory = (item: any): ProductSubCategory => ({
  id: Number(item?.id ?? item?.Id ?? 0),
  name: String(item?.name ?? item?.Name ?? ""),
  productCategoryId: Number(
    item?.productCategoryId ?? item?.ProductCategoryId ?? 0
  ),
  productCategoryName: String(
    item?.productCategoryName ?? item?.ProductCategoryName ?? ""
  ),
  createdOn: String(item?.createdOn ?? item?.CreatedOn ?? ""),
  createdBy: item?.createdBy ?? item?.CreatedBy ?? null,
  updatedOn: String(item?.updatedOn ?? item?.UpdatedOn ?? ""),
  updatedBy: item?.updatedBy ?? item?.UpdatedBy ?? null,
});

const buildQueryString = (query?: ProductSubCategoryQuery) => {
  const params = new URLSearchParams();

  if (query?.page) params.set("page", String(query.page));
  if (query?.limit) params.set("limit", String(query.limit));
  if (query?.search?.trim()) params.set("search", query.search.trim());
  if (query?.sortBy) params.set("sortBy", query.sortBy);
  if (query?.sortOrder) params.set("sortOrder", query.sortOrder);
  if (query?.productCategoryId) {
    params.set("productCategoryId", String(query.productCategoryId));
  }

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
};

const getListPayload = (result: any) => {
  const payload = unwrapPayload<any>(result);

  if (Array.isArray(payload)) {
    return {
      items: payload,
      pagination: (result as ApiEnvelope<unknown>)?.pagination ?? null,
    };
  }

  if (Array.isArray(payload?.data)) {
    return {
      items: payload.data,
      pagination: payload.pagination ?? null,
    };
  }

  return {
    items: [],
    pagination: payload?.pagination ?? null,
  };
};

const useProductSubCategoryStore = create<ProductSubCategoryState>(
  (set, get) => ({
    productSubCategories: [],
    productSubCategory: null,
    pagination: null,
    loading: false,
    error: null,

    fetchProductSubCategories: async (query) => {
      set({ loading: true, error: null });

      try {
        const response = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_API_URL}/product-sub-categories${buildQueryString(
            query ?? { limit: 100 }
          )}`
        );
        const result = await readJson<ApiEnvelope<unknown>>(response);
        const { items, pagination } = getListPayload(result);

        if (!response.ok || !Array.isArray(items)) {
          const message = getResponseMessage(
            result,
            "Failed to fetch product sub categories"
          );
          set({ loading: false, error: message });
          toast.error(message);
          return [];
        }

        const productSubCategories = items.map(normalizeProductSubCategory);
        set({
          productSubCategories,
          pagination,
          loading: false,
          error: null,
        });
        return productSubCategories;
      } catch (error: any) {
        const message =
          error?.message || "Failed to fetch product sub categories";
        set({ loading: false, error: message });
        toast.error(message);
        return [];
      }
    },

    getProductSubCategoryById: async (id) => {
      set({ loading: true, error: null });

      try {
        const response = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_API_URL}/product-sub-categories/${id}`
        );
        const result = await readJson<ApiEnvelope<unknown>>(response);
        const payload = unwrapPayload<any>(result);

        if (!response.ok || !payload) {
          const message = getResponseMessage(
            result,
            "Failed to fetch product sub category"
          );
          set({ loading: false, error: message });
          toast.error(message);
          return;
        }

        set({
          productSubCategory: normalizeProductSubCategory(payload),
          loading: false,
          error: null,
        });
      } catch (error: any) {
        const message =
          error?.message || "Failed to fetch product sub category";
        set({ loading: false, error: message });
        toast.error(message);
      }
    },

    addProductSubCategory: async (payload, onSuccess) => {
      set({ loading: true, error: null });

      try {
        const response = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_API_URL}/product-sub-categories`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: payload.name.trim(),
              productCategoryId: Number(payload.productCategoryId),
            }),
          }
        );
        const result = await readJson<ApiEnvelope<unknown>>(response);

        if (!response.ok) {
          const message = getResponseMessage(
            result,
            "Failed to add product sub category"
          );
          set({ loading: false, error: message });
          toast.error(message);
          return;
        }

        set({ loading: false, error: null });
        toast.success("Product sub category added successfully");
        onSuccess?.();
        await get().fetchProductSubCategories();
      } catch (error: any) {
        const message =
          error?.message || "Failed to add product sub category";
        set({ loading: false, error: message });
        toast.error(message);
      }
    },

    updateProductSubCategory: async (id, payload, onSuccess) => {
      set({ loading: true, error: null });

      try {
        const response = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_API_URL}/product-sub-categories/${id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: payload.name.trim(),
              productCategoryId: Number(payload.productCategoryId),
            }),
          }
        );
        const result = await readJson<ApiEnvelope<unknown>>(response);

        if (!response.ok) {
          const message = getResponseMessage(
            result,
            "Failed to update product sub category"
          );
          set({ loading: false, error: message });
          toast.error(message);
          return;
        }

        set({ loading: false, error: null });
        toast.success("Product sub category updated successfully");
        onSuccess?.();
        await get().fetchProductSubCategories();
      } catch (error: any) {
        const message =
          error?.message || "Failed to update product sub category";
        set({ loading: false, error: message });
        toast.error(message);
      }
    },

    deleteProductSubCategory: async (id, onSuccess) => {
      set({ loading: true, error: null });

      try {
        const response = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_API_URL}/product-sub-categories/${id}`,
          { method: "DELETE" }
        );
        const result = response.ok
          ? null
          : await readJson<ApiEnvelope<unknown>>(response);

        if (!response.ok) {
          const message = getResponseMessage(
            result,
            "Failed to delete product sub category"
          );
          set({ loading: false, error: message });
          toast.error(message);
          return;
        }

        set({ loading: false, error: null });
        toast.success("Product sub category deleted successfully");
        onSuccess?.();
        await get().fetchProductSubCategories();
      } catch (error: any) {
        const message =
          error?.message || "Failed to delete product sub category";
        set({ loading: false, error: message });
        toast.error(message);
      }
    },
  })
);

export default useProductSubCategoryStore;
