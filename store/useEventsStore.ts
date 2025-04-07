import { fetchWithAuth } from "@/src/app/services/authservice";
import toast from "react-hot-toast";
import { create } from "zustand";

interface GetEventsResponse {
  data: Events[];
  statusCode: number;
  message: string;
}

interface AddEventsResponse {
  data: Events;
  statusCode: number;
  message: string;
}

interface Events {
  Id: number;
  EventName: string;
  Description: string;
  CreatedBy: string;
  CreatedOn: string;
  UpdatedOn: string;
  UpdatedBy: string;
}
export interface AddEvent {
  EventName: string;
  Description: string;
}

interface StoreState {
  Events: Events[];
  eventById: Events | null;
  loading: boolean;
  error: string | null;

  fetchEvents: () => Promise<void>;
  getEventsById: (id: number) => Promise<void>;
  addEvent: (
    eventById: AddEvent,
    onSuccess: () => void
  ) => Promise<void>;
  updateEvent: (
    id: number,
    eventById: AddEvent,
    onSuccess: () => void
  ) => Promise<void>;
  deleteEvent: (id: number, onSuccess: () => void) => Promise<void>;
}

const useEventsStore = create<StoreState>((set, get) => ({
  Events: [],
  eventById: null,
  loading: false,
  error: null,

  fetchEvents: async () => {
    set({ loading: true, error: null });

    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/events`
      );
      if (!response.ok) {
        set({ loading: false, error: "Error Fetching Data" });
      }
      const data: GetEventsResponse = await response.json();
      set({ Events: data.data, loading: false });
    } catch (error) {
      set({ loading: false, error: "Error Fetching Data" });
    }
  },

  getEventsById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/events/${id}`
      );
      if (!response.ok) {
        const error = await response.json();
        set({ loading: false, error: null });
        toast.error(error.message || "Failed to fetch event");
      }
      const data: AddEventsResponse = await response.json();
      set({ eventById: data.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch event", loading: false });
      toast.error("Failed to fetch event");
    }
  },

  addEvent: async (eventData: AddEvent, onSuccess?: () => void) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/events`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventData),
        }
      );
      if (!response.ok) {
        const error = await response.json();
        set({ loading: false, error: null });
        toast.error(error.message || "Failed to add event");
      } else {
        set({ loading: false, error: null });
        toast.success("Event added successfully");
        if (onSuccess) onSuccess();
        await get().fetchEvents();
      }
    } catch (error) {
      set({ error: "Failed to Event", loading: false });
      toast.error("Failed to Event");
    }
  },

  updateEvent: async (
    id: number,
    updatedEvent: AddEvent,
    onSuccess?: () => void
  ) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/events/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedEvent),
        }
      );
      if (!response.ok) {
        const error = await response.json();
        set({ loading: false, error: null });
        toast.error(error.message || "Failed to update event");
      } else {
        set({ loading: false, error: null });
        toast.success("Event updated successfully");
        if (onSuccess) onSuccess();
        await get().fetchEvents();
      }
    } catch (error) {
      set({ error: "Failed to update event", loading: false });
      toast.error("Failed to update event");
    }
  },

  deleteEvent: async (id: number, onSuccess?: () => void) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/events/${id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const error = await response.json();
        set({ loading: false, error: null });
        toast.error(error.message || "Failed to delete event");
      } else {
        set({ loading: false, error: null });
        toast.success("Event deleted successfully");
        if (onSuccess) onSuccess();
        await get().fetchEvents();
      }
    } catch (error) {
      set({ error: "Failed to delete event", loading: false });
      toast.error("Failed to delete event");
    }
  },
}));

export default useEventsStore;
