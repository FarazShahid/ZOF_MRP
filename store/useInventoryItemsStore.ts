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

export interface InventoryItemResponse {
  Id: number;
  Name: string;
  ItemCode: string;
  CategoryId: number;
  SubCategoryId?: number;
  SubCategoryName: string;
  UnitOfMeasureId: string;
  UnitOfMeasureName: string;
  UnitOfMeasureShortForm: string;
  SupplierId: number;
  SupplierName: string;
  ReorderLevel: string | number;
  Stock: number;
  CreatedOn: string;
  CreatedBy: string;
  UpdatedOn: string;
  UpdatedBy: string;
}

export interface AddInventoryItemOptions {
  Name: string;
  CategoryId: number;
  SubCategoryId?: number;
  UnitOfMeasureId: string;
  SupplierId: number;
  ReorderLevel: number;
  Stock: number;
}

interface StoreState {
  inventoryItems: InventoryItemResponse[];
  inventoryItemById: InventoryItemResponse | null;
  stockStatusMap: Record<string, "low" | "normal" | "high">;
  loading: boolean;
  error: string | null;

  fetchInventoryItems: () => Promise<void>;
  getInventoryItemById: (id: number) => Promise<void>;
  addInventoryItem: (
    inventoryItemType: AddInventoryItemOptions
  ) => Promise<InventoryItemResponse | null>;
  updateInventoryItem: (
    id: number,
    inventoryItemType: AddInventoryItemOptions
  ) => Promise<InventoryItemResponse | null>;
  deleteInventoryItem: (id: number, onSuccess: () => void) => Promise<void>;
  updateStockLevelStatus: (
    itemCode: string,
    stockLevel: "low" | "normal" | "high"
  ) => void;
  getStockLevelStatus: () => {
    itemCode: string;
    statusLevel: "low" | "normal" | "high";
  }[];
}

const useInventoryItemsStore = create<StoreState>((set, get) => ({
  inventoryItems: [],
  inventoryItemById: null,
  stockStatusMap: {},
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
    inventoryItemType: AddInventoryItemOptions
  ): Promise<InventoryItemResponse | null> => {
    set({ loading: true, error: null });
    try {
      debugger
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/inventory-items`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(inventoryItemType),
        }
      );

      const result: AddInventoryItemResponse = await response.json();

      if (!response.ok) {
        set({ loading: false, error: null });
        toast.error(result.message || "Failed to add item");
        return null;
      }

      set({ loading: false, error: null });
      toast.success("Item added successfully");
      await get().fetchInventoryItems();

      return result.data;
    } catch (error) {
      set({ error: "Failed to add item", loading: false });
      toast.error("Failed to add item");
      return null;
    }
  },


  updateInventoryItem: async (
    id: number,
    inventoryItemType: AddInventoryItemOptions
  ): Promise<InventoryItemResponse | null> => {
    set({ loading: true, error: null });
    try {
      debugger
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/inventory-items/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(inventoryItemType),
        }
      );

      const result: AddInventoryItemResponse = await response.json();

      if (!response.ok) {
        set({ loading: false, error: null });
        toast.error(result.message || "Failed to updated item");
        return null;
      }

      set({ loading: false, error: null });
      toast.success("Item updated uccessfully");
      await get().fetchInventoryItems();

      return result.data;
    } catch (error) {
      set({ error: "Failed to update item", loading: false });
      toast.error("Failed to update item");
      return null;
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
  updateStockLevelStatus: (itemCode, stockLevel) => {
    set((state) => ({
      stockStatusMap: {
        ...state.stockStatusMap,
        [itemCode]: stockLevel,
      },
    }));
  },

  getStockLevelStatus: () => {
    const stockStatusMap = get().stockStatusMap;
    return Object.entries(stockStatusMap).map(([itemCode, statusLevel]) => ({
      itemCode,
      statusLevel,
    }));
  },
}));

export default useInventoryItemsStore;
