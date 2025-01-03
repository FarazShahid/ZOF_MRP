import { useState, useEffect } from "react";
import { fetchWithAuth } from "../services/authservice";

interface OrderStatus {
  Id: number;
  StatusName: string;
  Description: string;
  CreatedOn: string;
  CreatedBy: string;
  UpdatedOn: string;
  UpdatedBy: string;
}

interface UseOrderStatusResult {
  isLoading: boolean;
  error: string | null;
  statuses: OrderStatus[];
}

export const useOrderStatus = (): UseOrderStatusResult => {
  const [statuses, setStatuses] = useState<OrderStatus[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderStatus = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/orderstatuses`);
        if (!response.ok) {
          throw new Error("Failed to fetch order statuses.");
        }
        const data: OrderStatus[] = await response.json();
        setStatuses(data);
      } catch (err: unknown) {
        setError((err as Error).message);
        setStatuses([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderStatus();
  }, []);

  return { isLoading, error, statuses };
};
