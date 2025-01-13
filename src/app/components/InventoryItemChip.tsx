import { Chip } from '@nextui-org/react';
import React from 'react'

const InventoryItemChip = ({ Status }: { Status: string }) => {
    const statusColorMap: Record<
    string,
    "warning" | "success" | "danger" | "default"
  > = {
    InStock: "warning",
    OutOfStock: "success",
    LowStock: "danger",
  };
  return (
    <Chip
      className="capitalize"
      color={"danger"}
      size="sm"
      variant="flat"
    >
      {Status}
    </Chip>
  );
}

export default InventoryItemChip