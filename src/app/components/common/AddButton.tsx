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
      className="text-sm rounded-full bg-green-900 text-white font-semibold px-3 py-2 flex items-center gap-1"
    >
      <FiPlus />
      {title}
    </button>
  );
};

export default AddButton;
