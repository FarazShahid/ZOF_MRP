import React from 'react';
import { RxCross2 } from "react-icons/rx";
import { GoDatabase } from "react-icons/go";
import { CiClock2, CiGlobe, CiMonitor  } from "react-icons/ci";
import {  } from "react-icons/ci";
import { FiUser, FiActivity } from "react-icons/fi";
import {  } from "react-icons/fi";
import { AuditLog } from '@/src/types/audit';


interface AuditLogDetailSidebarProps {
  log: AuditLog | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AuditLogDetailSidebar: React.FC<AuditLogDetailSidebarProps> = ({
  log,
  isOpen,
  onClose
}) => {
  if (!log || !isOpen) return null;

  const formatDateTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    });
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-25 z-40"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Audit Log Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <RxCross2 className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto h-full pb-20">
          {/* Basic Information */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Basic Information</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CiClock2 className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Timestamp</p>
                  <p className="text-sm text-gray-600">{formatDateTime(log.timestamp)}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <GoDatabase className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Module</p>
                  <p className="text-sm text-gray-600">{log.module}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <FiActivity className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Action</p>
                  <p className="text-sm text-gray-600">{log.action}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <FiUser className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">User</p>
                  <p className="text-sm text-gray-600">{log.user}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{log.details}</p>
          </div>

          {/* Entity Information */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Entity ID</h3>
            <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">{log.entityId}</code>
          </div>

          {/* Changes */}
          {log.changes && log.changes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Changes Made</h3>
              <div className="space-y-4">
                {log.changes.map((change, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3">
                    <h4 className="text-sm font-medium text-gray-900 mb-2 capitalize">
                      {change.field.replace('_', ' ')}
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="text-gray-500 mb-1">Before</p>
                        <div className="bg-red-50 border border-red-200 rounded p-2">
                          <code className="text-red-800">
                            {change.before || <em className="text-gray-400">empty</em>}
                          </code>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">After</p>
                        <div className="bg-green-50 border border-green-200 rounded p-2">
                          <code className="text-green-800">
                            {change.after || <em className="text-gray-400">empty</em>}
                          </code>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technical Details */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Technical Details</h3>
            <div className="space-y-3">
              {log.ipAddress && (
                <div className="flex items-start gap-3">
                  <CiGlobe className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">IP Address</p>
                    <p className="text-xs text-gray-600 font-mono">{log.ipAddress}</p>
                  </div>
                </div>
              )}
              
              {log.userAgent && (
                <div className="flex items-start gap-3">
                  <CiMonitor className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">User Agent</p>
                    <p className="text-xs text-gray-600 break-all">{log.userAgent}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};