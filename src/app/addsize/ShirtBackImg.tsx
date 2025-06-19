import Image from 'next/image'
import React from 'react'
import ShirtBack from "../../../public/MeasurementBack.png"

const ShirtBackImg = () => {
  return (
    <>
        <Image src={ShirtBack} alt='shirt back view' />
    </>
  )
}

export default ShirtBackImg