"use client";

import React, { useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { MdDashboard } from "react-icons/md";
import { BsFileEarmarkTextFill } from "react-icons/bs";
import { FaUsers, FaStore } from "react-icons/fa6";
import { FaJediOrder } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { BiLogOut } from "react-icons/bi";
import { IoMdMenu } from "react-icons/io";
import LoginUserDetail from "./LoginUserDetail";
import AuthContext from "../services/authservice";

interface LayoutProps {
  children: React.ReactNode;
}

const AdminDashboardLayout = ({ children }: LayoutProps) => {
  const [selectedItem, setSelectedItem] = useState<number>(1);
  const [headerName, setHeaderName] = useState<string>("Dashboard");
  const [toggleNav, setToggleNav] = useState<boolean>(false);
  const pathname = usePathname();
  const router = useRouter();
  const authContext = useContext(AuthContext);

  const { logout } = authContext || {};

  const handleNavToggle = () => {
    setToggleNav(!toggleNav);
  };

  const handleSelectLink = (id: number, path: string) => {
    setSelectedItem(id);
    router.push(`${path}`);
  };

  const Navlist = [
    {
      id: 1,
      name: "Dashboard",
      path: "/adminDashboard",
      icon: <MdDashboard size={20} />,
    },
    {
      id: 2,
      name: "Clients",
      path: "/client",
      icon: <FaUsers size={20} />,
    },
    {
      id: 3,
      name: "Products",
      path: "/products",
      icon: <BsFileEarmarkTextFill size={20} />,
    },
    {
      id: 4,
      name: "Orders",
      path: "/orders",
      icon: <FaJediOrder size={20} />,
    },
    {
      id: 5,
      name: "Inventory",
      path: "/inventory",
      icon: <FaStore size={20} />,
    },
    {
      id: 6,
      name: "Settings",
      path: "/setting",
      icon: <IoSettingsOutline size={20} />,
    },
  ];

  useEffect(() => {
    const activeItem = Navlist.find((item) => item.path === pathname);
    if (activeItem) {
      setSelectedItem(activeItem.id);
      setHeaderName(activeItem.name);
    }
  }, [pathname]);

  return (
    <div className="flex h-screen w-full">
      <div
        className={`${
          toggleNav ? "w-[5%]" : "w-[15%]"
        } h-full bg-[#383838] flex flex-col gap-4 items-center transition-all duration-300`}
      >
        <div className="p-5">
          <span className="font-bold text-white">MRP</span>
        </div>
        <div className="flex flex-col gap-2 w-full items-center">
          {Navlist.map((list) => {
            return (
              <div
                key={list.id}
                onClick={() => handleSelectLink(list.id, list.path)}
                className={`${!toggleNav ? "w-[80%]" : ""} ${
                  list.id === selectedItem ? "bg-[#584BDD]" : ""
                } text-[#e9e9e9] text-[16px] px-7 rounded-lg py-2 cursor-pointer flex items-center gap-3 relative z-10`}
              >
                {list.icon} {!toggleNav ? `${list.name}` : ""}
              </div>
            );
          })}
        </div>
        <div
          className={`${toggleNav ? "w-full" : "w-[80%]"} flex flex-col gap-5`}
        >
          <hr className="border-[#e9e9e9] w-full" />
          <button
            type="button"
            className="text-[#e9e9e9] text-[16px] px-7 py-2 w-full cursor-pointer flex items-center gap-3"
            onClick={logout}
          >
            <BiLogOut size={20} /> {!toggleNav ? "Logout" : ""}
          </button>
        </div>
      </div>
      <div
        className={`${
          toggleNav ? "w-[95%]" : "w-[85%]"
        } h-full flex flex-col transition-all duration-300`}
      >
        <div className="flex items-center justify-between w-full p-5">
          <div className="flex items-center gap-3 ">
            <button type="button" onClick={handleNavToggle}>
              <IoMdMenu size={20} />
            </button>
            <span className="font-semibold text-lg font-sans text-[#383838]">
              {headerName}
            </span>
          </div>
          <LoginUserDetail />
        </div>
        <div className="bg-gray-100 flex flex-col gap-4 p-6 overflow-auto h-[calc(100vh-75px)]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
