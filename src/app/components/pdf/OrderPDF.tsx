import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image as PDFImage,
} from "@react-pdf/renderer";
import { formatDate } from "../../interfaces";
import { GetOrderByIdType } from "../../interfaces/OrderStoreInterface";

type Variant = "summary" | "spec";
type MeasurementBundle = { measurement?: any; productCategory?: any };
type MeasurementMap = Record<number, MeasurementBundle>;

type Props = {
  order: GetOrderByIdType;
  variant: Variant;
  measurements?: MeasurementMap; // { [MeasurementId]: { measurement, productCategory } }
  chartSrc?: string;             // data URL or absolute URL (recommended)
};

const COLORS = {
  text: "#1F2937",
  subtext: "#4B5563",
  line: "#E5E7EB",
  headerDark: "#0B1220",
  brand: "#1D4ED8",
  chipGreenBg: "#D1FAE5",
  chipGreenText: "#065F46",
  chipOrangeBg: "#FFEDD5",
  chipOrangeText: "#9A3412",
  chipRedBg: "#FEE2E2",
  chipRedText: "#7F1D1D",
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 30,
    paddingBottom: 40,
    paddingHorizontal: 32,
    fontSize: 10,
    color: COLORS.text,
  },

  // Header
  headerRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 14 },
  leftHeader: { flexDirection: "row", alignItems: "center" },
  logoBox: { width: 16, height: 16, borderRadius: 3, backgroundColor: COLORS.brand, marginRight: 6 },
  companyName: { fontSize: 11, color: COLORS.headerDark, fontWeight: 700 },
  rightHeader: { alignItems: "flex-end" },
  docTitle: { fontSize: 18, color: COLORS.headerDark, fontWeight: 700 },
  headerMeta: { marginTop: 2, color: COLORS.subtext },
  pillRow: { marginTop: 6, flexDirection: "row" },

  // Info bar
  infoBar: { marginTop: 8, backgroundColor: "#F3F4F6", borderRadius: 6, padding: 10 },
  infoGrid: { flexDirection: "row", flexWrap: "wrap" },
  infoCell: { width: "25%", paddingVertical: 6, paddingRight: 8 },
  infoLabel: { color: COLORS.subtext, marginBottom: 2, fontWeight: 700 },
  infoValue: { color: COLORS.text },

  // Tables
  table: { marginTop: 10, borderWidth: 1, borderColor: COLORS.text, borderRadius: 4, overflow: "hidden" },
  tableHeaderRow: { flexDirection: "row", backgroundColor: COLORS.headerDark },
  th: { flex: 1, color: "#fff", paddingVertical: 6, paddingHorizontal: 6, fontWeight: 700, borderRightWidth: 1, borderRightColor: "#fff" },
  tdRow: { flexDirection: "row" },
  td: { flex: 1, paddingVertical: 6, paddingHorizontal: 6, borderRightWidth: 1, borderRightColor: COLORS.text, borderTopWidth: 1, borderTopColor: COLORS.text },

  // Sections
  sectionTitle: { marginTop: 14, marginBottom: 6, fontSize: 12, fontWeight: 700, color: COLORS.headerDark },
  productCard: { marginTop: 10, padding: 10, borderRadius: 6, borderWidth: 1, borderColor: COLORS.line },
  productName: { fontSize: 12, fontWeight: 700 },
  productMeta: { color: COLORS.subtext, marginTop: 2, marginBottom: 6 },

  // Size option header
  sizeHeader: { marginTop: 8, paddingVertical: 6, paddingHorizontal: 8, backgroundColor: "#F9FAFB", borderRadius: 6, borderWidth: 1, borderColor: COLORS.line },
  sizeHeaderRow: { flexDirection: "row" },
  sizeHeaderCell: { marginRight: 12 },

  // Two-column spec row (no CSS gap in react-pdf → use paddings)
  specRow: { flexDirection: "row", marginTop: 8 },
  specLeft: { flex: 1, paddingRight: 8 },
  specRight: { flex: 1, paddingLeft: 8 },

  // Measurement tables
  subSectionTitle: {
    marginTop: 8, marginBottom: 4, fontSize: 11, fontWeight: 700,
    color: COLORS.headerDark, borderBottomWidth: 1, borderBottomColor: COLORS.line, paddingBottom: 3,
  },
  smallTable: { borderWidth: 1, borderColor: COLORS.text, borderRadius: 4, overflow: "hidden" },
  th2Row: { flexDirection: "row", backgroundColor: COLORS.headerDark },
  th2: { flex: 2, color: "#fff", paddingVertical: 5, paddingHorizontal: 6, fontWeight: 700, borderRightWidth: 1, borderRightColor: "#fff" },
  th2n: { flex: 1, color: "#fff", paddingVertical: 5, paddingHorizontal: 6, fontWeight: 700 },
  td2Row: { flexDirection: "row" },
  td2: { flex: 2, paddingVertical: 5, paddingHorizontal: 6, borderRightWidth: 1, borderRightColor: COLORS.text, borderTopWidth: 1, borderTopColor: COLORS.text },
  td2n: { flex: 1, paddingVertical: 5, paddingHorizontal: 6, borderTopWidth: 1, borderTopColor: COLORS.text },

  // Chip
  chip: { paddingVertical: 3, paddingHorizontal: 8, borderRadius: 999, fontSize: 9, fontWeight: 700 },
});

function StatusChip({ status }: { status?: string }) {
  const s = (status ?? "").toLowerCase();
  let bg = COLORS.chipGreenBg, fg = COLORS.chipGreenText;
  if (s.includes("risk") || s.includes("hold") || s.includes("pending")) { bg = COLORS.chipOrangeBg; fg = COLORS.chipOrangeText; }
  if (s.includes("delay") || s.includes("late") || s.includes("blocked")) { bg = COLORS.chipRedBg; fg = COLORS.chipRedText; }
  return <Text style={{ ...styles.chip, backgroundColor: bg, color: fg }}>{status || "—"}</Text>;
}

// === Overview (summary) table
const ItemsOverviewTable: React.FC<{ order: GetOrderByIdType }> = ({ order }) => {
  const rows =
    order?.items?.flatMap((item) =>
      (item?.orderItemDetails ?? []).map((d) => ({
        name: item?.ProductName ?? "-",
        qty: d?.Quantity ?? "-",
        size: d?.SizeOptionName ?? "-",
        fabric: `${item?.ProductFabricName ?? "-"}, ${item?.ProductFabricGSM ?? "-"} GSM`,
      }))
    ) ?? [];

  return (
    <View style={styles.table}>
      <View style={styles.tableHeaderRow}>
        <Text style={styles.th}>Product</Text>
        <Text style={styles.th}>Quantity</Text>
        <Text style={styles.th}>Size</Text>
        <Text style={styles.th}>Fabric & GSM</Text>
      </View>
      {rows.length === 0 ? (
        <View style={styles.tdRow}>
          <Text style={{ ...styles.td, flex: 4 }}>No Product</Text>
        </View>
      ) : (
        rows.map((r, i) => (
          <View key={i} style={styles.tdRow}>
            <Text style={styles.td}>{r.name}</Text>
            <Text style={styles.td}>{String(r.qty)}</Text>
            <Text style={styles.td}>{r.size}</Text>
            <Text style={styles.td}>{r.fabric}</Text>
          </View>
        ))
      )}
    </View>
  );
};

// === Utilities to build grouped measurement rows from your SizeMeasurements record
const pickRows = (obj: any, entries: Array<[string, string]>) => {
  const out: { label: string; value: string; unit: string }[] = [];
  for (const [key, label] of entries) {
    const v = obj?.[key];
    if (v === undefined || v === null || String(v).trim() === "") continue;
    out.push({ label, value: String(v), unit: "" });
  }
  return out;
};

const TOP_UNIT_FIELDS: Array<[string, string]> = [
  ["FrontLengthHPS", "Front Length (HPS)"], ["BackLengthHPS", "Back Length (HPS)"], ["AcrossShoulders", "Across Shoulders"],
  ["ArmHole", "Arm Hole"], ["UpperChest", "Upper Chest"], ["LowerChest", "Lower Chest"], ["Waist", "Waist"],
  ["BottomWidth", "Bottom Width"], ["SleeveLength", "Sleeve Length"], ["SleeveOpening", "Sleeve Opening"],
  ["NeckSize", "Neck Size"], ["CollarHeight", "Collar Height"], ["CollarPointHeight", "Collar Point Height"],
  ["StandHeightBack", "Stand Height Back"], ["CollarStandLength", "Collar Stand Length"],
  ["SideVentFront", "Side Vent (Front)"], ["SideVentBack", "Side Vent (Back)"],
  ["PlacketLength", "Placket Length"], ["TwoButtonDistance", "Two Button Distance"], ["PlacketWidth", "Placket Width"],
  ["BottomHem", "Bottom Hem"],
];

const BOTTOM_UNIT_FIELDS: Array<[string, string]> = [
  ["Hip", "Hip"], ["WasitRelax", "Waist Relax"], ["WasitStretch", "Waist Stretch"], ["Thigh", "Thigh"], ["KneeWidth", "Knee Width"],
  ["FrontRise", "Front Rise"], ["bFrontRise", "Front Rise (Btm)"], ["BackRise", "Back Rise"], ["WBHeight", "WB Height"],
  ["bBottomWidth", "Bottom Width (Btm)"], ["HemBottom", "Hem Bottom"], ["BottomElastic", "Bottom Elastic"], ["BottomOriginal", "Bottom Original"],
  ["TotalLength", "Total Length"], ["Inseam", "Inseam"], ["Outseam", "Outseam"], ["LegOpening", "Leg Opening"],
  ["BottomCuffZipped", "Bottom Cuff (Zipped)"], ["BottomStraightZipped", "Bottom Straight (Zipped)"],
];

const LOGO_TOP_FIELDS: Array<[string, string]> = [
  ["t_TopRight", "Logo Top Right"], ["t_TopLeft", "Logo Top Left"], ["t_BottomRight", "Logo Bottom Right"],
  ["t_BottomLeft", "Logo Bottom Left"], ["t_Back", "Logo Back"], ["t_Center", "Logo Center"],
  ["t_left_sleeve", "Logo Left Sleeve"], ["t_right_sleeve", "Logo Right Sleeve"],
];

const LOGO_BOTTOM_FIELDS: Array<[string, string]> = [
  ["b_TopRight", "Logo Top Right"], ["b_TopLeft", "Logo Top Left"],
  ["b_BottomRight", "Logo Bottom Right"], ["b_BottomLeft", "Logo Bottom Left"],
];

const MeasurementTable = ({ rows }: { rows: Array<{ label: string; value: string; unit: string }> }) => (
  <View style={styles.smallTable}>
    <View style={styles.th2Row}>
      <Text style={styles.th2}>Point</Text>
      <Text style={styles.th2n}>Value</Text>
      <Text style={styles.th2n}>Unit</Text>
    </View>
    {(rows.length ? rows : [{ label: "—", value: "—", unit: "" }]).map((r, i) => (
      <View key={i} style={styles.td2Row}>
        <Text style={styles.td2}>{r.label}</Text>
        <Text style={styles.td2n}>{r.value}</Text>
        <Text style={styles.td2n}>{r.unit}</Text>
      </View>
    ))}
  </View>
);

// === Main
const OrderPDF: React.FC<Props> = ({ order, variant, measurements, chartSrc }) => {
  const createdAt = new Date();

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        {/* HEADER */}
        <View style={styles.headerRow}>
          <View style={styles.leftHeader}>
            <View style={styles.logoBox} />
            <Text style={styles.companyName}>ZeroOneForge MRP</Text>
          </View>
          <View style={styles.rightHeader}>
            <Text style={styles.docTitle}>
              {variant === "summary" ? "Order Summary" : "Order Specification Sheet"}
            </Text>
            <Text style={styles.headerMeta}>Order #: {order?.OrderNumber ?? "—"}</Text>
            <Text style={styles.headerMeta}>Generated: {createdAt.toDateString()}</Text>
            <View style={styles.pillRow}><StatusChip status={order?.StatusName} /></View>
          </View>
        </View>

        {/* SUMMARY BAR */}
        <View style={styles.infoBar}>
          <View style={styles.infoGrid}>
            <View style={styles.infoCell}><Text style={styles.infoLabel}>Client Name</Text><Text style={styles.infoValue}>{order?.ClientName ?? "—"}</Text></View>
            <View style={styles.infoCell}><Text style={styles.infoLabel}>Event Name</Text><Text style={styles.infoValue}>{order?.EventName ?? "—"}</Text></View>
            <View style={styles.infoCell}><Text style={styles.infoLabel}>Deadline</Text><Text style={styles.infoValue}>{order?.Deadline ? formatDate(order.Deadline) : "—"}</Text></View>
            <View style={styles.infoCell}><Text style={styles.infoLabel}>Current Status</Text><Text style={styles.infoValue}>{order?.StatusName ?? "—"}</Text></View>
          </View>
        </View>

        {/* OVERVIEW */}
        <Text style={styles.sectionTitle}>Products Overview</Text>
        <ItemsOverviewTable order={order} />

        {/* SPECIFICATION */}
        {variant === "spec" && (
          <>
            <Text style={styles.sectionTitle}>Detailed Items</Text>

            {(order?.items ?? []).map((item, idx) => (
              <View key={idx} style={styles.productCard}>
                <Text style={styles.productName}>{item?.ProductName}</Text>
                <Text style={styles.productMeta}>
                  {item?.ProductCategoryName} — {item?.ProductFabricName} ({item?.ProductFabricGSM} GSM)
                </Text>

                {(item?.orderItemDetails ?? []).map((d, j) => {
                  const bundle = measurements?.[d?.MeasurementId ?? -1];
                  const m = bundle?.measurement || {};
                  const rowsTop = pickRows(m, TOP_UNIT_FIELDS);
                  const rowsBottom = pickRows(m, BOTTOM_UNIT_FIELDS);
                  const rowsLogoTop = pickRows(m, LOGO_TOP_FIELDS);
                  const rowsLogoBottom = pickRows(m, LOGO_BOTTOM_FIELDS);

                  return (
                    <View key={`${idx}_${j}`}>
                      {/* Size option header */}
                      <View style={styles.sizeHeader}>
                        <View style={styles.sizeHeaderRow}>
                          <Text style={styles.sizeHeaderCell}>Size: {d?.SizeOptionName ?? "—"}</Text>
                          <Text style={styles.sizeHeaderCell}>Qty: {d?.Quantity ?? "—"}</Text>
                          <Text>Priority: {d?.Priority ?? "—"}</Text>
                        </View>
                      </View>

                      {/* Two columns: image (left) + table(s) (right) */}
                      <View style={styles.specRow}>
                        <View style={styles.specLeft}>
                          {chartSrc ? (
                            <PDFImage
                              src={chartSrc}
                              style={{ width: "100%", height: 140 }}
                            />
                          ) : (
                            <View style={{ width: "100%", height: 140, borderWidth: 1, borderColor: COLORS.line, justifyContent: "center", alignItems: "center" }}>
                              <Text style={{ color: COLORS.subtext }}>Measurement chart image</Text>
                            </View>
                          )}
                        </View>

                        <View style={styles.specRight}>
                          {/* Top Unit */}
                          {rowsTop.length > 0 && (
                            <>
                              <Text style={styles.subSectionTitle}>Top Unit</Text>
                              <MeasurementTable rows={rowsTop} />
                            </>
                          )}

                          {/* Bottom Unit */}
                          {rowsBottom.length > 0 && (
                            <>
                              <Text style={styles.subSectionTitle}>Bottom Unit</Text>
                              <MeasurementTable rows={rowsBottom} />
                            </>
                          )}

                          {/* Logo placements */}
                          {rowsLogoTop.length > 0 && (
                            <>
                              <Text style={styles.subSectionTitle}>Logo Placement — Top</Text>
                              <MeasurementTable rows={rowsLogoTop} />
                            </>
                          )}

                          {rowsLogoBottom.length > 0 && (
                            <>
                              <Text style={styles.subSectionTitle}>Logo Placement — Bottom</Text>
                              <MeasurementTable rows={rowsLogoBottom} />
                            </>
                          )}
                        </View>
                      </View>
                    </View>
                  );
                })}

                {/* Printing options per product */}
                {Array.isArray(item?.printingOptions) && item.printingOptions.length > 0 && (
                  <Text style={{ marginTop: 8 }}>
                    Printing: {item.printingOptions.map((p: any) => p?.PrintingOptionName).filter(Boolean).join(", ")}
                  </Text>
                )}
              </View>
            ))}
          </>
        )}
      </Page>
    </Document>
  );
};

export default OrderPDF;
