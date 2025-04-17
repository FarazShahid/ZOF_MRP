import { fetchWithAuth } from "@/src/app/services/authservice";
import toast from "react-hot-toast";
import { create } from "zustand";

interface GetPrintingOptionsResponse {
  data: PrintingOptionType[];
  statusCode: number;
  message: string;
}

export interface PrintingOptionType {
  Id: number;
  Type: string;
  CreatedOn: string;
  CreatedBy: string;
  UpdatedOn: string;
  UpdatedBy: string;
}

interface printingById{
    Id: number;
    Name: string;
    CreatedOn: string;
    CreatedBy: string;
    UpdatedOn: string;
    UpdatedBy: string;
}

interface GetPrintingOptionByIdResponse{
    data: printingById;
}

export interface AddPrintingOptionsType{
    Name: string;
}

interface StoreState {
  printingOptions: PrintingOptionType[];
  printingOptionById: printingById | null;
  loading: boolean;
  error: string | null;

  fetchprintingOptions: () => Promise<void>;
  getPrintingOptionById: (id: number) => Promise<void>;


  addPrintingOption: (
    printingOptions: AddPrintingOptionsType,
    onSuccess: () => void
  ) => Promise<void>;


  updatePrintingOption: (
    id: number,
    printingOptions: AddPrintingOptionsType,
    onSuccess: () => void
  ) => Promise<void>;
  deletePrintingOption: (id: number, onSuccess: () => void) => Promise<void>;
}

const usePrintingOptionsStore = create<StoreState>((set, get) => ({
  printingOptions: [],
  printingOptionById: null,
  loading: false,
  error: null,

  fetchprintingOptions: async () => {
    set({ loading: true, error: null });

    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/printingoptions`
      );
      if (!response.ok) {
        set({ loading: false, error: "Error Fetching Data" });
        const error = await response.json();
        toast.error(error.message || "Error Fetching Data");
      }
      const data: GetPrintingOptionsResponse = await response.json();
      set({ printingOptions: data.data, loading: false });
    } catch (error) {
      set({ loading: false, error: "Error Fetching Data" });
    }
  },

  getPrintingOptionById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/printingoptions/${id}`
      );
      if (!response.ok) {
        const error = await response.json();
        set({ loading: false, error: null });
        toast.error(error.message || "Failed to fetch printing option");
      }
      const data: GetPrintingOptionByIdResponse = await response.json();
      set({ printingOptionById: data.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch printing option", loading: false });
      toast.error("Failed to fetch printing option");
    }
  },

  addPrintingOption: async (
    printingOptions: AddPrintingOptionsType,
    onSuccess?: () => void
  ) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/printingoptions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(printingOptions),
        }
      );
      if (!response.ok) {
        const error = await response.json();
        set({ loading: false, error: null });
        toast.error(error.message || "Failed to add printing option");
      } else {
        set({ loading: false, error: null });
        toast.success("Printing option added successfully");
        if (onSuccess) onSuccess();
        await get().fetchprintingOptions();
      }
    } catch (error) {
      set({ error: "Failed to printing option", loading: false });
      toast.error("Failed to printing option");
    }
  },

  updatePrintingOption: async (
    id: number,
    printingOptions: AddPrintingOptionsType,
    onSuccess?: () => void
  ) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/printingoptions/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(printingOptions),
        }
      );
      if (!response.ok) {
        const error = await response.json();
        set({ loading: false, error: null });
        toast.error(error.message || "Failed to update printing option");
      } else {
        set({ loading: false, error: null });
        toast.success("printing option updated successfully");
        if (onSuccess) onSuccess();
        await get().fetchprintingOptions();
      }
    } catch (error) {
      set({ error: "Failed to update printing option", loading: false });
      toast.error("Failed to update printing option");
    }
  },

  deletePrintingOption: async (id: number, onSuccess?: () => void) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/printingoptions/${id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const error = await response.json();
        set({ loading: false, error: null });
        toast.error(error.message || "Failed to delete Printing Options");
      } else {
        set({ loading: false, error: null });
        toast.success("Printing Options deleted successfully");
        if (onSuccess) onSuccess();
        await get().fetchprintingOptions();
      }
    } catch (error) {
      set({ error: "Failed to delete Printing Options", loading: false });
      toast.error("Failed to delete Printing Options");
    }
  },
}));

export default usePrintingOptionsStore;
