'use client'

import { useContext } from "react"
import { ThemeContext } from "./ThemeContext"
import { Harmattan, Aleo} from "next/font/google";

const bodytxt = Harmattan({
    weight: '400',
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-body',
})

const titletxt = Aleo({
    weight: '700',
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-title',
})
export default function ClientThemeWrapper({children}: any){
    const {theme}:any = useContext(ThemeContext);

    return (
        <html data-theme={theme} className={`${bodytxt.variable} ${titletxt.variable} font-sans`}>
            <body>
            {children}
            </body>
        </html>
    )
}