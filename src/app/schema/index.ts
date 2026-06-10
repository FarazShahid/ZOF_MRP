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
  }),
  null,
  Yup.object({
    Description: Yup.string().trim().required("Description is required"),
  }),
];
