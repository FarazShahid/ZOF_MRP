import React from 'react'
import AdminDashboardLayout from '../components/common/AdminDashboardLayout'
import ShipmentTable from './components/ShipmentTable'
import ShipmentModule from '../components/shipment/ShipmentModule'

const page = () => {
  return (
    <AdminDashboardLayout>
      <ShipmentModule />
    </AdminDashboardLayout>
  )
}

export default page