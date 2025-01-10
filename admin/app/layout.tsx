
import type { Metadata } from "next";
import "./globals.css";

import AppProvider from "@/providers/AppProvider";


export const metadata: Metadata = {
  title: "Penguin",
  description: "Penguin",
  icons: "/images/penguin.png",
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
