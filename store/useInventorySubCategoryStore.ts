import { fetchWithAuth } from "@/src/app/services/authservice";
import toast from "react-hot-toast";
import { create } from "zustand";

interface GetSubCategoryResponse {
  data: SubCategoryResponse[];
  statusCode: number;
  message: string;
}

interface AddSubCategoryResponse {
  data: SubCategoryResponse;
  statusCode: number;
  message: string;
}

interface SubCategoryResponse {
  Id: number;
  Name: string;
  CategoryId: number;
  CategoryName: string;
  CreatedOn: string;
  CreatedBy: string;
  UpdatedOn: string;
  UpdatedBy: string;
}

export interface AddSubCategoryOptions {
  Name: string;
  CategoryId: number;
}

interface StoreState {
  subCategories: SubCategoryResponse[];
  subCategoryById: SubCategoryResponse | null;
  loading: boolean;
  error: string | null;

  fetchSubCategories: () => Promise<void>;
  getSubCategoryById: (id: number) => Promise<void>;
  addSubCategory: (
    subCategoryType: AddSubCategoryOptions,
    onSuccess: () => void
  ) => Promise<void>;
  updateSubCategory: (
    id: number,
    subCategoryType: AddSubCategoryOptions,
    onSuccess: () => void
  ) => Promise<void>;
  deleteSubCategory: (id: number, onSuccess: () => void) => Promise<void>;
}

const useInventorySubCategoryStore = create<StoreState>((set, get) => ({
  subCategories: [],
  subCategoryById: null,
  loading: false,
  error: null,

  fetchSubCategories: async () => {
    set({ loading: true, error: null });

    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/inventory-sub-categories`
      );
      if (!response.ok) {
        set({ loading: false, error: "Error Fetching Data" });
      }
      const data: GetSubCategoryResponse = await response.json();
      set({ subCategories: data.data, loading: false });
    } catch (error) {
      set({ loading: false, error: "Error Fetching Data" });
    }
  },

  getSubCategoryById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/inventory-sub-categories/${id}`
      );
      if (!response.ok) {
        const error = await response.json();
        set({ loading: false, error: null });
        toast.error(error.message || "Failed to fetch data");
      }
      const data: AddSubCategoryResponse = await response.json();
      set({ subCategoryById: data.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch data", loading: false });
      toast.error("Failed to fetch data");
    }
  },

  addSubCategory: async (
    subCategoryType: AddSubCategoryOptions,
    onSuccess?: () => void
  ) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/inventory-sub-categories`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(subCategoryType),
        }
      );
      if (!response.ok) {
        const error = await response.json();
        set({ loading: false, error: null });
        toast.error(error.message || "Failed to add sub category");
      } else {
        set({ loading: false, error: null });
        toast.success("Sub Category added successfully");
        if (onSuccess) onSuccess();
        await get().fetchSubCategories();
      }
    } catch (error) {
      set({ error: "Failed to add sub category", loading: false });
      toast.error("Failed to add sub category");
    }
  },

  updateSubCategory: async (
    id: number,
    updatedsubCategory: AddSubCategoryOptions,
    onSuccess?: () => void
  ) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/inventory-sub-categories/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedsubCategory),
        }
      );
      if (!response.ok) {
        const error = await response.json();
        set({ loading: false, error: null });
        toast.error(error.message || "Failed to update sub category");
      } else {
        set({ loading: false, error: null });
        toast.success("Sub Category updated successfully");
        if (onSuccess) onSuccess();
        await get().fetchSubCategories();
      }
    } catch (error) {
      set({ error: "Failed to update sub category", loading: false });
      toast.error("Failed to update sub category");
    }
  },

  deleteSubCategory: async (id: number, onSuccess?: () => void) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/inventory-sub-categories/${id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const error = await response.json();
        set({ loading: false, error: null });
        toast.error(error.message || "Failed to delete sub category");
      } else {
        set({ loading: false, error: null });
        toast.success("Sub Category deleted successfully");
        if (onSuccess) onSuccess();
        await get().fetchSubCategories();
      }
    } catch (error) {
      set({ error: "Failed to delete sub category", loading: false });
      toast.error("Failed to delete sub category");
    }
  },
}));

export default useInventorySubCategoryStore;
