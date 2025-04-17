import { fetchWithAuth } from "@/src/app/services/authservice";
import toast from "react-hot-toast";
import { create } from "zustand";

interface GetInventoryCategoryResponse {
  data: InventoryCategoryResponse[];
  statusCode: number;
  message: string;
}

interface AddInventoryCategoryResponse {
  data: InventoryCategoryResponse;
  statusCode: number;
  message: string;
}

interface InventoryCategoryResponse {
  Id: number;
  Name: string;
  CreatedOn: string;
  CreatedBy: string;
  UpdatedOn: string;
  UpdatedBy: string;
}

export interface AddInventoryCategoryOptions {
  Name: string;
}

interface StoreState {
  inventoryCategories: InventoryCategoryResponse[];
  inventoryCategoryById: InventoryCategoryResponse | null;
  loading: boolean;
  error: string | null;

  fetchInventoryCategories: () => Promise<void>;
  getInventoryCategoryById: (id: number) => Promise<void>;
  addInventoryCategory: (
    inventoryCategoryType: AddInventoryCategoryOptions,
    onSuccess: () => void
  ) => Promise<void>;
  updateInventoryCategory: (
    id: number,
    supplierType: AddInventoryCategoryOptions,
    onSuccess: () => void
  ) => Promise<void>;
  deleteInventoryCategory: (id: number, onSuccess: () => void) => Promise<void>;
}

const useInventoryCategoryStore = create<StoreState>((set, get) => ({
  inventoryCategories: [],
  inventoryCategoryById: null,
  loading: false,
  error: null,

  fetchInventoryCategories: async () => {
    set({ loading: true, error: null });

    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/inventory-categories`
      );
      if (!response.ok) {
        set({ loading: false, error: "Error Fetching Data" });
      }
      const data: GetInventoryCategoryResponse = await response.json();
      set({ inventoryCategories: data.data, loading: false });
    } catch (error) {
      set({ loading: false, error: "Error Fetching Data" });
    }
  },

  getInventoryCategoryById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/inventory-categories/${id}`
      );
      if (!response.ok) {
        const error = await response.json();
        set({ loading: false, error: null });
        toast.error(error.message || "Failed to fetch data");
      }
      const data: AddInventoryCategoryResponse = await response.json();
      set({ inventoryCategoryById: data.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch data", loading: false });
      toast.error("Failed to fetch data");
    }
  },

  addInventoryCategory: async (
    inventoryCategoryType: AddInventoryCategoryOptions,
    onSuccess?: () => void
  ) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/inventory-categories`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(inventoryCategoryType),
        }
      );
      if (!response.ok) {
        const error = await response.json();
        set({ loading: false, error: null });
        toast.error(error.message || "Failed to add category");
      } else {
        set({ loading: false, error: null });
        toast.success("Category added successfully");
        if (onSuccess) onSuccess();
        await get().fetchInventoryCategories();
      }
    } catch (error) {
      set({ error: "Failed to add category", loading: false });
      toast.error("Failed to add category");
    }
  },

  updateInventoryCategory: async (
    id: number,
    updatedinventoryCategory: AddInventoryCategoryOptions,
    onSuccess?: () => void
  ) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/inventory-categories/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedinventoryCategory),
        }
      );
      if (!response.ok) {
        const error = await response.json();
        set({ loading: false, error: null });
        toast.error(error.message || "Failed to update category");
      } else {
        set({ loading: false, error: null });
        toast.success("Category updated successfully");
        if (onSuccess) onSuccess();
        await get().fetchInventoryCategories();
      }
    } catch (error) {
      set({ error: "Failed to update category", loading: false });
      toast.error("Failed to update category");
    }
  },

  deleteInventoryCategory: async (id: number, onSuccess?: () => void) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/inventory-categories/${id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const error = await response.json();
        set({ loading: false, error: null });
        toast.error(error.message || "Failed to delete category");
      } else {
        set({ loading: false, error: null });
        toast.success("Category deleted successfully");
        if (onSuccess) onSuccess();
        await get().fetchInventoryCategories();
      }
    } catch (error) {
      set({ error: "Failed to delete category", loading: false });
      toast.error("Failed to delete category");
    }
  },
}));

export default useInventoryCategoryStore;
