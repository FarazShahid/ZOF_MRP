import { useState, useEffect } from "react";
import { fetchWithAuth } from "./authservice";
import toast from "react-hot-toast";

interface GetEventsRepsonse{
  data: Event[];
}


interface Event {
  Id: number;
  EventName: string;
  Description: string;
}

const useClientEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetchWithAuth( `${process.env.NEXT_PUBLIC_API_URL}/events`);
        if (!response.ok) {
          const error = await response.json();
          setIsLoading(false);
          toast.error(error.message || "Fail to fetch available colors");
        }
        const data: GetEventsRepsonse = await response.json();
        setEvents(data.data);
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching events");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return { events, isLoading, error };
};

export default useClientEvents;
