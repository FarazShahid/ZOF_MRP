import { fetchWithAuth } from "@/src/app/services/authservice";
import toast from "react-hot-toast";
import { create } from "zustand";

interface GetProductCatagoryResponse {
  data: ProductCategory[];
  statusCode: number;
  message: string;
}
interface ProductCategoryIdRepsonse {
  data: ProductCategory;
  statusCode: number;
  message: string;
}

export interface ProductCategory {
  id: number;
  type: string;
  IsTopUnit: boolean;
  IsBottomUnit: boolean;
  SupportsLogo: boolean;
  createdOn: string;
  createdBy: string;
  updatedOn: string;
  updatedBy: string;
}
interface AddProductCategory {
  type: string;
}

interface CategoryState {
  productCategories: ProductCategory[];
  productCategory: ProductCategory | null;
  loading: boolean;
  error: string | null;
  isResolved: boolean;

  fetchCategories: () => Promise<void>;
  getCategoryById: (id: number) => Promise<void>;
  addCategory: (
    category: AddProductCategory,
    onSuccess: () => void
  ) => Promise<void>;
  updateCategory: (
    id: number,
    category: AddProductCategory,
    onSuccess: () => void
  ) => Promise<void>;
  deleteCategory: (id: number, onSuccess: () => void) => Promise<void>;
}

const useCategoryStore = create<CategoryState>((set, get) => ({
  productCategories: [],
  productCategory: null,
  loading: false,
  error: null,
  isResolved: false,

  fetchCategories: async () => {
    set({ loading: true, error: null });

    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/product-category`
      );
      if (!response.ok) {
        set({ loading: false, error: "Error Fetching Data" });
        toast.error("Error Fetching Data");
      }
      const data: GetProductCatagoryResponse = await response.json();
      set({ productCategories: data.data, loading: false });
    } catch (error) {
      set({ loading: false, error: "Error Fetching Data" });
      toast.error("Error Fetching Data");
    }
  },

  getCategoryById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/product-category/${id}`
      );
      const data: ProductCategoryIdRepsonse = await response.json();
      set({ productCategory: data.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch category", loading: false });
      toast.error("Error Fetching Data");
    }
  },

  addCategory: async (category: AddProductCategory, onSuccess?: () => void) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/product-category`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(category),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        set({ loading: false, error: null });
        toast.error(error.message || "Failed to add Category");
      } else {
        set({ loading: false, error: null, isResolved: true });
        toast.success("Product Category added successfully");
        if (onSuccess) onSuccess();
        await get().fetchCategories();
      }
    } catch (error) {
      set({ error: "Failed to add category", loading: false });
      toast.error("Failed to add Category");
    }
  },

  updateCategory: async (
    id: number,
    updatedCategory: AddProductCategory,
    onSuccess?: () => void
  ) => {
    set({ loading: true, error: null, isResolved: false });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/product-category/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedCategory),
        }
      );
      if (!response.ok) {
        const error = await response.json();
        set({ loading: false, error: null });
        toast.error(error.message || "Failed to update Category");
      } else {
        set({ loading: false, error: null, isResolved: true });
        toast.success("Product Category update successfully");
        if (onSuccess) onSuccess();
        await get().fetchCategories();
      }
    } catch (error) {
      set({ error: "Failed to update category", loading: false });
      toast.error("Failed to update Category");
    }
  },

  deleteCategory: async (id: number, onSuccess?: () => void) => {
    set({ loading: true, error: null, isResolved: false });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/product-category/${id}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        const error = await response.json();
        set({ loading: false, error: null });
        toast.error(error.message || "Failed to delete Category");
      } else {
        set({ loading: false, error: null, isResolved: true });
        toast.success("Product Category deleted successfully");
        if (onSuccess) onSuccess();
        await get().fetchCategories();
      }
    } catch (error) {
      set({ error: "Failed to delete category", loading: false });
      toast.error("Failed to delete Category");
    }
  },
}));

export default useCategoryStore;
