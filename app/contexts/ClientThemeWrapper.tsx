'use client'

import { useContext } from "react"
import { ThemeContext } from "./ThemeContext"
import { Inter, Yatra_One } from "next/font/google";

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
})

const yatra = Yatra_One({
    weight: '400',
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-yatra',
})
export default function ClientThemeWrapper({children}: any){
    const {theme} = useContext(ThemeContext);

    return <html data-theme={theme} className={`${inter.variable} ${yatra.variable} font-sans`}>
        <body>
        {children}
        </body>
        </html>
}