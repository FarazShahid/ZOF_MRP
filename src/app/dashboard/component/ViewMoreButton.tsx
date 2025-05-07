import Link from "next/link";
import React from "react";
import { FaCaretRight } from "react-icons/fa6";

const ViewMoreButton = ({ path }: { path: string }) => {
  return (
    <Link
      href={path}
      className="text-green-400 flex items-center gap-1 text-xs"
    >
      View More <FaCaretRight />
    </Link>
  );
};

export default ViewMoreButton;
