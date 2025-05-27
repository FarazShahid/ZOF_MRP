"use client";

import Image from "next/image";
import { MdCategory } from "react-icons/md";
import { TbNeedleThread, TbRulerMeasure2 } from "react-icons/tb";
import { BsThreeDotsVertical } from "react-icons/bs";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GoPencil } from "react-icons/go";
import { GiSleevelessJacket } from "react-icons/gi";
import { IoCut } from "react-icons/io5";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import Mock from "../../../../public/tshirtMockUp.jpg";
import { Product } from "../../services/useFetchProducts";
import { useEffect, useRef, useState } from "react";

export interface productComponentProp {
  products: Product[];
}

const ProductGrid: React.FC<productComponentProp> = ({ products }) => {
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const pageSize = 10;

  useEffect(() => {
    setVisibleProducts(products.slice(0, page * pageSize));
  }, [page, products]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      if (page * pageSize < products.length) {
        setPage((prev) => prev + 1);
      }
    }
  };
  
  return (
    <div className="grid grid-cols-1 gap-5 w-full h-[75vh] overflow-y-auto"  ref={containerRef} onScroll={handleScroll}>
      {visibleProducts?.map((product, index) => {
        return (
          <div className="border-1 border-gray-700 bg-gray-900 rounded p-2 h-fit flex items-center justify-between" key={index}>
            <Image alt="product" src={Mock} className="w-20 h-20 rounded" />
            <div className="flex flex-col gap-1">
              <h6 className="text-white text-lg">
                {product.Name}
              </h6>
              <div className="flex items-center gap-4">
                <div
                  className="rounded h-5 w-10"
                  style={{ backgroundColor: "red" }}
                ></div>
                <div className="flex items-center gap-1 text-gray-500">
                  <MdCategory size={14} />
                  <span className="text-sm">Hoodie</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                  <TbNeedleThread size={14} />
                  <span className="text-sm">Scuba300_Woven_300</span>
                </div>
              </div>
            </div>
            <div className="h-12 w-0 border-1 border-gray-700" />
            <div className="flex items-center gap-5">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-gray-500">
                  <IoCut />
                  <span className="text-sm ">Cut Option</span>
                </div>
                <span className="text-lg text-white">Male</span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-gray-500">
                  <TbRulerMeasure2 />
                  <span className="text-sm ">Size Measurements</span>
                </div>
                <span className="text-lg text-white">XXL</span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-gray-500">
                  <GiSleevelessJacket />
                  <span className="text-sm ">Sleeve Type</span>
                </div>
                <span className="text-lg text-white">Regular</span>
              </div>
            </div>
            <Dropdown>
              <DropdownTrigger>
                <button
                  type="button"
                  className="bg-gray-700 rounded-lg border-1 p-2 border-gray-400 mr-4"
                >
                  <BsThreeDotsVertical />
                </button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions">
                <DropdownItem key="edit">
                  <div className="flex items-center gap-2 hover:text-green-300">
                    <GoPencil /> Edit
                  </div>
                </DropdownItem>
                <DropdownItem
                  key="delete"
                  color="danger"
                  className="hover:text-white text-danger"
                >
                  <div className="flex items-center gap-2 ">
                    <RiDeleteBin6Line /> Delete
                  </div>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      })}
    </div>
  );
};

export default ProductGrid;
