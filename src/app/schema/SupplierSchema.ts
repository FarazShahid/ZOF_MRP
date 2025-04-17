import * as Yup from 'yup';

export const SupplierSchema = Yup.object().shape({
    Name: Yup.string().required('Name is required'),
})


export const UserSchema = Yup.object().shape({
    Email: Yup.string().required('Email is required'),
})