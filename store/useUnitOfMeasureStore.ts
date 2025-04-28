import { fetchWithAuth } from "@/src/app/services/authservice";
import toast from "react-hot-toast";
import { create } from "zustand";

interface GetAllDataResponse {
  data: UnitOfMeasure[];
  statusCode: number;
  message: string;
}
interface UnitOfMeasureByIdRepsonse {
  data: UnitOfMeasure;
  statusCode: number;
  message: string;
}

export interface UnitOfMeasure {
  Id: number;
  Name: string;
  ShortForm: string;
  createdOn: string;
  createdBy: string;
  updatedOn: string;
  updatedBy: string;
}
export interface AddUnitOfMeasureType {
    Name: string;
    ShortForm: string;
}

interface CategoryState {
    unitMeasures: UnitOfMeasure[];
    unitMeasureById: UnitOfMeasure | null;
  loading: boolean;
  error: string | null;
  isResolved: boolean;

  fetchUnitOfMeasures: () => Promise<void>;
  getUnitOfMeasuresById: (id: number) => Promise<void>;
  addUnitOfMeasure: (
    category: AddUnitOfMeasureType,
    onSuccess: () => void
  ) => Promise<void>;
  updateUnitOfMeasure: (
    id: number,
    category: AddUnitOfMeasureType,
    onSuccess: () => void
  ) => Promise<void>;
  deleteUnitOfMeasure: (id: number, onSuccess: () => void) => Promise<void>;
}

const useUnitOfMeasureStore = create<CategoryState>((set, get) => ({
    unitMeasures: [],
    unitMeasureById: null,
  loading: false,
  error: null,
  isResolved: false,

  fetchUnitOfMeasures: async () => {
    set({ loading: true, error: null });

    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/unit-measures`
      );
      if (!response.ok) {
        set({ loading: false, error: "Error Fetching Data" });
        toast.error("Error Fetching Data");
      }
      const data: GetAllDataResponse = await response.json();
      set({ unitMeasures: data.data, loading: false });
    } catch (error) {
      set({ loading: false, error: "Error Fetching Data" });
      toast.error("Error Fetching Data");
    }
  },

  getUnitOfMeasuresById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/unit-measures/${id}`
      );
      const data: UnitOfMeasureByIdRepsonse = await response.json();
      set({ unitMeasureById: data.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch measurements", loading: false });
      toast.error("Error Fetching Data");
    }
  },

  addUnitOfMeasure: async (category: AddUnitOfMeasureType, onSuccess?: () => void) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/unit-measures`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(category),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        set({ loading: false, error: null });
        toast.error(error.message || "Failed to add unit-measure");
      } else {
        set({ loading: false, error: null, isResolved: true });
        toast.success("Unit-measure added successfully");
        if (onSuccess) onSuccess();
        await get().fetchUnitOfMeasures();
      }
    } catch (error) {
      set({ error: "Failed to add unit-measure", loading: false });
      toast.error("Failed to add unit-measure");
    }
  },

  updateUnitOfMeasure: async (
    id: number,
    updatedCategory: AddUnitOfMeasureType,
    onSuccess?: () => void
  ) => {
    set({ loading: true, error: null, isResolved: false });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/unit-measures/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedCategory),
        }
      );
      if (!response.ok) {
        const error = await response.json();
        set({ loading: false, error: null });
        toast.error(error.message || "Failed to update unit-measure");
      } else {
        set({ loading: false, error: null, isResolved: true });
        toast.success("Unit-measure update successfully");
        if (onSuccess) onSuccess();
        await get().fetchUnitOfMeasures();
      }
    } catch (error) {
      set({ error: "Failed to update unit-measure", loading: false });
      toast.error("Failed to update unit-measure");
    }
  },

  deleteUnitOfMeasure: async (id: number, onSuccess?: () => void) => {
    set({ loading: true, error: null, isResolved: false });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/unit-measures/${id}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        const error = await response.json();
        set({ loading: false, error: null });
        toast.error(error.message || "Failed to delete unit-measure");
      } else {
        set({ loading: false, error: null, isResolved: true });
        toast.success("Unit-measure deleted successfully");
        if (onSuccess) onSuccess();
        await get().fetchUnitOfMeasures();
      }
    } catch (error) {
      set({ error: "Failed to delete unit-measure", loading: false });
      toast.error("Failed to delete unit-measure");
    }
  },
}));

export default useUnitOfMeasureStore;
