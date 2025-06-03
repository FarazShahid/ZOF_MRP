import useClientStore from "@/store/useClientStore";
import { Spinner } from "@heroui/react";
import React, { FC, useEffect } from "react";

interface ClientDetailsProp {
  clientId: number;
}

const ClientDetails: FC<ClientDetailsProp> = ({ clientId }) => {
  const { loading, clientById, getClientById } = useClientStore();

  useEffect(() => {
    if (clientId > 0) {
      getClientById(clientId);
    }
  }, [clientId]);
  return (
    <div className="p-3 bg-[#161616] shadow-lg  flex flex-col gap-5 rounded text-gray-400">
      <p className="text-sm">Client</p>
      {loading ? (
        <Spinner />
      ) : (
        <div className="flex gap-1 flex-col text-xs">
          <span>{clientById?.Name}</span>
          <span className="text-blue-700">{clientById?.Email}</span>
          <span>{clientById?.Phone}</span>
        </div>
      )}
    </div>
  );
};

export default ClientDetails;
