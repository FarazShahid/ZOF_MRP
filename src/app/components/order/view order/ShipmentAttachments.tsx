"use client";

import React, { useEffect, useMemo, useState } from "react";
import useShipmentStore from "@/store/useShipmentStore";
import { useDocumentCenterStore } from "@/store/useDocumentCenterStore";
import { DOCUMENT_REFERENCE_TYPE } from "@/interface";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { HiDownload } from "react-icons/hi";
import AttachmentPreviewModal, { AttachmentItem } from "../../AttachmentPreviewModal";
import { FileTypesEnum } from "@/src/types/order";
import { downloadAtIndex } from "@/src/types/admin";

const getFileIcon = (name: string) => {
  if (!name) return "ri-file-line text-slate-400";
  const n = name.toLowerCase();
  if (n.endsWith(".pdf")) return "ri-file-pdf-2-line text-red-400";
  if (n.endsWith(".png") || n.endsWith(".jpg")) return "ri-image-line text-purple-400";
  return "ri-file-line text-slate-400";
};

interface ShipmentCardProps {
  shipmentId: number;
  shipmentCode?: string;
  shipmentDate?: string;
}

const ShipmentCard: React.FC<ShipmentCardProps> = ({
  shipmentId,
  shipmentCode,
  shipmentDate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const { fetchDocuments, documentsByReferenceId, typeCoverageByReferenceId } =
    useDocumentCenterStore();

  const documents = documentsByReferenceId[shipmentId] || [];
  const coverage = typeCoverageByReferenceId[shipmentId];

  useEffect(() => {
    fetchDocuments(DOCUMENT_REFERENCE_TYPE.SHIPMENT, shipmentId);
  }, [shipmentId]);

  const items: AttachmentItem[] = useMemo(
    () =>
      (documents || []).map((d: any) => ({
        fileName: d.fileName,
        fileType: d.fileType,
        fileUrl: d.fileUrl,
      })),
    [documents]
  );

  const openAt = (idx: number) => {
    setStartIndex(idx);
    setIsOpen(true);
  };

  const percent = Math.round(coverage?.percent ?? 0);
  const matchedOverTotal = coverage
    ? `${coverage.matchedTypes}/${coverage.totalTypes}`
    : `0/${FileTypesEnum.length}`;

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <i className="ri-truck-line text-white w-4 h-4 flex items-center justify-center" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Shipment Attachments</h2>
            <p className="text-xs text-slate-400">
              {documents.length} file{documents.length !== 1 ? "s" : ""} attached
              {shipmentCode ? ` · ${shipmentCode}` : ` · #${shipmentId}`}
            </p>
          </div>
        </div>
        <div className="text-right text-xs text-slate-500">
          {shipmentDate && (
            <div>Ship date: {new Date(shipmentDate).toLocaleDateString()}</div>
          )}
          <div>Types: {matchedOverTotal} ({percent}%)</div>
        </div>
      </div>

      {documents.length === 0 ? (
        <div className="py-8 text-center border border-dashed border-slate-700 rounded-xl">
          <i className="ri-folder-open-line text-3xl text-slate-600 w-10 h-10 mx-auto flex items-center justify-center mb-2" />
          <p className="text-sm text-slate-500">No attachments for this shipment</p>
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map((attachment: any, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between px-4 py-3 bg-slate-800/50 rounded-xl border border-slate-700"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center shrink-0">
                  <i
                    className={`${getFileIcon(attachment?.fileName)} text-xl w-5 h-5 flex items-center justify-center`}
                  />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-white truncate">
                    {attachment?.fileName ?? "—"}
                  </div>
                  <div className="text-xs text-slate-500">{attachment?.fileType ?? "—"}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => openAt(index)}
                  className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                  title="View"
                >
                  <MdOutlineRemoveRedEye className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => downloadAtIndex(documents, index)}
                  className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                  title="Download"
                >
                  <HiDownload className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AttachmentPreviewModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        items={items}
        startIndex={startIndex}
      />
    </div>
  );
};

interface ShipmentAttachmentsProps {
  orderId: number;
}

const ShipmentAttachments: React.FC<ShipmentAttachmentsProps> = ({ orderId }) => {
  const { Shipments, fetchShipments, loading } = useShipmentStore();

  useEffect(() => {
    if (!Shipments || Shipments.length === 0) {
      fetchShipments();
    }
  }, []);

  const shipmentsForOrder = useMemo(
    () =>
      (Shipments || []).filter((s) =>
        (s?.Orders || []).some((o) => o.Id === orderId)
      ),
    [Shipments, orderId]
  );

  if (loading && shipmentsForOrder.length === 0) {
    return (
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 text-center">
        <p className="text-sm text-slate-500">Loading shipments…</p>
      </div>
    );
  }

  if (!shipmentsForOrder || shipmentsForOrder.length === 0) {
    return (
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 text-center">
        <i className="ri-truck-line text-4xl text-slate-600 w-10 h-10 mx-auto flex items-center justify-center mb-3" />
        <p className="text-sm text-slate-500">No shipments found for this order.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary - reference style */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
          <div className="text-xs text-slate-400 mb-1">Total Shipments</div>
          <div className="text-xl font-bold text-white">
            {shipmentsForOrder.length}
          </div>
        </div>
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
          <div className="text-xs text-slate-400 mb-1">Order</div>
          <div className="text-xl font-bold text-white">#{orderId}</div>
        </div>
      </div>

      {shipmentsForOrder.map((ship) => (
        <ShipmentCard
          key={ship.Id}
          shipmentId={ship.Id}
          shipmentCode={ship.ShipmentCode}
          shipmentDate={ship.ShipmentDate}
        />
      ))}
    </div>
  );
};

export default ShipmentAttachments;
