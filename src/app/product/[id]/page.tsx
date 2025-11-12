"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import AdminDashboardLayout from "@/src/app/components/common/AdminDashboardLayout";
import PermissionGuard from "@/src/app/components/auth/PermissionGaurd";
import { PERMISSIONS_ENUM } from "@/src/types/rightids";
import ProductStatusBadge from "@/src/app/components/product/ProductStatusBadge";
import useProductStore from "@/store/useProductStore";
import { useDocumentCenterStore } from "@/store/useDocumentCenterStore";
import { DOCUMENT_REFERENCE_TYPE } from "@/interface";
import { Button, Chip, Spinner } from "@heroui/react";
import { IoMdDownload } from "react-icons/io";
import { CgAttachment } from "react-icons/cg";
import { Package, Layers, CalendarDays, Tag, User2 } from "lucide-react";
import Lightbox from "@/src/app/components/gallery/Lightbox";
import Image from "next/image";
import Link from "next/link";
import { downloadAtIndex } from "@/src/types/admin";

const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp"];

const ProductDetailPage = () => {
  const params = useParams<{ id: string }>();
  const productId = Number(params?.id);

  const { getProductById, productById, loading } = useProductStore();
  const { fetchDocuments, documentsByReferenceId } = useDocumentCenterStore();

  useEffect(() => {
    if (Number.isFinite(productId) && productId > 0) {
      getProductById(productId);
      fetchDocuments(DOCUMENT_REFERENCE_TYPE.PRODUCT, productId);
    }
  }, [productId]);

  // No extra fetch needed for client/fabric; values come nested in productById

  const documents = documentsByReferenceId[productId || 0] || [];

  const { imageDocs, otherDocs } = useMemo(() => {
    const imageDocs = (documents || []).filter((d: any) =>
      imageExtensions.includes(d?.fileType?.toLowerCase())
    );
    const otherDocs = (documents || []).filter(
      (d: any) => !imageExtensions.includes(d?.fileType?.toLowerCase())
    );
    return { imageDocs, otherDocs };
  }, [documents]);

  const imageItems = useMemo(
    () =>
      (imageDocs || []).map((img: any) => ({
        src: img.fileUrl as string,
        title: productById?.Name as string,
        subtitle: ((productById as any)?.client?.Name || (productById as any)?.ClientName) as string,
      })),
    [imageDocs, productById?.Name, (productById as any)?.client?.Name, (productById as any)?.ClientName]
  );

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const hasImages = imageDocs.length > 0;
  const currentImage = hasImages ? imageDocs[Math.min(selectedMediaIndex, imageDocs.length - 1)] : null;
  const [zoomOrigin, setZoomOrigin] = useState<{ x: string; y: string }>({ x: "50%", y: "50%" });

  // No need to map cut/sleeve from stores: names are included in productById.productDetails

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

  return (
    <AdminDashboardLayout>
      <PermissionGuard required={PERMISSIONS_ENUM.PRODUCTS.VIEW}>
        <div className="p-6 bg-white dark:bg-slate-900 rounded">
          <div className="mb-4 text-sm text-slate-500">
            <Link href="/product" className="hover:underline">
              Products
            </Link>
            <span className="mx-2">/</span>
            <span className="text-slate-700 dark:text-slate-200">
              {productById?.Name || `#${productId}`}
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Spinner />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* LEFT: Media viewer + downloads */}
              <div className="lg:col-span-7 space-y-4">
                {hasImages ? (
                  <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-neutral-900 shadow overflow-hidden p-3">
                    <div className="grid grid-cols-12 gap-3">
                      {/* Vertical thumbnails */}
                      <div className="col-span-2">
                        <div className="flex flex-col gap-2 h-[520px] overflow-auto pr-1">
                          {imageDocs.map((thumb: any, idx: number) => {
                            const active = idx === selectedMediaIndex;
                            return (
                              <button
                                key={`${thumb.fileUrl}-${idx}`}
                                type="button"
                                onClick={() => setSelectedMediaIndex(idx)}
                                className={`relative w-full h-20 rounded-md overflow-hidden border ${active ? "border-blue-500 ring-2 ring-blue-200 dark:ring-blue-900/40" : "border-gray-200 dark:border-gray-700"} `}
                                title={thumb.fileName}
                              >
                                <Image
                                  src={thumb.fileUrl}
                                  alt={thumb.fileName || "Thumbnail"}
                                  fill
                                  className="object-cover"
                                />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      {/* Main preview */}
                      <div className="col-span-10">
                        <div
                          className="relative w-full h-[520px] bg-gray-50 dark:bg-neutral-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 group"
                          onMouseMove={(e) => {
                            const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                            const x = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100));
                            const y = Math.min(100, Math.max(0, ((e.clientY - rect.top) / rect.height) * 100));
                            setZoomOrigin({ x: `${x}%`, y: `${y}%` });
                          }}
                          onMouseLeave={() => setZoomOrigin({ x: "50%", y: "50%" })}
                        >
                          {currentImage ? (
                            <>
                              <Image
                                key={currentImage.fileUrl}
                                src={currentImage.fileUrl}
                                alt={currentImage.fileName || "Attachment"}
                                fill
                                className="object-contain transition-transform duration-300 group-hover:scale-[1.15]"
                                style={{ transformOrigin: `${zoomOrigin.x} ${zoomOrigin.y}` }}
                                sizes="100vw"
                              />
                              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none" />
                              <div className="absolute left-3 bottom-3 text-xs text-white/90 bg-black/40 backdrop-blur px-2 py-1 rounded">
                                {selectedMediaIndex + 1} / {imageDocs.length}
                              </div>
                              <div className="absolute right-3 top-3 flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => { setLightboxIndex(selectedMediaIndex); setLightboxOpen(true); }}
                                  className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-black/30 hover:bg-black/40 text-white backdrop-blur-sm"
                                  title="View"
                                >
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                                    <circle cx="12" cy="12" r="3" />
                                  </svg>
                                </button>
                                <a
                                  href={currentImage.fileUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-black/30 hover:bg-black/40 text-white backdrop-blur-sm"
                                  title="Open in new tab"
                                >
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                    <path d="M15 3h6v6" />
                                    <path d="M10 14 21 3" />
                                  </svg>
                                </a>
                              </div>
                              {imageDocs.length > 1 ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => setSelectedMediaIndex((i) => (i - 1 + imageDocs.length) % imageDocs.length)}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/30 hover:bg-black/40 text-white"
                                    aria-label="Previous image"
                                  >
                                    ‹
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setSelectedMediaIndex((i) => (i + 1) % imageDocs.length)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/30 hover:bg-black/40 text-white"
                                    aria-label="Next image"
                                  >
                                    ›
                                  </button>
                                </>
                              ) : null}
                            </>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-neutral-900 shadow overflow-hidden p-6">
                    <div className="flex flex-col items-center justify-center text-center h-[360px] md:h-[520px]">
                      <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center border border-gray-200 dark:border-gray-700">
                        <CgAttachment className="w-7 h-7 text-gray-400" />
                      </div>
                      <div className="mt-3 text-sm font-medium text-gray-800 dark:text-gray-200">No product images</div>
                      <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 max-w-sm">
                        When attachments are added for this product, they will appear here.
                      </div>
                    </div>
                  </div>
                )}

                {otherDocs.length > 0 && (
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-2">
                        <CgAttachment />
                        <span className="text-sm font-bold text-gray-900 uppercase tracking-wider">Downloads</span>
                      </div>
                      <span className="text-xs text-slate-500">{otherDocs.length} files</span>
                    </div>
                    <div className="p-4 space-y-2">
                      {otherDocs.map((attachment: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors">
                          <span className="text-sm font-medium text-gray-900 truncate">
                            {attachment.fileName}.{attachment.fileType}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const realIndex = (documents as any[]).findIndex(
                                (d) => d?.fileUrl === attachment.fileUrl && d?.fileName === attachment.fileName
                              );
                              downloadAtIndex(documents as any, realIndex === -1 ? 0 : realIndex);
                            }}
                            className="p-2 hover:bg-green-100 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400 rounded"
                            title="Download"
                          >
                            <IoMdDownload />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Lightbox
                  open={lightboxOpen}
                  items={imageItems}
                  index={lightboxIndex}
                  onClose={() => setLightboxOpen(false)}
                  onPrev={() => setLightboxIndex((i) => (i - 1 + imageItems.length) % imageItems.length)}
                  onNext={() => setLightboxIndex((i) => (i + 1) % imageItems.length)}
                />
              </div>

              {/* RIGHT: Info panel inspired by product page */}
              <div className="lg:col-span-5">
                <div className="sticky top-6 space-y-6">
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{productById?.Name || "Product"}</h2>
                        <div className="mt-2 flex items-center gap-2">
                          <ProductStatusBadge status={productById?.productStatus} archived={!!(productById as any)?.isArchived} />
                          <span className="text-sm text-slate-500">#{productId}</span>
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 dark:bg-neutral-800 border border-slate-200 dark:border-slate-700">
                            <User2 className="w-4 h-4 text-slate-500" />
                            {(productById as any)?.client?.Name || (productById as any)?.ClientName || "—"}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 dark:bg-neutral-800 border border-slate-200 dark:border-slate-700">
                            <Layers className="w-4 h-4 text-slate-500" />
                            {(productById as any)?.ProductCategoryName || "—"}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 dark:bg-neutral-800 border border-slate-200 dark:border-slate-700">
                            <CalendarDays className="w-4 h-4 text-slate-500" />
                            {formatDate(productById?.CreatedOn)}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/product/editproduct/${productId}`}>
                          <Button color="primary">Edit</Button>
                        </Link>
                        <Link href="/product">
                          <Button variant="flat" color="primary">Back</Button>
                        </Link>
                      </div>
                    </div>

                    {/* Quick stats */}
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <div className="rounded-md border border-slate-200 dark:border-slate-700 px-3 py-2 text-center">
                        <div className="text-[11px] uppercase tracking-wider text-slate-500">Colors</div>
                        <div className="text-base font-semibold text-slate-800 dark:text-slate-100">{selectedColors.length}</div>
                      </div>
                      <div className="rounded-md border border-slate-200 dark:border-slate-700 px-3 py-2 text-center">
                        <div className="text-[11px] uppercase tracking-wider text-slate-500">Sizes</div>
                        <div className="text-base font-semibold text-slate-800 dark:text-slate-100">{selectedSizes.length}</div>
                      </div>
                      <div className="rounded-md border border-slate-200 dark:border-slate-700 px-3 py-2 text-center">
                        <div className="text-[11px] uppercase tracking-wider text-slate-500">Images</div>
                        <div className="text-base font-semibold text-slate-800 dark:text-slate-100">{imageDocs.length}</div>
                      </div>
                    </div>

                    {/* Specifications */}
                    <div className="mt-6">
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Specifications</div>
                      <div className="rounded-md border border-slate-200 dark:border-slate-700 p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2"><Package className="w-4 h-4 text-slate-500" /><span>{productById?.Name ?? "—"}</span></div>
                        <div className="flex items-center gap-2"><User2 className="w-4 h-4 text-slate-500" /><span>{(productById as any)?.client?.Name || (productById as any)?.ClientName || "—"}</span></div>
                        <div className="flex items-center gap-2"><Layers className="w-4 h-4 text-slate-500" /><span>{(productById as any)?.ProductCategoryName || "—"}</span></div>
                        <div className="flex items-center gap-2"><Tag className="w-4 h-4 text-slate-500" /><span>{(productById as any)?.fabricType?.Type || (productById as any)?.FabricType || "—"}</span></div>
                        <div className="flex items-center gap-2"><Layers className="w-4 h-4 text-slate-500" /><span>{(productById as any)?.fabricType?.Name || (productById as any)?.FabricName || "—"}</span></div>
                        <div className="flex items-center gap-2"><Tag className="w-4 h-4 text-slate-500" /><span>GSM: {(productById as any)?.fabricType?.GSM ?? "—"}</span></div>
                        <div className="flex items-center gap-2"><CalendarDays className="w-4 h-4 text-slate-500" /><span>{formatDate(productById?.CreatedOn)}</span></div>
                      </div>
                    </div>

                    {/* Option chips */}
                    {selectedColors.length > 0 && (
                      <details className="group py-3">
                        <summary className="flex items-center justify-between cursor-pointer list-none border-b border-slate-200 dark:border-slate-700 pb-2">
                          <span className="text-sm font-medium flex items-center gap-2">
                            Colors
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                              {selectedColors.length}
                            </span>
                          </span>
                          <span className="transition-transform group-open:rotate-45 text-xl leading-none">+</span>
                        </summary>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {selectedColors.map((name: string, i: number) => (
                            <Chip key={`${name}-${i}`} radius="full" size="sm">{name}</Chip>
                          ))}
                        </div>
                      </details>
                    )}
                    {selectedSizes.length > 0 && (
                      <details className="group py-3">
                        <summary className="flex items-center justify-between cursor-pointer list-none border-b border-slate-200 dark:border-slate-700 pb-2">
                          <span className="text-sm font-medium flex items-center gap-2">
                            Sizes
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
                              {selectedSizes.length}
                            </span>
                          </span>
                          <span className="transition-transform group-open:rotate-45 text-xl leading-none">+</span>
                        </summary>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {selectedSizes.map((s, i) => (
                            <Chip key={i} radius="full" size="sm">{s}</Chip>
                          ))}
                        </div>
                      </details>
                    )}
                    {selectedPrinting.length > 0 && (
                      <details className="group py-3">
                        <summary className="flex items-center justify-between cursor-pointer list-none border-b border-slate-200 dark:border-slate-700 pb-2">
                          <span className="text-sm font-medium flex items-center gap-2">
                            Printing
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/60">
                              {selectedPrinting.length}
                            </span>
                          </span>
                          <span className="transition-transform group-open:rotate-45 text-xl leading-none">+</span>
                        </summary>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {selectedPrinting.map((p, i) => (
                            <Chip key={i} radius="full" size="sm">{p}</Chip>
                          ))}
                        </div>
                      </details>
                    )}
                    {(selectedCutOptions.length > 0 || selectedSleeveTypes.length > 0) && (
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedCutOptions.length > 0 && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Cut Options</div>
                          
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {selectedCutOptions.map((c, i) => (
                                <Chip key={i} radius="full" size="sm">{c}</Chip>
                              ))}
                            </div>
                          </div>
                        )}
                        {selectedSleeveTypes.length > 0 && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sleeve Type</div>
                             
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {selectedSleeveTypes.map((s, i) => (
                                <Chip key={i} radius="full" size="sm">{s}</Chip>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Collapsible sections */}
                    <div className="mt-6 divide-y divide-slate-200 dark:divide-slate-700">

                      {productById?.Description ? (
                        <details className="group py-3">
                          <summary className="flex items-center justify-between cursor-pointer list-none">
                            <span className="text-sm font-medium">Description</span>
                            <span className="transition-transform group-open:rotate-45 text-xl leading-none">+</span>
                          </summary>
                          <p className="mt-3 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{productById.Description}</p>
                        </details>
                      ) : null}

                      {productById?.qaChecklist && productById.qaChecklist.length > 0 ? (
                        <details className="group py-3">
                          <summary className="flex items-center justify-between cursor-pointer list-none">
                            <span className="text-sm font-medium">QA Checklist</span>
                            <span className="transition-transform group-open:rotate-45 text-xl leading-none">+</span>
                          </summary>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {productById.qaChecklist.map((q) => (
                              <Chip key={q.id} radius="full" size="sm">{q.name}</Chip>
                            ))}
                          </div>
                        </details>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </PermissionGuard>
    </AdminDashboardLayout>
  );
};

export default ProductDetailPage;


