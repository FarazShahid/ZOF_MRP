"use client";

import Link from "next/link";
import { IoCaretBackSharp, IoCut } from "react-icons/io5";
import { GiClothes, GiRolledCloth, GiSleevelessJacket } from "react-icons/gi";
import { TbRulerMeasure2, TbCategory2 } from "react-icons/tb";
import { IoIosColorPalette } from "react-icons/io";
import { PiPrinterFill, PiMapPinLineFill } from "react-icons/pi";
import AdminDashboardLayout from "../../components/common/AdminDashboardLayout";
import ColorOptions from "../../setting/coloroptions/ColorOptions";
import Fabric from "../../setting/fabrictype/Fabric";
import Sleeve from "../../setting/sleevetype/Sleeve";
import ProductCategoryComponent from "../../setting/productcatagory/ProductCategoryComponent";
import ProductCutOptions from "../../setting/cutoptions/ProductCutOptions";
import ProductSizeOptions from "../../setting/SizeOptions/ProductSizeOptions";
import ProductSizeMeasurements from "../../setting/SizeMeasurements/ProductSizeMeasurements";
import PrintingOptions from "../../setting/printingoptions/PrintingOptions";
import ProductRegionComponent from "../../setting/productregionstandard/ProductRegionComponent";
import useUIStore from "@/store/useUIStore";
import PermissionGuard from "../../components/auth/PermissionGaurd";
import { PERMISSIONS_ENUM } from "@/src/types/rightids";

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
    <AdminDashboardLayout>
      <PermissionGuard required={PERMISSIONS_ENUM.PRODUCT_DEFINITIONS.VIEW}>
        <div className="space-y-6">
          <div className="flex items-center">
            <Link
              href={"/product"}
              className="flex items-center gap-1 dark:text-gray-400 text-gray-800"
            >
              <IoCaretBackSharp /> <span>Back to listing</span>
            </Link>
          </div>
          <div className="space-x-5 flex h-[calc(100vh-162px)] overflow-y-auto">
            <aside className="w-1/4 p-5  h-full">
              <div className="space-y-3">
                {ListItems.map((item) => {
                  return (
                    <div
                      className={`${
                        selectedItem === item.id
                          ? "bg-green-800 text-white"
                          : "dark:bg-[#18181b] bg-gray-300 text-gray-800"
                      } rounded-lg p-2 text-gray-300 flex items-center gap-3 cursor-pointer`}
                      onClick={() => setSelectedItem(item.id)}
                      key={item.id}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </div>
                  );
                })}
              </div>
            </aside>
            <main className="w-full h-full p-5">
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
                    return <div>Select an option</div>;
                }
              })()}
            </main>
          </div>
        </div>
      </PermissionGuard>
    </AdminDashboardLayout>
  );
};

export default page;
