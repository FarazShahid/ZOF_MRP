"use client";

import { useState, useEffect } from "react";
import { Client } from "../interfaces";
import Spinner from "./Spinner";

const clientslist = [
  { Name: "John Doe", id: "1" },
  { Name: "Jane Smith", id: "2" },
  { Name: "Michael Johnson", id: "3" },
];

function SideNavigation() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [error, setError] = useState("");

  const handleSelectedClinet = (clientId: string) => {
    setSelectedClientId(clientId);
  };

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch("/api/clients");
        if (!response.ok) {
          throw new Error("Failed to fetch clients");
        }
        const data = await response.json();
        setClients(data);
      } catch (err: unknown) {
        setError((err as Error).message);
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
          {clientslist?.map((client, index) => (
            <li
              key={client.id}
              data-tooltip-target={client.id}
              onClick={() => handleSelectedClinet(client.id)}
              className={`min-h-[24.8px] px-1.5 py-0.5 border-b border-b-[#e0e0e0] hover:opacity-90 cursor-pointer hover:bg-[#cedfee] hover:rounded-xl truncate ${
                selectedClientId === client.id ? "bg-[#c2e7ff] rounded-xl" : ""
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
