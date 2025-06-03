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
      <div className="flex-none border-1 dark:border-default-200/50 border-gray-600 rounded-small text-center w-11 overflow-hidden">
        <div className="text-tiny text-white dark:text-default-500 dark:bg-default-100 bg-gray-500 py-0.5 ">
          {month}
        </div>
        <div className="flex items-center justify-center font-semibold text-medium h-6 text-default-500">
          {day}
        </div>
      </div>

      {/* Text */}
      <div className="flex flex-col gap-0.5 text-gray-400">
        <p className="text-medium dark:text-foreground text-gray-800 font-medium">
          {date.format("DD MMM YYYY")}
        </p>
        <p
          className={`text-small font-medium ${
            isPast ? "text-danger" : "dark:text-success text-green-700"
          }`}
        >
          {diffText}
        </p>
      </div>
    </div>
  );
};

export default OrderDeadline;
