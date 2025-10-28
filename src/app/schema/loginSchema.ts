import * as Yup from 'yup';

export const LoginSchemaValidation = Yup.object().shape({
    email: Yup.string().email('Inavlid Email').required('Email is required'),
    password: Yup.string().required('Password is required'),
    remember_me: Yup.boolean().optional(),
})