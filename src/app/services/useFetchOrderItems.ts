import { useState, useEffect } from "react";
import { fetchWithAuth } from "./authservice";

export interface OrderItem {
  Id: number;
  OrderId: number;
  ProductId: number;
  ProductName: string;
  Description: string | null;
  ImageId: number | null;
  FileId: number | null;
  VideoId: number | null;
  CreatedOn: string;
  UpdatedOn: string;
}

interface UseOrderItemsResult {
  isLoading: boolean;
  error: string | null;
  orderItems: OrderItem[] | null;
}

export const useFetchOrderItems = (
  orderId: number | null
): UseOrderItemsResult => {
  const [orderItems, setOrderItems] = useState<OrderItem[] | null>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setOrderItems(null);
      setError(null);
      return;
    }

    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/items/${orderId}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch products:`);
        }
        const data = await response.json();
        setOrderItems(data);
      } catch (err: unknown) {
        setError((err as Error).message);
        setOrderItems(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [orderId]);

  return { isLoading, error, orderItems };
};
