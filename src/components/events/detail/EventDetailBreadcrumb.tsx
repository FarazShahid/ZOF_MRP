"use client";

import Link from "next/link";
import { Events } from "@/store/useEventsStore";

interface EventDetailBreadcrumbProps {
  event: Events;
}

export default function EventDetailBreadcrumb({ event }: EventDetailBreadcrumbProps) {
  return (
    <div className="flex items-center gap-2 mb-6 text-sm">
      <Link
        href="/events"
        className="text-slate-400 hover:text-white transition-colors"
      >
        Events
      </Link>
      <i className="ri-arrow-right-s-line text-slate-600 w-4 h-4 flex items-center justify-center"></i>
      <span className="text-white">{event.EventName}</span>
    </div>
  );
}
