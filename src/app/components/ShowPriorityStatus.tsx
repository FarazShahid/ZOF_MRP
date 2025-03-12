import React, { useEffect, useState } from "react";
import { MdOutlineKeyboardDoubleArrowUp, MdOutlineKeyboardArrowUp, MdOutlineKeyboardArrowDown   } from "react-icons/md";

interface priorityStatus {
  name: string;
  color: string;
  icon: React.ReactNode;
}

const ShowPriorityStatus = ({ priority }: { priority: number }) => {
  const [priorityStatus, setPriorityStatus] = useState<priorityStatus>();

  useEffect(() => {
    if (priority === 1) {
      setPriorityStatus({
        name: "High",
        color: "#B41616",
        icon: <MdOutlineKeyboardDoubleArrowUp />,
      });
    } else if (priority === 2) {
      setPriorityStatus({
        name: "Normal",
        color: "#FFB800",
        icon: <MdOutlineKeyboardArrowUp />,
      });
    } else {
      setPriorityStatus({
        name: "Noraml",
        color: "#0DB01E",
        icon: <MdOutlineKeyboardArrowDown />,
      });
    }
  }, [priority]);

  return (
    <div className="flex items-center gap-2" style={{ color: priorityStatus?.color || "inherit" }}>
      {priorityStatus?.icon}
      <span>
        {priorityStatus?.name} - {priority}
      </span>
    </div>
  );
};

export default ShowPriorityStatus;
