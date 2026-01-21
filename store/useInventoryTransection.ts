import { fetchWithAuth } from "@/src/app/services/authservice";
import toast from "react-hot-toast";
import { create } from "zustand";


export const TRANSACTION_TYPES = [
  { label: "IN", value: "IN" }, // + in stock
  { label: "OUT", value: "OUT" }, // - in stock
  { label: "Opening Balance", value: "Opening Balance" }, // first ever transction
   { label: "Return to Stock", value: "Return to Stock" }, // + in stock
   {label: "Return to Supplier", value: "Return to Supplier"}, // - in stock
  { label: "Disposal", value: "Disposal" }, // - in stock
];


interface GetInventoryTransectionResponse {
  data: InventoryTransectionResponse[];
  statusCode: number;
  message: string;
}

interface AddInventoryTransactionResponse {
  data: InventoryTransectionResponse;
  statusCode: number;
  message: string;
}

interface InventoryTransectionResponse {
  Id: number;
  ClientId?: number;
  OrderId?: number;
  SupplierId?: number;
  InventoryItemId: number;
  ItemName: string;
  ItemCode: string;
  UnitOfMeasure: string;
  Quantity: string;
  TransactionType: string;
  TransactionDate: string;
  CreatedBy: string;
  UpdatedBy: string;
  CreatedOn: string;
  UpdatedOn: string;
}

export interface AddInventoryTransactionType {
  ClientId?: number;
  OrderId?: number;
  SupplierId?: number;
  InventoryItemId: number;
  Quantity: number;
  TransactionType: string;
  TransactionDate: string;
}

interface StoreState {
  inventoryTransactions: InventoryTransectionResponse[];
  inventoryTransactionById: InventoryTransectionResponse | null;
  loading: boolean;
  error: string | null;

  fetchInventoryTransactions: () => Promise<void>;
  getInventoryTransactionById: (id: number) => Promise<void>;
  addInventoryTransaction: (
    inventoryTransactionType: AddInventoryTransactionType,
    onSuccess: () => void
  ) => Promise<void>;
  updateInventoryTransaction: (
    id: number,
    TransactionType: AddInventoryTransactionType,
    onSuccess: () => void
  ) => Promise<void>;
  deleteInventoryTransaction: (
    id: number,
    onSuccess: () => void
  ) => Promise<void>;
}

const useInventoryTransection = create<StoreState>((set, get) => ({
  inventoryTransactions: [],
  inventoryTransactionById: null,
  loading: false,
  error: null,

  fetchInventoryTransactions: async () => {
    set({ loading: true, error: null });

    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/inventory-transections`
      );
      if (!response.ok) {
        set({ loading: false, error: "Error Fetching Data" });
      }
      const data: GetInventoryTransectionResponse = await response.json();
      set({ inventoryTransactions: data.data, loading: false });
    } catch (error) {
      set({ loading: false, error: "Error Fetching Data" });
    }
  },

  getInventoryTransactionById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/inventory-transections/${id}`
      );
      if (!response.ok) {
        const error = await response.json();
        set({ loading: false, error: null });
        toast.error(error.message || "Failed to fetch data");
      }
      const data: AddInventoryTransactionResponse = await response.json();
      set({ inventoryTransactionById: data.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch data", loading: false });
      toast.error("Failed to fetch data");
    }
  },

  addInventoryTransaction: async (
    inventoryTransactionType: AddInventoryTransactionType,
    onSuccess?: () => void
  ) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/inventory-transections`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(inventoryTransactionType),
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
        await get().fetchInventoryTransactions();
      }
    } catch (error) {
      set({ error: "Failed to add item", loading: false });
      toast.error("Failed to add item");
    }
  },

  updateInventoryTransaction: async (
    id: number,
    TransactionType: AddInventoryTransactionType,
    onSuccess?: () => void
  ) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/inventory-transections/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(TransactionType),
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
        await get().fetchInventoryTransactions();
      }
    } catch (error) {
      set({ error: "Failed to update item", loading: false });
      toast.error("Failed to update item");
    }
  },

  deleteInventoryTransaction: async (id: number, onSuccess?: () => void) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/inventory-transections/${id}`,
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
        await get().fetchInventoryTransactions();
      }
    } catch (error) {
      set({ error: "Failed to delete Item", loading: false });
      toast.error("Failed to delete Item");
    }
  },
}));

export default useInventoryTransection;
