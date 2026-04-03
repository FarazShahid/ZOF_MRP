import React from "react";
import { FiPlus } from "react-icons/fi";

interface AddButtonProps {
  title: React.ReactNode;
  onClick?: () => void;
}

const AddButton = ({ title, onClick }: AddButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-sm rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 flex items-center gap-2 whitespace-nowrap transition-colors"
    >
      <FiPlus />
      {title}
    </button>
  );
};

export default AddButton;
