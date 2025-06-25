import ShirtAndShortsBackViewModa from "@/public/svgs/ShirtAndShortsBackViewModa";
import ShirtAndShortsModal from "@/public/svgs/ShirtAndShortsModal";
import React from "react";

const ShirtShortsView = ({ shirtFrontView }: { shirtFrontView: boolean }) => {
  return (
    <>
      {shirtFrontView ? (
        <ShirtAndShortsModal />
      ) : (
        <div className="w-full h-full dark:text-gray-100 text-gray-800 pt-[40px]">
          <ShirtAndShortsBackViewModa />
        </div>
      )}
    </>
  );
};

export default ShirtShortsView;
