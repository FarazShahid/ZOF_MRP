"use client"

import React from 'react'
import { useParams } from 'next/navigation';
import OrderForm from '../../components/OrderForm';

const page = () => {
  const params = useParams();
  const id = params?.id;

   if (!id || typeof id !== 'string') {
    return <div>Invalid ID</div>;
  }

  return (
    <>
        <OrderForm orderId={id} />
    </>
  )
}

export default page
