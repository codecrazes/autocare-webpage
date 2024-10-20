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

  const diferentPage = 
    pathname === "/login" || 
    pathname === "/register" || 
    pathname === "/email-confirmation" || 
    pathname === "/password-recovery" ||
    pathname.startsWith("/email-confirmated");

  return (
    <html lang="pt-br">
      <body>
        <NotificationProvider>
          {!diferentPage && <Header />}
          <div className="home">
            {children}
          </div>
          {!diferentPage && <Footer />}
        </NotificationProvider>
      </body>
    </html>
  );
}
