import { useState, useEffect } from "react";
import { fetchWithAuth } from "./authservice";

export interface Client {
    Id: number;
    Name: string;
    Email: string;
    Phone: string;
    Country: string;
    State: string;
    City:string;
    CompleteAddress:string;
    ClientStatusId:string;
    CreatedOn:string;
    CreatedBy: string;
}

interface fetchClientsType{
  refreshKey?: number;
}


export const useFetchClients = ({refreshKey}: fetchClientsType) => {
  const [client, setClient] = useState<Client[] | null>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/clients`);
        if (!response.ok) {
          throw new Error(`Failed to fetch clients:`);
        }
        const data = await response.json();
        setClient(data);
      } catch (err: unknown) {
        setError((err as Error).message);
        setClient(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [refreshKey]);

  return { isLoading, error, client };
};
