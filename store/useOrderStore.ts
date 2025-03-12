import { AvailableColor } from "@/src/app/interfaces";
import { fetchWithAuth } from "@/src/app/services/authservice";
import { create } from "zustand";

export interface GetOrdersType {
  Id: number;
  OrderName: string;
  OrderNumber: string;
  ExternalOrderId: string;
  Description: string;
  OrderEventId: number;
  ClientId: number;
  OrderStatusId: number;
  OrderPriority: number;
  Deadline: string;
  EventName: string;
  ClientName: string;
  StatusName: string;
}
export interface orderItemDetailsType {
  ColorOptionId: number;
  Quantity: number;
  Priority: number;
}
export interface GetOrderByIdType {
  ClientId: number;
  OrderEventId: number;
  OrderPriority: number;
  Description: string;
  OrderNumber: string;
  OrderName: string;
  ExternalOrderId: string;
  OrderStatusId: number;
  Deadline: string;
  EventName: string;
  ClientName: string;
  StatusName: string;
  items: {
    Id: number;
    ProductId: number;
    ProductName: string;
    Description: string;
    OrderNumber: string;
    OrderName: string;
    ExternalOrderId: string;
    OrderItemPriority: number;
    ImageId: number;
    FileId: number;
    VideoId: number;
    printingOptions: {
      PrintingOptionId: number;
      PrintingOptionName: string;
      Description: string;
    }[];
    orderItemDetails: {
      ColorName: string;
      ColorOptionId: number;
      Quantity: number;
      Priority: number;
    }[];
  }[];
}
export interface AddOrderType {
  ClientId: number;
  OrderEventId: number;
  Description: string;
  OrderStatusId: number;
  Deadline: string;
  OrderNumber: string;
  OrderName: string;
  ExternalOrderId: number;
  OrderPriority: number;
  items: {
    ProductId: number;
    Description: string;
    OrderItemPriority: number;
    ImageId: number;
    FileId: number;
    VideoId: number;
    orderItemDetails: orderItemDetailsType[];
    printingOptions: {
      PrintingOptionId: number;
      Description: string;
    }[];
  }[];
}

interface StoreState {
  Orders: GetOrdersType[];
  OrderById: GetOrderByIdType;
  availableColors: { [productId: number]: AvailableColor[] };
  loading: boolean;
  error: string | null;
  isResolved: boolean;

  fetchOrders: (clientId: number) => Promise<void>;
  getOrderById: (id: number) => Promise<void>;
  getAvailableColorByProductId: (id: number) => Promise<void>;
  addOrder: (category: AddOrderType, onSuccess: () => void) => Promise<void>;
  updateOrder: (
    id: number,
    category: AddOrderType,
    onSuccess: () => void
  ) => Promise<void>;
  deleteOrder: (id: number, clientId: number ,onSuccess: () => void) => Promise<void>;
}

const useOrderStore = create<StoreState>((set, get) => ({
  Orders: [],
  OrderById: {
    ClientId: 0,
    OrderEventId: 0,
    OrderPriority: 0,
    Description: "",
    OrderNumber: "",
    OrderName: "",
    ExternalOrderId: "",
    OrderStatusId: 0,
    Deadline: "",
    EventName: "",
    ClientName: "",
    StatusName: "",
    items: [],
  },
  availableColors: {},
  loading: false,
  error: null,
  isResolved: false,

  fetchOrders: async (clientId: number) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${clientId}`
      );
      if (!response.ok) {
        set({ loading: false, error: "Error Fetching Data" });
      }
      const data: GetOrdersType[] = await response.json();
      set({ Orders: data, loading: false });
    } catch (error) {
      set({ loading: false, error: "Error Fetching Data" });
    }
  },

  getOrderById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/get-edit/${id}`
      );
      const data: GetOrderByIdType = await response.json();
      set({ OrderById: data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch category", loading: false });
    }
  },

  getAvailableColorByProductId: async (productId: number) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/products/availablecolors/${productId}`
      );
      const data: AvailableColor[] = await response.json();
      set((state) => ({
        availableColors: {
          ...state.availableColors,
          [productId]: data ?? [],
        },
        loading: false,
      }));
    } catch (error) {
      set({ error: "Failed to fetch available colors", loading: false });
    }
  },

  addOrder: async (orderType: AddOrderType, onSuccess?: () => void) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/orders`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderType),
        }
      );

      if (!response.ok) throw new Error("Failed to add Order");
      set({ loading: false, error: null });
      if (onSuccess) onSuccess();
      await get().fetchOrders(orderType?.ClientId);
    } catch (error) {
      set({ error: "Failed to add Order", loading: false });
    }
  },

  updateOrder: async (
    id: number,
    orderType: AddOrderType,
    onSuccess?: () => void
  ) => {
    set({ loading: true, error: null, isResolved: false });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderType),
        }
      );

      if (!response.ok) throw new Error("Failed to update order");
      set({ loading: false, error: null, isResolved: true });
      if (onSuccess) onSuccess();
      await get().fetchOrders(orderType?.ClientId);
    } catch (error) {
      set({ error: "Failed to update order", loading: false });
    }
  },

  deleteOrder: async (id: number,  clientId: number ,onSuccess?: () => void) => {
      set({ loading: true, error: null, isResolved: false  });
      try {
        const response = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`,
          { method: "DELETE" }
        );

        if (!response.ok) throw new Error("Failed to delete order");
        set({ loading: false, error: null, isResolved: true });
        if (onSuccess) onSuccess();
        await get().fetchOrders(clientId);
      } catch (error) {
        set({ error: "Failed to delete order", loading: false });
      }
    },
}));

export default useOrderStore;
