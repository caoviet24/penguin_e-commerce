
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import { store } from "@/redux/store";
import AppProvider from "@/providers/AppProvider";


export const metadata: Metadata = {
  title: "Hippo",
  description: "Hippo",
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
