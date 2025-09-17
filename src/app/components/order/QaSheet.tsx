"use client";
import {
  groupByMeasurementId,
  QaInfo,
  RowMap,
} from "@/src/types/order";
import useQAchecklistStore, {
  QAChecklistItem,
} from "@/store/useQAchecklistStore";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Tab,
  Tabs,
} from "@heroui/react";
import React, { useEffect, useMemo, useState } from "react";
import { formatDate } from "../../interfaces";

interface ComponentProps {
  isOpen: boolean;
  onClose: () => void;
  info: QaInfo;
}

const isNumericString = (v: unknown): boolean => {
  if (typeof v !== "string") return false;
  const s = v.trim();
  if (!s) return false;
  return /^[+-]?\d+(?:\.\d+)?$/.test(s);
};

const QaSheet: React.FC<ComponentProps> = ({ isOpen, onClose, info }) => {
  const {
    productQAChecklist,
    measurementQAChecklist,
    loading: qaLoading,
    createQAChecklist,
  } = useQAchecklistStore();

  const measurementGroups = useMemo(
    () => groupByMeasurementId(measurementQAChecklist),
    [measurementQAChecklist]
  );

  const [form, setForm] = useState<RowMap>({});
  const [baseline, setBaseline] = useState<RowMap>({});

  const initialObservedForRow = (r: QAChecklistItem) => {
    if (r.measurementId != null) {
      const isLabel = r.expected != null && !isNumericString(r.expected);
      if (isLabel) return (r.observed ?? "") as string;
      return (r.observed ?? r.expected ?? "") as string;
    }
    return (r.observed ?? "") as string;
  };

  const initialRemarksForRow = (r: QAChecklistItem) =>
    (r.remarks ?? "") as string;

  useEffect(() => {
    if (!isOpen) return;
    const map: RowMap = {};
    const allRows = [...productQAChecklist, ...measurementQAChecklist];

    for (const r of allRows) {
      map[r.id] = {
        observed: initialObservedForRow(r),
        remarks: initialRemarksForRow(r),
      };
    }

    setForm(map);
    setBaseline(map);
  }, [isOpen, productQAChecklist, measurementQAChecklist]);

  const updateObserved = (rowId: number, val: string) =>
    setForm((p) => ({
      ...p,
      [rowId]: { observed: val, remarks: p[rowId]?.remarks ?? "" },
    }));

  const updateRemarks = (rowId: number, val: string) =>
    setForm((p) => ({
      ...p,
      [rowId]: { observed: p[rowId]?.observed ?? "", remarks: val },
    }));

  const toNullIfEmpty = (s: string) => (s.trim() === "" ? null : s.trim());

  const handleSave = async () => {
    type CreateItem = Parameters<typeof createQAChecklist>[1][number];

   
    const productRows = productQAChecklist.filter((r) => r.productId != null);
    const measurementRowsAll = measurementQAChecklist.filter(
      (r) => r.measurementId != null
    );

    const measurementRowsForDiff = measurementRowsAll.filter(
      (r) => !(r.expected != null && !isNumericString(r.expected))
    );

    const productEdited = productRows.some((r) => {
      const curr = form[r.id] ?? { observed: "", remarks: "" };
      const base = baseline[r.id] ?? { observed: "", remarks: "" };
      return curr.observed !== base.observed || curr.remarks !== base.remarks;
    });

    const measurementEdited = measurementRowsForDiff.some((r) => {
      const curr = form[r.id] ?? { observed: "", remarks: "" };
      const base = baseline[r.id] ?? { observed: "", remarks: "" };
      return curr.observed !== base.observed || curr.remarks !== base.remarks;
    });

    if (!productEdited && !measurementEdited) {
      return;
    }

    const items: CreateItem[] = [];

    if (productEdited) {
    
      for (const r of productRows) {
        const curr = form[r.id] ?? { observed: "", remarks: "" };
        items.push({
          productId: r.productId as number,
          parameter: r.parameter,
          expected: r.expected,
          observed: toNullIfEmpty(curr.observed),
          remarks: toNullIfEmpty(curr.remarks),
        });
      }
    }

    if (measurementEdited) {

      for (const r of measurementRowsAll) {
        const curr = form[r.id] ?? { observed: "", remarks: "" };
        const isLabel = r.expected != null && !isNumericString(r.expected);

        items.push({
          measurementId: r.measurementId as number,
          parameter: r.parameter,
          expected: r.expected,
          observed: isLabel ? null : toNullIfEmpty(curr.observed),
          remarks: isLabel ? null : toNullIfEmpty(curr.remarks),
        });
      }
    }

    const opts: { productId?: number; measurementId?: number } = {};
    if (productEdited && !measurementEdited) {
      opts.productId = info.productId;
    } else if (measurementEdited && !productEdited) {
      const mids = Array.from(
        new Set(measurementRowsAll.map((r) => r.measurementId!))
      );
      if (mids.length === 1) opts.measurementId = mids[0];
    }

    await createQAChecklist(info.orderItemId, items, opts);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      size="4xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              QA Checklist
            </ModalHeader>
            <ModalBody>
              <div className="space-y-6">
                {/* --- Header Info --- */}
                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Order & Product Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <b>Order Name:</b> {info.orderName || "-"}
                    </div>
                    <div>
                      <b>Client Name:</b> {info.clientName || "-"}
                    </div>
                    <div>
                      <b>Deadline:</b> {formatDate(info.deadline) || "-"}
                    </div>
                    <div>
                      <b>Product Name:</b> {info.productName || "-"}
                    </div>
                  </div>
                </div>

                {/* --- Tabs --- */}
                <Tabs
                  aria-label="QA Sections"
                  variant="underlined"
                  color="primary"
                  defaultSelectedKey="size"
                  className="w-full"
                >
                  {/* --- Measurement --- */}
                  <Tab key="size" title="Measurement">
                    {qaLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Spinner size="lg" />
                      </div>
                    ) : measurementGroups.length === 0 ? (
                      <p className="text-sm text-gray-500">
                        No measurement checklist items.
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {measurementGroups.map((grp) => (
                          <div
                            key={grp.measurementId}
                            className="shadow rounded-lg border"
                          >
                            <div className="px-3 py-2 font-semibold text-gray-700">
                              Size:{" "}
                              {grp.label || `Measurement #${grp.measurementId}`}
                            </div>
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm border-collapse">
                                <thead className="">
                                  <tr>
                                    <th className="p-2 border">Parameter</th>
                                    <th className="p-2 border">Expected</th>
                                    <th className="p-2 border">Observed</th>
                                    <th className="p-2 border">Remarks</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {grp.items.map((row) => (
                                    <tr key={row.id} className="text-center">
                                      <td className="border p-2 font-medium">
                                        {row.parameter}
                                      </td>
                                      <td className="border p-2">
                                        {row.expected ?? ""}
                                      </td>
                                      <td className="border p-2">
                                        <input
                                          type="text"
                                          value={form[row.id]?.observed ?? ""}
                                          onChange={(e) =>
                                            updateObserved(
                                              row.id,
                                              e.target.value
                                            )
                                          }
                                          className="w-full px-2 py-1 border rounded"
                                        />
                                      </td>
                                      <td className="border p-2">
                                        <input
                                          type="text"
                                          value={form[row.id]?.remarks ?? ""}
                                          onChange={(e) =>
                                            updateRemarks(
                                              row.id,
                                              e.target.value
                                            )
                                          }
                                          placeholder="Remarks"
                                          className="w-full px-2 py-1 border rounded"
                                        />
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Tab>

                  {/* --- Product --- */}
                  <Tab key="general" title="Product">
                    {qaLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Spinner size="lg" />
                      </div>
                    ) : productQAChecklist.length === 0 ? (
                      <p className="text-sm text-gray-500">
                        No product checklist items.
                      </p>
                    ) : (
                      <div className="shadow rounded-lg border">
                        <div className="px-3 py-2 font-semibold text-gray-700">
                          Product Checklist
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm border-collapse">
                            <thead>
                              <tr>
                                <th className="p-2 border">Parameter</th>
                                <th className="p-2 border">Expected</th>
                                <th className="p-2 border">Observed</th>
                                <th className="p-2 border">Remarks</th>
                              </tr>
                            </thead>
                            <tbody>
                              {productQAChecklist.map((row) => (
                                <tr key={row.id} className="text-center">
                                  <td className="border p-2 font-medium">
                                    {row.parameter}
                                  </td>
                                  <td className="border p-2">
                                    {row.expected ?? ""}
                                  </td>
                                  <td className="border p-2">
                                    <input
                                      type="text"
                                      value={form[row.id]?.observed ?? ""}
                                      onChange={(e) =>
                                        updateObserved(row.id, e.target.value)
                                      }
                                      placeholder="Observed"
                                      className="w-full px-2 py-1 border rounded"
                                    />
                                  </td>
                                  <td className="border p-2">
                                    <input
                                      type="text"
                                      value={form[row.id]?.remarks ?? ""}
                                      onChange={(e) =>
                                        updateRemarks(row.id, e.target.value)
                                      }
                                      placeholder="Remarks"
                                      className="w-full px-2 py-1 border rounded"
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </Tab>
                </Tabs>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Close
              </Button>
              <Button
                color="primary"
                onPress={handleSave}
                isDisabled={qaLoading}
              >
                Save
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default QaSheet;
