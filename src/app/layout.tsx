'use client';

import type { Metadata } from "next";
import { Inter } from "next/font/google"; // 替换为 Inter 字体
import { ThemeProvider } from "next-themes";
import Navbar from "@/components/layout/Navbar";
import "./globals.css";

// 使用 Inter 字体替代 Geist
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// 如果需要等宽字体，可以使用 Roboto Mono
import { Roboto_Mono } from "next/font/google";
const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
