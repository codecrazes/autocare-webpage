"use client";

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { NotificationProvider } from '@/components/NotificationContext/NotificationContext';
import { usePathname } from "next/navigation";
import type { Metadata } from "next";
import "./globals.css";

export const viewport = {
  initialScale: 1.0,
  width: "device-width",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();

  const isLoginPage = pathname === "/login" || pathname === "/register";

  return (
    <html lang="pt-br">
      <body>
        <NotificationProvider>
          {!isLoginPage && <Header />}
          <div className="home">
            {children}
          </div>
          {!isLoginPage && <Footer />}
        </NotificationProvider>
      </body>
    </html>
  );
}
