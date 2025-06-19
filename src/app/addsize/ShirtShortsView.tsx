import ShirtAndShortsBackViewModa from "@/public/svgs/ShirtAndShortsBackViewModa";
import ShirtAndShortsModal from "@/public/svgs/ShirtAndShortsModal";
import React from "react";

const ShirtShortsView = ({ shirtFrontView }: { shirtFrontView: boolean }) => {
  return (
    <>
      {shirtFrontView ? (
        <ShirtAndShortsModal />
      ) : (
        <ShirtAndShortsBackViewModa />
      )}
    </>
  );
};

export default ShirtShortsView;
