import { fetchWithAuth } from "@/src/app/services/authservice";
import { create } from "zustand";

interface SizeOptions {
  Id: number;
  OptionSizeOptions: string;
  CreatedOn: string;
  CreatedBy: string;
  UpdatedOn: string;
  UpdatedBy: string;
}
interface AddSizeOptions {
  OptionSizeOptions: string;
  CreatedBy: string;
  UpdatedBy: string;
}

interface CategoryState {
  sizeOptions: SizeOptions[];
  sizeOptionsType: SizeOptions | null;
  loading: boolean;
  error: string | null;

  fetchsizeOptions: () => Promise<void>;
  getSizeOptionById: (id: number) => Promise<void>;
  addSizeOption: (
    sizeOptionsType: AddSizeOptions,
    onSuccess: () => void
  ) => Promise<void>;
  updateSizeOption: (
    id: number,
    cutOptionsType: AddSizeOptions,
    onSuccess: () => void
  ) => Promise<void>;
  deleteSizeOption: (id: number, onSuccess: () => void) => Promise<void>;
}

const useSizeOptionsStore = create<CategoryState>((set, get) => ({
  sizeOptions: [],
  sizeOptionsType: null,
  loading: false,
  error: null,

  fetchsizeOptions: async () => {
    set({ loading: true, error: null });

    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/sizeoptions`
      );
      if (!response.ok) {
        set({ loading: false, error: "Error Fetching Data" });
      }
      const data: SizeOptions[] = await response.json();
      set({ sizeOptions: data, loading: false });
    } catch (error) {
      set({ loading: false, error: "Error Fetching Data" });
    }
  },

  getSizeOptionById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/sizeoptions/${id}`
      );
      const data: SizeOptions = await response.json();
      set({ sizeOptionsType: data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch size option", loading: false });
    }
  },

  addSizeOption: async (
    sizeOptionsType: AddSizeOptions,
    onSuccess?: () => void
  ) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/sizeoptions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sizeOptionsType),
        }
      );

      if (!response.ok) throw new Error("Failed to add size options");
      set({ loading: false, error: null });
      if (onSuccess) onSuccess();
      await get().fetchsizeOptions();
    } catch (error) {
      set({ error: "Failed to add size options", loading: false });
    }
  },

  updateSizeOption: async (
    id: number,
    updatedSizeOption: AddSizeOptions,
    onSuccess?: () => void
  ) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/sizeoptions/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedSizeOption),
        }
      );

      if (!response.ok) throw new Error("Failed to update cut option");
      set({ loading: false, error: null });
      if (onSuccess) onSuccess();
      await get().fetchsizeOptions();
    } catch (error) {
      set({ error: "Failed to update size option", loading: false });
    }
  },

  deleteSizeOption: async (id: number, onSuccess?: () => void) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/sizeoptions/${id}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Failed to delete size option");
      set({ loading: false, error: null });
      if (onSuccess) onSuccess();
      await get().fetchsizeOptions();
    } catch (error) {
      set({ error: "Failed to size option", loading: false });
    }
  },
}));

export default useSizeOptionsStore;
