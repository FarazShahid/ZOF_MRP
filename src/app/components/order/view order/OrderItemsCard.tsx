import { GetOrderByIdType } from "@/src/app/interfaces/OrderStoreInterface";
import React, { useEffect, useMemo, useState } from "react";
import QASheetGenerator from "./QASheetGenerator";
import ItemCard from "./ItemCard";

interface CardProps {
  OrderById: GetOrderByIdType;
}

const OrderItemsCard: React.FC<CardProps> = ({ OrderById }) => {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categoryFolders = useMemo(() => {
    const counts = new Map<string, number>();
    (OrderById?.items || []).forEach((i) => {
      const name = i.ProductCategoryName || "Uncategorized";
      counts.set(name, (counts.get(name) || 0) + 1);
    });
    return Array.from(counts.entries()).map(([name, count]) => ({ name, count }));
  }, [OrderById?.items]);

  const filteredItems = useMemo(() => {
    if (!categoryFilter || categoryFilter === "All") return OrderById?.items || [];
    return (OrderById?.items || []).filter(
      (i) => i.ProductCategoryName === categoryFilter
    );
  }, [OrderById?.items, categoryFilter]);

  const visibleItemIds = useMemo(() => filteredItems.map((i) => i.Id), [filteredItems]);
  const selectedVisibleCount = useMemo(
    () => selectedItems.filter((id) => visibleItemIds.includes(id)).length,
    [selectedItems, visibleItemIds]
  );
  const areAllVisibleSelected = useMemo(
    () => visibleItemIds.length > 0 && selectedVisibleCount === visibleItemIds.length,
    [visibleItemIds, selectedVisibleCount]
  );

  const totalUnits = useMemo(
    () =>
      (OrderById?.items ?? []).reduce(
        (sum, item) =>
          sum +
          (item.orderItemDetails ?? []).reduce(
            (s, d) => s + (Number(d.Quantity) || 0),
            0
          ),
        0
      ),
    [OrderById?.items]
  );

  const handleSelectAll = () => {
    if (areAllVisibleSelected) {
      setSelectedItems((prev) => prev.filter((id) => !visibleItemIds.includes(id)));
      return;
    }
    setSelectedItems((prev) => Array.from(new Set([...prev, ...visibleItemIds])));
  };

  const handleSelectItem = (itemId: number) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  useEffect(() => {
    setSelectedItems((prev) => prev.filter((id) => visibleItemIds.includes(id)));
  }, [categoryFilter, visibleItemIds]);

  const lineItemsCount = OrderById?.items?.length ?? 0;

  return (
    <div className="space-y-6">
      {/* Summary bar - reference style */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
          <div className="text-xs text-slate-400 mb-1">Line Items</div>
          <div className="text-xl font-bold text-white">{lineItemsCount}</div>
        </div>
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
          <div className="text-xs text-slate-400 mb-1">Total Units</div>
          <div className="text-xl font-bold text-white">
            {totalUnits.toLocaleString()}
          </div>
        </div>
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
          <div className="text-xs text-slate-400 mb-1">Categories</div>
          <div className="text-xl font-bold text-white">{categoryFolders.length}</div>
        </div>
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
          <div className="text-xs text-slate-400 mb-1">Selected</div>
          <div className="text-xl font-bold text-white">{selectedItems.length}</div>
        </div>
      </div>

      {/* Header / toolbar - reference style */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <i className="ri-list-check-2 text-white w-4 h-4 flex items-center justify-center" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Order Items</h2>
              <p className="text-xs text-slate-400">
                {lineItemsCount} item{lineItemsCount !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {activeCategory ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory(null);
                    setCategoryFilter("All");
                    setSelectedItems([]);
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-2"
                >
                  <i className="ri-arrow-left-line w-4 h-4 flex items-center justify-center" />
                  Back to Categories
                </button>
                <span className="text-sm text-slate-400">
                  Category: <span className="text-white font-medium">{activeCategory}</span>
                </span>
                <label className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 transition-colors">
                  <input
                    type="checkbox"
                    checked={areAllVisibleSelected}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 rounded cursor-pointer bg-slate-800 border-slate-600"
                  />
                  <span className="text-sm text-slate-300">
                    Select All ({selectedVisibleCount}/{visibleItemIds.length})
                  </span>
                </label>
                {selectedItems.length > 0 ? (
                  <QASheetGenerator
                    orderId={OrderById.Id}
                    selectedItems={selectedItems}
                  />
                ) : (
                  <span className="text-xs text-slate-500 px-3 py-2">
                    Select items for QA sheet
                  </span>
                )}
              </>
            ) : (
              <p className="text-sm text-slate-400">Browse by category below</p>
            )}
          </div>
        </div>
      </div>

      {/* Category folders - reference style */}
      {!activeCategory && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categoryFolders.map(({ name, count }) => (
            <button
              type="button"
              key={name}
              onClick={() => {
                setActiveCategory(name);
                setCategoryFilter(name);
                setSelectedItems([]);
              }}
              className="text-left p-5 rounded-2xl border border-slate-800 bg-slate-900 hover:border-slate-700 hover:bg-slate-800/80 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center shrink-0">
                  <i className="ri-folder-open-line text-slate-400 text-xl w-5 h-5 flex items-center justify-center" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-white truncate">{name}</h3>
                    <span className="text-xs bg-slate-700 text-slate-300 rounded-full px-2 py-0.5 shrink-0">
                      {count}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Click to view items</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Item list */}
      {activeCategory && (
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <ItemCard
              key={item.Id}
              item={item}
              isSelected={selectedItems.includes(item.Id)}
              onSelect={() => handleSelectItem(item.Id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderItemsCard;
