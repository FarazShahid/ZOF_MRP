"use client";

import React from "react";

export default function ClientProfileFiles() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Files</h2>
        <button
          disabled
          className="px-5 py-2.5 bg-slate-700 text-slate-400 rounded-lg font-medium text-sm cursor-not-allowed whitespace-nowrap opacity-60"
        >
          <i className="ri-upload-line mr-2 w-4 h-4 inline-flex items-center justify-center"></i>
          Upload File (Coming Soon)
        </button>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 px-6 py-12 text-center text-slate-400">
        No files uploaded yet
      </div>
    </div>
  );
}
