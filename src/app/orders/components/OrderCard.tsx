import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import React from "react";
import { BsThreeDotsVertical, BsFillCalendarEventFill } from "react-icons/bs";
import { GoPencil, GoDotFill } from "react-icons/go";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEye, FaRegUserCircle } from "react-icons/fa";
import { SiProgress } from "react-icons/si";
import { IoCalendarNumber } from "react-icons/io5";

const OrderCard = () => {
  return (
    <div className="bg-gray-800 rounded-lg p-3 space-y-4 h-fit">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <span className="text-white">PO-652</span>
          <div className="h-6 w-0 border-1 border-gray-700" />
          <span className="text-white">
            Men Cotton Polo Shirt Army / L x500
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-yellow-500 rounded-full p-2 text-xs text-black font-semibold">
            Production
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
              <DropdownItem key="view">
                <div className="flex items-center gap-2 hover:text-green-300">
                  <FaRegEye /> View
                </div>
              </DropdownItem>
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
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <FaRegUserCircle /> CRFC
        </div>
        <GoDotFill />
        <div className="flex items-center gap-2">
          <BsFillCalendarEventFill /> Winter Season
        </div>
        <GoDotFill />
        <div className="flex items-center gap-2">
          <IoCalendarNumber /> 03/06/2025
        </div>
        <GoDotFill />
        <div className="flex items-center gap-2">
          <SiProgress />
          <span className="bg-red-400 rounded-full px-1 text-[8px] text-black font-bold">
            High
          </span>
        </div>
      </div>

      <div className="bg-gray-700 p-3 rounded m-2">
        <div className="flex items-center gap-2">
            <span className="text-sm">Order is on shipping</span>
            <span className="text-gray-400 text-xs">November 7, 2022</span>
        </div>


      </div>
    </div>
  );
};

export default OrderCard;
