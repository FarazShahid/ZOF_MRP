import React from 'react'
import AdminDashboardLayout from '../../components/common/AdminDashboardLayout'
import CarriorTable from './components/CarriorTable'

const page = () => {
  return (
    <AdminDashboardLayout>
        <CarriorTable />
    </AdminDashboardLayout>
  )
}

export default page