import { useState, useEffect } from "react";
import { fetchWithAuth } from "../services/authservice";

interface User {
  Id: number;
  Email: string;
  Password: string;
  CreatedOn: string;
  isActive: boolean;
}

interface UseUserResult {
  isLoading: boolean;
  error: string | null;
  user: User | null;
}

export const useUser = (): UseUserResult => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // TODO: change the endpoint
        const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/users/1`);
        if (!response.ok) {
          throw new Error("Failed to fetch user information.");
        }
        const data: User = await response.json();
        setUser(data);
      } catch (err: unknown) {
        setError((err as Error).message);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { isLoading, error, user };
};
