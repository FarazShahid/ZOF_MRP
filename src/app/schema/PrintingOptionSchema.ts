import * as Yup from 'yup';

export const PrintingOptionSchema = Yup.object().shape({
    Name: Yup.string().required('Name is required'),
})
