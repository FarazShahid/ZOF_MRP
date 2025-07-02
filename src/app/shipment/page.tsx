import React from 'react'
import AdminDashboardLayout from '../components/common/AdminDashboardLayout'
import ShipmentTable from './components/ShipmentTable'

const page = () => {
  return (
    <AdminDashboardLayout>
        <ShipmentTable />
    </AdminDashboardLayout>
  )
}

export default page