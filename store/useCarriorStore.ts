import { fetchWithAuth } from "@/src/app/services/authservice";
import toast from "react-hot-toast";
import { create } from "zustand";

interface GetCarriorResponse {
  data: CarriorResponse[];
  statusCode: number;
  message: string;
}

interface AddCarriorResponse {
  data: CarriorResponse;
  statusCode: number;
  message: string;
}

interface CarriorResponse {
  Id: number;
  Name: string;
  CreatedOn: string;
  CreatedBy: string;
  UpdatedOn: string;
  UpdatedBy: string;
}

export interface AddCarriorOptions {
  Name: string;
}

interface StoreState {
  Carriors: CarriorResponse[];
  CarriorsById: CarriorResponse | null;
  loading: boolean;
  error: string | null;

  fetchCarriors: () => Promise<void>;
  getCarriorById: (id: number) => Promise<void>;
  addCarrior: (
    CarriorType: AddCarriorOptions,
    onSuccess: () => void
  ) => Promise<void>;
  updateCarrior: (
    id: number,
    CarriorType: AddCarriorOptions,
    onSuccess: () => void
  ) => Promise<void>;
  deleteCarrior: (id: number, onSuccess: () => void) => Promise<void>;
}

const useCarriorStore = create<StoreState>((set, get) => ({
  Carriors: [],
  CarriorsById: null,
  loading: false,
  error: null,

  fetchCarriors: async () => {
    set({ loading: true, error: null });

    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/shipment-carrier`
      );
      if (!response.ok) {
        set({ loading: false, error: "Error Fetching Data" });
      }
      const data: GetCarriorResponse = await response.json();
      set({ Carriors: data.data, loading: false });
    } catch (error) {
      set({ loading: false, error: "Error Fetching Data" });
    }
  },

  getCarriorById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/shipment-carrier/${id}`
      );
      if (!response.ok) {
        const error = await response.json();
        set({ loading: false, error: null });
        toast.error(error.message || "Failed to fetch data");
      }
      const data: AddCarriorResponse = await response.json();
      set({ CarriorsById: data.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch data", loading: false });
      toast.error("Failed to fetch data");
    }
  },

  addCarrior: async (
    CarriorType: AddCarriorOptions,
    onSuccess?: () => void
  ) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/shipment-carrier`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(CarriorType),
        }
      );
      if (!response.ok) {
        const error = await response.json();
        set({ loading: false, error: null });
        toast.error(error.message || "Failed to add Carrior");
      } else {
        set({ loading: false, error: null });
        toast.success("Carrior added successfully");
        if (onSuccess) onSuccess();
        await get().fetchCarriors();
      }
    } catch (error) {
      set({ error: "Failed to add category", loading: false });
      toast.error("Failed to add category");
    }
  },

  updateCarrior: async (
    id: number,
    CarriorType: AddCarriorOptions,
    onSuccess?: () => void
  ) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/shipment-carrier/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(CarriorType),
        }
      );
      if (!response.ok) {
        const error = await response.json();
        set({ loading: false, error: null });
        toast.error(error.message || "Failed to update Carrior");
      } else {
        set({ loading: false, error: null });
        toast.success("Carrior updated successfully");
        if (onSuccess) onSuccess();
        await get().fetchCarriors();
      }
    } catch (error) {
      set({ error: "Failed to update Carrior", loading: false });
      toast.error("Failed to update Carrior");
    }
  },

  deleteCarrior: async (id: number, onSuccess?: () => void) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/shipment-carrier/${id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const error = await response.json();
        set({ loading: false, error: null });
        toast.error(error.message || "Failed to delete Carrior");
      } else {
        set({ loading: false, error: null });
        toast.success("Category deleted successfully");
        if (onSuccess) onSuccess();
        await get().fetchCarriors();
      }
    } catch (error) {
      set({ error: "Failed to delete Carrior", loading: false });
      toast.error("Failed to delete Carrior");
    }
  },
}));

export default useCarriorStore;
