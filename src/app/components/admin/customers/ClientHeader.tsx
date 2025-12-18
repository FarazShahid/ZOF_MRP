"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Props {
  name: string;
}

const ClientHeader: React.FC<Props> = ({ name }) => {
	return (
		<div className="relative rounded-xl overflow-hidden mb-6">
			<div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-800 dark:via-slate-800 dark:to-slate-800" />
			<div className="relative flex items-center gap-4 p-4">
				<Link
					href="/client"
					className="p-2 hover:bg-white/70 dark:hover:bg-slate-700/60 rounded-lg transition-colors"
					aria-label="Back to Clients"
				>
					<ArrowLeft className="w-5 h-5" />
				</Link>
				<div>
					<h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{name}</h1>
					<p className="text-gray-600 dark:text-gray-400 mt-1 text-sm md:text-base">
						Client Profile & Details
					</p>
				</div>
			</div>
		</div>
	);
};

export default ClientHeader;


