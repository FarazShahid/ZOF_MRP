import { fetchWithAuth } from "@/src/app/services/authservice";
import { create } from "zustand";

interface ColorOption {
  Id: number;
  Name: string;
  CreatedOn: string;
  CreatedBy: string;
  UpdatedOn: string;
  UpdatedBy: string;
}
interface AddColorOption {
  Name: string;
  CreatedBy: string;
  UpdatedBy: string;
}

interface ColorOptionState {
  colorOptions: ColorOption[];
  colorOption: ColorOption | null;
  loading: boolean;
  error: string | null;
  isResolved: boolean;

  fetchColorOptions: () => Promise<void>;
  getColorOptionId: (id: number) => Promise<void>;
  addColorOption: (
    category: AddColorOption,
    onSuccess: () => void
  ) => Promise<void>;
  updateColorOption: (
    id: number,
    colorOption: AddColorOption,
    onSuccess: () => void
  ) => Promise<void>;
  deleteColorOption: (id: number, onSuccess: () => void) => Promise<void>;
}

const useColorOptionsStore = create<ColorOptionState>((set, get) => ({
  colorOptions: [],
  colorOption: null,
  loading: false,
  error: null,
  isResolved: false,

  fetchColorOptions: async () => {
    set({ loading: true, error: null });

    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/coloroption`
      );
      if (!response.ok) {
        set({ loading: false, error: "Error Fetching Data" });
      }
      const data: ColorOption[] = await response.json();
      set({ colorOptions: data, loading: false });
    } catch (error) {
      set({ loading: false, error: "Error Fetching Data" });
    }
  },

  getColorOptionId: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/coloroption/${id}`
      );
      const data: ColorOption = await response.json();
      set({ colorOption: data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch color option", loading: false });
    }
  },

  addColorOption: async (colorOption: AddColorOption, onSuccess?: () => void) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/coloroption`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(colorOption),
        }
      );

      if (!response.ok) throw new Error("Failed to add color Option");
      set({ loading: false, error: null, isResolved: true });
      if (onSuccess) onSuccess();
      await get().fetchColorOptions();
    } catch (error) {
      set({ error: "Failed to add color Option", loading: false });
    }
  },

  updateColorOption: async (
    id: number,
    updatedColorOption: AddColorOption,
    onSuccess?: () => void
  ) => {
    set({ loading: true, error: null, isResolved: false });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/coloroption/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedColorOption),
        }
      );

      if (!response.ok) throw new Error("Failed to update Color Option");
      set({ loading: false, error: null, isResolved: true });
      if (onSuccess) onSuccess();
      await get().fetchColorOptions(); // Fetch latest data after update
    } catch (error) {
      set({ error: "Failed to update Color Option", loading: false });
    }
  },

  deleteColorOption: async (id: number, onSuccess?: () => void) => {
    set({ loading: true, error: null, isResolved: false });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/coloroption/${id}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Failed to delete color option");
      set({ loading: false, error: null, isResolved: true });
      if (onSuccess) onSuccess();
      await get().fetchColorOptions(); // Fetch latest data after deletion
    } catch (error) {
      set({ error: "Failed to delete color option", loading: false });
    }
  },
}));

export default useColorOptionsStore;
