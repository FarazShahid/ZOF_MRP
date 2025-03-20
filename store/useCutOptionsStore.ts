import { fetchWithAuth } from "@/src/app/services/authservice";
import toast from "react-hot-toast";
import { create } from "zustand";

interface GetCutOptionsResponse {
  data: CutOptions[];
  statusCode: number;
  message: string;
}

interface AddCutOptionResponse{
  data: CutOptions;
  statusCode: number;
  message: string;
}


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
      const data: GetCutOptionsResponse = await response.json();
      set({ cutOptions: data.data, loading: false });
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
      if (!response.ok) {
        const error = await response.json();
        set({ loading: false, error: null });
        toast.error(error.message || "Failed to fetch cut option");
      }
      const data: AddCutOptionResponse = await response.json();
      set({ cutOptionsType: data.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch cut option", loading: false });
      toast.error("Failed to fetch cut option");
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
      if (!response.ok) {
        const error = await response.json();
        set({ loading: false, error: null });
        toast.error(error.message || "Failed to add cut option");
      } else {
        set({ loading: false, error: null });
        toast.success("Cut option added successfully");
        if (onSuccess) onSuccess();
        await get().fetchcutOptions();
      }
    } catch (error) {
      set({ error: "Failed to cut option", loading: false });
      toast.error("Failed to cut option");
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
      if (!response.ok) {
        const error = await response.json();
        set({ loading: false, error: null });
        toast.error(error.message || "Failed to update cut option");
      } else {
        set({ loading: false, error: null });
        toast.success("Cut option updated successfully");
        if (onSuccess) onSuccess();
        await get().fetchcutOptions();
      }
    } catch (error) {
      set({ error: "Failed to update cut option", loading: false });
      toast.error("Failed to update cut option");
    }
  },

  deleteCutOption: async (id: number, onSuccess?: () => void) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/productcutoptions/${id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const error = await response.json();
        set({ loading: false, error: null });
        toast.error(error.message || "Failed to delete  Cut Options");
      } else {
        set({ loading: false, error: null});
        toast.success(" Cut Options deleted successfully");
        if (onSuccess) onSuccess();
        await get().fetchcutOptions();
      }
    } catch (error) {
      set({ error: "Failed to delete  Cut Options", loading: false });
      toast.error("Failed to delete  Cut Options");
    }
  },
}));

export default useCutOptionsStore;
