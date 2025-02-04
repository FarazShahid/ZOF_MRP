import { fetchWithAuth } from "@/src/app/services/authservice";
import { create } from "zustand";

interface CutOptions {
  Id: number;
  OptionProductCutOptions: string;
  CreatedOn: string;
  CreatedBy: string;
  UpdatedOn: string;
  UpdatedBy: string;
}
interface AddCutOptions {
  OptionProductCutOptions: string;
  CreatedBy: string;
  UpdatedBy: string;
}

interface CategoryState {
  cutOptions: CutOptions[];
  cutOptionsType: CutOptions | null;
  loading: boolean;
  error: string | null;

  fetchcutOptions: () => Promise<void>;
  getCutOptionById: (id: number) => Promise<void>;
  addCutOption: (
    cutOptionsType: AddCutOptions,
    onSuccess: () => void
  ) => Promise<void>;
  updateCutOption: (
    id: number,
    cutOptionsType: AddCutOptions,
    onSuccess: () => void
  ) => Promise<void>;
  deleteCutOption: (id: number, onSuccess: () => void) => Promise<void>;
}

const useCutOptionsStore = create<CategoryState>((set, get) => ({
  cutOptions: [],
  cutOptionsType: null,
  loading: false,
  error: null,

  fetchcutOptions: async () => {
    set({ loading: true, error: null });

    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/productcutoptions`
      );
      if (!response.ok) {
        set({ loading: false, error: "Error Fetching Data" });
      }
      const data: CutOptions[] = await response.json();
      set({ cutOptions: data, loading: false });
    } catch (error) {
      set({ loading: false, error: "Error Fetching Data" });
    }
  },

  getCutOptionById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/productcutoptions/${id}`
      );
      const data: CutOptions = await response.json();
      set({ cutOptionsType: data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch fabric type", loading: false });
    }
  },

  addCutOption: async (cutOptionsType: AddCutOptions, onSuccess?: () => void) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/productcutoptions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cutOptionsType),
        }
      );

      if (!response.ok) throw new Error("Failed to add cut option");
      set({ loading: false, error: null });
      if (onSuccess) onSuccess();
      await get().fetchcutOptions();
    } catch (error) {
      set({ error: "Failed to add cut option", loading: false });
    }
  },

  updateCutOption: async (
    id: number,
    updatedFabricType: AddCutOptions,
    onSuccess?: () => void
  ) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/productcutoptions/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedFabricType),
        }
      );

      if (!response.ok) throw new Error("Failed to update cut option");
      set({ loading: false, error: null });
      if (onSuccess) onSuccess();
      await get().fetchcutOptions();
    } catch (error) {
      set({ error: "Failed to update cut option", loading: false });
    }
  },

  deleteCutOption: async (id: number, onSuccess?: () => void) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/productcutoptions/${id}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Failed to delete cut option");
      set({ loading: false, error: null });
      if (onSuccess) onSuccess();
      await get().fetchcutOptions();
    } catch (error) {
      set({ error: "Failed to cut option", loading: false });
    }
  },
}));

export default useCutOptionsStore;
