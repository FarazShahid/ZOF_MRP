"use client"

import React from 'react'
import { useParams } from 'next/navigation';
import ProductForm from '../../component/ProductForm';

const page = () => {
  const params = useParams();
  const id = params?.id;

   if (!id || typeof id !== 'string') {
    return <div>Invalid Product ID</div>;
  }

  return (
    <>
        <ProductForm productId={id} />
    </>
  )
}

export default page
