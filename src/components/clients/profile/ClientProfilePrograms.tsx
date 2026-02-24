"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProjectType } from "@/store/useClientStore";

interface ClientProfileProgramsProps {
  projects: ProjectType[];
  clientId: number;
}

export default function ClientProfilePrograms({
  projects,
  clientId,
}: ClientProfileProgramsProps) {
  const router = useRouter();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Programs & Events</h2>
        <button
          onClick={() => router.push(`/client/${clientId}`)}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors cursor-pointer whitespace-nowrap"
        >
          <i className="ri-add-line mr-2 w-4 h-4 inline-flex items-center justify-center"></i>
          Add Program
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {projects.length === 0 ? (
          <div className="bg-slate-800/50 rounded-2xl p-12 border border-slate-700 text-center text-slate-400">
            No programs or events yet
          </div>
        ) : (
          projects.map((program) => (
            <div
              key={program.Id}
              className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{program.Name}</h3>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${
                        program.isArchived
                          ? "bg-gray-500/20 text-gray-400 border-gray-500/30"
                          : "bg-green-500/20 text-green-400 border-green-500/30"
                      }`}
                    >
                      {program.isArchived ? "Archived" : "Active"}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mb-4">
                    {program.Description || "No description"}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Created</div>
                      <div className="text-slate-300">
                        {new Date(program.CreatedOn).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Updated</div>
                      <div className="text-slate-300">
                        {new Date(program.UpdatedOn).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
                <Link
                  href={`/client/${clientId}`}
                  className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer"
                  title="View"
                >
                  <i className="ri-eye-line w-4 h-4 flex items-center justify-center"></i>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
