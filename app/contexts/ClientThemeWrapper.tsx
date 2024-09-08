'use client'

import { useContext } from "react"
import { ThemeContext } from "./ThemeContext"

export default function ClientThemeWrapper({ children }: any) {
    const { theme }: any = useContext(ThemeContext);

    return (
        <div className='h-screen'data-theme={theme}>
            {children}
        </div>
    )
}