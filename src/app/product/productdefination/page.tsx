"use client";

import Link from "next/link";
import useUIStore from "@/store/useUIStore";
import { IoIosColorPalette } from "react-icons/io";
import Fabric from "../../setting/fabrictype/Fabric";
import Sleeve from "../../setting/sleevetype/Sleeve";
import { PERMISSIONS_ENUM } from "@/src/types/rightids";
import { IoCaretBackSharp, IoCut } from "react-icons/io5";
import { TbRulerMeasure2, TbCategory2 } from "react-icons/tb";
import { PiPrinterFill, PiMapPinLineFill } from "react-icons/pi";
import ColorOptions from "../../setting/coloroptions/ColorOptions";
import PermissionGuard from "../../components/auth/PermissionGaurd";
import ProductCutOptions from "../../setting/cutoptions/ProductCutOptions";
import PrintingOptions from "../../setting/printingoptions/PrintingOptions";
import ProductSizeOptions from "../../setting/SizeOptions/ProductSizeOptions";
import { GiClothes, GiRolledCloth, GiSleevelessJacket } from "react-icons/gi";
import ProductSizeMeasurements from "../../setting/SizeMeasurements/ProductSizeMeasurements";
import ProductCategoryComponent from "../../setting/productcatagory/ProductCategoryComponent";
import ProductRegionComponent from "../../setting/productregionstandard/ProductRegionComponent";

const ListItems = [
  { id: 1, name: "Fabric Type", icon: <GiRolledCloth size={20} /> },
  { id: 2, name: "Product Category", icon: <TbCategory2 size={20} /> },
  { id: 3, name: "Sleeve Type", icon: <GiSleevelessJacket size={20} /> },
  { id: 4, name: "Cut Options", icon: <IoCut size={20} /> },
  { id: 5, name: "Product Region", icon: <PiMapPinLineFill size={20} /> },
  { id: 6, name: "Size Options", icon: <GiClothes size={20} /> },
  { id: 7, name: "Size Measurements", icon: <TbRulerMeasure2 size={20} /> },
  { id: 8, name: "Colors", icon: <IoIosColorPalette size={20} /> },
  { id: 9, name: "Printing Options", icon: <PiPrinterFill size={20} /> },
];

const page = () => {
  const selectedItem = useUIStore((state) => state.selectedItem);
  const setSelectedItem = useUIStore((state) => state.setSelectedItem);

  return (
      <PermissionGuard required={PERMISSIONS_ENUM.PRODUCT_DEFINITIONS.VIEW}>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Link
              href={"/product"}
              className="group p-2 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white rounded-lg transition-all duration-300 ease-in-out"
            >
              <IoCaretBackSharp className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Product Definition</h1>
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Manage product types, categories, and options</p>
            </div>
          </div>

          {/* Content */}
          <div className="flex gap-5 h-[calc(100vh-200px)]">
            {/* Sidebar Tabs */}
            <aside className="w-64 shrink-0 h-full overflow-y-auto">
              <div className="space-y-1.5">
                {ListItems.map((item) => {
                  const isActive = selectedItem === item.id;
                  return (
                    <div
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors text-sm font-medium ${
                        isActive
                          ? "bg-emerald-600 text-white"
                          : "bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-200 dark:hover:border-emerald-500/30"
                      }`}
                      onClick={() => setSelectedItem(item.id)}
                      key={item.id}
                    >
                      <span className={isActive ? "text-white" : "text-gray-400 dark:text-slate-500"}>{item.icon}</span>
                      <span>{item.name}</span>
                    </div>
                  );
                })}
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 h-full overflow-y-auto bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg p-5">
              {(() => {
                switch (selectedItem) {
                  case 1:
                    return <Fabric />;
                  case 2:
                    return <ProductCategoryComponent />;
                  case 3:
                    return <Sleeve />;
                  case 4:
                    return <ProductCutOptions />;
                  case 5:
                    return <ProductRegionComponent />;
                  case 6:
                    return <ProductSizeOptions />;
                  case 7:
                    return <ProductSizeMeasurements />;
                  case 8:
                    return <ColorOptions />;
                  case 9:
                    return <PrintingOptions />;

                  default:
                    return <Fabric />;
                }
              })()}
            </main>
          </div>
        </div>
      </PermissionGuard>
  );
};

export default page;
