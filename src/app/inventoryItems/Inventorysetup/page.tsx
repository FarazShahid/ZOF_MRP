"use client";

import React, { useState } from "react";

import Link from "next/link";
import { IoCaretBackSharp, IoCut } from "react-icons/io5";
import { GiClothes, GiRolledCloth, GiSleevelessJacket } from "react-icons/gi";
import { TbCategory2 } from "react-icons/tb";
import AdminDashboardLayout from "../../components/common/AdminDashboardLayout";
import InventoryTransaction from "../../inventoryTransaction/page";
import Subcategories from "../../subcategories/page";
import InventoryCategories from "../../categories/page";
import Supplier from "../../supplier/page";
import UnitofMeasure from "../../unitofmeasure/page";

const ListItems = [
  { id: 1, name: "Inventory Transections", icon: <GiClothes size={20} /> },
  { id: 2, name: "Inventory Category", icon: <GiSleevelessJacket size={20} /> },
  { id: 3, name: "Inventory Sub Category", icon: <GiRolledCloth size={20} /> },
  { id: 4, name: "Supplier", icon: <TbCategory2 size={20} /> },
  { id: 5, name: "Unit of Measure", icon: <IoCut size={20} /> },
];

const page = () => {
  const [selectedItem, setSelectedItem] = useState(1);

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center">
          <Link
            href={"/inventoryItems"}
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
                  return <InventoryTransaction />;
                case 2:
                  return <InventoryCategories />;
                case 3:
                  return <Subcategories />;
                case 4:
                  return <Supplier />;
                case 5:
                  return <UnitofMeasure />;
                default:
                  return <div>Select an option</div>;
              }
            })()}
          </main>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default page;
