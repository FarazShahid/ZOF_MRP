import { fetchWithAuth } from "@/src/app/services/authservice";
import { create } from "zustand";

interface ProductRegion {
  Id: number;
  Name: string;
  CreatedOn: string;
  CreatedBy: string;
  UpdatedOn: string;
  UpdatedBy: string;
}
interface AddProductRegion {
  Name: string;
  CreatedBy: string;
  UpdatedBy: string;
}

interface ProductRegionState {
  productRegions: ProductRegion[];
  productRegion: ProductRegion | null;
  loading: boolean;
  error: string | null;
  isResolved: boolean;

  fetchProductRegions: () => Promise<void>;
  getProductRegionId: (id: number) => Promise<void>;
  addProductRegion: (
    category: AddProductRegion,
    onSuccess: () => void
  ) => Promise<void>;
  updateProductRegion: (
    id: number,
    regionOption: AddProductRegion,
    onSuccess: () => void
  ) => Promise<void>;
  deleteProductRegion: (id: number, onSuccess: () => void) => Promise<void>;
}

const useProductRegionStore = create<ProductRegionState>((set, get) => ({
  productRegions: [],
  productRegion: null,
  loading: false,
  error: null,
  isResolved: false,

  fetchProductRegions: async () => {
    set({ loading: true, error: null });

    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/product-region-standard`
      );
      if (!response.ok) {
        set({ loading: false, error: "Error Fetching Data" });
      }
      const data: ProductRegion[] = await response.json();
      set({ productRegions: data, loading: false });
    } catch (error) {
      set({ loading: false, error: "Error Fetching Data" });
    }
  },

  getProductRegionId: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/product-region-standard/${id}`
      );
      const data: ProductRegion = await response.json();
      set({ productRegion: data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch", loading: false });
    }
  },

  addProductRegion: async (
    productRegion: AddProductRegion,
    onSuccess?: () => void
  ) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/product-region-standard`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productRegion),
        }
      );

      if (!response.ok) throw new Error("Failed to add");
      set({ loading: false, error: null, isResolved: true });
      if (onSuccess) onSuccess();
      await get().fetchProductRegions();
    } catch (error) {
      set({ error: "Failed to add", loading: false });
    }
  },

  updateProductRegion: async (
    id: number,
    regionOption: AddProductRegion,
    onSuccess?: () => void
  ) => {
    set({ loading: true, error: null, isResolved: false });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/product-region-standard/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(regionOption),
        }
      );

      if (!response.ok) throw new Error("Failed to update");
      set({ loading: false, error: null, isResolved: true });
      if (onSuccess) onSuccess();
      await get().fetchProductRegions(); // Fetch latest data after update
    } catch (error) {
      set({ error: "Failed to update", loading: false });
    }
  },

  deleteProductRegion: async (id: number, onSuccess?: () => void) => {
    set({ loading: true, error: null, isResolved: false });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/product-region-standard/${id}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Failed to delete");
      set({ loading: false, error: null, isResolved: true });
      if (onSuccess) onSuccess();
      await get().fetchProductRegions(); // Fetch latest data after deletion
    } catch (error) {
      set({ error: "Failed to delete", loading: false });
    }
  },
}));

export default useProductRegionStore;
