import React from 'react'
import Label from '../../components/common/Label';
import { ErrorMessage, Field } from 'formik';

const TextAreaField = ({ label, name }: { label: string; name: string }) => (
  
    <div className="flex flex-col gap-1 mb-3">
    <Label isRequired={false} label={label} />
    <Field
      as="textarea"
      name={name}
      className="rounded-xl dark:text-gray-400 text-black text-sm p-2 w-full outline-none dark:bg-slate-800 bg-gray-100 border-1 dark:border-gray-400 border-gray-100"
    />
    <ErrorMessage name={name} component="div" className="text-red-500 text-sm" />
  </div>
  )


export default TextAreaField