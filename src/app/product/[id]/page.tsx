"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminDashboardLayout from "@/src/app/components/common/AdminDashboardLayout";
import PermissionGuard from "@/src/app/components/auth/PermissionGaurd";
import { PERMISSIONS_ENUM } from "@/src/types/rightids";
import ProductStatusBadge from "@/src/app/components/product/ProductStatusBadge";
import useProductStore from "@/store/useProductStore";
import { useDocumentCenterStore } from "@/store/useDocumentCenterStore";
import { DOCUMENT_REFERENCE_TYPE } from "@/interface";
import { Spinner } from "@heroui/react";
import { CgAttachment } from "react-icons/cg";
import { Edit } from "lucide-react";
import Link from "next/link";
import { downloadAtIndex } from "@/src/types/admin";

const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp"];

type TabId = "overview" | "variants" | "measurements" | "design-files" | "qa-checklist" | "activity-log";

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "overview", label: "Overview", icon: "ri-dashboard-line" },
  { id: "variants", label: "Variants", icon: "ri-stack-line" },
  // { id: "measurements", label: "Measurements", icon: "ri-ruler-line" },
  { id: "design-files", label: "Design Files", icon: "ri-file-list-line" },
  { id: "qa-checklist", label: "QA Checklist", icon: "ri-checkbox-line" },
  // { id: "activity-log", label: "Activity Log", icon: "ri-time-line" },
];

const ProductDetailPage = () => {
  const params = useParams<{ id: string }>();
  const productId = Number(params?.id);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  const { getProductById, productById, loading } = useProductStore();
  const { fetchDocuments, documentsByReferenceId } = useDocumentCenterStore();

  useEffect(() => {
    if (Number.isFinite(productId) && productId > 0) {
      getProductById(productId);
      fetchDocuments(DOCUMENT_REFERENCE_TYPE.PRODUCT, productId);
    }
  }, [productId]);

  const documents = documentsByReferenceId[productId || 0] || [];

  const selectedColors = useMemo(() => {
    return (productById?.productColors || [])
      .map((c: any) => c?.ColorName)
      .filter(Boolean);
  }, [productById?.productColors]);

  const selectedSizes = useMemo(() => {
    return (productById?.productSizes || []).map((s: any) => s.SizeName).filter(Boolean);
  }, [productById?.productSizes]);

  const selectedPrinting = useMemo(() => {
    return (productById?.printingOptions || [])
      .map((p: any) => p?.PrintingOption?.Type)
      .filter(Boolean);
  }, [productById?.printingOptions]);

  const selectedCutOptions = useMemo(() => {
    return (productById?.productDetails || [])
      .map((d: any) => d?.OptionProductCutOptions)
      .filter(Boolean);
  }, [productById?.productDetails]);

  const selectedSleeveTypes = useMemo(() => {
    return (productById?.productDetails || [])
      .map((d: any) => d?.SleeveTypeName)
      .filter(Boolean);
  }, [productById?.productDetails]);

  const formatDate = (iso?: string) =>
    iso
      ? new Date(iso).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "—";

  const handleEdit = (id: number) => router.push(`/product/editproduct/${id}`);

  const qaList = (productById as any)?.qaChecklist || [];
  const qaProgress = qaList.length > 0 ? 0 : 0; // ZOF qaChecklist has no checked field; could be extended

  if (loading) {
    return (
      <AdminDashboardLayout>
        <PermissionGuard required={PERMISSIONS_ENUM.PRODUCTS.VIEW}>
          <div className="p-8 flex items-center justify-center min-h-[400px]">
            <Spinner />
          </div>
        </PermissionGuard>
      </AdminDashboardLayout>
    );
  }

  if (!productById && !loading) {
    return (
      <AdminDashboardLayout>
        <PermissionGuard required={PERMISSIONS_ENUM.PRODUCTS.VIEW}>
          <div className="p-8">
            <div className="text-center text-white">Product not found</div>
          </div>
        </PermissionGuard>
      </AdminDashboardLayout>
    );
  }

  return (
      <PermissionGuard required={PERMISSIONS_ENUM.PRODUCTS.VIEW}>
        <div className="p-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link href="/product" className="text-slate-400 hover:text-white transition-colors cursor-pointer">
              Products
            </Link>
            <i className="ri-arrow-right-s-line text-slate-600 w-4 h-4 flex items-center justify-center" />
            <span className="text-white">{productById?.Name || `#${productId}`}</span>
          </div>

          {/* Page Header */}
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="text-3xl font-bold text-white">{productById?.Name || "Product"}</h1>
                <ProductStatusBadge
                  status={productById?.productStatus}
                  archived={!!(productById as any)?.isArchived}
                />
              </div>
              <p className="text-slate-400 text-sm">#{productId}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleEdit(Number(productById?.Id))}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium text-sm transition-colors cursor-pointer whitespace-nowrap border border-slate-700 inline-flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              {/* <button
                type="button"
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium text-sm transition-colors cursor-pointer whitespace-nowrap border border-slate-700 inline-flex items-center gap-2"
              >
                <i className="ri-file-copy-line mr-2 w-4 h-4 inline-flex items-center justify-center" />
                Clone
              </button>
              <button
                type="button"
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium text-sm transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-archive-line mr-2 w-4 h-4 inline-flex items-center justify-center" />
                Archive
              </button> */}
            </div>
          </div>

          {/* Tabs Navigation - same as reference */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 mb-6">
            <div className="flex items-center border-b border-slate-800 overflow-x-auto">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium text-sm transition-colors cursor-pointer whitespace-nowrap border-b-2 ${
                    activeTab === tab.id
                      ? "text-blue-500 border-blue-500"
                      : "text-slate-400 border-transparent hover:text-white"
                  }`}
                >
                  <i className={`${tab.icon} w-4 h-4 flex items-center justify-center`} />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Basic Information */}
                    <div className="lg:col-span-2 bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
                      <h2 className="text-xl font-bold text-white mb-6">Basic Information</h2>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="text-sm text-slate-400 mb-2 block">Product Name</label>
                          <div className="text-white font-medium">{productById?.Name ?? "—"}</div>
                        </div>
                        <div>
                          <label className="text-sm text-slate-400 mb-2 block">Product ID</label>
                          <div className="text-white font-medium">#{productId}</div>
                        </div>
                        <div>
                          <label className="text-sm text-slate-400 mb-2 block">Category</label>
                          <div className="text-white font-medium">{(productById as any)?.ProductCategoryName ?? "—"}</div>
                        </div>
                        <div>
                          <label className="text-sm text-slate-400 mb-2 block">Client</label>
                          <div className="text-white font-medium">{(productById as any)?.ClientName ?? "—"}</div>
                        </div>
                        <div>
                          <label className="text-sm text-slate-400 mb-2 block">Fabric Type</label>
                          <div className="text-white font-medium">{(productById as any)?.FabricType ?? "—"}</div>
                        </div>
                        <div>
                          <label className="text-sm text-slate-400 mb-2 block">Fabric Name</label>
                          <div className="text-white font-medium">{(productById as any)?.FabricName ?? "—"}</div>
                        </div>
                        <div>
                          <label className="text-sm text-slate-400 mb-2 block">GSM</label>
                          <div className="text-white font-medium">{(productById as any)?.fabricType?.GSM ?? (productById as any)?.GSM ?? "—"}</div>
                        </div>
                        <div>
                          <label className="text-sm text-slate-400 mb-2 block">Created Date</label>
                          <div className="text-white font-medium">{formatDate(productById?.CreatedOn)}</div>
                        </div>
                        <div>
                          <label className="text-sm text-slate-400 mb-2 block">Status</label>
                          <ProductStatusBadge
                            status={productById?.productStatus}
                            archived={!!(productById as any)?.isArchived}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Summary card */}
                    <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
                      <h2 className="text-xl font-bold text-white mb-6">Summary</h2>
                      <div className="space-y-6">
                        <div>
                          <label className="text-sm text-slate-400 mb-2 block">Colors</label>
                          <div className="text-2xl font-bold text-white">{selectedColors.length}</div>
                          {selectedColors.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {selectedColors.slice(0, 3).map((c, i) => (
                                <span key={i} className="text-xs text-slate-400 truncate max-w-[80px]">{c}</span>
                              ))}
                              {selectedColors.length > 3 && (
                                <span className="text-xs text-slate-500">+{selectedColors.length - 3}</span>
                              )}
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="text-sm text-slate-400 mb-2 block">Sizes</label>
                          <div className="text-2xl font-bold text-white">{selectedSizes.length}</div>
                        </div>
                        <div>
                          <label className="text-sm text-slate-400 mb-2 block">Design Files</label>
                          <div className="text-2xl font-bold text-white">{documents.length}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {(productById?.Description || selectedCutOptions.length > 0 || selectedSleeveTypes.length > 0 || selectedPrinting.length > 0) && (
                    <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
                      <h2 className="text-xl font-bold text-white mb-4">Details</h2>
                      {productById?.Description && (
                        <p className="text-slate-300 leading-relaxed mb-4">{productById.Description}</p>
                      )}
                      {(selectedCutOptions.length > 0 || selectedSleeveTypes.length > 0 || selectedPrinting.length > 0) && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedCutOptions.map((c, i) => (
                            <span key={i} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-200 border border-slate-600">
                              Cut: {c}
                            </span>
                          ))}
                          {selectedSleeveTypes.map((s, i) => (
                            <span key={i} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-200 border border-slate-600">
                              Sleeve: {s}
                            </span>
                          ))}
                          {selectedPrinting.map((p, i) => (
                            <span key={i} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-200 border border-slate-600">
                              {p}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Design Files Tab */}
              {activeTab === "design-files" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-white">Design Files</h2>
                      <p className="text-sm text-slate-400 mt-1">Versioned design files and documentation</p>
                    </div>
                    <button
                      type="button"
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <i className="ri-upload-line mr-2 w-4 h-4 inline-flex items-center justify-center" />
                      Upload New Version
                    </button>
                  </div>
                  {documents.length === 0 ? (
                    <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-12 text-center">
                      <CgAttachment className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                      <p className="text-white font-medium">No files uploaded</p>
                      <p className="text-sm text-slate-400 mt-1">Design files and attachments will appear here.</p>
                    </div>
                  ) : (
                    <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-slate-700">
                            <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-4">File Name</th>
                            <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-4">Version</th>
                            <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-4">Uploaded By</th>
                            <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-4">Date</th>
                            <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-4">Size</th>
                            <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {documents.map((file: any, index: number) => {
                            const isImage = imageExtensions.includes((file?.fileType || "").toLowerCase());
                            const typeClass = isImage ? "bg-green-500/20" : "bg-blue-500/20";
                            const typeIcon = isImage ? "ri-image-line text-green-400" : "ri-file-text-line text-blue-400";
                            return (
                              <tr key={index} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${typeClass}`}>
                                      <i className={`${typeIcon} text-xl w-5 h-5 flex items-center justify-center`} />
                                    </div>
                                    <span className="text-white font-medium">
                                      {file?.fileName ?? (file as any)?.name ?? "—"}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                    {(file as any)?.version ?? "v1"}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-slate-300">{(file as any)?.uploadedBy ?? "—"}</td>
                                <td className="px-6 py-4 text-slate-300">{(file as any)?.createdOn ? formatDate((file as any).createdOn) : "—"}</td>
                                <td className="px-6 py-4 text-slate-300">{(file as any)?.fileSize ?? "—"}</td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => downloadAtIndex(documents, index)}
                                      className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors cursor-pointer"
                                      title="Download"
                                    >
                                      <i className="ri-download-line w-4 h-4 flex items-center justify-center" />
                                    </button>
                                    <button
                                      type="button"
                                      className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors cursor-pointer"
                                      title="History"
                                    >
                                      <i className="ri-history-line w-4 h-4 flex items-center justify-center" />
                                    </button>
                                    <button
                                      type="button"
                                      className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors cursor-pointer"
                                      title="Delete"
                                    >
                                      <i className="ri-delete-bin-line w-4 h-4 flex items-center justify-center" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* QA Checklist Tab - same style as reference */}
              {activeTab === "qa-checklist" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-white">QA Checklist</h2>
                      <p className="text-sm text-slate-400 mt-1">Quality assurance checkpoints and status</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-slate-400">Progress</p>
                        <p className="text-2xl font-bold text-white">{qaList.length > 0 ? Math.round(qaProgress) : 0}%</p>
                      </div>
                      <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                          style={{ width: `${qaList.length > 0 ? qaProgress : 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  {qaList.length === 0 ? (
                    <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-12 text-center">
                      <i className="ri-checkbox-line text-5xl text-slate-500 mx-auto mb-3 block" />
                      <p className="text-white font-medium">No QA checklist items</p>
                      <p className="text-sm text-slate-400 mt-1">QA checklist items will appear here when added.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {qaList.map((item: any) => (
                        <div key={item.id} className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
                          <div className="flex items-start gap-4">
                            <input
                              type="checkbox"
                              checked={!!item.checked}
                              readOnly
                              className="mt-1 w-5 h-5 rounded border-slate-600 bg-slate-900 cursor-pointer"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border bg-slate-500/20 text-slate-400 border-slate-500/30 whitespace-nowrap">
                                  {(item.status || "Pending").charAt(0).toUpperCase() + (item.status || "pending").slice(1)}
                                </span>
                              </div>
                              {(item.assignedTo != null || item.notes) && (
                                <>
                                  {item.assignedTo != null && (
                                    <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
                                      <i className="ri-user-line w-4 h-4 flex items-center justify-center" />
                                      <span>{item.assignedTo}</span>
                                    </div>
                                  )}
                                  {item.notes && (
                                    <div className="bg-slate-900 rounded-lg p-3 border border-slate-700">
                                      <p className="text-sm text-slate-300">{item.notes}</p>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Variants Tab - same structure as reference */}
              {activeTab === "variants" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-white">Product Variants</h2>
                      <p className="text-sm text-slate-400 mt-1">Manage size and color variations with auto-generated SKUs</p>
                    </div>
                  </div>
                  <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-700">
                          <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-4">Size</th>
                          <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-4">Color</th>
                          <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-4">SKU</th>
                          <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-4">Stock</th>
                          <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-4">Price</th>
                          {/* <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-4">Actions</th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          const hasSizes = selectedSizes.length > 0;
                          const hasColors = selectedColors.length > 0;
                          if (!hasSizes && !hasColors) {
                            return (
                              <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                                  No variants defined. Add sizes and colors in product edit to see variants here.
                                </td>
                              </tr>
                            );
                          }
                          const sizes = hasSizes ? selectedSizes : ["—"];
                          const colors = hasColors ? selectedColors : ["—"];
                          return sizes.flatMap((size) =>
                            colors.map((color) => (
                              <tr key={`${size}-${color}`} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                                <td className="px-6 py-4"><span className="text-white font-medium">{size}</span></td>
                                <td className="px-6 py-4 text-slate-300">{color}</td>
                                <td className="px-6 py-4 font-mono text-sm text-blue-400">—</td>
                                <td className="px-6 py-4 text-slate-300">—</td>
                                <td className="px-6 py-4 text-white font-medium">—</td>
                                {/* <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                    <button type="button" className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors cursor-pointer">
                                      <i className="ri-edit-line w-4 h-4 flex items-center justify-center" />
                                    </button>
                                    <button type="button" className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors cursor-pointer">
                                      <i className="ri-delete-bin-line w-4 h-4 flex items-center justify-center" />
                                    </button>
                                  </div>
                                </td> */}
                              </tr>
                            ))
                          );
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Measurements Tab - same structure as reference */}
              {activeTab === "measurements" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-white">Measurements</h2>
                      <p className="text-sm text-slate-400 mt-1">View measurements in table or visual diagram mode</p>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-800 rounded-lg p-1">
                      <button type="button" className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white cursor-pointer whitespace-nowrap">
                        <i className="ri-table-line mr-2 w-4 h-4 inline-flex items-center justify-center" />
                        Table
                      </button>
                      <button type="button" className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white cursor-pointer whitespace-nowrap">
                        <i className="ri-image-line mr-2 w-4 h-4 inline-flex items-center justify-center" />
                        Diagram
                      </button>
                    </div>
                  </div>
                  <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-12 text-center">
                    <i className="ri-ruler-line text-5xl text-slate-500 mx-auto mb-3 block" />
                    <p className="text-white font-medium">No measurements data</p>
                    <p className="text-sm text-slate-400 mt-1">Measurements can be added when available.</p>
                  </div>
                </div>
              )}

              {/* Activity Log Tab - same structure as reference */}
              {activeTab === "activity-log" && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-white">Activity Log</h2>
                    <p className="text-sm text-slate-400 mt-1">Complete history of product changes and updates</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-12 text-center">
                    <i className="ri-time-line text-5xl text-slate-500 mx-auto mb-3 block" />
                    <p className="text-white font-medium">No activity yet</p>
                    <p className="text-sm text-slate-400 mt-1">Product changes and updates will appear here.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </PermissionGuard>
  );
};

export default ProductDetailPage;
