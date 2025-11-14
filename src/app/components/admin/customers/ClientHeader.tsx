"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Props {
  name: string;
}

const ClientHeader: React.FC<Props> = ({ name }) => {
  return (
    <div className="flex items-center gap-4 mb-6">
      <Link
        href="/client"
        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
      </Link>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{name}</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Client Profile & Details</p>
      </div>
    </div>
  );
};

export default ClientHeader;


