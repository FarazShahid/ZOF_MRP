import * as Yup from 'yup';

export const CatagorySchema = Yup.object().shape({
    type: Yup.string().required('Name is required'),
})