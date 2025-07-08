import { fetchWithAuth } from "@/src/app/services/authservice";
import toast from "react-hot-toast";
import { create } from "zustand";

interface GetShipmentResponse {
  data: GetAllShipments[];
  statusCode: number;
  message: string;
}

interface AddShipmentResponse {
  data: ShipmentResponse;
  statusCode: number;
  message: string;
}

interface GetAllShipments {
  Id: number;
  ShipmentCode: string;
  ShipmentDate: string;
  ShipmentCost: string;
  WeightUnit: string;
  TotalWeight: number;
  NumberOfBoxes: number;
  ReceivedTime: string;
  Status: string;
  ShipmentCarrierId: number;
  ShipmentCarrierName: string;
  OrderId: number;
  OrderName: string;
  OrderNumber: string;
  CreatedOn: string;
  UpdatedOn: string;
  CreatedBy: string;
  UpdatedBy: string;
}

interface ShipmentResponse {
  Id: number;
  ShipmentCode: string;
  OrderId: number;
  ShipmentCarrierId: number;
  ShipmentCarrierName: string;
  ShipmentDate: string;
  ShipmentCost: string;
  TotalWeight: number;
  NumberOfBoxes: number;
  WeightUnit: string;
  ReceivedTime: string;
  Status: string;
  ShipmentCarrier: {
    Id: number;
    Name: string;
  };
  Boxes: {
    Id: number;
    ShipmentId: number;
    Weight: number;
    BoxNumber: number;
  }[];
  ShipmentDetails: {
    Id: number;
    ShipmentId: number;
    OrderItemId: number;
    Quantity: number;
    Size: string;
    Description: string;
    ItemDetails: string;
    OrderItem: {
      Id: number;
      ProductId: number;
      Description: string;
    };
  }[];

  CreatedOn: string;
  CreatedBy: string;
  UpdatedOn: string;
  UpdatedBy: string;
}

export interface AddShipmentOptions {
  ShipmentCode: string;
  OrderId: number;
  ShipmentCarrierId: number;
  ShipmentDate: string;
  ShipmentCost: number;
  TotalWeight: number;
  NumberOfBoxes: number;
  WeightUnit: string;
  ReceivedTime: string;
  Status: string;
  ShipmentDetails: {
    OrderItemId: number;
    Quantity: number;
    Size: number;
    ItemDetails: string;
  }[];
  boxes: {
    BoxNumber: number;
    Weight: number;
  }[];
}

interface StoreState {
  Shipments: GetAllShipments[];
  ShipmentById: ShipmentResponse | null;
  loading: boolean;
  error: string | null;

  fetchShipments: () => Promise<void>;
  getShipmentById: (id: number) => Promise<void>;
  addShipment: (
    ShipmentType: AddShipmentOptions
  ) => Promise<ShipmentResponse | null>;
  updateShipment: (
    id: number,
    ShipmentType: AddShipmentOptions
  ) => Promise<ShipmentResponse | null>;
  deleteShipment: (id: number, onSuccess: () => void) => Promise<void>;
}

const useShipmentStore = create<StoreState>((set, get) => ({
  Shipments: [],
  ShipmentById: null,
  loading: false,
  error: null,

  fetchShipments: async () => {
    set({ loading: true, error: null });

    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/shipment`
      );
      if (!response.ok) {
        set({ loading: false, error: "Error Fetching Data" });
      }
      const data: GetShipmentResponse = await response.json();
      set({ Shipments: data.data, loading: false });
    } catch (error) {
      set({ loading: false, error: "Error Fetching Data" });
    }
  },

  getShipmentById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/shipment/${id}`
      );
      if (!response.ok) {
        const error = await response.json();
        set({ loading: false, error: null });
        toast.error(error.message || "Failed to fetch data");
      }
      const data: AddShipmentResponse = await response.json();
      set({ ShipmentById: data.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch data", loading: false });
      toast.error("Failed to fetch data");
    }
  },

  addShipment: async (
    ShipmentType: AddShipmentOptions
  ): Promise<ShipmentResponse | null> => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/shipment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(ShipmentType),
        }
      );

      const result: AddShipmentResponse = await response.json();

      if (!response.ok) {
        set({ loading: false, error: null });
        toast.error(result.message || "Failed to add item");
        return null;
      }

      set({ loading: false, error: null });
      toast.success("Item added successfully");
      await get().fetchShipments();

      return result.data;
    } catch (error) {
      set({ error: "Failed to add item", loading: false });
      toast.error("Failed to add item");
      return null;
    }
  },

  updateShipment: async (
    id: number,
    ShipmentType: AddShipmentOptions
  ): Promise<ShipmentResponse | null> => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/shipment/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(ShipmentType),
        }
      );

      const result: AddShipmentResponse = await response.json();

      if (!response.ok) {
        set({ loading: false, error: null });
        toast.error(result.message || "Failed to update item");
        return null;
      }

      set({ loading: false, error: null });
      toast.success("Item updated successfully");
      await get().fetchShipments();

      return result.data;
    } catch (error) {
      set({ error: "Failed to update", loading: false });
      toast.error("Failed to update");
      return null;
    }
  },

  deleteShipment: async (id: number, onSuccess?: () => void) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/shipment/${id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const error = await response.json();
        set({ loading: false, error: null });
        toast.error(error.message || "Failed to delete shipment");
      } else {
        set({ loading: false, error: null });
        toast.success("Shipment deleted successfully");
        if (onSuccess) onSuccess();
        await get().fetchShipments();
      }
    } catch (error) {
      set({ error: "Failed to delete Shipment", loading: false });
      toast.error("Failed to delete shipment");
    }
  },
}));

export default useShipmentStore;
