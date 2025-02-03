import { useState, useEffect } from "react";
import { fetchWithAuth } from "./authservice";

export interface Client {
  Id: number;
  Name: string;
  Email: string;
  Phone: string;
  Country: string;
  State: string;
  City: string;
  CompleteAddress: string;
  ClientStatusId: string;
  CreatedOn: string;
  CreatedBy: string;
}
interface fetchClientType {
  clientId?: number;
}

export const useFetchClientById = ({ clientId }: fetchClientType) => {
  const [clientbyId, setClientById] = useState<Client | null>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clientId) {
      setClientById(null);
      setError(null);
      return;
    }

    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_API_URL}/clients/${clientId}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch client:`);
        }
        const data = await response.json();
        setClientById(data);
      } catch (err: unknown) {
        setError((err as Error).message);
        setClientById(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [clientId]);

  return { isLoading, error, clientbyId };
};
