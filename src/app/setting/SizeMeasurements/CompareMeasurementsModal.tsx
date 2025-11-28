import React, { useEffect, useMemo, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";
import { SizeMeasurements } from "@/store/useSizeMeasurementsStore";
import { labelMap } from "@/src/utils";

interface Props {
  isOpen: boolean;
  left: SizeMeasurements | null;
  right: SizeMeasurements | null;
  onClose: () => void;
}

const excludedKeys = new Set<string>([
  "Id",
  "OriginalSizeMeasurementId",
  "Version",
  "IsLatest",
  "IsActive",
  "ClientName",
  "ClientId",
  "ProductCategoryId",
  "ProductCategoryType",
  "SizeOptionId",
  "SizeOptionName",
  "CutOptionId",
  "cutOptionName",
  "__search",
  "CreatedOn",
  "CreatedBy",
  "UpdatedOn",
  "UpdatedBy",
  "hasVersions",
]);


const CompareMeasurementsModal: React.FC<Props> = ({ isOpen, left, right, onClose }) => {
  const [diffOnly, setDiffOnly] = useState<boolean>(true);
  const [displayLeft, setDisplayLeft] = useState<SizeMeasurements | null>(left);
  const [displayRight, setDisplayRight] = useState<SizeMeasurements | null>(right);

  useEffect(() => {
    if (isOpen) {
      setDisplayLeft(left);
      setDisplayRight(right);
    }
  }, [isOpen, left, right]);

  const rows = useMemo(() => {
    if (!displayLeft || !displayRight) return [];
    const keys: string[] = Array.from(
      new Set<string>([
        ...Object.keys(displayLeft),
        ...Object.keys(displayRight),
      ])
    ).filter((k) => !excludedKeys.has(k));
    const built = keys.map((key: string) => {
      const a = (displayLeft as any)[key] ?? "";
      const b = (displayRight as any)[key] ?? "";
      const isLogo = key.startsWith("t_") || key.startsWith("b_");
      return {
        key,
        label: labelMap[key] ?? key,
        a,
        b,
        changed: String(a) !== String(b),
        isLogo,
      };
    });
    return diffOnly ? built.filter((r) => r.changed) : built;
  }, [displayLeft, displayRight, diffOnly]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" placement="center">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Compare Size Measurements
          <span className="text-xs font-normal text-default-500">
            <span className="inline-flex items-center gap-1">
              <span className="px-2 py-0.5 rounded-full bg-danger-50 text-danger-700 border border-danger-200">
                Left: {displayLeft?.Measurement1}{displayLeft?.Version ? `` : ""}
              </span>
              <span>vs</span>
              <span className="px-2 py-0.5 rounded-full bg-success-50 text-success-700 border border-success-200">
                Right: {displayRight?.Measurement1}{displayRight?.Version ? `` : ""}
              </span>
            </span>
          </span>
        </ModalHeader>
        <ModalBody>
          <div className="flex items-center justify-between mb-2 gap-3 flex-wrap">
            <span className="text-xs text-default-600">
              {rows.length} {diffOnly ? "differences" : "fields"}
            </span>
            <div className="flex items-center gap-3">
              
              <label className="flex items-center gap-2 text-xs text-default-700">
                <input
                  type="checkbox"
                  className="h-3 w-3 accent-primary-500"
                  checked={diffOnly}
                  onChange={(e) => setDiffOnly(e.target.checked)}
                />
                Show differences only
              </label>
            </div>
          </div>
         
          <div className="w-full rounded-medium border border-default-200 overflow-auto max-h-[50vh]">
            <div className="sticky top-0 z-10 grid grid-cols-12 gap-2 bg-default-100 px-4 py-2 text-xs font-semibold uppercase tracking-wide shadow-sm">
              <div className="col-span-4">Field</div>
              <div className="col-span-4">Left</div>
              <div className="col-span-4">Right</div>
            </div>
            <div className="divide-y divide-default-200">
              {rows.map((r) => (
                <div
                  key={r.key}
                  className="grid grid-cols-12 gap-2 px-4 py-2 text-sm"
                >
                  <div className="col-span-4 text-default-700 flex items-center gap-2">
                    <span>{r.label}</span>
                    {r.isLogo ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 border border-primary-200">
                        Logo
                      </span>
                    ) : null}
                  </div>
                  <div
                    className={`col-span-4 ${
                      r.changed ? "bg-danger-50/60 text-danger-700 rounded px-2" : "text-default-700"
                    }`}
                  >
                    <div className="max-h-40 overflow-y-auto whitespace-pre-wrap break-words pr-1 font-mono text-[13px]">
                      {r.a}
                    </div>
                  </div>
                  <div
                    className={`col-span-4 ${
                      r.changed ? "bg-success-50/60 text-success-700 rounded px-2" : "text-default-700"
                    }`}
                  >
                    <div className="max-h-40 overflow-y-auto whitespace-pre-wrap break-words pr-1 font-mono text-[13px]">
                      {r.b}
                    </div>
                  </div>
                </div>
              ))}
              {rows.length === 0 && (
                <div className="px-4 py-6 text-sm text-default-500">Nothing to compare.</div>
              )}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button onPress={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CompareMeasurementsModal;


