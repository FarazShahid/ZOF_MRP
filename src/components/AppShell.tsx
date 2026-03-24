"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import CollapsibleSidebar from "@/src/components/CollapsibleSidebar";
import TopHeader from "@/src/components/TopHeader";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/";

  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    setIsCollapsed(saved ? JSON.parse(saved) : false);
  }, []);

  useEffect(() => {
    const handleStorage = () => {
      const saved = localStorage.getItem("sidebarCollapsed");
      setIsCollapsed(saved ? JSON.parse(saved) : false);
    };

    window.addEventListener("storage", handleStorage);
    const interval = setInterval(handleStorage, 100);

    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, []);

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="bg-slate-950 min-h-screen">
      <CollapsibleSidebar />
      <TopHeader />
      <main
        className={`transition-all duration-300 pt-20 px-5 pb-5 ${
          isCollapsed ? "ml-16" : "ml-60"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
