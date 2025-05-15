import * as Yup from 'yup';

export const ProductValidationSchemas = [
    Yup.object({
        ProductCategoryId: Yup.string().required('Product Category is required'),
        FabricTypeId: Yup.string().required('Fabric Type is required'),
    }),
    null,
    null
  ];