"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { PERMISSIONS_ENUM } from "@/src/types/rightids";
import useProductStore from "@/store/useProductStore";
import ProductTile from "@/src/app/components/gallery/ProductTile";
import Lightbox from "@/src/app/components/gallery/Lightbox";

const GalleryPage = () => {
  const [selectedClientId, setSelectedClientId] = useState<number | "all">("all");
  const [query, setQuery] = useState("");
  const [clientMenuOpen, setClientMenuOpen] = useState(false);
  const [clientSearch, setClientSearch] = useState("");
  const clientMenuRef = useRef<HTMLDivElement | null>(null);
  const clientButtonRef = useRef<HTMLButtonElement | null>(null);
  const clientPanelRef = useRef<HTMLDivElement | null>(null);
  const [clientPanelPos, setClientPanelPos] = useState<{ left: number; top: number; width: number }>({ left: 0, top: 0, width: 288 });

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const attachments = useProductStore((s) => s.productAttachments);
  const fetchProductAttachments = useProductStore((s) => s.fetchProductAttachments);
  const storeLoading = useProductStore((s) => s.loading);

  useEffect(() => {
    if (!attachments || attachments.length === 0) fetchProductAttachments();
  }, [attachments?.length, fetchProductAttachments]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const insideButton = clientMenuRef.current?.contains(target);
      const insidePanel = clientPanelRef.current?.contains(target);
      if (!insideButton && !insidePanel) setClientMenuOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
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

  const imageTypes = useMemo(() => new Set(["png","jpg","jpeg","gif","webp","svg","bmp","tiff","avif"]), []);

  type ImageEntry = { key: string; productId: number; productName: string; clientId: number; clientName: string; fileName: string; fileUrl: string };

  const allImageEntries = useMemo(() => {
    const list: ImageEntry[] = [];
    for (const item of attachments || []) {
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

  const filteredImages = useMemo(() => {
    let result = allImageEntries;
    if (selectedClientId !== "all") result = result.filter((e) => e.clientId === selectedClientId);
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter((e) => e.productName.toLowerCase().includes(q) || e.fileName.toLowerCase().includes(q));
    }
    return result;
  }, [allImageEntries, selectedClientId, query]);

  const isLoading = storeLoading;

  const resetFilters = () => {
    setSelectedClientId("all");
    setQuery("");
  };

  return (
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Gallery</h1>
            <p className="text-sm text-gray-600 mt-1">Browse products visually. Filter by client and search by name.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-lg p-2">
            <div className="relative flex-1 min-w-[220px]">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products…"
                className="w-full text-sm bg-transparent pl-9 pr-8 py-2 rounded-md border border-gray-200 dark:border-gray-700"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
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
                  className="max-h-80 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-neutral-900 shadow-xl"
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
                  <div className="max-h-60 overflow-auto">
                    <button
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-neutral-800 ${selectedClientId === "all" ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
                      onClick={() => { setSelectedClientId("all"); setClientMenuOpen(false); }}
                    >
                      All clients
                    </button>
                    {clientOptions
                      .filter((c) => c.name.toLowerCase().includes(clientSearch.toLowerCase()))
                      .map((c) => (
                        <button
                          key={c.id}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-neutral-800 ${selectedClientId === c.id ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
                          onClick={() => { setSelectedClientId(c.id); setClientMenuOpen(false); }}
                        >
                          {c.name}
                        </button>
                      ))}
                  </div>
                </div>,
                document.body
              )}
            </div>
            {(selectedClientId !== "all" || query) && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-sm px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-neutral-800"
              >
                Reset
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="text-sm text-gray-500 dark:text-gray-400">Loading…</div>
          ) : filteredImages.length === 0 ? (
            <div className="text-sm text-gray-500 dark:text-gray-400">No products found.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
              {filteredImages.map((e, idx) => (
                <ProductTile
                  key={e.key}
                  name={e.productName}
                  category={e.clientName}
                  imageSrc={e.fileUrl}
                  linkUrl={e.fileUrl}
                  onClick={() => { setLightboxIndex(idx); setLightboxOpen(true); }}
                />
              ))}
            </div>
          )}

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


