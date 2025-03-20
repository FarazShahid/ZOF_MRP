import { fetchWithAuth } from "@/src/app/services/authservice";
import toast from "react-hot-toast";
import { create } from "zustand";

interface GetColorsResponse {
  data: ColorOption[];
  statusCode: number;
  message: string;
}

interface GetColorByIdResponse{
  data: ColorOption;
  statusCode: number;
  message: string;
}

interface ColorOption {
  Id: number;
  Name: string;
  HexCode: string;
  CreatedOn: string;
  CreatedBy: string;
  UpdatedOn: string;
  UpdatedBy: string;
}
export interface AddColorOption {
  Name: string;
  HexCode: string;
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
        const error = await response.json();
        toast.error(error.message);
      }
      const data: GetColorsResponse = await response.json();
      set({ colorOptions: data.data, loading: false });
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
      if(!response.ok){
        const error = await response.json();
        toast.error(error.message || "Fail to fetch data");
      }
      const data: GetColorByIdResponse = await response.json();
      set({ colorOption: data.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch color option", loading: false });
    }
  },

  addColorOption: async (
    colorOption: AddColorOption,
    onSuccess?: () => void
  ) => {
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
      if (response.ok) {
        set({ loading: false, error: null });
        toast.success("Color add successfully");
        if (onSuccess) onSuccess();
        await get().fetchColorOptions();
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to add color Option.");
      }
    } catch (error) {
      set({ error: "Failed to add color Option", loading: false });
      toast.error("Failed to add color Option");
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
      if (response.ok) {
        set({ loading: false, error: null, isResolved: true });
        toast.success("Color updated successfully");
        if (onSuccess) onSuccess();
        await get().fetchColorOptions();
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to update color Option.");
      }
    } catch (error) {
      set({ error: "Failed to update Color Option", loading: false });
      toast.error("Failed to update color Option.");
    }
  },

  deleteColorOption: async (id: number, onSuccess?: () => void) => {
    set({ loading: true, error: null, isResolved: false });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/coloroption/${id}`,
        { method: "DELETE" }
      );
      if (response.ok) {
        set({ loading: false, error: null });
        toast.success("Color deleted successfully");
        if (onSuccess) onSuccess();
        await get().fetchColorOptions();
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to delete color option");
      }
    } catch (error) {
      set({ error: "Failed to delete color option", loading: false });
      toast.error("Failed to delete color option");
    }
  },
}));

export default useColorOptionsStore;
