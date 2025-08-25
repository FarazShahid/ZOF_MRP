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
      className="text-sm rounded-full dark:bg-blue-600 bg-blue-800 text-white font-semibold px-3 py-2 flex items-center gap-2 whitespace-nowrap"
    >
      <FiPlus />
      {title}
    </button>
  );
};

export default AddButton;
