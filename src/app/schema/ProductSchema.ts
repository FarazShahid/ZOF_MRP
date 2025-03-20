import * as Yup from 'yup';

export const ProductSchema = Yup.object().shape({
    ProductCategoryId: Yup.string().required('Product Category is required'),
    FabricTypeId: Yup.string().required('Fabric Type is required'),
    Description: Yup.string().required('Description is required'),
})