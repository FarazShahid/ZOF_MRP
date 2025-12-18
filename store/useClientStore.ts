import { fetchWithAuth } from "@/src/app/services/authservice";
import toast from "react-hot-toast";
import { create } from "zustand";

interface GetClientResponseType {
  data: GetClientsType[];
  statusCode: number;
  message: string;
}

interface ClinetByIdResponse {
  data: GetClientsType;
  statusCode: number;
  message: string;
}

export interface GetClientsType {
  Id: number;
  Name: string;
  Email: string;
  POCName?: string;
  Phone: string;
  POCEmail?: string;
  Website?: string;
  Linkedin?: string;
  Instagram?: string;
  City: string;
  State: string;
  Country: string;
  ClientStatusId: string;
  CompleteAddress: string;
  status?: string;
  CreatedBy: string;
  CreatedOn: string;
}
export interface AddClientType {
  Name: string;
  Email?: string;
  POCName?: string;
  Phone?: string;
  POCEmail?: string;
  Website?: string;
  Linkedin?: string;
  Instagram?: string;
  Country?: string;
  State?: string;
  City?: string;
  CompleteAddress?: string;
  ClientStatusId?: string;
}

interface ClientState {
  clients: GetClientsType[];
  clientById: GetClientsType | null;
  projects: ProjectType[];
  projectById: ProjectType | null;
  loading: boolean;
  error: string | null;
  isResolved: boolean;

  fetchClients: () => Promise<void>;
  getClientById: (id: number) => Promise<void>;
  addClient: (client: AddClientType, onSuccess: () => void) => Promise<void>;
  updateClient: (
    id: number,
    client: AddClientType,
    onSuccess: () => void
  ) => Promise<void>;
  deleteclient: (id: number, onSuccess: () => void) => Promise<void>;

  // Projects
  fetchProjects: (clientId?: number) => Promise<void>;
  getProjectById: (id: number) => Promise<void>;
  addProject: (project: AddProjectType, onSuccess?: () => void) => Promise<void>;
  updateProject: (
    id: number,
    project: AddProjectType,
    onSuccess?: () => void
  ) => Promise<void>;
  deleteProject: (id: number, onSuccess?: () => void) => Promise<void>;
}

// Projects
export interface AddProjectType {
  Name: string;
  ClientId: number;
  Description?: string;
}

export interface ProjectType {
  Id: number;
  Name: string;
  Description: string;
  ClientId: number;
  isArchived: boolean;
  CreatedOn: string;
  UpdatedOn: string;
  CreatedBy: string;
  UpdatedBy: string;
  client?: {
    Id: number;
    Name: string;
    Email: string;
    Phone: string;
    Country: string;
    State: string;
    City: string;
    CompleteAddress: string;
    ClientStatusId: string;
    POCName: string | null;
    POCEmail: string | null;
    Website: string | null;
    Linkedin: string | null;
    Instagram: string | null;
    CreatedOn: string | null;
    UpdatedOn: string;
    CreatedBy: string;
    UpdatedBy: string;
  };
}

interface GetProjectsResponseType {
  data: ProjectType[];
  statusCode: number;
  message: string;
  timestamp?: string;
}

interface ProjectByIdResponseType {
  data: ProjectType;
  statusCode: number;
  message: string;
  timestamp?: string;
}

const useClientStore = create<ClientState>((set, get) => ({
  clients: [],
  clientById: null,
  projects: [],
  projectById: null,
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
        toast.error("Fail to fetch data");
      }
      const data: GetClientResponseType = await response.json();
      set({ clients: data.data, loading: false });
    } catch (error) {
      toast.error("Fail to fetch data");
      set({ loading: false, error: "Error Fetching Data" });
    }
  },

  getClientById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/clients/${id}`
      );
      if (!response.ok) {
        set({ loading: false, error: "Error Fetching Data" });
        toast.error("Fail to fetch data");
      }
      const data: ClinetByIdResponse = await response.json();
      set({ clientById: data.data, loading: false });
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
      if (response.ok) {
        set({ loading: false, error: null, isResolved: true });
        toast.success("Client added successfully.");
        if (onSuccess) onSuccess();
        await get().fetchClients();
      } else {
        set({ loading: false, error: null, isResolved: false });
        const error = await response.json();
        toast.error(error.message || "Fail to add client");
      }
    } catch (error) {
      set({ error: "Failed to add client", loading: false });
      toast.error("Fail to add client");
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
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedClient),
        }
      );
      if (response.ok) {
        set({ loading: false, error: null, isResolved: true });
        toast.success("Client updated successfully.");
        if (onSuccess) onSuccess();
        await get().fetchClients();
      } else {
        set({ loading: false, error: null, isResolved: false });
        const error = await response.json();
        toast.error(error.message || "Fail to updated client");
      }
    } catch (error) {
      set({ error: "Failed to updated client", loading: false });
      toast.error("Fail to updated client");
    }
  },

  deleteclient: async (id: number, onSuccess?: () => void) => {
    set({ loading: true, error: null, isResolved: false });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/clients/${id}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        set({ loading: false, error: null, isResolved: true });
        toast.success("Client deleted successfully.");
        if (onSuccess) onSuccess();
        await get().fetchClients();
      } else {
        set({ loading: false, error: null, isResolved: false });
        const error = await response.json();
        toast.error(error.message || "Fail to delete client");
      }
    } catch (error) {
      set({ error: "Failed to delete client", loading: false });
      toast.error("Failed to delete client");
    }
  },

  // Projects
  fetchProjects: async (clientId?: number) => {
    set({ loading: true, error: null });
    try {
      // Build URL with optional clientId query parameter
      let url = `${process.env.NEXT_PUBLIC_API_URL}/projects`;
      if (clientId !== undefined && clientId !== null) {
        url += `?clientId=${clientId}`;
      }
      
      const response = await fetchWithAuth(url);
      if (!response.ok) {
        set({ loading: false, error: "Error Fetching Data" });
        const error = await response.json();
        toast.error(error.message || "Fail to fetch projects");
        return;
      }
      const data: GetProjectsResponseType = await response.json();
      set({ projects: data.data, loading: false });
    } catch (error) {
      set({ loading: false, error: "Error Fetching Data" });
      toast.error("Fail to fetch projects");
    }
  },

  getProjectById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/projects/${id}`
      );
      if (!response.ok) {
        set({ loading: false, error: "Error Fetching Data" });
        const error = await response.json();
        toast.error(error.message || "Fail to fetch project");
        return;
      }
      const data: ProjectByIdResponseType = await response.json();
      set({ projectById: data.data, loading: false });
    } catch (error) {
      set({ loading: false, error: "Error Fetching Data" });
      toast.error("Fail to fetch project");
    }
  },

  addProject: async (project: AddProjectType, onSuccess?: () => void) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/projects`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(project),
        }
      );
      const result = await response.json();
      if (!response.ok) {
        set({ loading: false, error: null });
        toast.error(result?.message || "Failed to add project");
        return;
      }
      set({ loading: false, error: null });
      toast.success("Project added successfully.");
      if (onSuccess) onSuccess();
      await get().fetchProjects();
    } catch (error) {
      set({ loading: false, error: "Failed to add project" });
      toast.error("Failed to add project");
    }
  },

  updateProject: async (
    id: number,
    project: AddProjectType,
    onSuccess?: () => void
  ) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/projects/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(project),
        }
      );
      const result = await response.json();
      if (!response.ok) {
        set({ loading: false, error: null });
        toast.error(result?.message || "Failed to update project");
        return;
      }
      set({ loading: false, error: null });
      toast.success("Project updated successfully.");
      if (onSuccess) onSuccess();
      await get().fetchProjects();
    } catch (error) {
      set({ loading: false, error: "Failed to update project" });
      toast.error("Failed to update project");
    }
  },

  deleteProject: async (id: number, onSuccess?: () => void) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/projects/${id}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        set({ loading: false, error: null });
        const error = await response.json();
        toast.error(error?.message || "Failed to delete project");
        return;
      }
      set({ loading: false, error: null });
      toast.success("Project deleted successfully.");
      if (onSuccess) onSuccess();
      await get().fetchProjects();
    } catch (error) {
      set({ loading: false, error: "Failed to delete project" });
      toast.error("Failed to delete project");
    }
  },
}));

export default useClientStore;
