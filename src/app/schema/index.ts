import * as Yup from "yup";

export const StatusSchema = Yup.object().shape({
    Name: Yup.string().required('Name is required'),
})


export const ProductValidationSchemas = [
  Yup.object({
    Name: Yup.string()
      .trim()
      .required("Name is required")
      .min(3, "Name must be at least 3 characters")
      .max(255, "Name must not exceed 255 characters"),
    ClientId: Yup.string().required("Client is required"),
    ProductCategoryId: Yup.string().required("Product Category is required"),
    FabricTypeId: Yup.string().required("Fabric Type is required"),
    productComponents: Yup.array()
      .of(
        Yup.object({
          componentTypeId: Yup.string().test(
            "component-type-required-with-fabric",
            "Product Component Type is required",
            function (value) {
              const { fabricTypeId } = this.parent;
              return !fabricTypeId || Boolean(value);
            }
          ),
          fabricTypeId: Yup.string().test(
            "fabric-required-with-component-type",
            "Fabric Type is required",
            function (value) {
              const { componentTypeId } = this.parent;
              return !componentTypeId || Boolean(value);
            }
          ),
        })
      )
      .test(
        "unique-component-types",
        "Product Component Type can only be added once",
        (components) => {
          const componentTypeIds = (components || [])
            .map((component) => component?.componentTypeId)
            .filter(Boolean);

          return componentTypeIds.length === new Set(componentTypeIds).size;
        }
      ),
  }),
  null,
  Yup.object({
    Description: Yup.string()
      .trim()
      .max(255, "Description must not exceed 255 characters"),
  }),
];

export const OrderValidationSchemas = [
  Yup.object({
    OrderNumber:  Yup.string().required("Order Number is required"),
    OrderName:  Yup.string().required("Order Name is required"),
    ClientId: Yup.string().required("Client is required"),
    Deadline: Yup.string().required("Deadline is required"),
    OrderPriority: Yup.string().required("Order Priority is required"),
  }),
  Yup.object({
    items: Yup.array()
      .of(
        Yup.object({
          ProductId: Yup.number()
            .typeError("Product is required")
            .moreThan(0, "Product is required")
            .required("Product is required"),
          orderItemDetails: Yup.array()
            .of(
              Yup.object({
                Quantity: Yup.number()
                  .typeError("Quantity is required")
                  .integer("Quantity must be a whole number")
                  .min(1, "Quantity must be at least 1")
                  .required("Quantity is required"),
                Priority: Yup.number()
                  .transform((value, originalValue) =>
                    originalValue === "" || originalValue === null ? 0 : value
                  )
                  .typeError("Please select a priority")
                  .moreThan(0, "Please select a priority")
                  .required("Please select a priority"),
                SizeOption: Yup.number()
                  .transform((value, originalValue) =>
                    originalValue === "" || originalValue === null ? 0 : value
                  )
                  .moreThan(0, "Please select a size option")
                  .required("Please select a size option"),
              })
            )
            .min(1, "Please add at least one size option")
            .required("Please add at least one size option"),
        })
      )
      .min(1, "Please add at least one product")
      .required("Please add at least one product"),
  }),
  Yup.object({
    Description: Yup.string().trim().required("Description is required"),
  }),
];
