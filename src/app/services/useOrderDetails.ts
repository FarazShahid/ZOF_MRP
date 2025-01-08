import { useEffect, useState, useCallback  } from "react";
import { fetchWithAuth } from "./authservice";

interface OrderDetails {
  ClientId: number;
  OrderEventId: number;
  OrderPriority: number;
  Description: string;
  OrderStatusId: number;
  Deadline: string;
  OrderName: string;
  items: {
    Id: number,
    ProductId: number,
    Description: string,
    OrderItemPriority: number,
    ColorOptionId: number,
    OrderItemQuantity: number,
    ImageId: number,
    FileId: number,
    VideoId: number,
    printingOptions: {
        PrintingOptionId: number;
        Description: string;
      }[];
  }[];
}

export const useOrderDetails = (orderId?: number) => {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderDetails = useCallback(async () => {
    if (!orderId || orderId === 0 || orderId === null) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/get-edit/${orderId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch order details.");
      }

      const data: OrderDetails = await response.json();
      setOrderDetails(data);
    } catch (err: unknown) {
      setError((err as Error).message || "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);


  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  return {orderDetails, isLoading, error, refetch: fetchOrderDetails };
};
