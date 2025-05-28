import { fetchWithAuth } from "@/src/app/services/authservice";
import toast from "react-hot-toast";
import { create } from "zustand";
import useUIStore from "./useUIStore";

interface GetSleeveTypeResponse {
  data: SleeveType[];
  statusCode: number;
  message: string;
}

interface UpdateSleeveTypeResponse {
  data: SleeveType;
  statusCode: number;
  message: string;
}

export interface SleeveType {
  id: number;
  sleeveTypeName: string;
  productCategoryId: string;
  categoryName: string;
  CreatedOn: string;
  CreatedBy: string;
  UpdatedOn: string;
  updatedBy: string;
}
interface AddSleeveType {
  sleeveTypeName: string;
  productCategoryId: number;
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
      const data: GetSleeveTypeResponse = await response.json();
      set({ sleeveTypeData: data.data, loading: false });
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
      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message || "Failed to fetch sleeve type");
      }
      const data: UpdateSleeveTypeResponse = await response.json();
      set({ sleeveType: data.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch fabric type", loading: false });
      toast.error("Failed to add sleeve type.");
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
      if (!response.ok) {
        const error = await response.json();
        set({ loading: false, error: null });
        toast.error(error.message || "Failed to add sleeve type");
      } else {
        set({ loading: false, error: null });
        toast.success("Sleeve type added successfully.");
   
        if (onSuccess) onSuccess();
        await get().fetchSleeveType();
      }
    } catch (error) {
      set({ error: "Failed to add sleeve type", loading: false });
      toast.error("Failed to add sleeve type.");
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
      if (!response.ok) {
        const error = await response.json();
        set({ loading: false, error: null });
        toast.error(error.message || "Failed to update sleeve type");
      } else {
        set({ loading: false, error: null });
        toast.success("Sleeve type update successfully.");
        
        if (onSuccess) onSuccess();
        await get().fetchSleeveType();
      }
    } catch (error) {
      set({ error: "Failed to update sleeve type", loading: false });
      toast.error("Failed to update sleeve type");
    }
  },

  deleteSleeveType: async (id: number, onSuccess?: () => void) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/sleeve-type/${id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const error = await response.json();
        set({ loading: false, error: null });
        toast.error(error.message || "Failed to delete sleeve type");
      } else {
        set({ loading: false, error: null });
        if (onSuccess) onSuccess();
        toast.success("Sleeve type delete successfully.");
        await get().fetchSleeveType();
      }
    } catch (error) {
      set({ error: "Failed to delete sleeve type", loading: false });
      toast.success("Failed to delete sleeve type");
    }
  },
}));

export default useSleeveType;
