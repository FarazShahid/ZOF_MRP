import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface OrderDeadlineProps {
  deadline: string;
}

const OrderDeadline: React.FC<OrderDeadlineProps> = ({ deadline }) => {
  const date = dayjs(deadline);
  const month = date.format("MMM");
  const day = date.format("D");

  const now = dayjs();
  const isPast = date.isBefore(now, "day");
  const diffText = isPast
    ? `Due ${date.fromNow()}`
    : `${date.toNow(true)} left`;

  return (
    <div className="flex gap-3 items-center">
      {/* Calendar Tile */}
      <div className="flex-none border-1 border-default-200/50 rounded-small text-center w-11 overflow-hidden">
        <div className="text-tiny bg-default-100 py-0.5 text-default-500">
          {month}
        </div>
        <div className="flex items-center justify-center font-semibold text-medium h-6 text-default-500">
          {day}
        </div>
      </div>

      {/* Text */}
      <div className="flex flex-col gap-0.5">
        <p className="text-medium text-foreground font-medium">
          {date.format("DD MMM YYYY")}
        </p>
        <p
          className={`text-small font-medium ${
            isPast ? "text-danger" : "text-success"
          }`}
        >
          {diffText}
        </p>
      </div>
    </div>
  );
};

export default OrderDeadline;
