import { create } from "zustand";
import toast from "react-hot-toast";
import { fetchWithAuth } from "@/src/app/services/authservice";

export interface QAChecklistItem {
  orderItemId: number;
  productId: number | null;
  measurementId: number | null;
  parameter: string;
  expected: string | null;
  observed: string | null;
  remarks: string | null;
  createdBy: string | null;
  createdOn: string; // ISO date string
  id: number;
}

export interface QAChecklistResponse {
  data: QAChecklistItem[];
}

export type QAChecklistCreateItem = {
  productId?: number;        // include ONLY for product rows
  measurementId?: number;    // include ONLY for measurement rows
  parameter: string;
  expected: string | null;
  observed: string | null;
  remarks: string | null;
};

interface QAStoreState {
  qaChecklist: QAChecklistItem[];
  productQAChecklist: QAChecklistItem[];
  measurementQAChecklist: QAChecklistItem[];
  loading: boolean;
  error: string | null;

  getQAChecklist: (
    orderItemId: number,
    productId?: number,
    measurementId?: number
  ) => Promise<void>;

  executeQAChecklist: (
    orderItemId: number,
    productId?: number,
    measurementId?: number
  ) => Promise<void>;

   createQAChecklist: (
    orderItemId: number,
    items: QAChecklistCreateItem[],
    opts?: { productId?: number; measurementId?: number }
  ) => Promise<void>;
}

const useQAchecklistStore = create<QAStoreState>((set, get) => ({
  qaChecklist: [],
  productQAChecklist: [],
  measurementQAChecklist: [],
  loading: false,
  error: null,

  getQAChecklist: async (orderItemId, productId, measurementId) => {
    set({ loading: true, error: null });
    try {
      const base = `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderItemId}/qa-checklist`;

      const res = await fetchWithAuth(base);
      const result: QAChecklistResponse = await res.json();

      if (!res.ok) {
        const message = (result as any)?.message || "Failed to fetch QA checklist";
        set({ loading: false, error: message });
        toast.error(message);
        return;
      }

      if (Array.isArray(result.data) && result.data.length > 0) {
        const items = result.data;
        set({
          qaChecklist: items,
          productQAChecklist: items.filter((i) => i.productId !== null),
          measurementQAChecklist: items.filter((i) => i.measurementId !== null && i.expected !== null && i.expected !== "0.00"),
          loading: false,
          error: null,
        });
      } else {
        await get().executeQAChecklist(orderItemId, productId, measurementId);
      }
    } catch {
      set({ loading: false, error: "Failed to fetch QA checklist" });
      toast.error("Failed to fetch QA checklist");
    }
  },

  executeQAChecklist: async (orderItemId) => {
    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderItemId}/execute-qa-checklist`,
      );

      const result: QAChecklistResponse = await res.json();

      if (!res.ok) {
        const message = (result as any)?.message || "Failed to execute QA checklist";
        set({ loading: false, error: message });
        toast.error(message);
        return;
      }

      const items = result.data ?? [];
      set({
        qaChecklist: items,
        productQAChecklist: items.filter((i) => i.productId !== null),
        measurementQAChecklist: items.filter((i) => i.measurementId !== null && i.expected !== null && i.expected !== "0.00"),
        loading: false,
        error: null,
      });
    } catch {
      set({ loading: false, error: "Failed to execute QA checklist" });
      toast.error("Failed to execute QA checklist");
    }
  },

   createQAChecklist: async (orderItemId, items, opts) => {
    // Validate input
    if (!Array.isArray(items) || items.length === 0) {
      toast.error("Nothing to save.");
      return;
    }

    // Split payload into product vs measurement (restriction: cannot send both in one request)
    const productItems: QAChecklistCreateItem[] = [];
    const measurementItems: QAChecklistCreateItem[] = [];
    const invalidItems: QAChecklistCreateItem[] = [];

    for (const it of items) {
      const hasProduct = typeof it.productId === "number";
      const hasMeasurement = typeof it.measurementId === "number";

      if (hasProduct && !hasMeasurement) productItems.push(it);
      else if (!hasProduct && hasMeasurement) measurementItems.push(it);
      else invalidItems.push(it); // either neither or both -> invalid
    }

    if (invalidItems.length > 0) {
      toast.error("Each item must target either a product OR a measurement (not both).");
      return;
    }

    set({ loading: true, error: null });

    const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderItemId}/qa-checklist`;
    const postBatch = async (batch: QAChecklistCreateItem[]) => {
      const res = await fetchWithAuth(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(batch),
      });
      let payload: any = null;
      try {
        payload = await res.json();
      } catch {
        // ignore non-JSON responses
      }
      if (!res.ok) {
        const message = payload?.message || "Failed to save QA checklist";
        throw new Error(message);
      }
    };

    try {
      if (productItems.length > 0) {
        await postBatch(productItems);
      }
      if (measurementItems.length > 0) {
        await postBatch(measurementItems);
      }

      // Refetch after save
      if (productItems.length > 0 && measurementItems.length === 0) {
        await get().getQAChecklist(orderItemId, opts?.productId, undefined);
      } else if (measurementItems.length > 0 && productItems.length === 0) {
        await get().getQAChecklist(orderItemId, undefined, opts?.measurementId);
      } else {
        // both kinds saved; fetch all (or you can choose to call twice with filters)
        await get().getQAChecklist(orderItemId);
      }

      toast.success("QA checklist saved.");
    } catch (err: any) {
      const message = err?.message || "Failed to save QA checklist";
      set({ error: message });
      toast.error(message);
    } finally {
      set({ loading: false });
    }
  },
}));

export default useQAchecklistStore;
