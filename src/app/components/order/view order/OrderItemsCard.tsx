import { GetOrderByIdType } from "@/src/app/interfaces/OrderStoreInterface";
import React, { useEffect, useMemo, useState } from "react";
import { IoBag } from "react-icons/io5";
import QASheetGenerator from "./QASheetGenerator";
import ItemCard from "./ItemCard";

interface CardProps {
  OrderById: GetOrderByIdType;
}

const OrderItemsCard: React.FC<CardProps> = ({ OrderById }) => {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  const categoryOptions = useMemo(() => {
    const names = Array.from(
      new Set((OrderById?.items || []).map((i) => i.ProductCategoryName).filter(Boolean))
    );
    return ["All", ...names];
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

  const handleSelectAll = () => {
    if (areAllVisibleSelected) {
      setSelectedItems((prev) => prev.filter((id) => !visibleItemIds.includes(id)));
      return;
    }
    setSelectedItems((prev) => Array.from(new Set([...prev, ...visibleItemIds])));
  };

const handleSelectItem = (itemId: number) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  useEffect(() => {
    setSelectedItems((prev) => prev.filter((id) => visibleItemIds.includes(id)));
  }, [categoryFilter, visibleItemIds]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-5 rounded-xl flex items-center justify-center">
            <IoBag size={23} />
          </div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-900">
              Order Items 
            </h2>
            <span className="bg-green-500 text-white rounded-full px-2 py-1 text-xs mr-1">{OrderById?.items?.length}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-sm px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 focus:outline-none"
            >
              {categoryOptions.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <input
              type="checkbox"
              checked={areAllVisibleSelected}
              onChange={handleSelectAll}
              className="w-4 h-4 text-blue-600 rounded cursor-pointer"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Select All ({selectedVisibleCount}/{visibleItemIds.length})
            </span>
          </label>
        {
          selectedItems.length > 0 ? (
            <QASheetGenerator
              orderId={OrderById.Id}
              selectedItems={selectedItems}
            />
          ) : (
            <div className="text-sm text-gray-500 dark:text-gray-400 bg-blue-100 text-gray-900 rounded-lg p-2">Select items to generate QA sheet</div>
          )
        }
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <ItemCard key={item.Id} 
           isSelected={selectedItems.includes(item.Id)}
           onSelect={() => handleSelectItem(item.Id)} 
           item={item}
            />
        ))}
      </div>
    </div>
  );
};

export default OrderItemsCard;
