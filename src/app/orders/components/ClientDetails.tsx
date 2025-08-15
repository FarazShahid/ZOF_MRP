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
    <div className="p-3  flex flex-col gap-5 dark:text-foreground text-gray-700 dark:bg-[#161616] bg-gray-100 rounded-2xl border-1 dark:border-slate-700 border-slate-300 shadow-lg">
      <p className="text-sm">Client</p>
      {loading ? (
        <Spinner />
      ) : (
        <div className="flex gap-1 flex-col text-xs">
          <span>{clientById?.Name}</span>
          <span className="dark:text-blue-300 text-blue-700">{clientById?.Email}</span>
          <span>{clientById?.Phone}</span>
        </div>
      )}
    </div>
  );
};

export default ClientDetails;
