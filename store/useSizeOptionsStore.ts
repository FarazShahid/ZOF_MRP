import { fetchWithAuth } from "@/src/app/services/authservice";
import toast from "react-hot-toast";
import { create } from "zustand";

interface GetSizeOptionsResponse {
  data: SizeOptions[];
  statusCode: number;
  message: string;
}

interface SizeOptionsIdRepsonse {
  data: SizeOptions;
  statusCode: number;
  message: string;
}

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
  // CreatedBy: string;
  // UpdatedBy: string;
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
        toast.error("Error Fetching Data");
      }
      const data: GetSizeOptionsResponse = await response.json();
      set({ sizeOptions: data.data, loading: false });
    } catch (error) {
      set({ loading: false, error: "Error Fetching Data" });
      toast.error("Error Fetching Data");
    }
  },

  getSizeOptionById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/sizeoptions/${id}`
      );
      if (!response.ok) {
        const error = await response.json();
        set({ loading: false, error: null });
        toast.error(error.message || "Failed to fetch data");
      }
      const data: SizeOptionsIdRepsonse = await response.json();
      set({ sizeOptionsType: data.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch size option", loading: false });
      toast.error("Failed to fetch size option");
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
      if (!response.ok) {
        const error = await response.json();
        set({ loading: false, error: null });
        toast.error(error.message || "Failed to add size options");
      } else {
        set({ loading: false, error: null });
        if (onSuccess) onSuccess();
        await get().fetchsizeOptions();
        toast.success("Size option added successfully");
      }
    } catch (error) {
      set({ error: "Failed to add size options", loading: false });
      toast.error("Failed to add size options");
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
      if (!response.ok) {
        const error = await response.json();
        set({ loading: false, error: null });
        toast.error(error.message || "Failed to update size options");
      } else {
        set({ loading: false, error: null });
        if (onSuccess) onSuccess();
        await get().fetchsizeOptions();
        toast.success("Size option update successfully");
      }
    } catch (error) {
      set({ error: "Failed to update size options", loading: false });
      toast.error("Failed to update size options");
    }
  },

  deleteSizeOption: async (id: number, onSuccess?: () => void) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/sizeoptions/${id}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        const error = await response.json();
        set({ loading: false, error: null });
        toast.error(error.message || "Failed to delete size options");
      } else {
        set({ loading: false, error: null });
        if (onSuccess) onSuccess();
        await get().fetchsizeOptions();
        toast.success("Size option deleted successfully");
      }
    } catch (error) {
      set({ error: "Failed to delete size options", loading: false });
      toast.error("Failed to delete size options");
    }
  },
}));

export default useSizeOptionsStore;
