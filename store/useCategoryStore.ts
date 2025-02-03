import { fetchWithAuth } from "@/src/app/services/authservice";
import { create } from "zustand";

interface ProductCategory {
  id: number;
  type: string;
  createdOn: string;
  createdBy: string;
  updatedOn: string;
  updatedBy: string;
}
interface AddProductCategory {
  type: string;
  createdBy: string;
  updatedBy: string;
}

interface CategoryState {
  productCategories: ProductCategory[];
  productCategory: ProductCategory | null;
  loading: boolean;
  error: string | null;
  isResolved: boolean;

  fetchCategories: () => Promise<void>;
  getCategoryById: (id: number) => Promise<void>;
  addCategory: (category: AddProductCategory, onSuccess:()=> void) => Promise<void>;
  updateCategory: (id: number ,category: AddProductCategory, onSuccess:()=> void) => Promise<void>;
  deleteCategory: (id: number, onSuccess:()=> void) => Promise<void>;
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
      }
      const data: ProductCategory[] = await response.json();
      set({ productCategories: data, loading: false });
    } catch (error) {
      set({ loading: false, error: "Error Fetching Data" });
    }
  },

  getCategoryById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/product-category/${id}`
      );
      const data: ProductCategory = await response.json();
      set({ productCategory: data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch category", loading: false });
    }
  },

  addCategory: async (category: AddProductCategory,  onSuccess?: () => void) => {
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

      if (!response.ok) throw new Error("Failed to add category");
      set({ loading: false, error: null, isResolved: true });
      if (onSuccess) onSuccess();
      await get().fetchCategories();
    } catch (error) {
      set({ error: "Failed to add category", loading: false });
    }
  },

  updateCategory: async (id: number, updatedCategory: AddProductCategory,  onSuccess?: () => void) => {
    set({ loading: true, error: null, isResolved: false });
    try {
      const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/product-category/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCategory),
      });

      if (!response.ok) throw new Error("Failed to update category");
      set({ loading: false, error: null, isResolved: true });
      if (onSuccess) onSuccess();
      await get().fetchCategories(); // Fetch latest data after update
    } catch (error) {
      set({ error: "Failed to update category", loading: false });
    }
  },

  deleteCategory: async (id: number,  onSuccess?: () => void) => {
    set({ loading: true, error: null, isResolved: false  });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/product-category/${id}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Failed to delete category");
      set({ loading: false, error: null, isResolved: true });
      if (onSuccess) onSuccess();
      await get().fetchCategories(); // Fetch latest data after deletion
    } catch (error) {
      set({ error: "Failed to delete category", loading: false });
    }
  },
}));

export default useCategoryStore;
