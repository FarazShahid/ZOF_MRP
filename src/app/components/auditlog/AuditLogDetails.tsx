"use client";

import React from "react";
import ModalLayout, { ModalBody, ModalFooter, ModalHeader } from "../ModalLayout/ModalLayout";
import { AuditLogEntry } from "@/store/useAuditLogStore";
import { CiClock2, CiGlobe, CiMonitor } from "react-icons/ci";
import { GoDatabase } from "react-icons/go";
import { FiUser, FiActivity, FiHash } from "react-icons/fi";

interface AuditLogDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  log: AuditLogEntry | null;
}

const formatDateTime = (iso: string) => {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
    time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
  };
};

export const AuditLogDetails: React.FC<AuditLogDetailsProps> = ({ isOpen, onClose, log }) => {
  const getActionBadgeClass = (action: string) => {
    const a = action.toLowerCase();
    if (a.includes("delete")) return "bg-red-100 text-red-700 border-red-200";
    if (a.includes("create") || a.includes("insert")) return "bg-green-100 text-green-700 border-green-200";
    if (a.includes("update") || a.includes("edit") || a.includes("change")) return "bg-amber-100 text-amber-700 border-amber-200";
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  const tryParseJson = (text: string | null | undefined): any | null => {
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  };

  const isBeforeAfterShape = (v: any) => v && typeof v === "object" && ("before" in v) && ("after" in v);
  const isChangesArray = (v: any) => Array.isArray(v) && v.every((x) => x && typeof x === "object" && ("field" in x) && ("before" in x) && ("after" in x));

  const renderKV = (obj: any, parentKey = "") => {
    if (obj === null || obj === undefined) return (
      <div className="text-xs text-gray-400">null</div>
    );
    if (typeof obj !== "object") {
      return <div className="text-sm font-medium break-words">{String(obj)}</div>;
    }
    const entries = Object.entries(obj);
    return (
      <div className="space-y-2">
        {entries.map(([k, v]) => {
          const keyPath = parentKey ? `${parentKey}.${k}` : k;
          return (
            <div key={keyPath} className="grid grid-cols-3 gap-3">
              <div className="col-span-1 text-xs text-gray-500 break-words">{k}</div>
              <div className="col-span-2 break-words">{renderKV(v, keyPath)}</div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderDiffRows = (before: any, after: any) => {
    // If primitives, show simple row
    if (typeof before !== "object" || typeof after !== "object" || !before || !after) {
      return (
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="text-gray-500">Value</div>
          <div className="bg-red-50 border border-red-200 rounded p-2 break-words">{String(before)}</div>
          <div className="bg-green-50 border border-green-200 rounded p-2 break-words">{String(after)}</div>
        </div>
      );
    }
    const keys = Array.from(new Set([...Object.keys(before), ...Object.keys(after)]));
    return (
      <div className="space-y-2">
        {keys.map((k) => (
          <div key={k} className="grid grid-cols-3 gap-3 text-sm items-start">
            <div className="text-gray-600 font-medium break-words">{k}</div>
            <div className="bg-red-50 border border-red-200 rounded p-2 break-words">{typeof before?.[k] === "object" ? JSON.stringify(before?.[k], null, 2) : String(before?.[k] ?? "")}</div>
            <div className="bg-green-50 border border-green-200 rounded p-2 break-words">{typeof after?.[k] === "object" ? JSON.stringify(after?.[k], null, 2) : String(after?.[k] ?? "")}</div>
          </div>
        ))}
      </div>
    );
  };

  const renderDetails = (raw: string) => {
    const parsed = tryParseJson(raw);
    if (!parsed) {
      return (
        <div className="text-sm whitespace-pre-wrap break-words border rounded-md p-3 bg-gray-50">{raw || "—"}</div>
      );
    }
    if (isBeforeAfterShape(parsed)) {
      return (
        <div className="space-y-3">
          <div className="text-xs text-gray-500">Changes</div>
          {renderDiffRows(parsed.before, parsed.after)}
        </div>
      );
    }
    if (isChangesArray(parsed)) {
      return (
        <div className="space-y-3">
          <div className="text-xs text-gray-500">Changes</div>
          <div className="space-y-2">
            {parsed.map((c: any, idx: number) => (
              <div key={idx} className="border border-gray-200 rounded-md p-3">
                <div className="text-xs text-gray-500 mb-1">{c.field}</div>
                {renderDiffRows(c.before, c.after)}
              </div>
            ))}
          </div>
        </div>
      );
    }
    // Generic object/array -> key/value view
    return (
      <div className="space-y-2">
        {renderKV(parsed)}
      </div>
    );
  };

  return (
    <ModalLayout isOpen={isOpen} onClose={onClose} classNames="w-[95vw] max-w-2xl">
      <ModalHeader onClose={onClose} title="Audit Log Details" />
      <ModalBody>
        {!log ? (
          <div className="text-gray-500">No log selected.</div>
        ) : (
          <div className="space-y-4">
            {/* Header badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2 py-0.5 rounded-full border text-xs ${getActionBadgeClass(log.action)}`}>
                {log.action}
              </span>
              {log.module && (
                <span className="px-2 py-0.5 rounded-full border text-xs bg-gray-50 text-gray-700 border-gray-200">
                  {log.module}
                </span>
              )}
              {typeof log.entityId !== "undefined" && log.entityId !== null && (
                <span className="px-2 py-0.5 rounded-full border text-xs bg-gray-50 text-gray-700 border-gray-200 flex items-center gap-1">
                  <FiHash className="w-3 h-3" />
                  {String(log.entityId)}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <CiClock2 className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-xs text-gray-500">Date</div>
                  <div className="text-sm font-medium">{formatDateTime(log.createdAt).date}</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CiClock2 className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-xs text-gray-500">Time</div>
                  <div className="text-sm font-medium">{formatDateTime(log.createdAt).time}</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <GoDatabase className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-xs text-gray-500">Module</div>
                  <div className="text-sm font-medium">{log.module}</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <FiActivity className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-xs text-gray-500">Action</div>
                  <div className="text-sm font-medium">{log.action}</div>
                </div>
              </div>
              <div className="flex items-start gap-2 sm:col-span-2">
                <FiUser className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-xs text-gray-500">User (Email)</div>
                  <div className="text-sm font-medium break-all">{log.Email}</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <FiUser className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-xs text-gray-500">User ID</div>
                  <div className="text-sm font-medium">{log.userId}</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <FiHash className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-xs text-gray-500">Entity ID</div>
                  <div className="text-sm font-medium">{log.entityId ?? "—"}</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CiGlobe className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-xs text-gray-500">IP Address</div>
                  <div className="text-sm font-medium">{log.log_ip}</div>
                </div>
              </div>
              <div className="flex items-start gap-2 sm:col-span-2">
                <CiMonitor className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-xs text-gray-500">Device</div>
                  <div className="text-sm font-medium break-all">{log.device}</div>
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-1">Details</div>
              {renderDetails(log.details)}
            </div>
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
        >
          Close
        </button>
      </ModalFooter>
    </ModalLayout>
  );
};

export default AuditLogDetails;


