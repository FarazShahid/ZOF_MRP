"use client";

import React, { useState } from "react";

type Severity = "info" | "warning" | "critical";

interface EventItem {
  id: number;
  time: string;
  message: string;
  severity: Severity;
  acknowledged?: boolean;
}

const initialEvents: EventItem[] = [
  { id: 1, time: "10:12", message: "Order NK-44 moved to QA", severity: "info" },
  { id: 2, time: "09:54", message: "Shipment FX99881 pickup failed", severity: "warning" },
  { id: 3, time: "09:20", message: "Order AD-11 late by 10 days", severity: "critical" },
  { id: 4, time: "08:03", message: "New client onboarded: Puma", severity: "info" },
];

const badgeBySeverity: Record<Severity, string> = {
  info: "bg-blue-100 text-blue-700 dark:bg-white/[0.06] dark:text-blue-300",
  warning: "bg-yellow-100 text-yellow-700 dark:bg-white/[0.06] dark:text-yellow-300",
  critical: "bg-red-100 text-red-700 dark:bg-white/[0.06] dark:text-red-300",
};

const EventsStream: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>(initialEvents);

  const acknowledge = (id: number) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, acknowledged: true } : e)));
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-3 dark:border-[#1d2939] dark:from-white/[0.05] dark:to-transparent shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <span className="dark:text-white text-gray-900 font-medium">Events</span>
          <p className="text-xs text-gray-500">Recent system and operations updates</p>
        </div>
        <span className="text-xs text-gray-500">Auto-refresh off</span>
      </div>
      <div className="relative h-[320px] overflow-y-auto pr-1">
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200 dark:bg-white/10" />
        <div className="space-y-3">
          {events.map((e) => (
            <div key={e.id} className="relative pl-10">
              <div className="absolute left-3 top-2 h-3 w-3 rounded-full ring-2 ring-white dark:ring-black/40 ${badgeBySeverity[e.severity]}"></div>
              <div className="flex items-center justify-between rounded-xl bg-gray-100 p-2 ring-1 ring-gray-200/60 dark:bg-white/[0.06] dark:ring-white/10">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${badgeBySeverity[e.severity]}`}>{e.severity}</span>
                  <span className="text-xs text-gray-500">{e.time}</span>
                  <span className="text-sm dark:text-white text-gray-900">{e.message}</span>
                </div>
                <div>
                  <button
                    disabled={e.acknowledged}
                    onClick={() => acknowledge(e.id)}
                    className={`text-xs px-2 py-1 rounded-full ring-1 ${
                      e.acknowledged
                        ? "ring-gray-200 text-gray-400"
                        : "ring-blue-200 text-blue-600 hover:bg-blue-50 dark:hover:bg-white/[0.06]"
                    }`}
                  >
                    {e.acknowledged ? "Ack'd" : "Acknowledge"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventsStream;


