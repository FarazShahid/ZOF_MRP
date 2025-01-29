"use client";

import { useState, Dispatch, SetStateAction } from "react";
import Spinner from "./Spinner";
import { Tooltip } from "@heroui/react";
import { useFetchClients } from "../services/useFetchClients";

interface SideNavigationProps {
  onClientSelect: (id: number) => void;
  isSideNavOpen: boolean;
  setIsSideNavOpen: Dispatch<SetStateAction<boolean>>;
}

const SideNavigation: React.FC<SideNavigationProps> = ({
  onClientSelect,
  isSideNavOpen,
  setIsSideNavOpen,
}) => {

  const [refreshKey, setRefreshkey] = useState(1);
  const {client, isLoading} = useFetchClients({refreshKey});
  const [selectedClientId, setSelectedClientId] = useState<number>();

  const handleSelectedClinet = (clientId: number) => {
    onClientSelect(clientId);
    setSelectedClientId(clientId);
  };
  return (
    <div className="flex h-full">
      <div
        id="default-sidebar"
        className="hidden xl:flex j-side-nav overflow-y-auto py-3"
      >
        <label htmlFor="clients-list" className="text-xl font-bold px-5 my-3">
          Clients
        </label>
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <ul
            id="clients-list"
            className="custom-scrollbar flex w-full flex-col gap-2.5 text-sm h-full px-3 max-h-[calc(100vh-145px)]"
          >
            {client?.map((client) => (
              <Tooltip key={client.Id} content={client.Name}>
                <li
                  key={client.Id}
                  data-tooltip-target={client.Id}
                  onClick={() => handleSelectedClinet(client.Id)}
                  className={`min-h-[24.8px] px-1.5 py-0.5 border-b border-b-[#e0e0e0] hover:opacity-90 cursor-pointer hover:bg-[#cedfee] hover:rounded-xl truncate ${
                    selectedClientId === client.Id
                      ? "bg-[#c2e7ff] rounded-xl"
                      : ""
                  }`}
                >
                  {client.Name}
                </li>
              </Tooltip>
            ))}
          </ul>
        )}
      </div>
      {isSideNavOpen && (
        <div
          id="default-sidebar"
          className="j-side-nav overflow-y-auto py-3 absolute !w-full h-full"
        >
          <div className="flex w-full justify-between items-center pr-3">
            <label
              htmlFor="clients-list"
              className="text-xl font-bold px-5 my-3"
            >
              Clients
            </label>
            <button
              className="min-w-4 min-h-4 flex justify-center items-center bg-gray-400 rounded-full p-1.5"
              onClick={() => setIsSideNavOpen(false)}
            >
              <img className="w-2.5 h-auto" src="/crossIcon.svg" />
            </button>
          </div>
          {isLoading ? (
            <div className="flex w-full h-full justify-center items-center">
              <Spinner />
            </div>
          ) : (
            <ul
              id="clients-list"
              className="custom-scrollbar flex w-full flex-col gap-2.5 text-sm h-full px-3 max-h-[calc(100vh-145px)]"
            >
              {client?.map((client) => (
                <li
                  key={client.Id}
                  data-tooltip-target={client.Id}
                  onClick={() => handleSelectedClinet(client.Id)}
                  className={`min-h-[24.8px] px-1.5 py-0.5 border-b border-b-[#e0e0e0] hover:opacity-90 cursor-pointer hover:bg-[#cedfee] hover:rounded-xl truncate ${
                    selectedClientId === client.Id
                      ? "bg-[#c2e7ff] rounded-xl"
                      : ""
                  }`}
                >
                  {client.Name}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default SideNavigation;
