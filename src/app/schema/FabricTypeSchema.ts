import * as Yup from "yup";

export const FabricTypeSchema = Yup.object().shape({
  type: Yup.string().required("Type is required"),
  name: Yup.string().required("Name is required"),
  gsm: Yup.number()
    .required("GSM is required")
    .min(0, "GSM must be a positive number")
    .max(2147483647, "GSM must not exceed 2,147,483,647"),
});
