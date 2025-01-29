import { Chip } from "@heroui/react";

const StatusChip = ({ OrderStatus }: { OrderStatus: string }) => {
  const statusColorMap: Record<
    string,
    "warning" | "success" | "danger" | "default"
  > = {
    Pending: "warning",
    Completed: "success",
    Cancelled: "danger",
  };
  return (
    <Chip
      className="capitalize"
      color={statusColorMap[OrderStatus]}
      size="sm"
      variant="flat"
    >
      {OrderStatus}
    </Chip>
  );
};

export default StatusChip;
