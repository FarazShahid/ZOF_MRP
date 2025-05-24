import useOrderStatusStore from "@/store/useOrderStatusStore";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import React, { useEffect, useState } from "react";

interface ChangeStatusDropdownProps {
  statusName: string; // Initial status name
  onChangeStatus?: (statusId: number) => void;
}

const UpdateOrderStatus: React.FC<ChangeStatusDropdownProps> = ({
  statusName,
  onChangeStatus,
}) => {
  const { fetchStatuses, statuses } = useOrderStatusStore();
  const [selectedStatusName, setSelectedStatusName] = useState(statusName);

  useEffect(() => {
    fetchStatuses();
    setSelectedStatusName(statusName);
  }, [statusName]);


  const handleSelect = (key: string) => {
    const selectedStatus = statuses.find((status) => status.Id.toString() === key);
    if (selectedStatus) {
      setSelectedStatusName(selectedStatus.StatusName);
      onChangeStatus?.(selectedStatus.Id);
    }
  };

  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-medium text-foreground font-medium">
        {selectedStatusName}
      </p>
      <Dropdown>
        <DropdownTrigger>
          <div className="flex items-center gap-1 text-xs cursor-pointer group">
            Change Status
            <svg
              className="group-hover:text-inherit text-default-400 transition-[color,transform] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              fill="none"
              height="16"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M7 17 17 7M7 7h10v10" />
            </svg>
          </div>
        </DropdownTrigger>

        <DropdownMenu
          aria-label="Change Order Status"
          onAction={(key) => handleSelect(String(key))}
        >
          {statuses.map((status) => (
            <DropdownItem key={status.Id}>{status.StatusName}</DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default UpdateOrderStatus;
