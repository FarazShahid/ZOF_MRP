"use client";

import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthContext from "../services/authservice";
import { FaUserCircle } from "react-icons/fa";

const DashboardHeader = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();
  const authContext = useContext(AuthContext);
  // const { user } = useUser();

  const { logout } = authContext || {};

  const MenuItemsList = [
    {
      id: "1",
      name: "Orders",
      route: "/dashboard",
    },
    {
      id: "2",
      name: "Products",
      route: "/products",
    },
    {
      id: "3",
      name: "Inventory",
      route: "/inventory",
    },
    {
      id: "4",
      name: "Clients",
      route: "/client",
    },
    {
      id: "5",
      name: "Lead",
      route: "/lead",
    },
  ];
  useEffect(() => {}, []);
  return (
    <nav className="bg-[#F6F8FC] text-[#333333] border-b border-[#e0e0e0]">
      {/* Desktop and Tablet Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 text-lg font-bold">
            <Link href="/dashboard">Zero One Forge - MRP</Link>
          </div>

          {/* Menu Items (hidden on small screens) */}
          <div className="hidden md:flex space-x-8 ml-12">
            {MenuItemsList.map((item) => {
              return (
                <Link
                  href={item.route}
                  key={item.id}
                  className={`font-semibold hover:opacity-80 px-1 text-lg border-b-2 ${
                    pathname === item.route
                      ? "border-[#333333]"
                      : "border-transparent"
                  }`}
                >
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
              <img src="/arrowDown.svg" className={`mt-1 ${isDrawerOpen ? "rotate-180":""}`} />
            </button>
            {/* Dropdown */}
            {isDrawerOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-md shadow-lg">
                <a
                onClick={logout}
                  className="block w-full text-left px-4 py-2 cursor-pointer hover:bg-gray-100"
                >
                  Logout
                </a>
              </div>
            )}
          </div>

          {/* Hamburger Icon (visible on small screens) */}
          <div className="md:hidden">
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
        <div className="md:hidden bg-gray-800 fixed inset-0 z-50 p-4">
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
