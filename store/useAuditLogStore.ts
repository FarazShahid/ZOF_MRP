// /store/useAuditLogStore.ts
import { fetchWithAuth } from "@/src/app/services/authservice";
import toast from "react-hot-toast";
import { create } from "zustand";

export interface AuditLogEntry {
  log_id: number;
  log_module: string;
  log_action: string;
  log_details: string;
  log_entityId: number | null;
  log_ip: string;
  log_device: string;
  log_createdAt: string; // ISO string
  userId: number;
  Email: string;
}

export interface GetAuditLogResponse {
  data: AuditLogEntry[];
  statusCode: number;
  message: string;
}

export interface StoreState {
  logs: AuditLogEntry[];
  selectedLog: AuditLogEntry | null;
  loading: boolean;
  error: string | null;
  fetchAuditLogs: () => Promise<void>;
}

const useAuditLogStore = create<StoreState>((set) => ({
  logs: [],
  selectedLog: null,
  loading: false,
  error: null,

  fetchAuditLogs: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/audit-logs`
      );

      if (!response.ok) {
        let errMsg = "Error fetching audit logs";
        try {
          const e = await response.json();
          errMsg = e.message || errMsg;
        } catch {}
        set({ loading: false, error: errMsg });
        toast.error(errMsg);
        return;
      }

      const data: GetAuditLogResponse = await response.json();
      set({ logs: data.data ?? [], loading: false });
    } catch {
      set({ loading: false, error: "Error fetching audit logs" });
      toast.error("Error fetching audit logs");
    }
  },
}));

export default useAuditLogStore;
