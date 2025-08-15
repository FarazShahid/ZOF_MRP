// components/measurements/MeasurementTables.tsx
import React, { useMemo, useState } from "react";
import { Button } from "@heroui/react";
import { formatNumber } from "@/interface";
import { SectionTable } from "./SectionTable";

// ---- Types ----
export interface ProductCategoryLike {
  IsTopUnit?: boolean;
  IsBottomUnit?: boolean;
  SupportsLogo?: boolean;
}

export interface SizeMeasurementLike {
  // Top Unit
  BackNeckDrop: string;
  FrontNeckDrop: string;
  ShoulderSeam: string;
  ShoulderSlope: string;
  NeckSize: string;
  Neckwidth: string;
  ColllarHeightCenterBack: string;
  CollarOpening: string;
  ArmHoleStraight: string;
  CuffHeight: string;
  BottomRib: string;
  UpperChest: string;
  LowerChest: string;
  SleeveLength: string;
  SleeveOpening: string;
  FrontLengthHPS: string;
  FrontRise: string;
  Hem: string;
  BottomHem: string;
  CollarHeight: string;
  CollarPointHeight: string;
  StandHeightBack: string;
  CollarStandLength: string;
  AcrossShoulders: string;
  BackLengthHPS: string;
  BottomWidth: string;
  SideVentFront: string;
  SideVentBack: string;
  PlacketLength: string;
  TwoButtonDistance: string;
  PlacketWidth: string;
  ArmHole: string;

  // Bottom Unit
  Hip: string;
  Waist: string;
  WasitStretch: string;
  WasitRelax: string;
  Thigh: string;
  KneeWidth: string;
  BackRise: string;
  bFrontRise: string;
  WBHeight: string;
  bBottomWidth: string;
  HemBottom: string;
  BottomElastic: string;
  BottomOriginal: string;
  TotalLength: string;
  Inseam: string;
  Outseam: string;
  BottomCuffZipped: string;
  LegOpening: string;
  BottomStraightZipped: string;

  // Logo Placement for Top Uint
  t_TopRight: string;
  t_TopLeft: string;
  t_BottomRight: string;
  t_BottomLeft: string;
  t_Back: string;
  t_Center: string;
  t_left_sleeve: string;
  t_right_sleeve: string;

  // Logo Placement for Bottom Unit
  b_TopRight: string;
  b_TopLeft: string;
  b_BottomRight: string;
  b_BottomLeft: string;
}

// Utility: builds a [label, value] list from an object and a field mapping
const pickFields = (
  obj: Record<string, any> | null | undefined,
  fields: Array<[label: string, key: keyof SizeMeasurementLike]>
) => {
  if (!obj) return [] as Array<[string, string]>;
  return fields
    .map(([label, key]) => {
      const v = obj[key];
      if (v === null || v === undefined || v === "") return null;
      const n = Number(v);
      if (Number.isNaN(n)) return null;
      return [label, formatNumber(n)] as [string, string];
    })
    .filter(Boolean) as Array<[string, string]>;
};

// Public component
interface MeasurementTablesProps {
  productCategory?: ProductCategoryLike | null;
  measurement?: SizeMeasurementLike | null;
  /** If true (or left undefined), uses a simple tab switcher when >1 sections are visible. */
  useTabs?: boolean;
}

const MeasurementTables: React.FC<MeasurementTablesProps> = ({
  productCategory,
  measurement,
  useTabs = true,
}) => {
 const topRows = useMemo(
  () =>
    pickFields(measurement || {}, [
      ["Back Neck Drop", "BackNeckDrop"],
      ["Front Neck Drop", "FrontNeckDrop"],
      ["Shoulder Seam", "ShoulderSeam"],
      ["Shoulder Slope", "ShoulderSlope"],
      ["Neck Size", "NeckSize"],
      ["Neck Width", "Neckwidth"],
      ["Collar Height Center Back", "ColllarHeightCenterBack"],
      ["Collar Opening", "CollarOpening"],
      ["Arm Hole Straight", "ArmHoleStraight"],
      ["Cuff Height", "CuffHeight"],
      ["Bottom Rib", "BottomRib"],
      ["Upper Chest", "UpperChest"],
      ["Lower Chest", "LowerChest"],
      ["Sleeve Length", "SleeveLength"],
      ["Sleeve Opening", "SleeveOpening"],
      ["Front Length HPS", "FrontLengthHPS"],
      ["Front Rise", "FrontRise"],
      ["Hem", "Hem"],
      ["Bottom Hem", "BottomHem"],
      ["Collar Height", "CollarHeight"],
      ["Collar Point Height", "CollarPointHeight"],
      ["Stand Height Back", "StandHeightBack"],
      ["Collar Stand Length", "CollarStandLength"],
      ["Across Shoulders", "AcrossShoulders"],
      ["Back Length HPS", "BackLengthHPS"],
      ["Bottom Width", "BottomWidth"],
      ["Side Vent Front", "SideVentFront"],
      ["Side Vent Back", "SideVentBack"],
      ["Placket Length", "PlacketLength"],
      ["Two Button Distance", "TwoButtonDistance"],
      ["Placket Width", "PlacketWidth"],
      ["Arm Hole", "ArmHole"],
    ]),
  [measurement]
);


  const bottomRows = useMemo(
    () =>
      pickFields(measurement || {}, [
        ["Hip", "Hip"],
        ["Waist", "Waist"],
        ["Waist Stretch", "WasitStretch"],
        ["Waist Relax", "WasitRelax"],
        ["Thigh", "Thigh"],
        ["Knee Width", "KneeWidth"],
        ["Back Rise", "BackRise"],
        ["Front Rise", "bFrontRise"],
        ["Total Length", "TotalLength"],
        ["WB Height", "WBHeight"],
        ["Bottom Width", "bBottomWidth"],
        ["Hem Bottom", "HemBottom"],
        ["Bottom Original", "BottomOriginal"],
        ["Bottom Elastic", "BottomElastic"],
        ["Outseam", "Outseam"],
        ["Inseam", "Inseam"],
        ["Leg Opening", "LegOpening"],
        ["Bottom Cuff Zipped", "BottomCuffZipped"],
        ["Bottom Straight Zipped", "BottomStraightZipped"],
      ]),
    [measurement]
  );

  const logoRows = useMemo(
    () =>
      pickFields(measurement || {}, [
        // Logo Placement for Top Unit
        ["Top Right", "t_TopRight"],
        ["Top Left", "t_TopLeft"],
        ["Bottom Right", "t_BottomRight"],
        ["Bottom Left", "t_BottomLeft"],
        ["Back", "t_Back"],
        ["Center", "t_Center"],
        ["Left Sleeve", "t_left_sleeve"],
        ["Right Sleeve", "t_right_sleeve"],

        // Logo Placement for Bottom Unit
        ["Top Right (Bottom Unit)", "b_TopRight"],
        ["Top Left (Bottom Unit)", "b_TopLeft"],
        ["Bottom Right (Bottom Unit)", "b_BottomRight"],
        ["Bottom Left (Bottom Unit)", "b_BottomLeft"],
      ]),
    [measurement]
  );

  const sections = useMemo(() => {
    const s: Array<{
      key: string;
      title: string;
      rows: Array<[string, string]>;
    }> = [];
    if (productCategory?.IsTopUnit)
      s.push({ key: "top", title: "Top Unit", rows: topRows });
    if (productCategory?.IsBottomUnit)
      s.push({
        key: "bottom",
        title: "Bottom Unit",
        rows: bottomRows,
      });
    if (productCategory?.SupportsLogo)
      s.push({ key: "logo", title: "Logo", rows: logoRows });
    return s.filter((sec) => sec.rows.length > 0);
  }, [productCategory, topRows, bottomRows, logoRows]);

  const multiple = sections.length > 1;
  const [activeKey, setActiveKey] = useState<string>(sections[0]?.key || "");

  // Keep activeKey stable as sections update
  React.useEffect(() => {
    if (!sections.find((s) => s.key === activeKey)) {
      setActiveKey(sections[0]?.key || "");
    }
  }, [sections, activeKey]);

  if (!sections.length) {
    return (
      <div className="text-sm text-gray-500">
        No measurements available for this product category.
      </div>
    );
  }

  // If only one section or tabs disabled → show stacked
  if (!useTabs || !multiple) {
    return (
      <div className="w-full">
        {sections.map((s) => (
          <SectionTable key={s.key} title={s.title} rows={s.rows} />
        ))}
      </div>
    );
  }

  // Tabs variant when multiple sections
  return (
    <div className="w-full">
      <div className="flex gap-2 mb-4">
        {sections.map((s) => (
          <Button
            key={s.key}
            size="sm"
            variant={activeKey === s.key ? "solid" : "flat"}
            onPress={() => setActiveKey(s.key)}
          >
            {s.title}
          </Button>
        ))}
      </div>
      <div>
        {sections
          .filter((s) => s.key === activeKey)
          .map((s) => (
            <SectionTable key={s.key} title={s.title} rows={s.rows} />
          ))}
      </div>
    </div>
  );
};

export default MeasurementTables;
