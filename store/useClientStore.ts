import { fetchWithAuth } from "@/src/app/services/authservice";
import toast from "react-hot-toast";
import { create } from "zustand";


interface GetClientResponseType{
  data:GetClientsType[];
  statusCode: number;
  message: string;
}

interface GetClientsType {
  Id: number;
  Name: string;
  Email: string;
  Phone: string;
  City: string;
  State: string;
  Country: string;
  ClientStatusId: string;
  CompleteAddress: string;
  CreatedBy: string;
  CreatedOn: string;
}
export interface AddClientType{
    Name: string,
    Email: string,
    Phone: string,
    Country: string,
    State: string,
    City: string,
    CompleteAddress: string,
    ClientStatusId: string
}

interface ClientState {
  clients: GetClientsType[];
  clientById: GetClientsType | null;
  loading: boolean;
  error: string | null;
  isResolved: boolean;

  fetchClients: () => Promise<void>;
  getClientById: (id: number) => Promise<void>;
  addClient: (
    client: AddClientType,
    onSuccess: () => void
  ) => Promise<void>;
  updateClient: (
    id: number,
    client: AddClientType,
    onSuccess: () => void
  ) => Promise<void>;
  deleteclient: (id: number, onSuccess: () => void) => Promise<void>;
}

const useClientStore = create<ClientState>((set, get) => ({
  clients: [],
  clientById: null,
  loading: false,
  error: null,
  isResolved: false,

  fetchClients: async () => {
    set({ loading: true, error: null });

    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/clients`
      );
      if (!response.ok) {
        set({ loading: false, error: "Error Fetching Data" });
      }
      const data: GetClientResponseType = await response.json();
      set({ clients: data.data, loading: false });
    } catch (error) {
      toast.error("Error Fetching Data");
      set({ loading: false, error: "Error Fetching Data" });
    }
  },

  getClientById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/clients/${id}`
      );
      const data: GetClientsType = await response.json();
      set({ clientById: data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch client", loading: false });
    }
  },

  addClient: async (client: AddClientType, onSuccess?: () => void) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/clients`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(client),
        }
      );

      if (!response.ok) throw new Error("Failed to add client");
      set({ loading: false, error: null, isResolved: true });
      if (onSuccess) onSuccess();
      await get().fetchClients();
    } catch (error) {
      set({ error: "Failed to add client", loading: false });
    }
  },

  updateClient: async (
    id: number,
    updatedClient: AddClientType,
    onSuccess?: () => void
  ) => {
    set({ loading: true, error: null, isResolved: false });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/clients/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedClient),
        }
      );

      if (!response.ok) throw new Error("Failed to update client");
      set({ loading: false, error: null, isResolved: true });
      if (onSuccess) onSuccess();
      await get().fetchClients(); // Fetch latest data after update
    } catch (error) {
      set({ error: "Failed to update client", loading: false });
    }
  },

  deleteclient: async (id: number, onSuccess?: () => void) => {
    set({ loading: true, error: null, isResolved: false });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/clients/${id}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Failed to delete clients");
      set({ loading: false, error: null, isResolved: true });
      if (onSuccess) onSuccess();
      await get().fetchClients(); // Fetch latest data after deletion
    } catch (error) {
      set({ error: "Failed to delete clients", loading: false });
    }
  },
}));

export default useClientStore;
