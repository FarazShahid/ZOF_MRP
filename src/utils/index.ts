export const normalize = (v: unknown) =>
  (v ?? "")
    .toString()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();


export const labelMap: Record<string, string> = {
  Measurement1: "Name",
  // Top Unit
  BackNeckDrop: "Back Neck Drop",
  FrontNeckDrop: "Front Neck Drop",
  ShoulderSeam: "Shoulder Seam",
  ShoulderSlope: "Shoulder Slope",
  NeckSize: "Neck Size",
  Neckwidth: "Neck Width",
  ColllarHeightCenterBack: "Collar Height (Center Back)",
  CollarOpening: "Collar Opening",
  ArmHoleStraight: "Arm Hole Straight",
  CuffHeight: "Cuff Height",
  BottomRib: "Bottom Rib",
  UpperChest: "Upper Chest",
  LowerChest: "Lower Chest",
  SleeveLength: "Sleeve Length",
  SleeveOpening: "Sleeve Opening",
  FrontLengthHPS: "Front Length (HPS)",
  FrontRise: "Front Rise",
  Hem: "Hem",
  BottomHem: "Bottom Hem",
  CollarHeight: "Collar Height",
  CollarPointHeight: "Collar Point Height",
  StandHeightBack: "Stand Height Back",
  CollarStandLength: "Collar Stand Length",
  AcrossShoulders: "Across Shoulders",
  BackLengthHPS: "Back Length (HPS)",
  BottomWidth: "Bottom Width",
  SideVentFront: "Side Vent Front",
  SideVentBack: "Side Vent Back",
  PlacketLength: "Placket Length",
  TwoButtonDistance: "Two Button Distance",
  PlacketWidth: "Placket Width",
  ArmHole: "Arm Hole",
  // Bottom Unit
  Hip: "Hip",
  Waist: "Waist",
  WasitStretch: "Waist Stretch",
  WasitRelax: "Waist Relax",
  Thigh: "Thigh",
  KneeWidth: "Knee Width",
  BackRise: "Back Rise",
  bFrontRise: "Bottom Front Rise",
  WBHeight: "WB Height",
  bBottomWidth: "Bottom Unit Bottom Width",
  HemBottom: "Hem Bottom",
  BottomElastic: "Bottom Elastic",
  BottomOriginal: "Bottom Original",
  TotalLength: "Total Length",
  Inseam: "Inseam",
  Outseam: "Outseam",
  BottomCuffZipped: "Bottom Cuff Zipped",
  LegOpening: "Leg Opening",
  BottomStraightZipped: "Bottom Straight Zipped",
  // Logo placements
  t_TopRight: "Top Right (Top Unit)",
  t_TopLeft: "Top Left (Top Unit)",
  t_BottomRight: "Bottom Right (Top Unit)",
  t_BottomLeft: "Bottom Left (Top Unit)",
  t_Back: "Back (Top Unit)",
  t_Center: "Center (Top Unit)",
  t_left_sleeve: "Left Sleeve (Top Unit)",
  t_right_sleeve: "Right Sleeve (Top Unit)",
  b_TopRight: "Top Right (Bottom Unit)",
  b_TopLeft: "Top Left (Bottom Unit)",
  b_BottomRight: "Bottom Right (Bottom Unit)",
  b_BottomLeft: "Bottom Left (Bottom Unit)",
};


