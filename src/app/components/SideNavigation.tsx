"use client";

import { useState, useEffect } from "react";
import { Client } from "../interfaces";
import Spinner from "./Spinner";
import { fetchWithAuth } from "../services/authservice";

function SideNavigation() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClientId, setSelectedClientId] = useState("");

  const handleSelectedClinet = (clientId: string) => {
    setSelectedClientId(clientId);
  };

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/clients`);
        if (!response.ok) {
          throw new Error("Failed to fetch clients");
        }
        const data: Client[] = await response.json();
        setClients(data);
      } catch (err: unknown) {
        console.log("Error Fetching Clients")
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  return (
    <div id="default-sidebar" className="j-side-nav overflow-y-auto py-3">
      <label htmlFor="clients-list" className="text-xl font-bold px-5 my-3">
        Clients
      </label>
      {loading ? (
        <div className="flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <ul
          id="clients-list"
          className="custom-scrollbar flex w-full flex-col gap-2.5 text-sm h-full px-3 max-h-[calc(100vh-145px)]"
        >
          {clients?.map((client) => (
            <li
              key={client.Id}
              data-tooltip-target={client.Id}
              onClick={() => handleSelectedClinet(client.Id)}
              className={`min-h-[24.8px] px-1.5 py-0.5 border-b border-b-[#e0e0e0] hover:opacity-90 cursor-pointer hover:bg-[#cedfee] hover:rounded-xl truncate ${
                selectedClientId === client.Id ? "bg-[#c2e7ff] rounded-xl" : ""
              }`}
            >
              {client.Name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SideNavigation;
