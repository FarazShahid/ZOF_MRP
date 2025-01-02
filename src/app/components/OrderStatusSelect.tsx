"use client"

import React, { useState } from "react";
import useClientEvents from "../services/useClientEvents";
import { useOrderStatus } from "../services/useOrderStatus";

interface SelectedStatus {
  id: number | null;
  name: string | null;
}

interface StatusSelectProps {
  onChange: (selectedStatus: SelectedStatus) => void;
}

const OrderStatusSelect: React.FC<StatusSelectProps> = ({ onChange }) => {
  const { statuses, isLoading, error } = useOrderStatus();
  const [selectedStatus, setSelectedStatus] = useState<SelectedStatus>({
    id: null,
    name: null,
  });

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(event.target.value);
    const selectedName = event.target.options[event.target.selectedIndex].text;
    setSelectedStatus({ id: selectedId, name: selectedName });
    onChange({ id: selectedId, name: selectedName });
  };

  if (isLoading) return <p>Loading events...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <select
      className="inputDefault p-[7px] rounded-md"
      value={selectedStatus.id || ""}
      onChange={handleSelectChange}
    >
      <option value="" disabled>
        Select a Status
      </option>
      {statuses.map((statu) => (
        <option key={statu.Id} value={statu.Id}>
          {statu.StatusName}
        </option>
      ))}
    </select>
  );
};

export default OrderStatusSelect;