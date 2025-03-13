"use client";

import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthContext from "../services/authservice";
import { FaUserCircle } from "react-icons/fa";
import { BiLogOutCircle } from "react-icons/bi";
import { IoStorefront } from "react-icons/io5";
import { RiAlignItemVerticalCenterFill } from "react-icons/ri";
import { FaUserTie } from "react-icons/fa";
import { MdOutlineLeaderboard } from "react-icons/md";
import { IoSettingsSharp } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";

const DashboardHeader = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();
  const authContext = useContext(AuthContext);

  const { logout } = authContext || {};


  const MenuItemsList = [
    {
      id: "1",
      name: "Orders",
      route: "/dashboard",
      icon: <RiAlignItemVerticalCenterFill />
    },
    {
      id: "2",
      name: "Inventory",
      route: "/inventory",
      icon: <IoStorefront />
    },
    {
      id: "3",
      name: "Clients",
      route: "/client",
      icon: <FaUserTie />
    },
    {
      id: "4",
      name: "Lead",
      route: "/lead",
      icon: <MdOutlineLeaderboard />
    },
    {
      id: "5",
      name: "Settings",
      route: "/setting",
      icon: <IoSettingsSharp />
    },
  ];
  useEffect(() => {}, []);
  return (
    <nav className="bg-[#364254] text-white border-b border-[#e0e0e0]">
      {/* Desktop and Tablet Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 text-lg font-bold">
            <Link href="/dashboard">ZOF - MRP</Link>
          </div>

          {/* Menu Items (hidden on small screens) */}
          <div className="hidden md:flex space-x-8 ml-12">
            {MenuItemsList.map((item) => {
              return (
                <Link
                  href={item.route}
                  key={item.id}
                  className={`font-medium flex items-center gap-2 hover:opacity-80 px-1 text-medium ${
                    pathname === item.route
                      ? " text-[#EB8233]"
                      : " text-white"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Right Side (Username & Dropdown) */}
          <div className="relative">
            <button
              className="hover:opacity-80 flex items-center gap-2"
              onClick={() => setDrawerOpen(!isDrawerOpen)}
            >
              <FaUserCircle /> Admin
              <IoIosArrowDown className={`mt-1 ${isDrawerOpen ? "rotate-180" : ""}`} />
            </button>
            {/* Dropdown */}
            {isDrawerOpen && (
              <div className="absolute right-0 mt-2">
                <div className="w-40 bg-white text-black shadow-lg">
                  <a
                    onClick={logout}
                    className="flex items-center gap-3 w-full text-left px-4 py-2 cursor-pointer hover:bg-gray-100"
                  >
                   <BiLogOutCircle /> Log Out
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Hamburger Icon (visible on small screens) */}
          <div className="lg:hidden">
            <button
              className="p-2 rounded-md focus:outline-none hover:bg-gray-700"
              onClick={() => setDrawerOpen(!isDrawerOpen)}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Drawer for Small Screens */}
      {isDrawerOpen && (
        <div className="lg:hidden bg-gray-800 fixed inset-0 z-50 p-4">
          <button
            className="absolute top-4 right-4 text-white"
            onClick={() => setDrawerOpen(false)}
          >
            <img src="/crossIcon.svg" />
          </button>
          <nav className="space-y-4 mt-8">
            {MenuItemsList.map((item) => {
              return (
                <Link
                  href={item.route}
                  key={item.id}
                  className="text-white text-lg block"
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </nav>
  );
};

export default DashboardHeader;
