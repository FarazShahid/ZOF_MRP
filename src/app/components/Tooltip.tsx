import React, { Fragment } from "react";

function Tooltip({
  children,
  id,
  tooltipContent
}: {
  children: React.ReactNode;
  id?: string | undefined;
  tooltipContent?: string | undefined;
}) {
  return (
    <Fragment>
      {children}
      <div
        id={id}
        role="tooltip"
        className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
      >
        {tooltipContent}
        <div className="tooltip-arrow" data-popper-arrow></div>
      </div>
    </Fragment>
  );
}

export default Tooltip;
