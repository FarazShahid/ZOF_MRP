"use client";
import React, { useEffect, useState } from "react";
import { AiFillProduct } from "react-icons/ai";
import { FaList } from "react-icons/fa6";
import AdminDashboardLayout from "../components/common/AdminDashboardLayout";
import AddButton from "../components/common/AddButton";
import { FiRefreshCw, FiSettings } from "react-icons/fi";
import Link from "next/link";
import { Tooltip } from "@heroui/react";
import { MdOutlineFilterAlt } from "react-icons/md";
import ProductGrid from "./component/ProductGrid";
import useProductStore from "@/store/useProductStore";
import ProductsTable from "./component/ProductsTable";
import { useRouter } from "next/navigation";

const page = () => {
  const [selectedListType, setSelectedListType] = useState(1);
  const { fetchProducts, products } = useProductStore();

  const router = useRouter();

  const handleClick = () => {
    router.push("/product/productform");
  };

   useEffect(() => {
      fetchProducts();
    }, []);

  return (
    <AdminDashboardLayout>
      <div className="space-x-2">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-5">
            <h6 className="text-white text-xl font-semibold">Product</h6>
            <div className="border-1 border-gray-600 px-2 py-1 rounded-full flex items-center gap-1">
              <span className="text-white text-xs">{products?.length || 0}</span>
              <span className="text-gray-500 text-[10px]">total products</span>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <Tooltip content="Product Definition">
              <Link href={"/product/productdefination"} className="bg-gray-700 rounded-lg p-2">
                <FiSettings size={20} />
              </Link>
            </Tooltip>
            <div className="flex items-center bg-gray-700 rounded-lg">
              <button
                type="button"
                onClick={() => setSelectedListType(1)}
                className={`p-2 rounded-lg text-gray-200 ${
                  selectedListType === 1 ? "activeListing" : ""
                }`}
              >
                <FaList />
              </button>
              <button
                type="button"
                onClick={() => setSelectedListType(2)}
                className={`p-2 rounded-lg text-gray-200 ${
                  selectedListType === 2 ? "activeListing" : ""
                }`}
              >
                <AiFillProduct />
              </button>
            </div>
            <AddButton title={"Add Product"} onClick={handleClick} />
          </div>
        </div>
        <div className="flex gap-7 w-full mt-5 h-full">
          <div className="bg-gray-900 p-5 h-full rounded-lg flex flex-col gap-6">
            <span className="text-gray-50 uppercase text-sm flex items-center gap-2">
              <MdOutlineFilterAlt size={19} /> Filters
            </span>
            <div className="flex flex-col gap-2">
              <label className="text-gray-50 uppercase text-xs">category</label>
              <div className="w-[200px]">
                <select className="border-gray-600 bg-gray-800 text-gray-50 rounded-xl w-full text-sm px-1 py-2 outline-none">
                  <option value={"All"}>All Categories</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-gray-50 uppercase text-xs">
                fabric type
              </label>
              <div className="w-[200px]">
                <select className="border-gray-600 bg-gray-800 text-gray-50 rounded-xl w-full text-sm px-1 py-2 outline-none">
                  <option value={"All"}>All types</option>
                </select>
              </div>
            </div>
            <button
              type="button"
              className="flex items-center justify-center gap-3 py-2  text-base text-gray-50 rounded-lg border-gray-600 bg-gray-800"
            >
              <FiRefreshCw /> Reset Filters
            </button>
          </div>
          {
            selectedListType === 1 ? <ProductGrid products={products} /> : <ProductsTable products={products} />
          }
        </div>
        
      </div>
    </AdminDashboardLayout>
  );
};

export default page;
