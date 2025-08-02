'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { AnimatePresence } from "framer-motion";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8">
            <AnimatePresence mode="wait">
              {children}
            </AnimatePresence>
          </main>
        </div>
      </body>
    </html>
  );
}
