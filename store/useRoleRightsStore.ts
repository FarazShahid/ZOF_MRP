
import { fetchWithAuth } from "@/src/app/services/authservice";
import toast from "react-hot-toast";
import { create } from "zustand";


interface GetAllDataResponse {
  data: RoleType[];
  statusCode: number;
  message: string;
}
interface GetAllAssignedRightsResponse {
  data: AssingedRights[];
  statusCode: number;
  message: string;
}

interface AssingedRights {
  group: string;
  permissions: {id: number, name: string}[]
}

interface RoleAndRightIdRepsonse {
  data: RoleType;
  statusCode: number;
  message: string;
}

interface RoleType {
    id: number;
    name: string;
    rightIds: number[]
} 
export interface AddRoleType {
    name: string;
    rightIds: number[]
}

interface StoreState {
  roles: RoleType[];
  assingedRights: AssingedRights[];
  roleById: RoleType | null;
  loading: boolean;
  error: string | null;
  isResolved: boolean;

  fetchRoles: () => Promise<void>;
  fetchAssingedRights: () => Promise<void>;
  getRoleById: (id: number) => Promise<void>;
  addRole: (
    roleData: AddRoleType,
    onSuccess: () => void
  ) => Promise<void>;
  updateRole: (
    id: number,
    roleData: AddRoleType,
    onSuccess: () => void
  ) => Promise<void>;
  deleteRole: (id: number, onSuccess: () => void) => Promise<void>;
}

const useRoleRightsStore = create<StoreState>((set, get) => ({
  roles: [],
  assingedRights:[],
  roleById: null,
  loading: false,
  error: null,
  isResolved: false,

  fetchRoles: async () => {
    set({ loading: true, error: null });

    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/roles-rights`
      );
      if (!response.ok) {
        set({ loading: false, error: "Error Fetching Data" });
        toast.error("Error Fetching Data");
      }
      const data: GetAllDataResponse = await response.json();
      set({ roles: data.data, loading: false });
    } catch (error) {
      console.error(error);
      set({ loading: false, error: "Error Fetching Data" });
      toast.error("Error Fetching Data");
    }
  },

  fetchAssingedRights: async () => {
    set({ loading: true, error: null });

    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/roles-rights/assigned-rights`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) {
        set({ loading: false, error: "Error Fetching Data" });
        toast.error("Error Fetching Data");
      }
      const data: GetAllAssignedRightsResponse = await response.json();
      set({ assingedRights: data.data, loading: false });
    } catch (error) {
      console.error(error);
      set({ loading: false, error: "Error Fetching Data" });
      toast.error("Error Fetching Data");
    }
  },

  getRoleById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/roles-rights/${id}`
      );
      const data: RoleAndRightIdRepsonse = await response.json();
      set({ roleById: data.data, loading: false });
    } catch (error) {
      console.error(error);
      set({ error: "Failed to fetch Data", loading: false });
      toast.error("Error Fetching Data");
    }
  },

  addRole: async (roleData: AddRoleType, onSuccess?: () => void) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/roles-rights`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(roleData),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        set({ loading: false, error: null });
        toast.error(error.message || "Failed to add role");
      } else {
        set({ loading: false, error: null, isResolved: true });
        toast.success("Role added successfully");
        if (onSuccess) onSuccess();
        await get().fetchRoles();
      }
    } catch (error) {
      console.error(error);
      set({ error: "Failed to add role", loading: false });
      toast.error("Failed to add role");
    }
  },

  updateRole: async (
    id: number,
    shiftData: AddRoleType,
    onSuccess?: () => void
  ) => {
    set({ loading: true, error: null, isResolved: false });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/roles-rights/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(shiftData),
        }
      );
      if (!response.ok) {
        const error = await response.json();
        set({ loading: false, error: null });
        toast.error(error.message || "Failed to update role");
      } else {
        set({ loading: false, error: null, isResolved: true });
        toast.success("Role update successfully");
        if (onSuccess) onSuccess();
        await get().fetchRoles();
      }
    } catch (error) {
      console.error(error);
      set({ error: "Failed to update role", loading: false });
      toast.error("Failed to update role");
    }
  },

  deleteRole: async (id: number, onSuccess?: () => void) => {
    set({ loading: true, error: null, isResolved: false });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/roles-rights/${id}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        const error = await response.json();
        set({ loading: false, error: null });
        toast.error(error.message || "Failed to delete role");
      } else {
        set({ loading: false, error: null, isResolved: true });
        toast.success("Role deleted successfully");
        if (onSuccess) onSuccess();
        await get().fetchRoles();
      }
    } catch (error) {
      console.error(error);
      set({ error: "Failed to delete role", loading: false });
      toast.error("Failed to delete role");
    }
  },
}));

export default useRoleRightsStore;
