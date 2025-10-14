"use client";

import React, { useEffect, useMemo, useState } from "react";
import useShipmentStore from "@/store/useShipmentStore";
import { useDocumentCenterStore } from "@/store/useDocumentCenterStore";
import { DOCUMENT_REFERENCE_TYPE } from "@/interface";
import { Button, Card } from "@heroui/react";
import { RiAttachment2 } from "react-icons/ri";
import { FaFileInvoice } from "react-icons/fa6";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { HiDownload } from "react-icons/hi";
import AttachmentPreviewModal, { AttachmentItem } from "../../AttachmentPreviewModal";
import { FileTypesEnum } from "@/src/types/order";
import { downloadAtIndex } from "@/src/types/admin";

interface ShipmentAttachmentsProps {
  orderId: number;
}

const ShipmentCard: React.FC<{ shipmentId: number; shipmentCode?: string; shipmentDate?: string; }> = ({ shipmentId, shipmentCode, shipmentDate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const { fetchDocuments, documentsByReferenceId, typeCoverageByReferenceId } = useDocumentCenterStore();

  const documents = documentsByReferenceId[shipmentId] || [];
  const coverage = typeCoverageByReferenceId[shipmentId];

  useEffect(() => {
    fetchDocuments(DOCUMENT_REFERENCE_TYPE.SHIPMENT, shipmentId);
  }, [shipmentId]);

  const items: AttachmentItem[] = useMemo(
    () => (documents || []).map((d: any) => ({
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
    <Card className="bg-white dark:bg-slate-700 border-0 shadow-xl">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-5 rounded-xl flex items-center justify-center">
              <RiAttachment2 />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Shipment Attachments
              </h2>
              <p className="text-sm text-gray-600 dark:text-slate-300">
                {documents?.length} files attached
              </p>
            </div>
          </div>
          <div className="text-right text-xs text-gray-600 dark:text-slate-300">
            <div>{shipmentCode ? `Code: ${shipmentCode}` : `#${shipmentId}`}</div>
            {shipmentDate && (
              <div>{new Date(shipmentDate).toLocaleDateString()}</div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
          {documents?.map((attachment: any, index: number) => (
            <div
              key={index}
              className="group p-4 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-gray-50 to-white dark:from-slate-700 dark:to-slate-800"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-5 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <FaFileInvoice />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-slate-100 truncate">
                    {attachment?.fileName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">
                    {attachment?.fileType}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onPress={() => openAt(index)}
                  className="flex-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <MdOutlineRemoveRedEye />
                  View
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onPress={() => downloadAtIndex(documents as any, index)}
                  className="flex-1 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400"
                >
                  <HiDownload />
                  Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AttachmentPreviewModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        items={items}
        startIndex={startIndex}
      />
    </Card>
  );
};

const ShipmentAttachments: React.FC<ShipmentAttachmentsProps> = ({ orderId }) => {
  const { Shipments, fetchShipments, loading } = useShipmentStore();

  useEffect(() => {
    if (!Shipments || Shipments.length === 0) {
      fetchShipments();
    }
  }, []);

  const shipmentsForOrder = useMemo(
    () => (Shipments || []).filter((s) => (s?.Orders || []).some((o) => o.Id === orderId)),
    [Shipments, orderId]
  );

  if (loading && shipmentsForOrder.length === 0) {
    return <div className="text-sm text-slate-500">Loading shipments…</div>;
  }

  if (!shipmentsForOrder || shipmentsForOrder.length === 0) {
    return <div className="text-sm text-slate-500">No shipments found for this order.</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      {shipmentsForOrder.map((ship) => (
        <ShipmentCard
          key={ship.Id}
          shipmentId={ship.Id}
          shipmentCode={ship.ShipmentCode}
          shipmentDate={ship.ShipmentDate}
        />)
      )}
    </div>
  );
};

export default ShipmentAttachments;