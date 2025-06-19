"use client";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { RiDashboard2Line } from "react-icons/ri";
import { FaClipboardList } from "react-icons/fa";
import { IoStorefrontOutline } from "react-icons/io5";
import { FaRegCircleUser } from "react-icons/fa6";
import { AiOutlineProduct } from "react-icons/ai";
import { IoCalendarNumber } from "react-icons/io5";
import { FaUserTie } from "react-icons/fa";
import Logo from "../../../../public/logoDark.png";
import LogoLight from "../../../../public/logo.png";
import UserDropdown from "../header/UserDropdown";
import { ThemeToggleButton } from "./ThemeToggleButton";

const CutomNavBar = () => {
  const pathname = usePathname();
  const router = useRouter();

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
      isNested: true,
    },
    {
      id: 3,
      label: "Product",
      icon: <AiOutlineProduct size={14} />,
      route: "/product",
      isNested: true,
    },
    {
      id: 4,
      label: "Inventory",
      icon: <IoStorefrontOutline size={14} />,
      route: "/inventoryItems",
      isNested: true,
    },
    {
      id: 5,
      label: "Client",
      icon: <FaRegCircleUser size={14} />,
      route: "/client",
      isNested: false,
    },
    {
      id: 6,
      label: "Events",
      icon: <IoCalendarNumber size={14} />,
      route: "/events",
      isNested: false,
    },
    {
      id: 7,
      label: "Users",
      icon: <FaUserTie size={14} />,
      route: "/users",
      isNested: false,
    },
  ];

  const handleRoute = (path: string) => {
    router.push(path);
  };
  return (
    <div className="p-5 dark:bg-slate-900 bg-gray-100 border-b-1 border-gray-300 flex items-center justify-between">
      <div className="w-7 h-7">
        <Image src={Logo} alt="logo" className="hidden dark:block" />
        <Image src={LogoLight} alt="logo" className="dark:hidden" />
      </div>
      <div className="flex items-center gap-4">
        {Navlist.map((item) => {
          const isActive = pathname.startsWith(item.route);
          return (
            <div
              className={`flex items-center gap-2 px-2 py-1 cursor-pointer rounded-full text-gray-900 transition-all duration-150 ${
                isActive ? "selectedNavItem" : "dark:!text-white !text-black" 
              }`}
              key={item.id}
              onClick={() => handleRoute(item.route)}
            >
              {item.icon}
              <span className="dark:text-white text-black font-bold text-sm">
                {item.label}
              </span>
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
