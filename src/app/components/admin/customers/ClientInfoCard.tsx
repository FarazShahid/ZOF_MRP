"use client";

import React from "react";
import { Mail, Phone, MapPin, Globe } from "lucide-react";
import { GetClientsType } from "@/store/useClientStore";
import { getStatusColor } from "./clientHelpers";

const ClientInfoCard: React.FC<{ client: GetClientsType }> = ({ client }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-2xl font-bold">
            {client.Name.charAt(0)}
          </div>
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{client.Name}</h2>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${getStatusColor(client.status || "Active")}`}>
                {client.status || "Active"}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <Mail className="w-5 h-5 text-gray-500" />
                <span>{client.Email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <Phone className="w-5 h-5 text-gray-500" />
                <span>{client.Phone}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <MapPin className="w-5 h-5 text-gray-500" />
                <span>{client.CompleteAddress}</span>
              </div>
              {client.Website && (
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <Globe className="w-5 h-5 text-gray-500" />
                  <a href={client.Website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Visit Website
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientInfoCard;


