import React from "react";
import { Tooltip } from "@heroui/react";

interface ActionBtnProps {
  className?: string;
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
}

const ActionBtn: React.FC<ActionBtnProps> = ({
  className,
  icon,
  title,
  onClick,
}) => {
  return (
    <Tooltip content={title}>
      <button
        type="button"
        className={className}
        onClick={onClick}
      >
        {icon}
      </button>
    </Tooltip>
  );
};

export default ActionBtn;
