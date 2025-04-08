import * as Yup from 'yup';

export const SubCategorySchema = Yup.object().shape({
    Name: Yup.string().required('Name is required'),
    CategoryId: Yup.string().required('Category is required'),
})