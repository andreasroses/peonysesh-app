import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from "./components/navbar";
import ClientThemeWrapper from "./contexts/ClientThemeWrapper";




export const metadata: Metadata = {
  title: "Peony Sessions",
  description: "To-do boards with pomodoro timer for a nice work session",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider>
      <ClientThemeWrapper>
        <Navbar />
        {children}
      </ClientThemeWrapper>
    </ThemeProvider>
  );
}
