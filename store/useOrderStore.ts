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

interface StoreState {
  Orders: GetOrdersType[];
  OrderById: GetOrderByIdType;
  events: Event[];
  statuses: OderStatus[];
  availableColors: { [productId: number]: AvailableColor[] };
  loading: boolean;
  error: string | null;
  isResolved: boolean;

  fetchOrders: (clientId: number) => Promise<void>;
  getOrderEvents: (clientId: number) => Promise<void>;
  getOrderById: (id: number) => Promise<void>;
  getOrderStatus: () => Promise<void>;
  getAvailableColorByProductId: (id: number) => Promise<void>;
  addOrder: (category: AddOrderType, onSuccess: () => void) => Promise<void>;
  updateOrder: (
    id: number,
    category: AddOrderType,
    onSuccess: () => void
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
  events: [],
  statuses:[],
  availableColors: {},
  loading: false,
  error: null,
  isResolved: false,

  fetchOrders: async (clientId: number) => {
    set({ loading: true, error: null });
    let endpoint = "";
    if(clientId > 0){
      endpoint = `orders/${clientId}`
    }else{
      endpoint = "orders"
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
      if(response.ok){
        set({ loading: false, error: null });
        toast.success("Order added successfully.");
        if (onSuccess) onSuccess();
        await get().fetchOrders(orderType?.ClientId);
      }else{
        set({ loading: false, error: null });
        const error = await response.json();
        toast.error(error.message || "Fail to add Order");
      }
    
    } catch (error) {
      set({ error: "Fail to add Order", loading: false });
      toast.error("Fail to add Order");
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
