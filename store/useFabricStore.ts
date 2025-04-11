import { fetchWithAuth } from "@/src/app/services/authservice";
import toast from "react-hot-toast";
import { create } from "zustand";

interface GetFabricResponse{
  data:FabricType[];
  statusCode: number;
  message: string;
}

interface GetFabricTypeResponse {
  data:FabricType;
  statusCode: number;
  message: string;
}

export interface FabricType {
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
        toast.error("Fail to fetch fabric type");
      }
      const data: GetFabricResponse = await response.json();
      set({ fabricTypeData: data.data, loading: false });
    } catch (error) {
      set({ loading: false, error: "Error Fetching Data" });
      toast.error("Fail to fetch fabric type");
    }
  },

  getFabricById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/fabrictype/${id}`
      );
      if (!response.ok) {
        set({ loading: false, error: "Error Fetching Data" });
        toast.error("Fail to fetch fabric type");
      }
      const data: GetFabricTypeResponse = await response.json();
      set({ fabricType: data.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch fabric type", loading: false });
      toast.error("Fail to fetch fabric type");
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
      if(response.ok){
        set({ loading: false, error: null});
        toast.success("Added successfully");
        if (onSuccess) onSuccess();
        await get().fetchFabricType();
      }else{
        const error = await response.json();
        toast.error(error.message || "Failed to add");
      }    
    } catch (error) {
      set({ error: "Failed to add fabric type", loading: false });
      toast.error("Failed to add fabric type");
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
      if(response.ok){
        set({ loading: false, error: null});
        toast.success("Fabric Type Updated successfully");
        if (onSuccess) onSuccess();
        await get().fetchFabricType();
      }else{
        const error = await response.json();
        toast.error(error.message || "Failed to Update fabric type");
      }  
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

      if (!response.ok){
         const error = await response.json();
         toast.error(error.message || "Failed to Update fabric type");
      }
      set({ loading: false, error: null});
      toast.success("Delete successfully");
      if (onSuccess) onSuccess();
      await get().fetchFabricType();
    } catch (error) {
      set({ error: "Failed to delete fabric type", loading: false });
      toast.error("Failed to delete fabric type");
    }
  },
}));

export default useFabricStore;
