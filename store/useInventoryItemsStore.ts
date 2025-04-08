import { fetchWithAuth } from "@/src/app/services/authservice";
import toast from "react-hot-toast";
import { create } from "zustand";

interface GetInventoryItemsResponse {
  data: InventoryItemResponse[];
  statusCode: number;
  message: string;
}

interface AddInventoryItemResponse {
  data: InventoryItemResponse;
  statusCode: number;
  message: string;
}

interface InventoryItemResponse {
  Id: number;
  Name: string;
  ItemCode: string;
  SubCategoryId: number;
  SubCategoryName: string;
  UnitOfMeasure: string;
  SupplierId: number;
  SupplierName: string;
  ReorderLevel: string | number;
  Quantity: number;
  Stock: number;
  CreatedOn: string;
  CreatedBy: string;
  UpdatedOn: string;
  UpdatedBy: string;
}

export interface AddInventoryItemOptions {
  Name: string;
  SubCategoryId: number;
  Quantity: number;
  UnitOfMeasure: string;
  SupplierId: number;
  ReorderLevel: number;
  Stock: number;
}

interface StoreState {
  inventoryItems: InventoryItemResponse[];
  inventoryItemById: InventoryItemResponse | null;
  loading: boolean;
  error: string | null;

  fetchInventoryItems: () => Promise<void>;
  getInventoryItemById: (id: number) => Promise<void>;
  addInventoryItem: (
    inventoryItemType: AddInventoryItemOptions,
    onSuccess: () => void
  ) => Promise<void>;
  updateInventoryItem: (
    id: number,
    supplierType: AddInventoryItemOptions,
    onSuccess: () => void
  ) => Promise<void>;
  deleteInventoryItem: (id: number, onSuccess: () => void) => Promise<void>;
}

const useInventoryItemsStore = create<StoreState>((set, get) => ({
  inventoryItems: [],
  inventoryItemById: null,
  loading: false,
  error: null,

  fetchInventoryItems: async () => {
    set({ loading: true, error: null });

    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/inventory-items`
      );
      if (!response.ok) {
        set({ loading: false, error: "Error Fetching Data" });
      }
      const data: GetInventoryItemsResponse = await response.json();
      set({ inventoryItems: data.data, loading: false });
    } catch (error) {
      set({ loading: false, error: "Error Fetching Data" });
    }
  },

  getInventoryItemById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/inventory-items/${id}`
      );
      if (!response.ok) {
        const error = await response.json();
        set({ loading: false, error: null });
        toast.error(error.message || "Failed to fetch data");
      }
      const data: AddInventoryItemResponse = await response.json();
      set({ inventoryItemById: data.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch data", loading: false });
      toast.error("Failed to fetch data");
    }
  },

  addInventoryItem: async (
    inventoryItemType: AddInventoryItemOptions,
    onSuccess?: () => void
  ) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/inventory-items`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(inventoryItemType),
        }
      );
      if (!response.ok) {
        const error = await response.json();
        set({ loading: false, error: null });
        toast.error(error.message || "Failed to add item");
      } else {
        set({ loading: false, error: null });
        toast.success("Item added successfully");
        if (onSuccess) onSuccess();
        await get().fetchInventoryItems();
      }
    } catch (error) {
      set({ error: "Failed to add item", loading: false });
      toast.error("Failed to add item");
    }
  },

  updateInventoryItem: async (
    id: number,
    updatedinventoryItem: AddInventoryItemOptions,
    onSuccess?: () => void
  ) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/inventory-items/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedinventoryItem),
        }
      );
      if (!response.ok) {
        const error = await response.json();
        set({ loading: false, error: null });
        toast.error(error.message || "Failed to update item");
      } else {
        set({ loading: false, error: null });
        toast.success("Item updated successfully");
        if (onSuccess) onSuccess();
        await get().fetchInventoryItems();
      }
    } catch (error) {
      set({ error: "Failed to update item", loading: false });
      toast.error("Failed to update item");
    }
  },

  deleteInventoryItem: async (id: number, onSuccess?: () => void) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/inventory-items/${id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const error = await response.json();
        set({ loading: false, error: null });
        toast.error(error.message || "Failed to delete item");
      } else {
        set({ loading: false, error: null });
        toast.success("Item deleted successfully");
        if (onSuccess) onSuccess();
        await get().fetchInventoryItems();
      }
    } catch (error) {
      set({ error: "Failed to delete Item", loading: false });
      toast.error("Failed to delete Item");
    }
  },
}));

export default useInventoryItemsStore;
