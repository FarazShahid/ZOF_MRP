import { fetchWithAuth } from "@/src/app/services/authservice";
import toast from "react-hot-toast";
import { create } from "zustand";


interface GetAllDataResponseType{
  data:GetUsersType[];
  statusCode: number;
  message: string;
}

interface UserByIdResponse{
  data:GetUsersType;
  statusCode: number;
  message: string;
}

export interface GetUsersType {
    Id: number;
    Name?: string;
    Email: string;
    Password: string;
    isActive: boolean;
    status?: string;
    role?: string;
    avatar?: string;
    lastLogin?: string;
    CreatedOn: string;
    UpdatedOn: string;
}
export interface AddUserType{
    Email: string,
    Password: string,
    isActive: boolean,
}

interface StoreState {
  users: GetUsersType[];
  userById: GetUsersType | null;
  loading: boolean;
  error: string | null;
  isResolved: boolean;

  fetchUsers: () => Promise<void>;
  getUserById: (id: number) => Promise<void>;
  addUser: (
    user: AddUserType,
    onSuccess: () => void
  ) => Promise<void>;
  updateUser: (
    id: number,
    user: AddUserType,
    onSuccess: () => void
  ) => Promise<void>;
  deleteUser: (id: number, onSuccess: () => void) => Promise<void>;
}

const useUserStore = create<StoreState>((set, get) => ({
    users: [],
    userById: null,
  loading: false,
  error: null,
  isResolved: false,

  fetchUsers: async () => {
    set({ loading: true, error: null });

    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/users`
      );
      if (!response.ok) {
        set({ loading: false, error: "Error Fetching Data" });
        toast.error("Fail to fetch data");
      }
      const data: GetAllDataResponseType = await response.json();
      set({ users: data.data, loading: false });
    } catch (error) {
      toast.error("Fail to fetch data");
      set({ loading: false, error: "Error Fetching Data" });
    }
  },

  getUserById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`
      );
      if(!response.ok){
        set({ loading: false, error: "Error Fetching Data" });
        toast.error("Fail to fetch data");
      }
      const data: UserByIdResponse = await response.json();
      set({ userById: data.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch data", loading: false });
    }
  },

  addUser: async (user: AddUserType, onSuccess?: () => void) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/users`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        }
      );
      if(response.ok){
        set({ loading: false, error: null, isResolved: true });
        toast.success("User added successfully.");
        if (onSuccess) onSuccess();
        await get().fetchUsers();
      }else{
        set({ loading: false, error: null, isResolved: false });
        const error = await response.json();
        toast.error(error.message || "Fail to add user");
      }
    } catch (error) {
      set({ error: "Failed to add user", loading: false });
      toast.error("Fail to add user");
    }
  },

  updateUser: async (
    id: number,
    updatedUser: AddUserType,
    onSuccess?: () => void
  ) => {
    set({ loading: true, error: null, isResolved: false });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedUser),
        }
      );
      if(response.ok){
        set({ loading: false, error: null, isResolved: true });
        toast.success("User updated successfully.");
        if (onSuccess) onSuccess();
        await get().fetchUsers();
      }else{
        set({ loading: false, error: null, isResolved: false });
        const error = await response.json();
        toast.error(error.message || "Fail to updated User");
      }
    } catch (error) {
      set({ error: "Failed to updated User", loading: false });
      toast.error("Fail to updated User");
    }
  },

  deleteUser: async (id: number, onSuccess?: () => void) => {
    set({ loading: true, error: null, isResolved: false });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
        { method: "DELETE" }
      );

      if (response.ok){
        set({ loading: false, error: null, isResolved: true });
        toast.success("User deleted successfully.")
        if (onSuccess) onSuccess();
        await get().fetchUsers();
      }else{
        set({ loading: false, error: null, isResolved: false });
        const error = await response.json();
        toast.error(error.message || "Fail to delete user");
      }
      
    } catch (error) {
      set({ error: "Failed to delete user", loading: false });
      toast.error("Failed to delete user");
    }
  },
}));

export default useUserStore;
