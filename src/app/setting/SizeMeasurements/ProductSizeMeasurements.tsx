"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import {
  Input,
  Pagination,
} from "@heroui/react";
import useSizeMeasurementsStore, {
  SizeMeasurements,
} from "@/store/useSizeMeasurementsStore";
import DeleteSizeOptions from "./DeleteSizeOptions";
import AddSizeOptions from "./AddSizeOptions";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  GoPencil,
  GoEye,
  GoCheckCircle,
  GoChevronDown,
  GoChevronRight,
  GoGitCompare,
} from "react-icons/go";
import SetDefaultConfirm from "./SetDefaultConfirm";
import CompareMeasurementsModal from "./CompareMeasurementsModal";
import AddButton from "../../components/common/AddButton";
import { useRouter } from "next/navigation";
import { ViewMeasurementChart } from "../../orders/components/ViewMeasurementChart";
import { useSearch } from "@/src/hooks/useSearch";
import { CiSearch } from "react-icons/ci";
import PermissionGuard from "../../components/auth/PermissionGaurd";
import { PERMISSIONS_ENUM } from "@/src/types/rightids";
import { ROWS_PER_PAGE } from "@/src/types/admin";

const ProductSizeMeasurements = () => {
  const [page, setPage] = useState<number>(1);
  const [isOpenDeletModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const [selectedSizeOptionId, setSelectedSizeOptionId] = useState<number>(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isViewModal, setIsViewModal] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [expandedRootIds, setExpandedRootIds] = useState<Set<number>>(
    new Set()
  );
  const [versionsByRootId, setVersionsByRootId] = useState<
    Record<number, SizeMeasurements[]>
  >({});
  const [loadingVersions, setLoadingVersions] = useState<
    Record<number, boolean>
  >({});
  const [confirmDefaultOpen, setConfirmDefaultOpen] = useState<boolean>(false);
  const [pendingDefaultId, setPendingDefaultId] = useState<number | null>(null);
  const [compareOpen, setCompareOpen] = useState<boolean>(false);
  const [compareLeft, setCompareLeft] = useState<SizeMeasurements | null>(null);
  const [compareRight, setCompareRight] = useState<SizeMeasurements | null>(null);
  const [comparePickedIdsByRootId, setComparePickedIdsByRootId] = useState<
    Record<number, number[]>
  >({});
  const [selectedRootId, setSelectedRootId] = useState<number | null>(null);

  const router = useRouter();

  const {
    fetchSizeMeasurements,
    sizeMeasurement,
    loading,
    getVersionsBySizeMeasurement,
  } = useSizeMeasurementsStore();

  // Search on 4 fields
  const filtered = useSearch(sizeMeasurement, query, [
    "Measurement1",
    "ProductCategoryType",
    "SizeOptionName",
    "ClientName",
  ]);

  // Show only originals (no OriginalSizeMeasurementId)
  const filteredTopLevel: SizeMeasurements[] = useMemo(
    () => (filtered ?? []).filter((m: any) => !m?.OriginalSizeMeasurementId),
    [filtered]
  );

  // Map of versions count for each root (original) id
  const versionsCountMap = useMemo(() => {
    const map: Record<number, number> = {};
    (sizeMeasurement ?? []).forEach((m: any) => {
      const rootId = m?.OriginalSizeMeasurementId;
      if (rootId) {
        map[rootId] = (map[rootId] ?? 0) + 1;
      }
    });
    return map;
  }, [sizeMeasurement]);

  const total = filteredTopLevel?.length ?? 0;
  const rawPages = Math.ceil(total / ROWS_PER_PAGE);
  const pages = Math.max(1, rawPages);

  const items = useMemo(() => {
    const safePage = Math.min(page, pages);
    const start = (safePage - 1) * ROWS_PER_PAGE;
    return filteredTopLevel?.slice(start, start + ROWS_PER_PAGE) ?? [];
  }, [filteredTopLevel, page, pages]);

  // reset page on new search
  useEffect(() => setPage(1), [query]);

  // also clamp page whenever filtered changes (e.g., after search)
  useEffect(() => {
    if (page > pages) setPage(pages);
    if (page < 1) setPage(1);
  }, [pages, page]);

  useEffect(() => {
    fetchSizeMeasurements();
  }, []);

  const compareByCreatedOnDesc = useCallback(
    (a: SizeMeasurements, b: SizeMeasurements) =>
      new Date(b.CreatedOn).getTime() - new Date(a.CreatedOn).getTime(),
    []
  );

  const openAddModal = useCallback(() => {
    router.push("/product/addsizeOptions");
  }, [router]);

  const handleOpenDeleteModal = useCallback((sizeOptionId: number, rootId?: number) => {
    setSelectedSizeOptionId(sizeOptionId);
    if (rootId !== undefined) {
      setSelectedRootId(rootId);
    } else {
      const found = (sizeMeasurement ?? []).find((m: any) => m.Id === sizeOptionId) as
        | SizeMeasurements
        | undefined;
      const computedRoot = found?.OriginalSizeMeasurementId
        ? found.OriginalSizeMeasurementId
        : sizeOptionId;
      setSelectedRootId(computedRoot ?? null);
    }
    setIsOpenDeleteModal(true);
  }, [sizeMeasurement]);
  const closeDeleteModal = useCallback(() => setIsOpenDeleteModal(false), []);
  const closeAddModal = useCallback(() => {
    setIsAddModalOpen(false);
    setIsEdit(false);
  }, []);
  const openEditModal = useCallback((sizeId: number) => {
    router.push(`/product/editsizeoptions/${sizeId}`);
  }, [router]);
  const openViewModal = useCallback((sizeId: number) => {
    setSelectedSizeOptionId(sizeId);
    setIsViewModal(true);
  }, []);
  const handleCloseModal = useCallback(() => {
    setIsViewModal(false);
  }, []);
  const openConfirmDefault = useCallback((id: number) => {
    setPendingDefaultId(id);
    setConfirmDefaultOpen(true);
  }, []);
  const closeConfirmDefault = useCallback(() => {
    setPendingDefaultId(null);
    setConfirmDefaultOpen(false);
  }, []);

  const refreshRootVersions = useCallback(
    async (rootId: number) => {
      setLoadingVersions((prev) => ({ ...prev, [rootId]: true }));
      const list = await getVersionsBySizeMeasurement(rootId);
      const versionsOnly = (list ?? []).filter(
        (v) => (v as any)?.OriginalSizeMeasurementId && v.Id !== rootId
      );
      const sorted = [...versionsOnly].sort(compareByCreatedOnDesc);
      setVersionsByRootId((prev) => ({ ...prev, [rootId]: sorted }));
      setLoadingVersions((prev) => ({ ...prev, [rootId]: false }));
    },
    [getVersionsBySizeMeasurement, compareByCreatedOnDesc]
  );

  const handleSetDefaultSuccess = async () => {
    try {
      // Determine root id for the pending default item
      const targetId = pendingDefaultId ?? 0;
      const found = (sizeMeasurement ?? []).find((m: any) => m.Id === targetId) as
        | SizeMeasurements
        | undefined;
      const rootId = found?.OriginalSizeMeasurementId
        ? found.OriginalSizeMeasurementId
        : targetId;

      // Keep the parent expanded
      setExpandedRootIds((prev) => {
        const next = new Set(prev);
        next.add(rootId);
        return next;
      });

      // Refresh versions for the root
      await refreshRootVersions(rootId);

      // Clear any compare selections for this root
      setComparePickedIdsByRootId((prev) => ({ ...prev, [rootId]: [] }));

      // Refresh top-level list so "Latest" flags and counts update
      await fetchSizeMeasurements();
    } catch {
      // no-op; UI already provides general error handling via store/toasts
    }
  };

  const handleDeleteSuccess = async (_deletedId: number) => {
    try {
      // Determine target root to refresh
      const targetRootId =
        selectedRootId ??
        (() => {
          const found = (sizeMeasurement ?? []).find(
            (m: any) => m.Id === _deletedId
          ) as SizeMeasurements | undefined;
          return found?.OriginalSizeMeasurementId
            ? found.OriginalSizeMeasurementId
            : _deletedId;
        })();

      if (!targetRootId) {
        await fetchSizeMeasurements();
        return;
      }

      // Keep root expanded
      setExpandedRootIds((prev) => {
        const next = new Set(prev);
        next.add(targetRootId);
        return next;
      });

      // Refresh versions list
      await refreshRootVersions(targetRootId);

      // Remove any compare picks that included the deleted version
      setComparePickedIdsByRootId((prev) => {
        const picks = prev[targetRootId] ?? [];
        const filtered = picks.filter((id) => id !== _deletedId);
        return { ...prev, [targetRootId]: filtered };
      });

      // Finally refresh main list
      await fetchSizeMeasurements();
    } catch {
      // no-op
    } finally {
      setSelectedRootId(null);
    }
  };

  const getRootId = (m: SizeMeasurements) =>
    m.OriginalSizeMeasurementId ? m.OriginalSizeMeasurementId : m.Id;

  const toggleArchive = async (m: SizeMeasurements) => {
    const rootId = getRootId(m);
    const next = new Set(expandedRootIds);
    if (next.has(rootId)) {
      next.delete(rootId);
      setExpandedRootIds(next);
      return;
    }
    // Expand: fetch versions if not cached
    if (!versionsByRootId[rootId]) {
      await refreshRootVersions(rootId);
    }
    next.add(rootId);
    setExpandedRootIds(next);
  };


  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h6 className="font-sans text-lg font-semibold">Size Measurements</h6>
          <div className="flex justify-end gap-3">
            <Input
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onClear={() => setQuery("")}
              classNames={{
                base: "max-w-full",
                mainWrapper: "h-full",
                input: "text-small",
                inputWrapper:
                  "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
              }}
              size="sm"
              startContent={<CiSearch />}
              variant="bordered"
            />
            <PermissionGuard required={PERMISSIONS_ENUM.PRODUCT_DEFINITIONS.ADD}>
              <AddButton title="Add New" onClick={openAddModal} />
            </PermissionGuard>
          </div>
        </div>
        {/* Custom Table */}
        <div className="w-full rounded-medium border border-default-200 overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-12 gap-2 bg-default-100 px-4 py-3 text-sm font-semibold">
            <div className="text-default-700 col-span-1">Sr</div>
            <div className="text-default-700 col-span-2">Name</div>
            <div className="text-default-700 col-span-2">Product Category</div>
            <div className="text-default-700 col-span-2">Size Option</div>
            <div className="text-default-700 col-span-2">Client Name</div>
            <div className="text-default-700 col-span-3">Action</div>
          </div>
          {/* Body */}
          <div className="divide-y divide-default-200">
            {(items ?? []).map((item: SizeMeasurements, index: number) => {
              const rootId = getRootId(item);
              const isExpanded = expandedRootIds.has(rootId);
              const hasArchive =
                !!(item as any)?.hasVersions || !!(item as any)?.HasVersions;
              const versionCount = versionsCountMap[rootId] ?? 0;
              return (
                <div key={item.Id}>
                  {/* Row */}
                  <div className="grid grid-cols-12 gap-2 px-4 py-3 items-center odd:bg-default-50 hover:bg-default-100 transition-colors">
                    <div className="text-sm text-default-700 col-span-1">{index + 1}</div>
                    <div className="text-sm text-default-700 flex items-center gap-2 col-span-2">
                      {hasArchive ? (
                        <button
                          type="button"
                          onClick={() => toggleArchive(item)}
                          className="p-1 hover:bg-default-200 rounded inline-flex items-center"
                          aria-label={isExpanded ? "Collapse" : "Expand"}
                          title={isExpanded ? "Collapse" : "Expand"}
                        >
                          {isExpanded ? <GoChevronDown /> : <GoChevronRight />}
                        </button>
                      ) : null}
                      <span>{item.Measurement1}</span>
                      {item.IsLatest && hasArchive ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-success-100 text-success-700 border border-success-200">
                          Latest
                        </span>
                      ) : null}
                      {hasArchive && versionCount > 0 ? (
                        <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full bg-default-200 text-default-700">
                          {versionCount}
                        </span>
                      ) : null}
                    </div>
                    <div className="text-sm text-default-700 col-span-2">{item.ProductCategoryType}</div>
                    <div className="text-sm text-default-700 col-span-2">{item.SizeOptionName}</div>
                    <div className="text-sm text-default-700 col-span-2">{item.ClientName}</div>
                    <div className="flex items-center gap-2 justify-start col-span-3">
                      <button
                        type="button"
                        onClick={() => openViewModal(item.Id)}
                        className="p-1 hover:bg-default-200 rounded"
                        aria-label="View"
                        title="View"
                      >
                        <GoEye />
                      </button>
                      <PermissionGuard
                        required={PERMISSIONS_ENUM.PRODUCT_DEFINITIONS.UPDATE}
                      >
                        <button
                          type="button"
                          onClick={() => openEditModal(item.Id)}
                          className="p-1 hover:bg-default-200 rounded"
                          aria-label="Edit"
                          title="Edit"
                        >
                          <GoPencil color="green" />
                        </button>
                      </PermissionGuard>
                      <PermissionGuard
                        required={PERMISSIONS_ENUM.PRODUCT_DEFINITIONS.DELETE}
                      >
                        <button
                          type="button"
                          className="p-1 hover:bg-default-200 rounded hover:text-red-500"
                          onClick={() => handleOpenDeleteModal(item.Id, rootId)}
                          aria-label="Delete"
                          title="Delete"
                        >
                          <RiDeleteBin6Line color="red" />
                        </button>
                      </PermissionGuard>
                      {/* Archive chevron moved to Name cell */}
                      {hasArchive ? (
                        <PermissionGuard
                          required={PERMISSIONS_ENUM.PRODUCT_DEFINITIONS.UPDATE}
                        >
                          <button
                            type="button"
                            className={`p-1 rounded border inline-flex items-center justify-center ${
                              item.IsLatest
                                ? "border-success-300 text-success-600"
                                : "border-default-300 hover:bg-default-100"
                            }`}
                            onClick={() => openConfirmDefault(item.Id)}
                            disabled={item.IsLatest}
                            title={item.IsLatest ? "Default" : "Set as default"}
                            aria-label={item.IsLatest ? "Default" : "Set as default"}
                          >
                            <GoCheckCircle />
                          </button>
                        </PermissionGuard>
                      ) : null}
                    </div>
                  </div>
                  {/* Expanded versions */}
                  {isExpanded ? (
                    <div className="bg-default-50">
                      {loadingVersions[rootId] ? (
                        <div className="px-8 py-3">
                          <div className="h-3 bg-default-200 rounded w-1/3 mb-2 animate-pulse"></div>
                          <div className="h-3 bg-default-200 rounded w-1/2 mb-2 animate-pulse"></div>
                          <div className="h-3 bg-default-200 rounded w-2/3 animate-pulse"></div>
                        </div>
                      ) : (
                        <>
                          {/* Compare toolbar (appears when exactly two picks) */}
                          {(() => {
                            const picks = comparePickedIdsByRootId[rootId] || [];
                            if (picks.length === 2) {
                              return (
                                <div className="px-8 py-2 flex items-center justify-between bg-default-100 border-y border-default-200">
                                  <span className="text-xs text-default-600">
                                    2 versions selected
                                  </span>
                                  <button
                                    type="button"
                                    className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded bg-primary-600 text-white hover:bg-primary-700 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300"
                                    onClick={() => {
                                      const all = [item, ...(versionsByRootId[rootId] ?? [])];
                                      const left =
                                        all.find((x) => x.Id === picks[0]) ?? null;
                                      const right =
                                        all.find((x) => x.Id === picks[1]) ?? null;
                                      setCompareLeft(left);
                                      setCompareRight(right);
                                      setCompareOpen(true);
                                    }}
                                  >
                                    <GoGitCompare />
                                    Compare
                                  </button>
                                </div>
                              );
                            }
                            return null;
                          })()}
                          {/* Nested header */}
                          <div className="grid grid-cols-7 gap-2 px-8 py-2 text-[11px] font-semibold text-default-600 uppercase tracking-wide">
                            <div className="col-span-3">Name</div>
                            <div className="col-span-1">Version</div>
                            <div className="col-span-3 text-left">Action</div>
                          </div>
                          <div className="px-6 pb-3">
                            <div className="border-l-2 border-default-200 ml-2">
                              {(versionsByRootId[rootId] ?? []).map(
                                (v) => (
                                  <div
                                    key={v.Id}
                                    className="relative grid grid-cols-7 gap-2 items-center px-4 py-2 ml-4 odd:bg-default-100/50 hover:bg-default-200/40 rounded"
                                  >
                                    <span
                                      className={`absolute -left-3 top-3 rounded-full ${
                                        v.IsLatest
                                          ? "h-2.5 w-2.5 bg-success-500 ring-2 ring-success-200"
                                          : "h-2 w-2 bg-default-300"
                                      }`}
                                    ></span>
                                    <div className="col-span-3 text-sm flex items-center gap-2">
                                      {((versionsByRootId[rootId] ?? []).length > 1) ? (
                                        <input
                                          type="checkbox"
                                          className="h-3 w-3 accent-primary-500"
                                          checked={(comparePickedIdsByRootId[rootId] || []).includes(
                                            v.Id
                                          )}
                                          onChange={(e) => {
                                            setComparePickedIdsByRootId((prev) => {
                                              const list = prev[rootId] ? [...prev[rootId]] : [];
                                              if (e.target.checked) {
                                                if (!list.includes(v.Id)) {
                                                  list.push(v.Id);
                                                }
                                              } else {
                                                const idx = list.indexOf(v.Id);
                                                if (idx >= 0) list.splice(idx, 1);
                                              }
                                              // limit to 2 selections
                                              const trimmed = list.slice(-2);
                                              return { ...prev, [rootId]: trimmed };
                                            });
                                          }}
                                        />
                                      ) : null}
                                      <span>{v.Measurement1}</span>
                                    </div>
                                    <div className="col-span-1 text-sm flex items-center gap-2">
                                      <span>{v.Version}</span>
                                    </div>
                                    <div className="col-span-3 flex items-center gap-2">
                                      <button
                                        type="button"
                                        onClick={() => openViewModal(v.Id)}
                                        className="p-1 hover:bg-default-200 rounded"
                                        aria-label="View"
                                        title="View"
                                      >
                                        <GoEye />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setCompareLeft(item);
                                          setCompareRight(v);
                                          setCompareOpen(true);
                                        }}
                                        className="p-1 hover:bg-default-200 rounded inline-flex items-center gap-1"
                                        aria-label="Compare with original"
                                        title="Compare with original"
                                      >
                                        <GoGitCompare />
                                      </button>
                                      <PermissionGuard
                                        required={
                                          PERMISSIONS_ENUM.PRODUCT_DEFINITIONS
                                            .DELETE
                                        }
                                      >
                                        <button
                                          type="button"
                                          className="p-1 hover:bg-default-200 rounded hover:text-red-500"
                                          onClick={() => handleOpenDeleteModal(v.Id, rootId)}
                                          aria-label="Delete"
                                          title="Delete"
                                        >
                                          <RiDeleteBin6Line color="red" />
                                        </button>
                                      </PermissionGuard>
                                      <PermissionGuard
                                        required={
                                          PERMISSIONS_ENUM.PRODUCT_DEFINITIONS
                                            .UPDATE
                                        }
                                      >
                                        <button
                                          type="button"
                                          className={`p-1 rounded border inline-flex items-center justify-center ${
                                            v.IsLatest
                                              ? "border-success-300 text-success-600"
                                              : "border-default-300 hover:bg-default-100"
                                          }`}
                                          onClick={() => openConfirmDefault(v.Id)}
                                          disabled={v.IsLatest}
                                          title={
                                            v.IsLatest
                                              ? "Default"
                                              : "Set as default"
                                          }
                                        >
                                          <GoCheckCircle />
                                        </button>
                                      </PermissionGuard>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ) : null}
                </div>
              );
            })}
            {loading && (
              <div className="px-4 py-6 text-sm text-default-500">
                Loading...
              </div>
            )}
            {!loading && (items ?? []).length === 0 && (
              <div className="px-4 py-6 text-sm text-default-500">
                No records found.
              </div>
            )}
          </div>
          {/* Footer */}
          <div className="flex items-center justify-between gap-2 px-4 py-3 bg-default-50">
              <span className="text-small text-gray-500">
                Items per Page: {items?.length || 0}
              </span>
              <Pagination
                isCompact
                showControls
                showShadow
                color="secondary"
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
              />
              <span className="text-small text-gray-500">
              Total Items:{" "}
              {
                (sizeMeasurement ?? []).filter(
                  (m: any) => !m?.OriginalSizeMeasurementId
                ).length
              }
              </span>
            </div>
                      </div>

        {isViewModal ? (
          <ViewMeasurementChart
            isOpen={isViewModal}
            measurementId={selectedSizeOptionId}
            sizeOptionName={""}
            onCloseViewModal={handleCloseModal}
          />
        ) : (
          <></>
        )}

        {isAddModalOpen ? (
          <AddSizeOptions
            isOpen={isAddModalOpen}
            closeAddModal={closeAddModal}
            isEdit={isEdit}
            sizeId={selectedSizeOptionId}
          />
        ) : (
          <></>
        )}

        <DeleteSizeOptions
          isOpen={isOpenDeletModal}
          onClose={closeDeleteModal}
          onSuccess={handleDeleteSuccess}
          sizeOptionId={selectedSizeOptionId}
        />
        <SetDefaultConfirm
          isOpen={confirmDefaultOpen}
          measurementId={pendingDefaultId}
          onClose={closeConfirmDefault}
          onSuccess={handleSetDefaultSuccess}
        />
        <CompareMeasurementsModal
          isOpen={compareOpen}
          left={compareLeft}
          right={compareRight}
          onClose={() => {
            setCompareOpen(false);
            setCompareLeft(null);
            setCompareRight(null);
          }}
        />
      </div>
    </>
  );
};

export default ProductSizeMeasurements;
