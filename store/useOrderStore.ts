import { AvailableColor } from "@/src/app/interfaces";
import {
  AddOrderType,
  ColorsByProductResponse,
  GetClinetReponse,
  GetOrderByClientResponse,
  GetOrderByIdType,
  GetOrdersType,
  Event,
  OderStatus,
  OderStatusResponse,
  GetOrderByIdResponse,
} from "@/src/app/interfaces/OrderStoreInterface";
import { fetchWithAuth } from "@/src/app/services/authservice";
import toast from "react-hot-toast";
import { create } from "zustand";

export interface ChangeOrderStatusType {
  id: number;
  statusId: number;
}

export interface OrderItemsByIdResponse {
  message: string;
  data: OrderItem[];
  status: number;
}

export interface AddOrderResponse {
  message: string;
  data: OrderItemsByIdData;
}

export interface OrderItemsByIdData {
  Id: number;
  OrderId: number;
  ProductId: number;
  ProductName: string;
  Description: string;
  OrderItemPriority: number;
  printingOptions: {
    PrintingOptionId: number;
    PrintingOptionName: string;
    Description: string;
  }[];
  colors: {
    ColorOptionId: number;
    ColorName: string;
    HexCode: string;
    Quantity: number;
    Priority: number;
    SizeOptionId: number;
    SizeOptionName: string;
    MeasurementId: number;
    MeasurementName: string;
  }[];
}

export interface OrderItem{
  Id: number;
  Name: string;
}

interface OrderStatusLogsData {
  message: string;
  data: OrderStatusLogsType[];
  status: number;
}

export interface OrderStatusLogsType {
  StatusId: number;
  StatusName: string;
  Timestamp: string;
}

interface StoreState {
  Orders: GetOrdersType[];
  OrderById: GetOrderByIdType;
  OrderItemById: OrderItem[];
  events: Event[];
  statuses: OderStatus[];
  availableColors: { [productId: number]: AvailableColor[] };
  OrderStatusLogs: OrderStatusLogsType[];
  loading: boolean;
  error: string | null;
  isResolved: boolean;

  fetchOrders: (clientId?: number) => Promise<void>;
  getOrderEvents: (clientId: number) => Promise<void>;
  getOrderById: (id: number) => Promise<void>;
  getOrderItemsByOrderId: (ids: number[]) => Promise<void>;
  getOrderStatus: () => Promise<void>;
  getAvailableColorByProductId: (id: number) => Promise<void>;
  getOrderStatusLog: (id: number) => Promise<void>;
  changeOrderStatus: (
    orderStatus: ChangeOrderStatusType,
    onSuccess: () => void
  ) => Promise<void>;
  addOrder: (category: AddOrderType) => Promise<AddOrderResponse | null>;
  updateOrder: (
    id: number,
    category: AddOrderType
  ) => Promise<AddOrderResponse | null>;
  reorderOrder: (
    orderId: number,
    clientId: number,
    onSuccess?: () => void
  ) => Promise<void>;
  deleteOrder: (
    id: number,
    clientId: number,
    onSuccess: () => void
  ) => Promise<void>;
}

const useOrderStore = create<StoreState>((set, get) => ({
  Orders: [],
  OrderById: {
    ClientId: 0,
    Id: 0,
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
  OrderItemById: [],
  events: [],
  statuses: [],
  availableColors: {},
  OrderStatusLogs: [],
  loading: false,
  error: null,
  isResolved: false,

  fetchOrders: async (clientId?: number) => {
    set({ loading: true, error: null });
    let endpoint = "";
    if (clientId && clientId > 0) {
      endpoint = `orders/${clientId}`;
    } else {
      endpoint = "orders";
    }
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`
      );
      if (!response.ok) {
        set({ loading: false, error: "Error Fetching Data" });
        const error = await response.json();
        toast.error(error.message || "Error fetching data");
      }
      const data: GetOrderByClientResponse = await response.json();
      set({ Orders: data.data, loading: false });
    } catch (error) {
      set({ loading: false, error: "Error Fetching Data" });
    }
  },

  getOrderEvents: async (clientId: number) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/events/${clientId}`
      );
      if (!response.ok) {
        set({ loading: false, error: "Error Fetching events Data" });
        const error = await response.json();
        toast.error(error.message || "Error fetching events data");
      }
      const data: GetClinetReponse = await response.json();
      set({ events: data.data, loading: false });
    } catch (error) {
      set({ loading: false, error: "Error Fetching events Data" });
    }
  },

  getOrderById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/get-edit/${id}`
      );
      if (!response.ok) {
        set({ loading: false, error: "Error Fetching Data" });
        const error = await response.json();
        toast.error(error.message || "Error fetching data");
      }
      const data: GetOrderByIdResponse = await response.json();
      set({ OrderById: data.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch category", loading: false });
    }
  },

  getOrderItemsByOrderId: async (ids: number[]) => {
  set({ loading: true, error: null });
  try {
    const response = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_API_URL}/orders/orders-items`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderIds: ids }),
      }
    );

    if (!response.ok) {
      set({ loading: false, error: "Error Fetching Data" });
      const error = await response.json();
      toast.error(error.message || "Error fetching data");
    }

    const data: OrderItemsByIdResponse = await response.json();
    set({ OrderItemById: data.data, loading: false });
  } catch (error) {
    set({ error: "Failed to fetch order items", loading: false });
  }
},


  getOrderStatus: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/orderstatuses`
      );
      if (!response.ok) {
        set({ loading: false, error: "Error Fetching status Data" });
        const error = await response.json();
        toast.error(error.message || "Error fetching status data");
      }
      const data: OderStatusResponse = await response.json();
      set({ statuses: data.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch status", loading: false });
    }
  },

  getAvailableColorByProductId: async (productId: number) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/products/availablecolors/${productId}`
      );
      if (!response.ok) {
        set({ error: null, loading: false });
        const error = await response.json();
        toast.error(error.message || "Error fetching colors");
      }
      const result: ColorsByProductResponse = await response.json();
      const data = result.data;
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

  getOrderStatusLog: async (OrderId: number) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/order-status-log/${OrderId}`
      );
      if (!response.ok) {
        set({ error: null, loading: false });
        const error = await response.json();
        toast.error(error.message || "Error fetching colors");
      }
      const data: OrderStatusLogsData = await response.json();
      set({ OrderStatusLogs: data.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch available colors", loading: false });
    }
  },

  changeOrderStatus: async (
    ChangeOrderStatus: ChangeOrderStatusType,
    onSuccess?: () => void
  ) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/change-status${ChangeOrderStatus.id}/${ChangeOrderStatus.statusId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.ok) {
        set({ loading: false, error: null });
        toast.success("Order status updated successfully.");
        if (onSuccess) onSuccess();
        // await get().getOrderById(ChangeOrderStatus.id);
      } else {
        set({ loading: false, error: null });
        const error = await response.json();
        toast.error(error.message || "Fail to add Order");
      }
    } catch (error) {
      set({ error: "Fail to add Order", loading: false });
      toast.error("Fail to add Order");
    }
  },

  addOrder: async (
    orderType: AddOrderType
  ): Promise<AddOrderResponse | null> => {
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
      const result: AddOrderResponse = await response.json();

      if (!response.ok) {
        set({ loading: false, error: null });
        toast.error(result.message || "Failed to add order");
        return null;
      }

      set({ loading: false, error: null });
      toast.success("Order added successfully");
      await get().fetchOrders();

      return result;
    } catch (error) {
      set({ error: "Failed to add item", loading: false });
      toast.error("Failed to add item");
      return null;
    }
  },

  // updateOrder: async (
  //   id: number,
  //   orderType: AddOrderType,
  //   onSuccess?: () => void
  // ) => {
  //   set({ loading: true, error: null, isResolved: false });
  //   try {
  //     const response = await fetchWithAuth(
  //       `${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`,
  //       {
  //         method: "PUT",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(orderType),
  //       }
  //     );

  //     if (!response.ok) throw new Error("Failed to update order");
  //     set({ loading: false, error: null, isResolved: true });
  //     if (onSuccess) onSuccess();
  //     await get().fetchOrders(orderType?.ClientId);
  //   } catch (error) {
  //     set({ error: "Failed to update order", loading: false });
  //   }
  // },

  updateOrder: async (
    id: number,
    orderType: AddOrderType
  ): Promise<AddOrderResponse | null> => {
    set({ loading: true, error: null });

    try {
      
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderType),
        }
      );
      const result: AddOrderResponse = await response.json();

      if (!response.ok) {
        set({ loading: false, error: null });
        toast.error(result.message || "Failed to updated order");
        return null;
      }

      set({ loading: false, error: null });
      toast.success("Order updated successfully");
      await get().fetchOrders();

      return result;
    } catch (error) {
      set({ error: "Failed to update item", loading: false });
      toast.error("Failed to update item");
      return null;
    }
  },

  reorderOrder: async (
    orderId: number,
    clientId: number,
    onSuccess?: () => void
  ) => {
    set({ loading: true, error: null });

    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/reorder`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        set({ loading: false, error: null });
        toast.success("Order reordered successfully.");
        if (onSuccess) onSuccess();

        await get().fetchOrders(clientId);
      } else {
        set({ loading: false, error: null });
        const error = await response.json();
        toast.error(error.message || "Failed to reorder");
      }
    } catch (error) {
      set({ error: "Failed to reorder", loading: false });
      toast.error("Failed to reorder");
    }
  },

  deleteOrder: async (id: number, clientId: number, onSuccess?: () => void) => {
    set({ loading: true, error: null, isResolved: false });
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
