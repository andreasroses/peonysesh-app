import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from "./components/navbar";
import ClientThemeWrapper from "./contexts/ClientThemeWrapper";
import { Harmattan, Aleo } from "next/font/google";

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



export const metadata: Metadata = {
  title: "Peony Sessions",
  description: "To-do boards with pomodoro timer for an easy work session",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${bodytxt.variable} ${titletxt.variable} font-sans`}>
      <body>
        <ThemeProvider>
          <ClientThemeWrapper>
            <Navbar />
            <br></br>
            {children}
          </ClientThemeWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
