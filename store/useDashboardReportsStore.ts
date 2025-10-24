import { create } from "zustand";
import { fetchWithAuth } from "@/src/app/services/authservice";
import toast from "react-hot-toast";

// Response type helpers
interface ApiEnvelope<T> {
  data: T;
  statusCode: number;
  message: string;
  timestamp?: string;
}

// dsahboardWidgets
export interface DashboardWidgetsData {
  totalOrders: number;
  totalProducts: number;
  totalShipments: number;
  totalClients: number;
}

// OrderStatusSummary
export interface OrderStatusSummaryRow {
  statusId: number;
  statusName: string;
  count: number;
}

// OrderSummaryByMonth
export interface OrderSummaryByMonthRow {
  month: number;
  monthName: string;
  created: number;
  shipped: number;
}

// LateOrders
export interface LateOrderRow {
  orderId: number;
  orderNumber: string;
  orderName: string;
  deadline: string;
  clientName: string;
  statusName: string;
  daysLate: number;
}

// TopClients
export interface TopClientRow {
  clientId: number;
  clientName: string;
  orderCount: number;
  pendingOrders: number;
  completedOrders: number;
}

// Shipments summary
export interface ShipmentsSummaryData {
  totalShipments: number;
  inTransit: number;
  delivered: number;
  damaged: number;
  cancelled: number;
  onTimeDelivered: string;
}

// Stock levels
export interface StockLevelsSummaryData {
  highInStock: number;
  nearLow: number;
  lowStock: number;
  outOfStock: number;
}

export interface StockLevelsDetailRow {
  itemId: number;
  itemName: string;
  itemCode: string;
  currentStock: string;
  reorderLevel: string;
  stockLevel: string; // e.g., "High in Stock", "Low Stock"
}

export interface StockLevelsData {
  summary: StockLevelsSummaryData;
  details: Record<string, StockLevelsDetailRow[]>; // keyed by stock level label
}

// Top products
export interface TopProductRow {
  productId: number;
  productName: string;
  orderCount: number;
  itemCount: number;
  totalQuantity: number;
}

interface DashboardReportsState {
  // data
  widgets: DashboardWidgetsData | null;
  orderStatusSummary: OrderStatusSummaryRow[];
  orderSummaryByMonth: OrderSummaryByMonthRow[];
  lateOrders: LateOrderRow[];
  topClients: TopClientRow[];
  shipmentsSummary: ShipmentsSummaryData | null;
  stockLevels: StockLevelsData | null;
  topProducts: TopProductRow[];

  // ui
  loading: boolean;
  error: string | null;

  // actions
  fetchWidgets: () => Promise<void>;
  fetchOrderStatusSummary: () => Promise<void>;
  fetchOrderSummaryByMonth: (year?: number) => Promise<void>;
  fetchLateOrders: () => Promise<void>;
  fetchTopClients: () => Promise<void>;
  fetchShipmentsSummary: () => Promise<void>;
  fetchStockLevels: () => Promise<void>;
  fetchTopProducts: () => Promise<void>;
}

const useDashboardReportsStore = create<DashboardReportsState>((set) => ({
  // initial state
  widgets: null,
  orderStatusSummary: [],
  orderSummaryByMonth: [],
  lateOrders: [],
  topClients: [],
  shipmentsSummary: null,
  stockLevels: null,
  topProducts: [],

  loading: false,
  error: null,

  fetchWidgets: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboard-reports/widgets`
      );
      if (!res.ok) {
        const err = await safeParse(res);
        set({ loading: false, error: err.message || "Failed to fetch widgets" });
        toast.error(err.message || "Failed to fetch widgets");
        return;
      }
      const body: ApiEnvelope<DashboardWidgetsData> = await res.json();
      set({ widgets: body.data, loading: false });
    } catch (e) {
      set({ loading: false, error: "Failed to fetch widgets" });
    }
  },

  fetchOrderStatusSummary: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboard-reports/order-status-summary`
      );
      if (!res.ok) {
        const err = await safeParse(res);
        set({ loading: false, error: err.message || "Failed to fetch summary" });
        toast.error(err.message || "Failed to fetch summary");
        return;
      }
      const body: ApiEnvelope<OrderStatusSummaryRow[]> = await res.json();
      set({ orderStatusSummary: body.data, loading: false });
    } catch (e) {
      set({ loading: false, error: "Failed to fetch summary" });
    }
  },

  fetchOrderSummaryByMonth: async (year?: number) => {
    set({ loading: true, error: null });
    try {
      const url = new URL(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboard-reports/order-summary-by-month`
      );
      if (year && Number.isFinite(year)) url.searchParams.set("year", String(year));

      const res = await fetchWithAuth(url.toString());
      if (!res.ok) {
        const err = await safeParse(res);
        set({ loading: false, error: err.message || "Failed to fetch by month" });
        toast.error(err.message || "Failed to fetch by month");
        return;
      }
      const body: ApiEnvelope<OrderSummaryByMonthRow[]> = await res.json();
      set({ orderSummaryByMonth: body.data, loading: false });
    } catch (e) {
      set({ loading: false, error: "Failed to fetch by month" });
    }
  },

  fetchLateOrders: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboard-reports/late-orders`
      );
      if (!res.ok) {
        const err = await safeParse(res);
        set({ loading: false, error: err.message || "Failed to fetch late orders" });
        toast.error(err.message || "Failed to fetch late orders");
        return;
      }
      const body: ApiEnvelope<LateOrderRow[]> = await res.json();
      set({ lateOrders: body.data, loading: false });
    } catch (e) {
      set({ loading: false, error: "Failed to fetch late orders" });
    }
  },

  fetchTopClients: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboard-reports/top-clients`
      );
      if (!res.ok) {
        const err = await safeParse(res);
        set({ loading: false, error: err.message || "Failed to fetch top clients" });
        toast.error(err.message || "Failed to fetch top clients");
        return;
      }
      const body: ApiEnvelope<TopClientRow[]> = await res.json();
      set({ topClients: body.data, loading: false });
    } catch (e) {
      set({ loading: false, error: "Failed to fetch top clients" });
    }
  },

  fetchShipmentsSummary: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboard-reports/shipments-summary`
      );
      if (!res.ok) {
        const err = await safeParse(res);
        set({ loading: false, error: err.message || "Failed to fetch shipments" });
        toast.error(err.message || "Failed to fetch shipments");
        return;
      }
      const body: ApiEnvelope<ShipmentsSummaryData> = await res.json();
      set({ shipmentsSummary: body.data, loading: false });
    } catch (e) {
      set({ loading: false, error: "Failed to fetch shipments" });
    }
  },

  fetchStockLevels: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboard-reports/stock-levels`
      );
      if (!res.ok) {
        const err = await safeParse(res);
        set({ loading: false, error: err.message || "Failed to fetch stock levels" });
        toast.error(err.message || "Failed to fetch stock levels");
        return;
      }
      const body: ApiEnvelope<StockLevelsData> = await res.json();
      set({ stockLevels: body.data, loading: false });
    } catch (e) {
      set({ loading: false, error: "Failed to fetch stock levels" });
    }
  },

  fetchTopProducts: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboard-reports/top-products`
      );
      if (!res.ok) {
        const err = await safeParse(res);
        set({ loading: false, error: err.message || "Failed to fetch top products" });
        toast.error(err.message || "Failed to fetch top products");
        return;
      }
      const body: ApiEnvelope<TopProductRow[]> = await res.json();
      set({ topProducts: body.data, loading: false });
    } catch (e) {
      set({ loading: false, error: "Failed to fetch top products" });
    }
  },
}));

async function safeParse(res: Response): Promise<{ message?: string }> {
  try {
    const json = await res.json();
    return { message: (json && (json.message as string)) || undefined };
  } catch {
    return {};
  }
}

export default useDashboardReportsStore;


