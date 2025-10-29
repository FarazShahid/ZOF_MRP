import * as Yup from 'yup';

export const SupplierSchema = Yup.object().shape({
    Name: Yup.string().required('Name is required'),
    Email: Yup.string().email('Invalid email').required("Email is required"),
})


export const UserSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    Email: Yup.string().required('Email is required'),
    Password: Yup.string().required('Password is required'),
    roleId: Yup.number().required('Role is required'),
})


export const UnitOfMeasureSchema = Yup.object().shape({
    Name: Yup.string().required('Name is required'),
})

export const CarriorSchema = Yup.object().shape({
    Name: Yup.string().required('Name is required'),
    
})

export const ProductCategorySchema = Yup.object().shape({
    Name: Yup.string().required('Name is required'),
    
})