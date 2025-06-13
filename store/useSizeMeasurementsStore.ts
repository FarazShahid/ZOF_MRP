import { fetchWithAuth } from "@/src/app/services/authservice";
import toast from "react-hot-toast";
import { create } from "zustand";

export interface GetSizeOptionsResponse {
  data: SizeMeasurements[];
  statusCode: number;
  message: string;
}

export interface SizeOptionsIdRepsonse {
  data: SizeMeasurements;
  statusCode: number;
  message: string;
}

export interface AddSizeMeasurementType {
  SizeOptionId: number;
  ClientId?: number;
  Measurement1: string;
  FrontLengthHPS: string;
  BackLengthHPS: string;
  AcrossShoulders: string;
  ArmHole: string;
  UpperChest: string;
  LowerChest: string;
  Waist: string;
  BottomWidth: string;
  SleeveLength: string;
  SleeveOpening: string;
  NeckSize: string;
  CollarHeight: string;
  CollarPointHeight: string;
  StandHeightBack: string;
  CollarStandLength: string;
  SideVentFront: string;
  SideVentBack: string;
  PlacketLength: string;
  TwoButtonDistance: string;
  PlacketWidth: string;
  BottomHem: string;
}

export interface SizeMeasurements {
  Id: number;
  ClientName: string;
  ClientId: number;
  ProductCategoryId: number;
  ProductCategoryType: string;
  SizeOptionId: number;
  SizeOptionName: string;
  Measurement1: string;
  FrontLengthHPS: string;
  BackLengthHPS: string;
  AcrossShoulders: string;
  ArmHole: string;
  UpperChest: string;
  LowerChest: string;
  Waist: string;
  BottomWidth: string;
  SleeveLength: string;
  SleeveOpening: string;
  NeckSize: string;
  CollarHeight: string;
  CollarPointHeight: string;
  StandHeightBack: string;
  CollarStandLength: string;
  SideVentFront: string;
  SideVentBack: string;
  PlacketLength: string;
  TwoButtonDistance: string;
  PlacketWidth: string;
  BottomHem: string;
  CreatedOn: string;
  CreatedBy: string;
  UpdatedOn: string;
  UpdatedBy: string;
}
interface AddSizeOptions {
  OptionSizeOptions: string;
}

interface StoreState {
  sizeMeasurement: SizeMeasurements[];
  sizeMeasurementById: SizeMeasurements | null;
  sizeMeasurementsByClientId: SizeMeasurements[];
  sizeMeasurementByClientAndSize: SizeMeasurements | null;
  loading: boolean;
  error: string | null;

  fetchSizeMeasurements: () => Promise<void>;
  getSizeMeasurementById: (id: number) => Promise<void>;
  getSizeMeasurementByClientId: (id: number) => Promise<void>;
  fetchSizeMeasurementByClientAndSize: (
    clientId: number,
    sizeOptionId: number
  ) => Promise<SizeMeasurements | null>;
  addSizeMeasurement: (
    sizeMeasurement: AddSizeMeasurementType,
    onSuccess: () => void
  ) => Promise<void>;
  updateMeasurement: (
    id: number,
    sizeMeasurement: AddSizeMeasurementType,
    onSuccess: () => void
  ) => Promise<void>;
  deleteSizeOption: (id: number, onSuccess: () => void) => Promise<void>;
}

const useSizeMeasurementsStore = create<StoreState>((set, get) => ({
  sizeMeasurement: [],
  sizeMeasurementById: null,
  sizeMeasurementsByClientId: [],
  sizeMeasurementByClientAndSize: null,
  loading: false,
  error: null,

  fetchSizeMeasurements: async () => {
    set({ loading: true, error: null });

    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/size-measurements`
      );
      if (!response.ok) {
        set({ loading: false, error: "Error Fetching Data" });
        toast.error("Error Fetching Data");
      }
      const data: GetSizeOptionsResponse = await response.json();
      set({ sizeMeasurement: data.data, loading: false });
    } catch (error) {
      set({ loading: false, error: "Error Fetching Data" });
      toast.error("Error Fetching Data");
    }
  },
  getSizeMeasurementById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/size-measurements/${id}`
      );
      if (!response.ok) {
        const error = await response.json();
        set({ loading: false, error: null });
        toast.error(error.message || "Failed to fetch data");
      }
      const data: SizeOptionsIdRepsonse = await response.json();
      set({ sizeMeasurementById: data.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch data", loading: false });
      toast.error("Failed to fetch data");
    }
  },
  getSizeMeasurementByClientId: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/size-measurements/by-client/${id}`
      );
      if (!response.ok) {
        const error = await response.json();
        set({ loading: false, error: null });
        toast.error(error.message || "Failed to fetch data");
      }
      const data: SizeOptionsIdRepsonse = await response.json();
      set({ sizeMeasurementById: data.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch data", loading: false });
      toast.error("Failed to fetch data");
    }
  },

  fetchSizeMeasurementByClientAndSize: async (
    clientId: number,
    sizeOptionId: number
  ): Promise<SizeMeasurements | null> => {
    set({ loading: true, error: null });

    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/size-measurements/by-client/${clientId}`
      );

      if (!response.ok) {
        const error = await response.json();
        set({ loading: false, error: error.message || "Failed to fetch data" });
        toast.error(error.message || "Failed to fetch size measurement");
        return null;
      }

      const data: GetSizeOptionsResponse = await response.json();

      const matched = data.data.find(
        (item) => Number(item.SizeOptionId) === Number(sizeOptionId)
      );

      if (!matched) {
        toast.error("Size measurement not found for selected size option");
        set({ sizeMeasurementByClientAndSize: null, loading: false });
        return null;
      } else {
        set({ sizeMeasurementByClientAndSize: matched, loading: false });
        return matched;
      }
    } catch (error) {
      set({ error: "Failed to fetch data", loading: false });
      toast.error("Failed to fetch data");
      return null;
    }
  },

  addSizeMeasurement: async (
    sizeMeasurement: AddSizeMeasurementType,
    onSuccess?: () => void
  ) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/size-measurements`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sizeMeasurement),
        }
      );
      if (!response.ok) {
        const error = await response.json();
        set({ loading: false, error: null });
        toast.error(error.message || "Failed to add size measurement");
      } else {
        set({ loading: false, error: null });
        if (onSuccess) onSuccess();
        await get().fetchSizeMeasurements();
        toast.success("Size measurement added successfully");
      }
    } catch (error) {
      set({ error: "Failed to add size measurement", loading: false });
      toast.error("Failed to add size measurement");
    }
  },

  updateMeasurement: async (
    id: number,
    sizeMeasurement: AddSizeMeasurementType,
    onSuccess?: () => void
  ) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/size-measurements/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sizeMeasurement),
        }
      );
      if (!response.ok) {
        const error = await response.json();
        set({ loading: false, error: null });
        toast.error(error.message || "Failed to update size measurement");
      } else {
        set({ loading: false, error: null });
        if (onSuccess) onSuccess();
        await get().fetchSizeMeasurements();
        toast.success("Size measurement update successfully");
      }
    } catch (error) {
      set({ error: "Failed to update size measurement", loading: false });
      toast.error("Failed to update size measurement");
    }
  },

  deleteSizeOption: async (id: number, onSuccess?: () => void) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/size-measurements/${id}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        const error = await response.json();
        set({ loading: false, error: null });
        toast.error(error.message || "Failed to delete size");
      } else {
        set({ loading: false, error: null });
        if (onSuccess) onSuccess();
        await get().fetchSizeMeasurements();
        toast.success("Size deleted successfully");
      }
    } catch (error) {
      set({ error: "Failed to delete size", loading: false });
      toast.error("Failed to delete size");
    }
  },
}));

export default useSizeMeasurementsStore;
