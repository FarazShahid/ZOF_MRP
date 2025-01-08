import React from "react";
import DashboardHeader from "./DashboardHeader";
import SideNavigation from "./SideNavigation";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex-1 flex flex-col h-full min-h-screen w-full">
      <div className="sticky top-0 z-10">
        <DashboardHeader />
      </div>
      <div className="flex w-full flex-grow">
        <div className="flex flex-grow relative overflow-auto h-[calc(100vh-65px)]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;

