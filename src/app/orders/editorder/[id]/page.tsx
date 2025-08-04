"use client"

import React from 'react'
import { useParams } from 'next/navigation';
import OrderForm from '../../components/OrderForm';
import AdminDashboardLayout from '@/src/app/components/common/AdminDashboardLayout';

const page = () => {
  const params = useParams();
  const id = params?.id;

   if (!id || typeof id !== 'string') {
    return <div>Invalid ID</div>;
  }

  return (
    <AdminDashboardLayout>
        <OrderForm orderId={id} />
    </AdminDashboardLayout>
  )
}

export default page
