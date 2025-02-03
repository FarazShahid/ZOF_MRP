"use client"

import { HeroUIProvider } from "@heroui/react"

function NextUICompProvider({children}:{children:React.ReactNode}) {
  return (
    <HeroUIProvider>
        {children}
    </HeroUIProvider>
  )
}

export default NextUICompProvider