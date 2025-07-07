import React from 'react'
import AdminDashboardLayout from '../../components/common/AdminDashboardLayout'
import ShipmentForm from '../components/ShipmentForm'

const page = () => {
  return (
    <AdminDashboardLayout>
        <ShipmentForm />
    </AdminDashboardLayout>
  )
}

export default page