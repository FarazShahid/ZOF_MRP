"use client"

import React from 'react'
import { useParams } from 'next/navigation';
import OrderForm from '../../components/OrderForm';
import AdminDashboardLayout from '@/src/app/components/common/AdminDashboardLayout';
import { PERMISSIONS_ENUM } from '@/src/types/rightids';
import PermissionGuard from '../../../components/auth/PermissionGaurd';

const page = () => {
  const params = useParams();
  const id = params?.id;

   if (!id || typeof id !== 'string') {
    return <div>Invalid ID</div>;
  }

  return (
    <AdminDashboardLayout>
        <PermissionGuard required={PERMISSIONS_ENUM.ORDER.UPDATE}>
          <OrderForm orderId={id} />
        </PermissionGuard>
    </AdminDashboardLayout>
  )
}

export default page
