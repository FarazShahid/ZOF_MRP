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
      className="inline-flex h-[36px] items-center gap-2 whitespace-nowrap rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
    >
      <FiPlus size={16} />
      {title}
    </button>
  );
};

export default AddButton;
