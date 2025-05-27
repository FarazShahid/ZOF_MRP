import { fetchWithAuth } from "@/src/app/services/authservice";
import toast from "react-hot-toast";
import { create } from "zustand";

interface GetSupplierResponse {
  data: SuppliersResponse[];
  statusCode: number;
  message: string;
}

interface AddSupplierResponse {
  data: SuppliersResponse;
  statusCode: number;
  message: string;
}

interface SuppliersResponse {
  Id: number;
  Name: string;
  Phone: string;
  Country: string;
  State: string;
  City: string;
  CompleteAddress: string;
  CreatedOn: string;
  CreatedBy: string;
  UpdatedOn: string;
  UpdatedBy: string;
}

export interface AddSupplierOptions {
    Name: string;
    Email?: string;
    Phone?: string;
    Country?: string;
    State?: string;
    City?: string;
    CompleteAddress?: string;
}

interface StoreState {
  suppliers: SuppliersResponse[];
  supplierById: SuppliersResponse | null;
  loading: boolean;
  error: string | null;

  fetchSuppliers: () => Promise<void>;
  getSupplierById: (id: number) => Promise<void>;
  addSupplier: (
    supplierType: AddSupplierOptions,
    onSuccess: () => void
  ) => Promise<void>;
  updateSupplier: (
    id: number,
    supplierType: AddSupplierOptions,
    onSuccess: () => void
  ) => Promise<void>;
  deleteSupplier: (id: number, onSuccess: () => void) => Promise<void>;
}

const useSupplierStore = create<StoreState>((set, get) => ({
  suppliers: [],
  supplierById: null,
  loading: false,
  error: null,

  fetchSuppliers: async () => {
    set({ loading: true, error: null });

    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/inventory-suppliers`
      );
      if (!response.ok) {
        set({ loading: false, error: "Error Fetching Data" });
      }
      const data: GetSupplierResponse = await response.json();
      set({ suppliers: data.data, loading: false });
    } catch (error) {
      set({ loading: false, error: "Error Fetching Data" });
    }
  },

  getSupplierById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/inventory-suppliers/${id}`
      );
      if (!response.ok) {
        const error = await response.json();
        set({ loading: false, error: null });
        toast.error(error.message || "Failed to fetch data");
      }
      const data: AddSupplierResponse = await response.json();
      set({ supplierById: data.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch data", loading: false });
      toast.error("Failed to fetch data");
    }
  },

  addSupplier: async (
    supplierType: AddSupplierOptions,
    onSuccess?: () => void
  ) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/inventory-suppliers`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(supplierType),
        }
      );
      if (!response.ok) {
        const error = await response.json();
        set({ loading: false, error: null });
        toast.error(error.message || "Failed to add supplier");
      } else {
        set({ loading: false, error: null });
        toast.success("Supplier added successfully");
        if (onSuccess) onSuccess();
        await get().fetchSuppliers();
      }
    } catch (error) {
      set({ error: "Failed to add supplier", loading: false });
      toast.error("Failed to add supplier");
    }
  },

  updateSupplier: async (
    id: number,
    updatedSupplier: AddSupplierOptions,
    onSuccess?: () => void
  ) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/inventory-suppliers/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedSupplier),
        }
      );
      if (!response.ok) {
        const error = await response.json();
        set({ loading: false, error: null });
        toast.error(error.message || "Failed to update supplier");
      } else {
        set({ loading: false, error: null });
        toast.success("Supplier updated successfully");
        if (onSuccess) onSuccess();
        await get().fetchSuppliers();
      }
    } catch (error) {
      set({ error: "Failed to update supplier", loading: false });
      toast.error("Failed to update supplier");
    }
  },

  deleteSupplier: async (id: number, onSuccess?: () => void) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/inventory-suppliers/${id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const error = await response.json();
        set({ loading: false, error: null });
        toast.error(error.message || "Failed to delete supplier");
      } else {
        set({ loading: false, error: null });
        toast.success("Supplier deleted successfully");
        if (onSuccess) onSuccess();
        await get().fetchSuppliers();
      }
    } catch (error) {
      set({ error: "Failed to delete supplier", loading: false });
      toast.error("Failed to delete supplier");
    }
  },
}));

export default useSupplierStore;
