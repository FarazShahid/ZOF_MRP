import React from 'react'
import AdminDashboardLayout from '../../components/common/AdminDashboardLayout'
import SizeMeasurementForm from '../../addsize/SizeMeasurementForm'

const page = () => {
  return (
    <AdminDashboardLayout>
      <SizeMeasurementForm isEdit={false} />
    </AdminDashboardLayout>
  )
}

export default page