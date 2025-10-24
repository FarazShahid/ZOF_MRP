import React, { FC } from "react";

interface WidgetProps {
  icon: React.ReactNode;
  title: string;
  number: string;
}

const Widget: FC<WidgetProps> = ({ icon, title, number }) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/60 bg-white/70 p-4 backdrop-blur-md shadow-sm ring-1 ring-black/5 transition-all hover:-translate-y-0.5 hover:shadow-xl dark:border-white/10 dark:bg-white/[0.04] dark:ring-white/5">
      {/* soft ambient accents */}
      <div className="pointer-events-none absolute -top-10 right-0 h-28 w-28 rounded-full bg-gradient-to-tr from-indigo-400/10 to-fuchsia-400/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-8 h-32 w-32 rounded-full bg-gradient-to-tr from-cyan-400/10 to-violet-400/10 blur-2xl" />

      {/* header */}
      <div className="flex items-center justify-between">
        <div className="rounded-xl p-2.5 ring-1 ring-black/5 bg-white/60 shadow-sm text-gray-700 dark:bg-white/[0.06] dark:text-gray-200 dark:ring-white/10">
          {icon}
        </div>
        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-indigo-500/15 to-purple-500/15 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <span className="mt-2 text-[11px] tracking-widest text-gray-500/90 uppercase">
        {title}
      </span>

      <div className="mt-1 flex items-end justify-between gap-3">
        <span className="text-3xl font-semibold tracking-tight text-gray-900 tabular-nums drop-shadow-sm dark:text-white">
          {number}
        </span>
        <span className="h-1.5 w-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-70 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* bottom glow */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};

export default Widget;
