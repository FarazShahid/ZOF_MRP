"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import useProductStore from "@/store/useProductStore";
import Lightbox from "@/src/app/components/gallery/Lightbox";
import Link from "next/link";

const GalleryPage = () => {
  const [selectedClientId, setSelectedClientId] = useState<number | "all">("all");
  const [selectedProductId, setSelectedProductId] = useState<number | "all">("all");
  const [query, setQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [clientMenuOpen, setClientMenuOpen] = useState(false);
  const [clientSearch, setClientSearch] = useState("");
  const clientMenuRef = useRef<HTMLDivElement | null>(null);
  const clientButtonRef = useRef<HTMLButtonElement | null>(null);
  const clientPanelRef = useRef<HTMLDivElement | null>(null);
  const [clientPanelPos, setClientPanelPos] = useState<{ left: number; top: number; width: number }>({ left: 0, top: 0, width: 288 });
  const [productMenuOpen, setProductMenuOpen] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const productMenuRef = useRef<HTMLDivElement | null>(null);
  const productButtonRef = useRef<HTMLButtonElement | null>(null);
  const productPanelRef = useRef<HTMLDivElement | null>(null);
  const [productPanelPos, setProductPanelPos] = useState<{ left: number; top: number; width: number }>({ left: 0, top: 0, width: 288 });

  const [density, setDensity] = useState<"comfortable" | "compact">("comfortable");

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const attachments = useProductStore((s) => s.productAttachments);
  const fetchProductAttachments = useProductStore((s) => s.fetchProductAttachments);
  const storeLoading = useProductStore((s) => s.loading);
  const attachmentsPagination = useProductStore((s) => s.attachmentsPagination);
  const hasMore = useProductStore((s) => s.attachmentsPagination?.hasMore ?? false);
  const loadMoreProductAttachments = useProductStore((s) => s.loadMoreProductAttachments);
  const loadingMore = useProductStore((s) => s.attachmentsLoadingMore);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!Array.isArray(attachments) || attachments.length === 0) fetchProductAttachments();
  }, [Array.isArray(attachments) ? attachments.length : 0, fetchProductAttachments]);

  // Infinite scroll observer
  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;
    if (!hasMore) return;

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && hasMore && !loadingMore) {
        loadMoreProductAttachments();
      }
    }, { rootMargin: "200px 0px" });

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, loadMoreProductAttachments]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const insideClientButton = clientMenuRef.current?.contains(target);
      const insideClientPanel = clientPanelRef.current?.contains(target);
      if (!insideClientButton && !insideClientPanel) setClientMenuOpen(false);
      const insideProductButton = productMenuRef.current?.contains(target);
      const insideProductPanel = productPanelRef.current?.contains(target);
      if (!insideProductButton && !insideProductPanel) setProductMenuOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // Quick keyboard focus to search with '/'
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/") {
        const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
        const isTyping = tag === "input" || tag === "textarea" || (e.target as HTMLElement)?.isContentEditable;
        if (!isTyping) {
          e.preventDefault();
          searchInputRef.current?.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const updateClientPanelPosition = () => {
    const btn = clientButtonRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    setClientPanelPos({
      left: rect.right - 288,
      top: rect.bottom + 8,
      width: 288,
    });
  };

  useEffect(() => {
    if (!clientMenuOpen) return;
    updateClientPanelPosition();
    const onWin = () => updateClientPanelPosition();
    window.addEventListener("resize", onWin);
    window.addEventListener("scroll", onWin, true);
    return () => {
      window.removeEventListener("resize", onWin);
      window.removeEventListener("scroll", onWin, true);
    };
  }, [clientMenuOpen]);

  const updateProductPanelPosition = () => {
    const btn = productButtonRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    setProductPanelPos({
      left: rect.right - 288,
      top: rect.bottom + 8,
      width: 288,
    });
  };

  useEffect(() => {
    if (!productMenuOpen) return;
    updateProductPanelPosition();
    const onWin = () => updateProductPanelPosition();
    window.addEventListener("resize", onWin);
    window.addEventListener("scroll", onWin, true);
    return () => {
      window.removeEventListener("resize", onWin);
      window.removeEventListener("scroll", onWin, true);
    };
  }, [productMenuOpen]);

  const imageTypes = useMemo(() => new Set(["png","jpg","jpeg","gif","webp","svg","bmp","tiff","avif"]), []);

  type ImageEntry = { key: string; productId: number; productName: string; clientId: number; clientName: string; fileName: string; fileUrl: string };

  const allImageEntries = useMemo(() => {
    const list: ImageEntry[] = [];
    const src = Array.isArray(attachments) ? attachments : [];
    for (const item of src) {
      for (const att of item.attachments || []) {
        const type = (att.fileType || "").toLowerCase();
        if (!imageTypes.has(type)) continue;
        list.push({
          key: `${item.productId}-${att.mediaId}`,
          productId: item.productId,
          productName: item.productName,
          clientId: item.clientId,
          clientName: item.clientName,
          fileName: att.fileName,
          fileUrl: att.fileUrl,
        });
      }
    }
    return list;
  }, [attachments, imageTypes]);

  const clientOptions = useMemo(() => {
    const map = new Map<number, string>();
    for (const e of allImageEntries) map.set(e.clientId, e.clientName);
    return Array.from(map.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [allImageEntries]);

  const clientCounts = useMemo(() => {
    const counts = new Map<number, number>();
    for (const e of allImageEntries) counts.set(e.clientId, (counts.get(e.clientId) || 0) + 1);
    return counts;
  }, [allImageEntries]);

  const productOptions = useMemo(() => {
    const map = new Map<number, string>();
    for (const e of allImageEntries) map.set(e.productId, e.productName);
    return Array.from(map.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [allImageEntries]);

  const productCounts = useMemo(() => {
    const counts = new Map<number, number>();
    for (const e of allImageEntries) counts.set(e.productId, (counts.get(e.productId) || 0) + 1);
    return counts;
  }, [allImageEntries]);

  const filteredImages = useMemo(() => {
    let result = allImageEntries;
    if (selectedClientId !== "all") result = result.filter((e) => e.clientId === selectedClientId);
    if (selectedProductId !== "all") result = result.filter((e) => e.productId === selectedProductId);
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter((e) => e.productName.toLowerCase().includes(q) || e.fileName.toLowerCase().includes(q));
    }
    return result;
  }, [allImageEntries, selectedClientId, selectedProductId, query]);

  // Show skeleton only for initial load (not while fetching more pages)
  const isLoading = storeLoading && (!Array.isArray(attachments) || attachments.length === 0);

  const resetFilters = () => {
    setSelectedClientId("all");
    setSelectedProductId("all");
    setQuery("");
  };

  const masonryClassName = density === "compact"
    ? "columns-2 md:columns-3 xl:columns-5 gap-3 [column-fill:_balance]"
    : "columns-2 md:columns-3 xl:columns-4 gap-4 [column-fill:_balance]";

  return (
        <div className="flex flex-col gap-5">
          <div className="rounded-2xl border border-transparent bg-gradient-to-r from-blue-50/80 to-fuchsia-50/80 dark:from-blue-950/20 dark:to-fuchsia-950/20 p-4">
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">Gallery</h1>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Browse products visually. Filter by client and search by name.</p>
          </div>

          <div className="sticky top-2 z-[5]">
            <div className="flex flex-wrap items-center gap-2 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md rounded-xl border border-gray-200 dark:border-gray-800 p-2 shadow-sm">
              <div className="relative flex-1 min-w-[220px]">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </span>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products…"
                  className="w-full text-sm bg-transparent pl-9 pr-14 py-2 rounded-md border border-gray-200 dark:border-gray-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 outline-none"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="absolute right-9 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label="Clear search"
                    title="Clear"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                ) : null}
              </div>

              <div className="relative" ref={clientMenuRef}>
                <button
                  type="button"
                  ref={clientButtonRef}
                  onClick={() => setClientMenuOpen((v) => !v)}
                  aria-haspopup="listbox"
                  aria-expanded={clientMenuOpen}
                  className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-neutral-800"
                >
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
                  {selectedClientId === "all"
                    ? "Client: All"
                    : `Client: ${clientOptions.find((c) => c.id === selectedClientId)?.name || selectedClientId}`}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${clientMenuOpen ? "rotate-180" : ""} transition-transform`}>
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                {clientMenuOpen && createPortal(
                  <div
                    ref={clientPanelRef}
                    style={{ position: "fixed", left: clientPanelPos.left, top: clientPanelPos.top, width: clientPanelPos.width, zIndex: 10000 }}
                    className="max-h-96 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-neutral-900 shadow-xl"
                  >
                    <div className="p-2 border-b border-gray-100 dark:border-neutral-800">
                      <input
                        type="text"
                        value={clientSearch}
                        onChange={(e) => setClientSearch(e.target.value)}
                        placeholder="Search clients…"
                        className="w-full text-sm bg-transparent px-2 py-1.5 rounded-md border border-gray-200 dark:border-gray-700"
                      />
                    </div>
                    <div className="max-h-72 overflow-auto">
                      <button
                        className={`w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-neutral-800 ${selectedClientId === "all" ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
                        onClick={() => { setSelectedClientId("all"); setClientMenuOpen(false); }}
                      >
                        <span>All clients</span>
                        <span className="text-[11px] text-gray-500">{allImageEntries.length}</span>
                      </button>
                      {clientOptions
                        .filter((c) => c.name.toLowerCase().includes(clientSearch.toLowerCase()))
                        .map((c) => (
                          <button
                            key={c.id}
                            className={`w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-neutral-800 ${selectedClientId === c.id ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
                            onClick={() => { setSelectedClientId(c.id); setClientMenuOpen(false); }}
                          >
                            <span className="truncate">{c.name}</span>
                            <span className="flex items-center gap-1">
                              {selectedClientId === c.id ? (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              ) : null}
                              <span className="text-[11px] text-gray-500">{clientCounts.get(c.id) || 0}</span>
                            </span>
                          </button>
                        ))}
                    </div>
                  </div>,
                  document.body
                )}
              </div>

              <div className="relative" ref={productMenuRef}>
                <button
                  type="button"
                  ref={productButtonRef}
                  onClick={() => setProductMenuOpen((v) => !v)}
                  aria-haspopup="listbox"
                  aria-expanded={productMenuOpen}
                  className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-neutral-800"
                >
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                  {selectedProductId === "all"
                    ? "Product: All"
                    : `Product: ${productOptions.find((p) => p.id === selectedProductId)?.name || selectedProductId}`}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${productMenuOpen ? "rotate-180" : ""} transition-transform`}>
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                {productMenuOpen && createPortal(
                  <div
                    ref={productPanelRef}
                    style={{ position: "fixed", left: productPanelPos.left, top: productPanelPos.top, width: productPanelPos.width, zIndex: 10000 }}
                    className="max-h-96 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-neutral-900 shadow-xl"
                  >
                    <div className="p-2 border-b border-gray-100 dark:border-neutral-800">
                      <input
                        type="text"
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        placeholder="Search products…"
                        className="w-full text-sm bg-transparent px-2 py-1.5 rounded-md border border-gray-200 dark:border-gray-700"
                      />
                    </div>
                    <div className="max-h-72 overflow-auto">
                      <button
                        className={`w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-neutral-800 ${selectedProductId === "all" ? "bg-emerald-50 dark:bg-emerald-900/20" : ""}`}
                        onClick={() => { setSelectedProductId("all"); setProductMenuOpen(false); }}
                      >
                        <span>All products</span>
                        <span className="text-[11px] text-gray-500">{allImageEntries.length}</span>
                      </button>
                      {productOptions
                        .filter((p) => p.name.toLowerCase().includes(productSearch.toLowerCase()))
                        .map((p) => (
                          <button
                            key={p.id}
                            className={`w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-neutral-800 ${selectedProductId === p.id ? "bg-emerald-50 dark:bg-emerald-900/20" : ""}`}
                            onClick={() => { setSelectedProductId(p.id); setProductMenuOpen(false); }}
                          >
                            <span className="truncate">{p.name}</span>
                            <span className="flex items-center gap-1">
                              {selectedProductId === p.id ? (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              ) : null}
                              <span className="text-[11px] text-gray-500">{productCounts.get(p.id) || 0}</span>
                            </span>
                          </button>
                        ))}
                    </div>
                  </div>,
                  document.body
                )}
              </div>

              <div className="hidden md:flex items-center gap-1 border border-gray-200 dark:border-gray-700 rounded-md p-0.5">
                <button
                  type="button"
                  onClick={() => setDensity("comfortable")}
                  className={`px-2 py-1.5 text-xs rounded ${density === "comfortable" ? "bg-gray-100 dark:bg-neutral-800" : "hover:bg-gray-100 dark:hover:bg-neutral-800"}`}
                  title="Comfortable grid"
                >
                  Comfort
                </button>
                <button
                  type="button"
                  onClick={() => setDensity("compact")}
                  className={`px-2 py-1.5 text-xs rounded ${density === "compact" ? "bg-gray-100 dark:bg-neutral-800" : "hover:bg-gray-100 dark:hover:bg-neutral-800"}`}
                  title="Compact grid"
                >
                  Compact
                </button>
              </div>

              
              <div className="ml-auto flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 6v6l4 2"></path>
                  </svg>
                  {isLoading ? "Loading…" : `${filteredImages.length} images`}
                </span>
                {(selectedClientId !== "all" || selectedProductId !== "all" || query) && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="text-xs px-2 py-1 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-neutral-800"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          {(selectedClientId !== "all" || selectedProductId !== "all" || query) ? (
            <div className="flex flex-wrap items-center gap-2 -mt-2">
              {selectedClientId !== "all" ? (
                <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
                  Client: {clientOptions.find((c) => c.id === selectedClientId)?.name || selectedClientId}
                </span>
              ) : null}
              {selectedProductId !== "all" ? (
                <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                  Product: {productOptions.find((p) => p.id === selectedProductId)?.name || selectedProductId}
                </span>
              ) : null}
              {query ? (
                <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/60">
                  Query: "{query}"
                </span>
              ) : null}
            </div>
          ) : null}

          {isLoading ? (
            <div className={masonryClassName}>
              {Array.from({ length: density === "compact" ? 18 : 14 }).map((_, i) => {
                const heights = ["h-32", "h-40", "h-48", "h-56", "h-64"] as const;
                const h = heights[i % heights.length];
                return (
                  <div key={i} className="mb-4 break-inside-avoid rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm shadow-md overflow-hidden">
                    <div className={`w-full ${h} bg-gray-100 dark:bg-neutral-800 animate-pulse`} />
                  </div>
                );
              })}
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-16 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-neutral-900/40">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <path d="M21 15l-5-5L5 21"></path>
              </svg>
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">No images match your filters.</p>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-sm px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-neutral-800"
                >
                  Reset filters
                </button>
              </div>
            </div>
          ) : (
            <div className={masonryClassName}>
              {filteredImages.map((e, idx) => (
                <div
                  key={e.key}
                  className="mb-4 break-inside-avoid rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm shadow-md overflow-hidden cursor-zoom-in group relative"
                  onClick={() => { setLightboxIndex(idx); setLightboxOpen(true); }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(ev) => { if (ev.key === "Enter" || ev.key === " ") { setLightboxIndex(idx); setLightboxOpen(true); } }}
                >
                  <img
                    src={e.fileUrl}
                    alt={e.productName}
                    className="w-full h-auto block"
                    loading="lazy"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <div className="truncate font-medium text-white drop-shadow-sm text-[13px]">{e.productName}</div>
                    <div className="mt-1 inline-flex items-center text-[10px] px-2 py-0.5 rounded-full bg-white/85 text-gray-800 dark:bg-neutral-800/85 backdrop-blur">
                      {e.clientName}
                    </div>
                  </div>
                  <div className="absolute right-2 top-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a
                      href={e.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(ev) => ev.stopPropagation()}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-black/30 hover:bg-black/40 text-white backdrop-blur-sm"
                      title="Open in new tab"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <path d="M15 3h6v6" />
                        <path d="M10 14 21 3" />
                      </svg>
                    </a>
                    <Link
                      href={`/product/${e.productId}`}
                      onClick={(ev) => ev.stopPropagation()}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-black/30 hover:bg-black/40 text-white backdrop-blur-sm"
                      title="Open product details"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
              {/* Sentinel for infinite scroll */}
              <div ref={loadMoreRef} className="h-8 w-full" />
            </div>
          )}

          {/* Load-more indicator / end-of-list message */}
          {!isLoading && Array.isArray(attachments) && attachments.length > 0 ? (
            <div className="flex items-center justify-center py-3 text-xs text-gray-600 dark:text-gray-300">
              {loadingMore ? (
                <span className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.25"></circle>
                    <path d="M22 12a10 10 0 0 1-10 10" strokeOpacity="0.9"></path>
                  </svg>
                  Loading more…
                </span>
              ) : hasMore ? null : (
                <span className="px-2 py-1 rounded-md bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-gray-700">
                  No more results
                </span>
              )}
            </div>
          ) : null}

          <Lightbox
            open={lightboxOpen}
            items={filteredImages.map((e) => ({ src: e.fileUrl, title: e.productName, subtitle: e.clientName }))}
            index={lightboxIndex}
            onClose={() => setLightboxOpen(false)}
            onPrev={() => setLightboxIndex((i) => (i - 1 + filteredImages.length) % filteredImages.length)}
            onNext={() => setLightboxIndex((i) => (i + 1) % filteredImages.length)}
          />
        </div>
  );
};

export default GalleryPage;


