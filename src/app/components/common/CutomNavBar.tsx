"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { RiDashboard2Line } from "react-icons/ri";
import { FaClipboardList } from "react-icons/fa";
import { AiOutlineProduct } from "react-icons/ai";
import { IoStorefrontOutline } from "react-icons/io5";
import { GiCargoShip } from "react-icons/gi";
import { IoIosArrowDown } from "react-icons/io";
import Logo from "@/public/Sealforge.svg";
import LogoLight from "@/public/Sealforge_dark.svg";
import UserDropdown from "../header/UserDropdown";
import { ThemeToggleButton } from "./ThemeToggleButton";

const CutomNavBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
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
      id: 2,
      label: "Order",
      icon: <FaClipboardList size={14} />,
      route: "/orders",
      isNested: false,
    },
    {
      id: 3,
      label: "Product",
      icon: <AiOutlineProduct size={14} />,
      route: "/product",
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
  };

  const toggleSubMenu = (id: number) => {
    setActiveMenu((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
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
      <div className="w-20">
        {/* <Image src={LogoLight} alt="sealforge" className="dark:hidden" />
        <Image src={Logo} alt="sealforge" className="dark:block  hidden" /> */}
        <img src="/Sealforge_dark.svg" alt="Sealforge" className="dark:hidden" />
        <img
          src="/Sealforge.svg"
          alt="Sealforge dark"
          className="dark:block hidden"
        />
      </div>

      <div className="flex items-center gap-6 relative">
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
      </div>
    </div>
  );
};

export default CutomNavBar;
