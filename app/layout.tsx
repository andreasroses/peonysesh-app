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
      <body className="relative min-h-screen flex flex-col">
        <ThemeProvider>
          <ClientThemeWrapper>
            <Navbar />
            <br></br>
            <div className="flex-grow">
              {children}
            </div>
            <footer className="w-full absolute bottom-0 text-center">
              <div className="my-4 text-center">
                <a className="text-base-content underline" href="https://www.vecteezy.com/members/elsabenaa620570">Page icon by Vecteezy</a>
              </div>
            </footer>
          </ClientThemeWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
