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
    if (a.includes("delete")) return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30";
    if (a.includes("create") || a.includes("insert")) return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
    if (a.includes("update") || a.includes("edit") || a.includes("change")) return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30";
    return "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/30";
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
      <div className="text-xs text-gray-400 dark:text-slate-500">null</div>
    );
    if (typeof obj !== "object") {
      return <div className="text-sm font-medium text-gray-900 dark:text-white break-words">{String(obj)}</div>;
    }
    const entries = Object.entries(obj);
    return (
      <div className="space-y-2">
        {entries.map(([k, v]) => {
          const keyPath = parentKey ? `${parentKey}.${k}` : k;
          return (
            <div key={keyPath} className="grid grid-cols-3 gap-3">
              <div className="col-span-1 text-xs text-gray-500 dark:text-slate-400 break-words">{k}</div>
              <div className="col-span-2 break-words">{renderKV(v, keyPath)}</div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderDiffRows = (before: any, after: any) => {
    if (typeof before !== "object" || typeof after !== "object" || !before || !after) {
      return (
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="text-gray-500 dark:text-slate-400">Value</div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-md p-2 text-red-700 dark:text-red-400 break-words text-xs">{String(before)}</div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-md p-2 text-emerald-700 dark:text-emerald-400 break-words text-xs">{String(after)}</div>
        </div>
      );
    }
    const keys = Array.from(new Set([...Object.keys(before), ...Object.keys(after)]));
    return (
      <div className="space-y-2">
        {keys.map((k) => (
          <div key={k} className="grid grid-cols-3 gap-3 text-sm items-start">
            <div className="text-gray-600 dark:text-slate-300 font-medium break-words text-xs">{k}</div>
            <div className="bg-red-500/10 border border-red-500/20 rounded-md p-2 text-red-700 dark:text-red-400 break-words text-xs">{typeof before?.[k] === "object" ? JSON.stringify(before?.[k], null, 2) : String(before?.[k] ?? "")}</div>
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-md p-2 text-emerald-700 dark:text-emerald-400 break-words text-xs">{typeof after?.[k] === "object" ? JSON.stringify(after?.[k], null, 2) : String(after?.[k] ?? "")}</div>
          </div>
        ))}
      </div>
    );
  };

  const renderDetails = (raw: string) => {
    const parsed = tryParseJson(raw);
    if (!parsed) {
      return (
        <div className="text-sm whitespace-pre-wrap break-words border border-gray-200 dark:border-slate-700 rounded-lg p-3 bg-gray-50 dark:bg-slate-800/60 text-gray-700 dark:text-slate-300">{raw || "—"}</div>
      );
    }
    if (isBeforeAfterShape(parsed)) {
      return (
        <div className="space-y-3">
          <div className="text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Changes</div>
          {renderDiffRows(parsed.before, parsed.after)}
        </div>
      );
    }
    if (isChangesArray(parsed)) {
      return (
        <div className="space-y-3">
          <div className="text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Changes</div>
          <div className="space-y-2">
            {parsed.map((c: any, idx: number) => (
              <div key={idx} className="border border-gray-200 dark:border-slate-700 rounded-lg p-3 bg-gray-50 dark:bg-slate-800/30">
                <div className="text-xs font-medium text-gray-500 dark:text-slate-400 mb-2">{c.field}</div>
                {renderDiffRows(c.before, c.after)}
              </div>
            ))}
          </div>
        </div>
      );
    }
    return (
      <div className="space-y-2">
        {renderKV(parsed)}
      </div>
    );
  };

  return (
    <ModalLayout isOpen={isOpen} onClose={onClose} classNames="w-[95vw] max-w-2xl !bg-white dark:!bg-slate-900 !rounded-xl shadow-2xl">
      <ModalHeader onClose={onClose} title="Audit Log Details" />
      <ModalBody>
        {!log ? (
          <div className="text-gray-500 dark:text-slate-400">No log selected.</div>
        ) : (
          <div className="space-y-5">
            {/* Header badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2.5 py-1 rounded-md border text-xs font-medium ${getActionBadgeClass(log.action)}`}>
                {log.action}
              </span>
              {log.module && (
                <span className="px-2.5 py-1 rounded-md border text-xs font-medium bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30">
                  {log.module}
                </span>
              )}
              {typeof log.entityId !== "undefined" && log.entityId !== null && (
                <span className="px-2.5 py-1 rounded-md border text-xs font-medium bg-gray-500/10 text-gray-600 dark:text-slate-400 border-gray-500/30 flex items-center gap-1">
                  <FiHash className="w-3 h-3" />
                  {String(log.entityId)}
                </span>
              )}
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center justify-between bg-gray-50 dark:bg-slate-800/60 rounded-lg px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <CiClock2 className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
                  <span className="text-xs text-gray-500 dark:text-slate-400">Date</span>
                </div>
                <span className="text-xs font-medium text-gray-900 dark:text-white">{formatDateTime(log.createdAt).date}</span>
              </div>
              <div className="flex items-center justify-between bg-gray-50 dark:bg-slate-800/60 rounded-lg px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <CiClock2 className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
                  <span className="text-xs text-gray-500 dark:text-slate-400">Time</span>
                </div>
                <span className="text-xs font-medium text-gray-900 dark:text-white">{formatDateTime(log.createdAt).time}</span>
              </div>
              <div className="flex items-center justify-between bg-gray-50 dark:bg-slate-800/60 rounded-lg px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <GoDatabase className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
                  <span className="text-xs text-gray-500 dark:text-slate-400">Module</span>
                </div>
                <span className="text-xs font-medium text-gray-900 dark:text-white">{log.module}</span>
              </div>
              <div className="flex items-center justify-between bg-gray-50 dark:bg-slate-800/60 rounded-lg px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <FiActivity className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
                  <span className="text-xs text-gray-500 dark:text-slate-400">Action</span>
                </div>
                <span className="text-xs font-medium text-gray-900 dark:text-white">{log.action}</span>
              </div>
              <div className="flex items-center justify-between bg-gray-50 dark:bg-slate-800/60 rounded-lg px-3 py-2.5 sm:col-span-2">
                <div className="flex items-center gap-2">
                  <FiUser className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
                  <span className="text-xs text-gray-500 dark:text-slate-400">User (Email)</span>
                </div>
                <span className="text-xs font-medium text-gray-900 dark:text-white break-all">{log.Email}</span>
              </div>
              <div className="flex items-center justify-between bg-gray-50 dark:bg-slate-800/60 rounded-lg px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <FiUser className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
                  <span className="text-xs text-gray-500 dark:text-slate-400">User ID</span>
                </div>
                <span className="text-xs font-medium text-gray-900 dark:text-white">{log.userId}</span>
              </div>
              <div className="flex items-center justify-between bg-gray-50 dark:bg-slate-800/60 rounded-lg px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <FiHash className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
                  <span className="text-xs text-gray-500 dark:text-slate-400">Entity ID</span>
                </div>
                <span className="text-xs font-medium text-gray-900 dark:text-white">{log.entityId ?? "—"}</span>
              </div>
              <div className="flex items-center justify-between bg-gray-50 dark:bg-slate-800/60 rounded-lg px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <CiGlobe className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
                  <span className="text-xs text-gray-500 dark:text-slate-400">IP Address</span>
                </div>
                <span className="text-xs font-medium text-gray-900 dark:text-white">{log.log_ip}</span>
              </div>
              <div className="flex items-center justify-between bg-gray-50 dark:bg-slate-800/60 rounded-lg px-3 py-2.5 sm:col-span-2">
                <div className="flex items-center gap-2">
                  <CiMonitor className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
                  <span className="text-xs text-gray-500 dark:text-slate-400">Device</span>
                </div>
                <span className="text-xs font-medium text-gray-900 dark:text-white break-all max-w-[60%] text-right">{log.device}</span>
              </div>
            </div>

            {/* Details */}
            <div>
              <div className="text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">Details</div>
              {renderDetails(log.details)}
            </div>
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-sm font-medium transition-colors"
        >
          Close
        </button>
      </ModalFooter>
    </ModalLayout>
  );
};

export default AuditLogDetails;
