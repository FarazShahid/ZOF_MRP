import { useState, useEffect } from "react";
import { fetchWithAuth } from "./authservice";

interface OrderItem {
  itemId: number;
  quantity: number;
}

interface Order {
  Id: number;
  ClientId: string;
  ClientName: string;
  OrderEventId: number;
  EventName: string;
  Description: string;
  OrderStatusId: number;
  StatusName: string;
  CreatedOn: string;
  Deadline: string;
  items: OrderItem[];
}

interface UseClientOrdersResult {
  isLoading: boolean;
  error: string | null;
  result: Order[] | null;
}

export const useClientOrders = (clientId: string | null): UseClientOrdersResult => {
  const [result, setResult] = useState<Order[] | null>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clientId) {
      setResult(null);
      setError(null);
      return;
    }

    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/orders/${clientId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch orders for client ID: ${clientId}`);
        }
        const data = await response.json();
        setResult(data);
      } catch (err: unknown) {
        setError((err as Error).message);
        setResult(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [clientId]);

  return { isLoading, error, result };
};
