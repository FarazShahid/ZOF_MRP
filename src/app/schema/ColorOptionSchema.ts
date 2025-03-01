import * as Yup from 'yup';

export const ColorOptionSchema = Yup.object().shape({
    Name: Yup.string().required('Name is required'),
})