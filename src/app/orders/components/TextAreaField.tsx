import React from 'react'
import Label from '../../components/common/Label';
import { ErrorMessage, Field } from 'formik';

const TextAreaField = ({ label, name }: { label: string; name: string }) => (
  
    <div className="flex flex-col gap-1 mb-3">
    <Label isRequired label={label} />
    <Field
      as="textarea"
      name={name}
      className="rounded-xl text-gray-400 text-sm p-2 w-full outline-none bg-gray-950 border-1 border-gray-600"
    />
    <ErrorMessage name={name} component="div" className="text-red-500 text-sm" />
  </div>
  )


export default TextAreaField