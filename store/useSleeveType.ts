import { fetchWithAuth } from "@/src/app/services/authservice";
import { create } from "zustand";

interface SleeveType {
  id: number;
  sleeveTypeName: string;
  productCategoryId: string;
  categoryName: string;
  createdOn: string;
  createdBy: string;
  updatedOn: string;
  updatedBy: string;
}
interface AddSleeveType {
  sleeveTypeName: string;
  productCategoryId: number;
  createdBy: string;
  updatedBy: string;
}

interface CategoryState {
  sleeveTypeData: SleeveType[];
  sleeveType: SleeveType | null;
  loading: boolean;
  error: string | null;

  fetchSleeveType: () => Promise<void>;
  getSleeveTypeById: (id: number) => Promise<void>;
  addSleeveType: (
    sleeveType: AddSleeveType,
    onSuccess: () => void
  ) => Promise<void>;
  updateSleeveType: (
    id: number,
    sleeveType: AddSleeveType,
    onSuccess: () => void
  ) => Promise<void>;
  deleteSleeveType: (id: number, onSuccess: () => void) => Promise<void>;
}

const useSleeveType = create<CategoryState>((set, get) => ({
  sleeveTypeData: [],
  sleeveType: null,
  loading: false,
  error: null,

  fetchSleeveType: async () => {
    set({ loading: true, error: null });

    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/sleeve-type`
      );
      if (!response.ok) {
        set({ loading: false, error: "Error Fetching Data" });
      }
      const data: SleeveType[] = await response.json();
      set({ sleeveTypeData: data, loading: false });
    } catch (error) {
      set({ loading: false, error: "Error Fetching Data" });
    }
  },

  getSleeveTypeById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/sleeve-type/${id}`
      );
      const data: SleeveType = await response.json();
      set({ sleeveType: data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch fabric type", loading: false });
    }
  },

  addSleeveType: async (sleeveType: AddSleeveType, onSuccess?: () => void) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/sleeve-type`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sleeveType),
        }
      );

      if (!response.ok) throw new Error("Failed to add sleeve type");
      set({ loading: false, error: null });
      if (onSuccess) onSuccess();
      await get().fetchSleeveType();
    } catch (error) {
      set({ error: "Failed to add sleeve type", loading: false });
    }
  },

  updateSleeveType: async (
    id: number,
    updatedFabricType: AddSleeveType,
    onSuccess?: () => void
  ) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/sleeve-type/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedFabricType),
        }
      );

      if (!response.ok) throw new Error("Failed to update sleeve type");
      set({ loading: false, error: null });
      if (onSuccess) onSuccess();
      await get().fetchSleeveType();
    } catch (error) {
      set({ error: "Failed to update sleeve type", loading: false });
    }
  },

  deleteSleeveType: async (id: number, onSuccess?: () => void) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/sleeve-type/${id}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Failed to delete sleeve type");
      set({ loading: false, error: null });
      if (onSuccess) onSuccess();
      await get().fetchSleeveType();
    } catch (error) {
      set({ error: "Failed to delete sleeve", loading: false });
    }
  },
}));

export default useSleeveType;
