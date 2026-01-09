"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface TabActionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}

const TabActionButton: React.FC<TabActionButtonProps> = ({ icon: Icon, label, onClick }) => {
  return (
    <button
      className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm h-[36px] shadow-sm hover:bg-blue-700 transition-colors"
      onClick={onClick}
      type="button"
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
};

export default TabActionButton;

