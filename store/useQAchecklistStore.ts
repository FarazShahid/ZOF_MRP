import { create } from "zustand";
import toast from "react-hot-toast";
import { fetchWithAuth } from "@/src/app/services/authservice";

interface QAStoreState {
  loading: boolean;
  error: string | null;
  downloadQAChecklistZip: (orderId: number, itemIds: number[]) => Promise<void>;
}

const useQAchecklistStore = create<QAStoreState>((set, get) => ({
  qaChecklist: [],
  productQAChecklist: [],
  measurementQAChecklist: [],
  loading: false,
  error: null,

  downloadQAChecklistZip: async (orderId, itemIds) => {
    // basic validation
    if (!orderId || !Number.isFinite(orderId)) {
      toast.error("Invalid order id.");
      return;
    }
    if (!Array.isArray(itemIds) || itemIds.length === 0) {
      toast.error("Select at least one order item.");
      return;
    }

    const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/qa-checklist-zip`;

    // helper to extract filename from Content-Disposition
    const getFilenameFromHeader = (cd?: string | null) => {
      if (!cd) return null;
      // handles: attachment; filename="some name.zip"
      const match = /filename\*?=(?:UTF-8'')?"?([^\";]+)"?/i.exec(cd);
      if (match?.[1]) {
        try {
          // decode RFC5987 if present
          return decodeURIComponent(match[1]);
        } catch {
          return match[1];
        }
      }
      return null;
    };

    try {
      set({ loading: true, error: null });

      const res = await fetchWithAuth(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemIds }),
      });

      if (!res.ok) {
        // try to surface server message if sent as JSON
        let msg = `Failed to download QA checklist (HTTP ${res.status})`;
        try {
          const j = await res.json();
          if (j?.message) msg = j.message;
        } catch {}
        throw new Error(msg);
      }

      const blob = await res.blob();
      if (!blob || blob.size === 0) {
        throw new Error("Empty file received.");
      }

      const cd = res.headers.get("content-disposition");
      const fallbackName = `order-${orderId}-checklists.zip`;
      const filename = getFilenameFromHeader(cd) || fallbackName;

      // trigger browser download
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      toast.success("QA checklist ZIP downloaded.");
    } catch (err: any) {
      const message = err?.message || "Failed to download QA checklist ZIP.";
      set({ error: message });
      toast.error(message);
    } finally {
      set({ loading: false });
    }
  },
}));

export default useQAchecklistStore;
