import { useState, useEffect } from "react";
import { fetchWithAuth } from "./authservice";

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
          throw new Error("Failed to fetch events");
        }
        const data: Event[] = await response.json();
        setEvents(data);
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
