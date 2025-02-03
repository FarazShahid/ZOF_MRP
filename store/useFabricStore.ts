import { fetchWithAuth } from "@/src/app/services/authservice";
import { create } from "zustand";

interface FabricType {
  id: number;
  type: string;
  name: string;
  gsm: string;
  createdOn: string;
  createdBy: string;
  updatedOn: string;
  updatedBy: string;
}
interface AddFabricType {
  type: string;
  createdBy: string;
  updatedBy: string;
}

interface CategoryState {
  fabricTypeData: FabricType[];
  fabricType: FabricType | null;
  loading: boolean;
  error: string | null;

  fetchFabricType: () => Promise<void>;
  getFabricById: (id: number) => Promise<void>;
  addFabricType: (
    fabricType: AddFabricType,
    onSuccess: () => void
  ) => Promise<void>;
  updateFabricType: (
    id: number,
    fabricType: AddFabricType,
    onSuccess: () => void
  ) => Promise<void>;
  deleteFabricType: (id: number, onSuccess: () => void) => Promise<void>;
}

const useFabricStore = create<CategoryState>((set, get) => ({
  fabricTypeData: [],
  fabricType: null,
  loading: false,
  error: null,

  fetchFabricType: async () => {
    set({ loading: true, error: null });

    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/fabrictype`
      );
      if (!response.ok) {
        set({ loading: false, error: "Error Fetching Data" });
      }
      const data: FabricType[] = await response.json();
      set({ fabricTypeData: data, loading: false });
    } catch (error) {
      set({ loading: false, error: "Error Fetching Data" });
    }
  },

  getFabricById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/fabrictype/${id}`
      );
      const data: FabricType = await response.json();
      set({ fabricType: data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch fabric type", loading: false });
    }
  },

  addFabricType: async (fabricType: AddFabricType, onSuccess?: () => void) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/fabrictype`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fabricType),
        }
      );

      if (!response.ok) throw new Error("Failed to add fabric type");
      set({ loading: false, error: null});
      if (onSuccess) onSuccess();
      await get().fetchFabricType();
    } catch (error) {
      set({ error: "Failed to add fabric type", loading: false });
    }
  },

  updateFabricType: async (
    id: number,
    updatedFabricType: AddFabricType,
    onSuccess?: () => void
  ) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/fabrictype/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedFabricType),
        }
      );

      if (!response.ok) throw new Error("Failed to update fabric type");
      set({ loading: false, error: null });
      if (onSuccess) onSuccess();
      await get().fetchFabricType();
    } catch (error) {
      set({ error: "Failed to update fabric type", loading: false });
    }
  },

  deleteFabricType: async (id: number, onSuccess?: () => void) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/fabrictype/${id}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Failed to delete fabric type");
      set({ loading: false, error: null});
      if (onSuccess) onSuccess();
      await get().fetchFabricType();
    } catch (error) {
      set({ error: "Failed to delete category", loading: false });
    }
  },
}));

export default useFabricStore;
