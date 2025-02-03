import * as Yup from 'yup';

export const SleeveTypeSchema = Yup.object().shape({
    sleeveTypeName: Yup.string().required('Name is required'),
    productCategoryId: Yup.string().required('Product Category is required'),
})