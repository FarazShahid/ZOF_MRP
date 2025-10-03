import { fetchWithAuth } from "@/src/app/services/authservice";
import { create } from "zustand";

interface PermissionStore {
  permissions: number[];
  setPermissions: (perms: number[]) => void;
  fetchPermissionsByRole: () => Promise<void>;
}

const usePermissionStore = create<PermissionStore>((set) => ({
  permissions: [],

  setPermissions: (perms) => set({ permissions: perms }),

  fetchPermissionsByRole: async () => {
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/roles-rights/assigned-rights`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await response.json();


    const rightIds = data?.data?.flatMap((group: any) =>
      group.permissions.map((perm: any) => perm.id)
    ) || [];  

       set({ permissions: rightIds });
    } catch (error) {
      console.error("Failed to fetch permissions:", error);
    }
  },
}));

export default usePermissionStore;
