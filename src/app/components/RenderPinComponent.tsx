import React from "react";
import ShortsMeasurementPin from "../addsize/ShortsMeasurementPin";
import TrouserMeasurementPin from "../addsize/TrouserMeasurementPin";
import { ShirtShortsMeasurementPin } from "../addsize/ShirtShortsMeasurementPin";

interface Props {
  categoryId: number | string;
  values: any;
}

const RenderPinComponent: React.FC<Props> = ({ categoryId, values }) => {
  switch (categoryId) {
    case 5:
      return <ShortsMeasurementPin values={values} />;
    case 6:
      return <TrouserMeasurementPin values={values} />;
    default:
      return <ShirtShortsMeasurementPin values={values} />;
  }
};

export default RenderPinComponent;
