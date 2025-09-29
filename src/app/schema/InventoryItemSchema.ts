import * as Yup from "yup";

export const InventoryItemSchema = Yup.object().shape({
  Name: Yup.string().required("Name is required"),
  UnitOfMeasureId: Yup.string().required("Unit Of Measure is required"),
  SupplierId: Yup.string().required("Supplier is required"),
  ReorderLevel: Yup.number().required("Reorder Level is required"),
  Stock: Yup.number().required("Stock is required"),
});

export const InventoryTransactionSchema = Yup.object().shape({
  InventoryItemId: Yup.string().required("Inventory Item is required"),
  Quantity: Yup.string().required("Quantity is required"),
  TransactionType: Yup.string().required("Transaction Type is required"),
});


export const ShipmentSchema = Yup.object().shape({
  ShipmentCode: Yup.string().required("Shipment Code is required"),
  ShipmentCarrierId: Yup.string().required("Shipment Carrier is required"),
  ShipmentDate: Yup.string().required("Shipment Date is required"),
  WeightUnit: Yup.string().required("Weight Unit is required"),
  TotalWeight: Yup.string().required("Total Weight is required"),
  NumberOfBoxes: Yup.string().required("Number Of Boxes are required"),
  ShipmentCost: Yup.string().required("Shipment Cost is required"),
  Status: Yup.string().required("Status is required"),

  boxes: Yup.array().of(
    Yup.object().shape({
      BoxNumber: Yup.string().required("Box Number is required"),
      Weight: Yup.string().required("Weight is required"),
      OrderBoxDescription: Yup.string(),
      items: Yup.array().of(
        Yup.object().shape({
          OrderItemId: Yup.string().required("Order Item is required"),
          OrderItemDescription: Yup.string(),
          Quantity: Yup.string().required("Quantity is required"),
        })
      ).min(1, "At least one item is required in the box"),
    })
  ).min(1, "At least one box is required"),
});
