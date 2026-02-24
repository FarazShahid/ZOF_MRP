"use client";

import React from "react";

export default function EventDetailFilesTab() {
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
        <span className="text-sm text-slate-400">0 files</span>
        <button
          disabled
          className="px-4 py-2 bg-slate-700 text-slate-400 rounded-lg font-medium text-sm cursor-not-allowed whitespace-nowrap opacity-60"
        >
          <i className="ri-upload-2-line mr-1.5 w-4 h-4 inline-flex items-center justify-center"></i>
          Upload File (Coming Soon)
        </button>
      </div>
      <div className="px-6 py-12 text-center text-slate-400">
        No files uploaded yet
      </div>
    </div>
  );
}
