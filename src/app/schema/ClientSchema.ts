import * as Yup from 'yup';

export const SchemaValidation = Yup.object().shape({
  Name: Yup.string().required('Name is required'),
  Email: Yup.string().email('Invalid email').required('Email is required'),
  POCEmail: Yup.string().email('Invalid email'),
});

export const AddClientSchemaValidation = Yup.object().shape({
  Name: Yup.string().required('Business name is required').max(100, 'Max 100 characters'),
  Email: Yup.string().required('Business email is required').email('Invalid email'),
  POCName: Yup.string().max(100, 'Max 100 characters'),
  Phone: Yup.string().max(50, 'Max 50 characters'),
  POCEmail: Yup.string().test('email', 'Invalid POC email', (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)),
  Website: Yup.string()
    .max(200, 'Max 200 characters')
    .test('url', 'Invalid URL', (v) => !v || /^https?:\/\/.+/.test(v)),
  Linkedin: Yup.string().max(200, 'Max 200 characters'),
  Instagram: Yup.string().max(200, 'Max 200 characters'),
  Country: Yup.string().max(100, 'Max 100 characters'),
  State: Yup.string().max(100, 'Max 100 characters'),
  City: Yup.string().max(100, 'Max 100 characters'),
  CompleteAddress: Yup.string().max(300, 'Max 300 characters'),
  ClientStatusId: Yup.string(),
});