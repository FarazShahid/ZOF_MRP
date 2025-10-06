import React from "react";
import { Boxes, Layers, PackageSearch, Ruler, Truck, ClipboardList } from "lucide-react";
import { ActiveInventoryModule } from "@/src/types/inventory";

interface SidebarProps {
  activeModule: ActiveInventoryModule;
  onModuleChange: (module: ActiveInventoryModule) => void;
}

const menuItems = [
  // Items moved to /inventory
  // { id: "items" as ActiveInventoryModule, label: "Items", icon: Boxes },
  { id: "categories" as ActiveInventoryModule, label: "Categories", icon: Layers },
  { id: "subcategories" as ActiveInventoryModule, label: "Sub Categories", icon: PackageSearch },
  { id: "uom" as ActiveInventoryModule, label: "Unit of Measure", icon: Ruler },
  { id: "suppliers" as ActiveInventoryModule, label: "Suppliers", icon: Truck },
  { id: "transactions" as ActiveInventoryModule, label: "Transactions", icon: ClipboardList },
];

export const InventorySidebar: React.FC<SidebarProps> = ({ activeModule, onModuleChange }) => {
  return (
    <div className="w-64 border-r border-gray-200 h-full">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">Inventory Setup</h1>
        <p className="text-sm text-gray-500 mt-1">Manage inventory configuration</p>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onModuleChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-gray-500"}`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default InventorySidebar;


