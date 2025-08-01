import useSizeMeasurementsStore from "@/store/useSizeMeasurementsStore";
import React, { useEffect } from "react";
import PrintSizeValue from "./PrintSizeValue";
import useCategoryStore from "@/store/useCategoryStore";

const PrintAbleSizeMeasurementView = ({
  MeasurementId,
  ProductCategoryId,
}: {
  MeasurementId: number;
  ProductCategoryId: any;
}) => {
  const { getSizeMeasurementById, sizeMeasurementById } =
    useSizeMeasurementsStore();
  const { getCategoryById, productCategory } = useCategoryStore();
  useEffect(() => {
    if (MeasurementId) {
      getSizeMeasurementById(MeasurementId);
    }
    if (ProductCategoryId) {
      getCategoryById(ProductCategoryId);
    }
  }, [MeasurementId]);
  return (
    <div>
      {productCategory?.IsTopUnit && (
        <div>
          <p className="text-center font-bold">Top Unit</p>
          <div className="grid grid-cols-3 mt-3 mb-3">
            <PrintSizeValue
              label="Back Neck Drop"
              sizeValue={sizeMeasurementById?.BackNeckDrop}
            />
            <PrintSizeValue
              label="Front Neck Drop"
              sizeValue={sizeMeasurementById?.FrontNeckDrop}
            />
            <PrintSizeValue
              label="Shoulder Seam"
              sizeValue={sizeMeasurementById?.ShoulderSeam}
            />
            <PrintSizeValue
              label="Shoulder Slope"
              sizeValue={sizeMeasurementById?.ShoulderSlope}
            />
             <PrintSizeValue
              label="Across Shoulders"
              sizeValue={sizeMeasurementById?.AcrossShoulders}
            />
            <PrintSizeValue
              label="Upper Chest"
              sizeValue={sizeMeasurementById?.UpperChest}
            />
            <PrintSizeValue
              label="Lower Chest"
              sizeValue={sizeMeasurementById?.LowerChest}
            />
            <PrintSizeValue
              label="Sleeve Length"
              sizeValue={sizeMeasurementById?.SleeveLength}
            />
            <PrintSizeValue
              label="Sleeve Opening"
              sizeValue={sizeMeasurementById?.SleeveOpening}
            />
            <PrintSizeValue
              label="Front Length HPS"
              sizeValue={sizeMeasurementById?.FrontLengthHPS}
            />
            <PrintSizeValue
              label="Front Rise"
              sizeValue={sizeMeasurementById?.FrontRise}
            />
            <PrintSizeValue label="Hem" sizeValue={sizeMeasurementById?.Hem} />
            <PrintSizeValue
              label="Neck Size"
              sizeValue={sizeMeasurementById?.NeckSize}
            />

            {/* <PrintSizeValue
              label="Neck width"
              sizeValue={sizeMeasurementById?.Neck}
            /> */}
            <PrintSizeValue
              label="Collar Height"
              sizeValue={sizeMeasurementById?.CollarHeight}
            />
            <PrintSizeValue
              label="Collar Point Height"
              sizeValue={sizeMeasurementById?.CollarHeight}
            />
            <PrintSizeValue
              label="Collar Stand Length"
              sizeValue={sizeMeasurementById?.CollarStandLength}
            />
            <PrintSizeValue
              label="Across Shoulders"
              sizeValue={sizeMeasurementById?.AcrossShoulders}
            />
            <PrintSizeValue
              label="Back Length HPS"
              sizeValue={sizeMeasurementById?.BackLengthHPS}
            />
            <PrintSizeValue
              label="Bottom Width"
              sizeValue={sizeMeasurementById?.BottomWidth}
            />
            <PrintSizeValue
              label="Stand Height Back"
              sizeValue={sizeMeasurementById?.StandHeightBack}
            />
            <PrintSizeValue
              label="Side Vent Front"
              sizeValue={sizeMeasurementById?.SideVentFront}
            />
            <PrintSizeValue
              label="Side Vent Back"
              sizeValue={sizeMeasurementById?.SideVentBack}
            />
            <PrintSizeValue
              label="Placket Length"
              sizeValue={sizeMeasurementById?.PlacketLength}
            />
            <PrintSizeValue
              label="Placket Width"
              sizeValue={sizeMeasurementById?.TwoButtonDistance}
            />
          </div>
        </div>
      )}
      {productCategory?.SupportsLogo && productCategory?.IsTopUnit ? (
        <div>
          <p className="text-center font-bold">Logo Placement</p>
          <div className="grid grid-cols-3 mt-3 mb-3">
            <PrintSizeValue label="Hip" sizeValue={sizeMeasurementById?.Hip} />
            <PrintSizeValue
              label="Top Right"
              sizeValue={sizeMeasurementById?.t_TopLeft}
            />
            <PrintSizeValue
              label="Top Left"
              sizeValue={sizeMeasurementById?.t_TopLeft}
            />
            <PrintSizeValue
              label="Bottom Right"
              sizeValue={sizeMeasurementById?.t_BottomRight}
            />
            <PrintSizeValue
              label="Bottom Left"
              sizeValue={sizeMeasurementById?.t_BottomLeft}
            />
            <PrintSizeValue
              label="Center"
              sizeValue={sizeMeasurementById?.t_Center}
            />
            <PrintSizeValue
              label="Back"
              sizeValue={sizeMeasurementById?.t_Back}
            />
          </div>
        </div>
      ) : (
        <></>
      )}
      {productCategory?.IsBottomUnit && (
        <div>
          <p className="text-center font-bold">Bottom Unit</p>
          <div className="grid grid-cols-3 mt-3 mb-3">
            <PrintSizeValue label="Hip" sizeValue={sizeMeasurementById?.Hip} />
            <PrintSizeValue
              label="Waist"
              sizeValue={sizeMeasurementById?.Waist}
            />
            <PrintSizeValue
              label="Outseam"
              sizeValue={sizeMeasurementById?.Outseam}
            />
            <PrintSizeValue
              label="Inseam"
              sizeValue={sizeMeasurementById?.Inseam}
            />
            <PrintSizeValue
              label="Hem Bottom"
              sizeValue={sizeMeasurementById?.HemBottom}
            />
            <PrintSizeValue
              label="Knee Width"
              sizeValue={sizeMeasurementById?.KneeWidth}
            />
            <PrintSizeValue
              label="Front Rise"
              sizeValue={sizeMeasurementById?.bFrontRise}
            />
            <PrintSizeValue
              label="Leg Opening"
              sizeValue={sizeMeasurementById?.LegOpening}
            />
          </div>
        </div>
      )}
      {productCategory?.SupportsLogo && productCategory?.IsBottomUnit ? (
        <div>
          <p className="text-center font-bold">Logo Placement</p>
          <div className="grid grid-cols-3 mt-3 mb-3">
            <PrintSizeValue label="Hip" sizeValue={sizeMeasurementById?.Hip} />
            <PrintSizeValue
              label="Top Right"
              sizeValue={sizeMeasurementById?.b_TopRight}
            />
            <PrintSizeValue
              label="Top Left"
              sizeValue={sizeMeasurementById?.b_TopLeft}
            />
            <PrintSizeValue
              label="Bottom Right"
              sizeValue={sizeMeasurementById?.b_BottomRight}
            />
            <PrintSizeValue
              label="Bottom Left"
              sizeValue={sizeMeasurementById?.b_BottomLeft}
            />
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default PrintAbleSizeMeasurementView;
