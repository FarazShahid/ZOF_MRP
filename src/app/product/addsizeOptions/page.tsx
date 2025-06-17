import React from 'react'
import AdminDashboardLayout from '../../components/common/AdminDashboardLayout'
import SizeMeasurementForm from '../../addsize/SizeMeasurementForm'
import TShirtViewer from '../../components/ui/Modals/TshirtViewer'

const page = () => {
  return (
    <AdminDashboardLayout>
      {/* <SizeMeasurementForm isEdit={false} /> */}
      <TShirtViewer />
    </AdminDashboardLayout>
  )
}

export default page