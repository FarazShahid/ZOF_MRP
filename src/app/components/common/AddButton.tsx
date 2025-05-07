import React from "react";

interface AddButtonProps {
  title: React.ReactNode;
  onClick?: () => void;
}

const AddButton = ({ title, onClick }: AddButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-sm rounded-full bg-green-400 text-black font-semibold px-3 py-2"
    >
      {title}
    </button>
  );
};

export default AddButton;
