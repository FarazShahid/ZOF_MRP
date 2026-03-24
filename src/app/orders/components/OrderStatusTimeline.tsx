import React from "react";
import { formatDateToReadableDate } from "@/interface";
import { OrderStatusLogsType } from "@/store/useOrderStore";

const DEFAULT_ICON = "ri-checkbox-circle-line";

const OrderStatusTimeline = ({
  OrderStatusLogs,
}: {
  OrderStatusLogs: OrderStatusLogsType[];
}) => {
  if (!OrderStatusLogs || OrderStatusLogs.length === 0) {
    return (
      <div className="py-6 text-center">
        <p className="text-sm text-slate-500">No status history yet</p>
      </div>
    );
  }

  const getTimelineStepStyle = (isActive: boolean, isCompleted: boolean) => {
    if (isCompleted)
      return {
        dot: "bg-green-500 border-green-400",
        line: "bg-green-500",
        text: "text-green-400",
      };
    if (isActive)
      return {
        dot: "bg-amber-500 border-amber-400 animate-pulse",
        line: "bg-slate-700",
        text: "text-amber-400",
      };
    return {
      dot: "bg-slate-700 border-slate-600",
      line: "bg-slate-700",
      text: "text-slate-500",
    };
  };

  return (
    <div className="flex items-start justify-start flex-wrap gap-x-4 gap-y-6">
      {OrderStatusLogs.map((log, idx) => {
        const isLast = idx === OrderStatusLogs.length - 1;
        const isCompleted = !isLast;
        const isActive = isLast;
        const style = getTimelineStepStyle(isActive, isCompleted);

        return (
          <React.Fragment key={log.StatusId ?? idx}>
            <div className="flex flex-col items-center shrink-0">
              {/* Dot */}
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${style.dot}`}
              >
                {isCompleted && (
                  <i className="ri-check-line text-white text-sm w-4 h-4 flex items-center justify-center" />
                )}
                {isActive && (
                  <i
                    className={`${DEFAULT_ICON} text-white text-sm w-4 h-4 flex items-center justify-center`}
                  />
                )}
              </div>
              <span
                className={`text-xs font-medium mt-2 text-center max-w-[80px] truncate ${style.text}`}
                title={log.StatusName}
              >
                {log.StatusName}
              </span>
              {log.Timestamp && (
                <span className="text-xs text-slate-500 mt-0.5 text-center max-w-[90px]">
                  {formatDateToReadableDate(log.Timestamp)}
                </span>
              )}
            </div>
            {/* Connector line to next step */}
            {!isLast && (
              <div
                className={`w-8 sm:w-12 h-0.5 shrink-0 self-center mt-4 ${
                  isCompleted ? "bg-green-500" : "bg-slate-700"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default OrderStatusTimeline;
