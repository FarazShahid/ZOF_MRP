import { fetchWithAuth } from "@/src/app/services/authservice";
import toast from "react-hot-toast";
import { create } from "zustand";

interface getProductRegionResponse {
  data: ProductRegion[];
  statusCode: string;
  message: string;
}

interface ProductRegionByIdResponse{
  data: ProductRegion;
  statusCode: string;
  message: string;
}

export interface ProductRegion {
  Id: number;
  Name: string;
  CreatedOn: string;
  CreatedBy: string;
  UpdatedOn: string;
  UpdatedBy: string;
}
export interface AddProductRegion {
  Name: string;
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
        toast.error("Fail to fetch data.")
      }
      const data: getProductRegionResponse = await response.json();
      set({ productRegions: data.data, loading: false });
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
      if(!response.ok){
        const error = await response.json();
        toast.error(error.message || "Fail to fetch data");
        set({loading: false});
      }
      const data: ProductRegionByIdResponse = await response.json();
      set({ productRegion: data.data, loading: false });
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
      if (response.ok) {
        set({ loading: false, error: null, isResolved: true });
        toast.success("Region added successfully.");
        if (onSuccess) onSuccess();
        await get().fetchProductRegions();
      } else {
        const error = await response.json();
        toast.error(error.message || "Fail to add region standard");
        set({loading: false});
      }
    } catch (error) {
      set({ error: "Failed to add", loading: false });
      toast.error("Fail to add region standard");
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

      if (response.ok) {
        set({ loading: false, error: null, isResolved: true });
        toast.success("Region update successfully.");
        if (onSuccess) onSuccess();
        await get().fetchProductRegions();
      } else {
        const error = await response.json();
        toast.error(error.message || "Fail to update region standard");
        set({loading: false});
      }
    } catch (error) {
      set({ error: "Failed to update", loading: false });
      toast.error("Fail to update region standard");
    }
  },

  deleteProductRegion: async (id: number, onSuccess?: () => void) => {
    set({ loading: true, error: null, isResolved: false });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/product-region-standard/${id}`,
        { method: "DELETE" }
      );
      if (response.ok) {
        set({ loading: false, error: null, isResolved: true });
        toast.success("Region Deleted successfully");
        if (onSuccess) onSuccess();
        await get().fetchProductRegions();
      }else{
        const error = await response.json();
        toast.error(error.message || "Fail to delete region");
        set({loading: false});
      }
    } catch (error) {
      set({ error: "Failed to delete", loading: false });
      toast.error("Fail to delete region");
    }
  },
}));

export default useProductRegionStore;
