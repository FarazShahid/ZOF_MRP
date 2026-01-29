"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { RiDashboard2Line, RiMenu3Line, RiCloseLine } from "react-icons/ri";
import { FaClipboardList } from "react-icons/fa";
import { AiOutlineProduct } from "react-icons/ai";
import { IoStorefrontOutline } from "react-icons/io5";
import { MdPhotoLibrary } from "react-icons/md";
import { GiCargoShip } from "react-icons/gi";
import { IoIosArrowDown } from "react-icons/io";
import UserDropdown from "../header/UserDropdown";
import { ThemeToggleButton } from "./ThemeToggleButton";
import { TfiGallery } from "react-icons/tfi";
import { FaUserTie } from "react-icons/fa";

const CutomNavBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  const Navlist = [
    {
      id: 1,
      label: "Dashboard",
      icon: <RiDashboard2Line size={16} />,
      route: "/dashboard",
      isNested: false,
    },
    {
      id: 6,
      label: "Gallery",
      icon: <TfiGallery   size={16} />,
      route: "/gallery",
      isNested: false,
    },
    {
      id: 4,
      label: "Inventory",
      icon: <IoStorefrontOutline size={14} />,
      route: "/inventory",
      isNested: false,
    },
    {
      id: 7,
      label: "Clients",
      icon: <FaUserTie size={14} />,
      route: "/client",
      isNested: false,
    },
    {
      id: 5,
      label: "Shipment",
      icon: <GiCargoShip size={14} />,
      route: "/shipment",
      isNested: false,
      subList: [
        { id: 1, label: "Shipment", route: "/shipment" },
        { id: 2, label: "Carrier", route: "/shipment/carrior" },
      ],
    },
  ];

  const handleRoute = (path: string) => {
    router.push(path);
    setActiveMenu(null);
    setMobileOpen(false);
  };

  const toggleSubMenu = (id: number) => {
    setActiveMenu((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
        setMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="p-5 dark:bg-slate-900 bg-gray-100 border-b border-gray-300 flex items-center justify-between relative z-50"
      ref={navRef}
    >
      <div className="w-32">
        <img src="/Logo-SealForge-Dark.svg" alt="Sealforge" className="dark:hidden" />
        <img
          src="/Logo-SealForge-Light.svg"
          alt="Sealforge dark"
          className="dark:block hidden"
        />
      </div>

      <div className="hidden xl:flex items-center gap-6 relative">
        {Navlist.map((item) => {
          const isActive = pathname.startsWith(item.route);
          const isOpen = activeMenu === item.id;

          return (
            <div key={item.id} className="relative">
              <div
                onClick={() =>
                  item.isNested
                    ? toggleSubMenu(item.id)
                    : handleRoute(item.route)
                }
                className={`flex items-center gap-2 px-2 py-1 cursor-pointer rounded-full text-sm font-bold transition-all duration-150 ${
                  isActive
                    ? "selectedNavItem !text-white"
                    : "dark:text-white text-black "
                }`}
              >
                {item.icon}
                {item.label}
                {item.isNested && <IoIosArrowDown />}
              </div>

              {item.isNested && item.subList && isOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-md z-50">
                  {item.subList.map((sub) => {
                    const isSubActive = pathname === sub.route;
                    return (
                      <div
                        key={sub.id}
                        onClick={() => handleRoute(sub.route)}
                        className={`px-4 py-2 text-sm cursor-pointer ${
                          isSubActive
                            ? "bg-gray-600 dark:text-black text-white font-semibold"
                            : "text-gray-700 dark:text-gray-200"
                        }`}
                      >
                        {sub.label}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-5">
        <ThemeToggleButton />
        <UserDropdown />
        <button
          type="button"
          className="xl:hidden inline-flex items-center justify-center w-9 h-9 rounded-md border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 hover:bg-white dark:hover:bg-gray-800 transition"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <RiCloseLine size={20} /> : <RiMenu3Line size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="absolute left-0 top-full w-full xl:hidden bg-white dark:bg-slate-900 border-t border-gray-300 dark:border-gray-800 shadow-sm">
          <div className="p-2">
            {Navlist.map((item) => {
              const isActive = pathname.startsWith(item.route);
              return (
                <button
                  key={item.id}
                  onClick={() => handleRoute(item.route)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-left transition ${
                    isActive
                      ? "bg-gray-800 text-white dark:bg-white dark:text-black font-semibold"
                      : "text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CutomNavBar;
