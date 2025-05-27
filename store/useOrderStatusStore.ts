import { fetchWithAuth } from "@/src/app/services/authservice";
import toast from "react-hot-toast";
import { create } from "zustand";

interface OrderStatus {
  Id: number;
  StatusName: string;
  Description: string;
  CreatedOn: string;
  CreatedBy: string;
  UpdatedOn: string;
  UpdatedBy: string;
}

interface OrderStatusByIdType{
  Id: number;
  Name: string;
  Description: string;
  CreatedOn: string;
  CreatedBy: string;
  UpdatedOn: string;
  UpdatedBy: string;
}

export interface AddOrUpdateOrderStatus {
  Name: string;
  Description?: string;
}

interface OrderStatusResponse {
  data: OrderStatus[];
  statusCode: number;
  message: string;
}

interface SingleOrderStatusResponse {
  data: OrderStatusByIdType;
  statusCode: number;
  message: string;
}

interface OrderStatusStore {
  statuses: OrderStatus[];
  statusById: OrderStatusByIdType | null;
  loading: boolean;
  error: string | null;

  fetchStatuses: () => Promise<void>;
  getStatusById: (id: number) => Promise<void>;
  addStatus: (
    status: AddOrUpdateOrderStatus,
    onSuccess?: () => void
  ) => Promise<void>;
  updateStatus: (
    id: number,
    status: AddOrUpdateOrderStatus,
    onSuccess?: () => void
  ) => Promise<void>;
  deleteStatus: (id: number, onSuccess?: () => void) => Promise<void>;
}

const useOrderStatusStore = create<OrderStatusStore>((set, get) => ({
  statuses: [],
  statusById: null,
  loading: false,
  error: null,

  fetchStatuses: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/orderstatuses`
      );
      if (!response.ok) {
        toast.error("Failed to fetch order statuses");
      }
      const data: OrderStatusResponse = await response.json();
      set({ statuses: data.data, loading: false });
    } catch (error: any) {
      set({ loading: false, error: error.message });
      toast.error(error.message || "Failed to fetch statuses");
    }
  },

  getStatusById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/orderstatuses/${id}`
      );
      if (!response.ok) {
        toast.error("Failed to fetch status by ID");
      }
      const data: SingleOrderStatusResponse = await response.json();
      set({ statusById: data.data, loading: false });
    } catch (error: any) {
      set({ loading: false, error: error.message });
      toast.error(error.message || "Failed to fetch status");
    }
  },

  addStatus: async (status: AddOrUpdateOrderStatus, onSuccess?: () => void) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/orderstatuses`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(status),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message || "Failed to delete status");
        //throw new Error(error.message || "Failed to add order status");
      }

      toast.success("Order status added successfully");
      set({ loading: false });
      onSuccess?.();
      await get().fetchStatuses();
    } catch (error: any) {
      set({ loading: false, error: error.message });
      toast.error(error.message || "Failed to add status");
    }
  },

  updateStatus: async (
    id: number,
    status: AddOrUpdateOrderStatus,
    onSuccess?: () => void
  ) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/orderstatuses/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(status),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message || "Failed to delete status");
        // throw new Error(error.message || "Failed to update order status");
      }

      toast.success("Order status updated successfully");
      set({ loading: false });
      onSuccess?.();
      await get().fetchStatuses();
    } catch (error: any) {
      set({ loading: false, error: error.message });
      toast.error(error.message || "Failed to update status");
    }
  },

  deleteStatus: async (id: number, onSuccess?: () => void) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/orderstatuses/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const error = await response.json();
        // throw new Error(error.message || "Failed to delete order status");
        toast.error(error.message || "Failed to delete status");
      }

      toast.success("Order status deleted successfully");
      set({ loading: false });
      onSuccess?.();
      await get().fetchStatuses();
    } catch (error: any) {
      set({ loading: false, error: error.message });
      toast.error(error.message || "Failed to delete status");
    }
  },
}));

export default useOrderStatusStore;
