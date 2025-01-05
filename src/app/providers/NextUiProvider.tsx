"use client"

import { NextUIProvider } from '@nextui-org/react'

function NextUICompProvider({children}:{children:React.ReactNode}) {
  return (
    <NextUIProvider>
        {children}
    </NextUIProvider>
  )
}

export default NextUICompProvider